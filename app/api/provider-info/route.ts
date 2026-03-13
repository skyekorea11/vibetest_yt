import { NextResponse } from 'next/server'
import { summaryService } from '@/lib/summarization/summary-service'

export async function GET() {
  try {
    const transcript = summaryService.getTranscriptProviderInfo()
    const summarizer = summaryService.getSummarizerInfo()
    return NextResponse.json({ success: true, transcript, summarizer })
  } catch (err) {
    console.error('Provider info error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
