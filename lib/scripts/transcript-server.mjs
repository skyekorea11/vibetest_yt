/**
 * Transcript HTTP Server
 * POST /api/transcripts/:videoId  →  { status: 'READY', text: '...' }
 * GET  /api/transcripts/:videoId  →  { status: 'READY', text: '...' }
 */
import { createServer } from 'http'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { readdir, readFile, writeFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const exec = promisify(execFile)
const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp'
const PORT = Number(process.env.PORT || '8080')

// 쿠키 파일 초기화: YT_COOKIES_BASE64 환경변수에서 디코딩해서 파일로 저장
const COOKIES_PATH = join(tmpdir(), 'yt-cookies.txt')
async function initCookies() {
  const b64 = process.env.YT_COOKIES_BASE64
  if (!b64) return
  try {
    await writeFile(COOKIES_PATH, Buffer.from(b64, 'base64').toString('utf-8'))
    console.log('[server] cookies initialized from YT_COOKIES_BASE64')
  } catch (e) {
    console.warn('[server] failed to write cookies:', e.message)
  }
}

function normalizeTimestamp(raw) {
  const ts = String(raw || '').replace(',', '.').trim()
  const parts = ts.split(':')
  if (parts.length === 3) {
    const h = Number(parts[0])
    const ss = (parts[2] || '00').split('.')[0] || '00'
    return h > 0
      ? `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${ss.padStart(2,'0')}`
      : `${parts[1].padStart(2,'0')}:${ss.padStart(2,'0')}`
  }
  if (parts.length === 2) {
    const ss = (parts[1] || '00').split('.')[0] || '00'
    return `${parts[0].padStart(2,'0')}:${ss.padStart(2,'0')}`
  }
  return ts
}

function parseVtt(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const segments = []
  let activeStart = ''
  let buffer = []

  const flush = () => {
    if (!activeStart || buffer.length === 0) { buffer = []; return }
    const text = buffer.join(' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) segments.push({ start: normalizeTimestamp(activeStart), text })
    buffer = []
  }

  for (const lineRaw of lines) {
    const line = lineRaw.trim()
    if (!line) { flush(); continue }
    const m = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{3})?)\s+-->/)
    if (m) { flush(); activeStart = m[1]; continue }
    if (/^(WEBVTT|NOTE|Kind:|Language:)/i.test(line) || /^\d+$/.test(line)) continue
    buffer.push(line)
  }
  flush()

  const deduped = []
  for (const seg of segments) {
    if (deduped.length > 0) {
      const prev = deduped[deduped.length - 1]
      if (prev.text === seg.text) continue
      if (prev.start === seg.start && prev.text.includes(seg.text)) continue
      if (prev.text.includes(seg.text) && seg.text.length >= 8) continue
    }
    deduped.push(seg)
  }
  return deduped
}

async function fetchTranscript(videoId) {
  const tmpDir = tmpdir()
  const baseName = `srv-transcript-${videoId}`
  const outputTemplate = join(tmpDir, `${baseName}.%(ext)s`)

  const hasCookies = await readFile(COOKIES_PATH, 'utf-8').then(t => t.length > 50).catch(() => false)

  const buildArgs = (lang, { useImpersonate = false, playerClient = null } = {}) => {
    const args = [
      '--skip-download',
      '--write-sub',
      '--write-auto-sub',
      '--sub-langs', lang,
      '--sub-format', 'vtt',
      '--convert-subs', 'vtt',
      '--sleep-requests', '2',
      '--sleep-interval', '2',
      '--max-sleep-interval', '5',
      '--no-check-certificate',
      '--no-warnings',
      '--output', outputTemplate,
    ]
    if (playerClient) {
      args.push('--extractor-args', `youtube:player_client=${playerClient}`)
    } else {
      args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0')
      if (hasCookies) args.push('--cookies', COOKIES_PATH)
      if (useImpersonate) args.push('--impersonate', 'edge')
    }
    args.push(`https://www.youtube.com/watch?v=${videoId}`)
    return args
  }

  const isBotDetection = (err) => {
    const msg = err instanceof Error ? err.message : String(err)
    return /Sign in to confirm you.re not a bot/i.test(msg) || /bot/i.test(msg) && /Sign in/i.test(msg)
  }

  const isImpersonateUnsupported = (err) => {
    const msg = err instanceof Error ? err.message : String(err)
    return /Impersonate target .* is not available/i.test(msg) ||
      /missing dependencies required to support this target/i.test(msg)
  }

  const runLang = async (lang) => {
    // Strategy 1: cookies + impersonate
    try {
      await exec(YT_DLP_PATH, buildArgs(lang, { useImpersonate: true }), { timeout: 90000 })
      return
    } catch (err) {
      if (!isImpersonateUnsupported(err) && !isBotDetection(err)) throw err
      console.log(`[server] strategy1 failed (${isImpersonateUnsupported(err) ? 'no impersonate' : 'bot detection'}), trying iOS client...`)
    }
    // Strategy 2: iOS player client (bypasses web bot detection)
    try {
      await exec(YT_DLP_PATH, buildArgs(lang, { playerClient: 'ios' }), { timeout: 90000 })
      return
    } catch (err) {
      console.log('[server] iOS client failed, trying mweb client...')
      if (!isBotDetection(err)) throw err
    }
    // Strategy 3: mweb player client
    await exec(YT_DLP_PATH, buildArgs(lang, { playerClient: 'mweb' }), { timeout: 90000 })
  }

  try {
    await runLang('ko')
    let files = await readdir(tmpDir)
    let vttFile = files.find(f => f.startsWith(baseName) && f.includes('.ko.') && f.endsWith('.vtt'))

    if (!vttFile) {
      await runLang('en')
      files = await readdir(tmpDir)
      vttFile = files.find(f => f.startsWith(baseName) && f.includes('.en.') && f.endsWith('.vtt'))
    }

    if (!vttFile) return { status: 'NOT_AVAILABLE' }

    const rawVtt = await readFile(join(tmpDir, vttFile), 'utf-8')
    const segments = parseVtt(rawVtt)
    const content = segments.map(s => `[${s.start}] ${s.text}`).join('\n').trim()

    if (content.length < 50) return { status: 'NOT_AVAILABLE' }
    return { status: 'READY', text: content.slice(0, 50000) }

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[server] yt-dlp error:', msg)
    if (/429/.test(msg)) return { status: 'FAILED', error: 'YouTube rate limit (429)' }
    return { status: 'FAILED', error: msg }
  } finally {
    try {
      const files = await readdir(tmpDir)
      await Promise.all(
        files.filter(f => f.startsWith(baseName))
          .map(f => unlink(join(tmpDir, f)).catch(() => {}))
      )
    } catch {}
  }
}

function extractVideoId(url) {
  // /api/transcripts/VIDEO_ID or /transcripts/VIDEO_ID
  const m = url.match(/\/(?:api\/)?transcripts\/([^/?]+)/)
  return m ? m[1] : null
}

async function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
  })
}

function sendJson(res, statusCode, body) {
  const json = JSON.stringify(body)
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json) })
  res.end(json)
}

const server = createServer(async (req, res) => {
  const { method, url } = req
  console.log(`[server] ${method} ${url}`)

  if (url === '/health' || url === '/') {
    return sendJson(res, 200, { status: 'ok' })
  }

  const videoId = extractVideoId(url || '')
  if (!videoId) return sendJson(res, 404, { error: 'Not found' })

  if (method !== 'GET' && method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' })
  }

  // For POST, also accept videoId from body
  let bodyVideoId = videoId
  if (method === 'POST') {
    const body = await readBody(req)
    if (body.videoId) bodyVideoId = body.videoId
  }

  const id = bodyVideoId || videoId
  if (!id) return sendJson(res, 400, { error: 'videoId required' })

  console.log(`[server] extracting transcript for ${id}`)
  const result = await fetchTranscript(id)
  console.log(`[server] result: ${result.status} (${result.text?.length ?? 0} chars)`)

  return sendJson(res, 200, result)
})

initCookies().then(() => {
  server.listen(PORT, () => {
    console.log(`Transcript server listening on :${PORT}`)
    console.log(`yt-dlp path: ${YT_DLP_PATH}`)
  })
})
