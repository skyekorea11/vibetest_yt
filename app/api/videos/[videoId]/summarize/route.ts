/**
 * POST /api/videos/[videoId]/summarize - Generate summary from transcript
 */

import { NextRequest, NextResponse } from 'next/server'
import { videoRepository } from '@/lib/supabase/videos'
import { geminiSummarizer } from '@/lib/summarization/gemini-summarizer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
): Promise<NextResponse> {
  try {
    const { videoId } = await params

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    // Get video from database
    const video = await videoRepository.getByYouTubeId(videoId)

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    // Check if summary already exists
    if (video.summary_text && video.summary_status === 'complete') {
      return NextResponse.json(
        {
          success: true,
          source: 'cached',
          summary: video.summary_text,
          sourceType: video.summary_source_type,
        },
        { status: 200 }
      )
    }

    // Check if transcript exists
    if (!video.transcript_text) {
      return NextResponse.json(
        {
          success: false,
          error: 'No transcript available for summarization',
          status: 'no_transcript',
        },
        { status: 400 }
      )
    }

    // Check if Gemini is available
    if (!geminiSummarizer.isAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API not configured (GEMINI_API_KEY not set)',
          status: 'no_api_key',
        },
        { status: 503 }
      )
    }

    // Mark as pending
    await videoRepository.updateSummary(videoId, '', 'transcript', 'pending')

    // Generate summary
    const summary = await geminiSummarizer.summarizeTranscript(video.transcript_text)

    if (!summary) {
      // Mark as failed
      await videoRepository.updateSummary(videoId, '', 'transcript', 'failed')

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate summary',
          status: 'failed',
        },
        { status: 500 }
      )
    }

    // Save summary
    await videoRepository.updateSummary(videoId, summary, 'transcript', 'complete')

    return NextResponse.json(
      {
        success: true,
        summary,
        sourceType: 'transcript',
        status: 'complete',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in summarize API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
