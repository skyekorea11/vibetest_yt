import { execFileSync } from 'child_process'

/**
 * Transcript provider - standalone yt-dlp_macos 강제 사용 (impersonate 지원)
 * 경로: /Users/skye/bin/yt-dlp
 * Edge 쿠키 + ko 자막 우선 + rate limit 방어
 */

export interface TranscriptResult {
  status: 'READY' | 'PENDING' | 'NOT_AVAILABLE' | 'FAILED';
  text?: string;
  source?: 'yt-dlp';
  error?: string;
}

export interface TranscriptProvider {
  fetchTranscript(videoId: string): Promise<TranscriptResult>;
  isAvailable(): boolean;
  getName(): string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const YT_DLP_PATH = '/Users/skye/bin/yt-dlp';

export class YtDlpStandaloneProvider implements TranscriptProvider {

  async fetchTranscript(videoId: string): Promise<TranscriptResult> {
    const { execFile } = await import('child_process');
    const fs = await import('fs/promises');
    const os = await import('os');
    const path = await import('path');
    const { promisify } = await import('util');

    const exec = promisify(execFile);
    const tmpDir = os.tmpdir();
    const baseName = `transcript-${videoId}`;
    const outputTemplate = path.join(tmpDir, `${baseName}.%(ext)s`);

    try {
      console.log('[yt-dlp-standalone] 한국어 자막 시도 중... (Edge impersonate + 쿠키)');

      await sleep(8000);

      const buildArgs = (lang: 'ko' | 'en') => [
        '--skip-download',
        '--write-sub',
        '--write-auto-sub',
        '--sub-langs', lang,
        '--sub-format', 'vtt',
        '--convert-subs', 'vtt',
        '--sleep-requests', '10',
        '--sleep-interval', '8',
        '--max-sleep-interval', '20',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        '--impersonate', 'edge',
        '--cookies-from-browser', 'edge',
        '--no-check-certificate',
        '--no-warnings',
        '--output', outputTemplate,
        `https://www.youtube.com/watch?v=${videoId}`,
      ];

      await exec(YT_DLP_PATH, buildArgs('ko'));

      const files = await fs.readdir(tmpDir);
      let vttFile: string | undefined = files.find(f =>
        f.startsWith(baseName) &&
        f.includes('.ko.') &&
        f.endsWith('.vtt')
      );

      if (!vttFile) {
        console.log('[yt-dlp-standalone] ko 없음 → en 시도');
        await sleep(15000);

        await exec(YT_DLP_PATH, buildArgs('en'));

        const files2 = await fs.readdir(tmpDir);
        vttFile = files2.find(f =>
          f.startsWith(baseName) &&
          f.includes('.en.') &&
          f.endsWith('.vtt')
        );
      }

      if (!vttFile) {
        return { status: 'NOT_AVAILABLE', error: '자막 파일 없음 (ko/en 모두 실패)' };
      }

      const filePath = path.join(tmpDir, vttFile);
      let content = await fs.readFile(filePath, 'utf-8');

      content = content
        .replace(/^WEBVTT[\s\S]*?\n{2,}/i, '')
        .replace(/^\s*\d+\s*$/gm, '')
        .replace(/^\s*\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{3})?\s+-->\s+\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{3})?.*$/gm, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      // Remove empty/metadata lines and collapse adjacent duplicate caption lines.
      const lines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .filter(line => !/^(?:Kind|Language|NOTE)\b/i.test(line));

      const deduped: string[] = [];
      for (const line of lines) {
        if (deduped[deduped.length - 1] === line) continue;
        deduped.push(line);
      }

      content = deduped.join('\n').trim();

      if (content.length < 50) {
        return { status: 'NOT_AVAILABLE' };
      }

      return {
        status: 'READY',
        // Keep enough context for fallback summarization (beginning-only truncation hurts quality).
        text: content.slice(0, 50000),
        source: 'yt-dlp',
      };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[yt-dlp-standalone] 에러:', message);
      return { status: 'FAILED', error: message };
    } finally {
      try {
        const files = await fs.readdir(tmpDir);
        for (const f of files) {
          if (f.startsWith(baseName)) {
            await fs.unlink(path.join(tmpDir, f)).catch(() => {});
          }
        }
      } catch {}
    }
  }

  isAvailable(): boolean {
    if (typeof window !== 'undefined') return false;
    try {
      execFileSync(YT_DLP_PATH, ['--version'], { stdio: 'ignore' });
      return true;
    } catch (e) {
      console.error('yt-dlp 실행 불가:', e);
      return false;
    }
  }

  getName() { return 'yt-dlp-standalone (edge impersonate)'; }
}

class CompositeTranscriptProvider implements TranscriptProvider {
  constructor(private provider: TranscriptProvider) {}

  async fetchTranscript(videoId: string): Promise<TranscriptResult> {
    if (!this.provider.isAvailable()) {
      return { status: 'FAILED', error: 'yt-dlp 실행 불가 (경로 확인 필요)' };
    }
    return this.provider.fetchTranscript(videoId);
  }

  isAvailable() { return this.provider.isAvailable(); }
  getName() { return this.provider.getName(); }
}

export function getTranscriptProvider(): TranscriptProvider {
  const provider = new YtDlpStandaloneProvider();
  return new CompositeTranscriptProvider(provider);
}
