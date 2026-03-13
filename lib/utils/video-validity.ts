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
  // Stored videos often don't have caption metadata. We only hard-exclude known no-caption videos.
  const hasCaption = video.transcript_status !== 'not_available'
  return is_valid_video(video.title || '', duration, hasCaption)
}

