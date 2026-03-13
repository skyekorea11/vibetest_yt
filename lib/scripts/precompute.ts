import { videoRepository } from '../supabase/videos'
import { summaryService } from '../summarization/summary-service'

async function main() {
  console.log('Fetching existing videos from database...')
  const videos = await videoRepository.getAll()
  console.log(`Found ${videos.length} videos, generating summaries/transcripts...`)

  for (const v of videos) {
    try {
      // this will run the full pipeline (transcript then summary) if needed
      await summaryService.getSummary(v.youtube_video_id, v.title, v.description)
    } catch (err) {
      console.error('Error processing video', v.youtube_video_id, err)
    }
  }

  console.log('Precompute complete')
}

main().catch((e) => {
  console.error('Precompute script failed', e)
  process.exit(1)
})
