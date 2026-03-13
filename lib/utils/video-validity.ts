import { Video } from '@/types'

const BLOCKED_TITLE_KEYWORDS = ['#shorts', '#라이브', '#live']

export function is_valid_video(title: string, duration: number, has_caption: boolean): boolean {
  const normalizedTitle = title.toLowerCase()
  const hasBlockedKeyword = BLOCKED_TITLE_KEYWORDS.some((kw) => normalizedTitle.includes(kw))
  if (hasBlockedKeyword) return false
  if (!has_caption) return false
  if (duration <= 60) return false
  return true
}

export function isValidStoredVideo(video: Video): boolean {
  const duration = typeof video.duration_seconds === 'number' ? video.duration_seconds : 61
  const normalizedTitle = (video.title || '').toLowerCase()
  const hasBlockedKeyword = BLOCKED_TITLE_KEYWORDS.some((kw) => normalizedTitle.includes(kw))
  if (hasBlockedKeyword) return false
  if (duration <= 60) return false
  // 저장된 영상 표시 단계에서는 transcript_status(not_available)로 숨기지 않는다.
  return true
}
