import { NextResponse } from 'next/server'
import { videoRepository } from '@/lib/supabase/videos'
import { summaryService } from '@/lib/summarization/summary-service'

// POST /api/summaries/refresh - regenerate summaries/transcripts for all videos
export async function POST() {
  try {
    const videos = await videoRepository.getAll()
    for (const v of videos) {
      await summaryService.getSummary(v.youtube_video_id, v.title, v.description)
    }
    return NextResponse.json({ success: true, count: videos.length })
  } catch (err) {
    console.error('Batch refresh error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
