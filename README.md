# YouTube Digest

A modern, demo-first web application for discovering, organizing, and summarizing YouTube videos from your favorite channels. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

✨ **Channel Management**
- Add channels by URL, @handle, or channel ID
- Automatically fetch latest 5 videos per channel
- Remove channels easily

📺 **Smart Video Display**
- Combined feed showing latest 5-7 videos across all channels
- Per-channel video sections
- Modern, readable card design with thumbnails

❤️ **Personal Organization**
- Heart/favorite videos
- Add personal notes to videos
- Filter videos by channel
- Search by title/description

📝 **Intelligent Summaries**
- Auto-generated summaries from YouTube descriptions
- Optional transcript extraction (requires setup)
- Optional local LLM summarization (requires setup)
- Summary source badges (description vs. transcript)
- Manual summary refresh per video

💾 **Persistent Storage**
- All channels, videos, notes, and favorites saved in Supabase
- No authentication required (demo mode)
- Optimistic UI updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: Supabase
- **API**: YouTube Data API v3
- **Icons**: Lucide React

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to SQL Editor
4. Create a new query and paste contents of `lib/supabase/schema.sql`
5. Click "Run"

### 3. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create an API key (Credentials > Create Credentials > API Key)

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (main)/page.tsx        # Dashboard
│   ├── favorites/page.tsx     # Favorites view
│   ├── settings/page.tsx      # Settings
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/                # Reusable React components
├── actions/                   # Server actions
├── hooks/                     # Custom React hooks
├── lib/
│   ├── youtube/               # YouTube API integration
│   ├── supabase/              # Database & repositories
│   ├── transcript/            # Transcript abstraction
│   ├── summarization/         # Summary generation
│   └── mock-data.ts           # Demo data
├── types/                     # TypeScript definitions
└── public/                    # Static assets
```

## Usage

### Add a YouTube Channel

1. Go to Dashboard
2. Fill in "채널 추가" form with:
   - YouTube URL: `https://youtube.com/@channelname`
   - Or channel handle: `@channelname`
   - Or channel ID: `UCxxxxxx...`
3. Click "추가" (Add)

### Favorite Videos

Click the ❤️ icon to add to favorites. View all favorites on the "추천" (Favorites) page.

### Take Notes

Click the 📝 icon to add personal notes to any video. Notes are saved to Supabase.

### Search & Filter

- Use the search box to find videos by title/description
- Click channel chips to filter by channel

## Database Schema

Tables created in Supabase:

- **channels**: YouTube channel metadata
- **videos**: Video metadata and summaries
- **channel_subscriptions_demo**: Tracked channels
- **video_notes**: Personal notes per video
- **video_favorites**: Favorited videos

See `lib/supabase/schema.sql` for complete schema.

## Advanced Features (Optional)

### Transcript Extraction

To enable automatic transcript extraction:

1. Install yt-dlp: `pip install yt-dlp`
2. Implement `LocalTranscriptProvider` in `lib/transcript/transcript-provider.ts`

### Local LLM Summarization

To use Ollama for better summaries:

1. Install [Ollama](https://ollama.ai)
2. Run: `ollama pull llama2 && ollama serve`
3. Implement `OllamaLocalSummarizer` in `lib/summarization/local-summarizer.ts`

## Demo Mode

If YouTube API key is not configured, the app uses demo data. Perfect for testing the UI without API setup.

## Architecture Decisions

- **No authentication**: Demo app. All users see all data. Add auth for production.
- **RLS disabled**: Database allows open read/write. Enable RLS for production.
- **Service-oriented**: Modular design for easy integration testing and swapping implementations.
- **Caching**: Videos cached in Supabase. No re-fetching on page reload.
- **Optimistic UI**: Favorites and notes update immediately with background sync.

## Deployment

### Vercel

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Set environment variables on your platform:
- `NEXT_PUBLIC_YOUTUBE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

**"Could not resolve channel"**
- Check YouTube API key is valid
- Verify channel URL/handle/@ID is correct
- Check API quota in Google Cloud Console

**Videos not showing**
- Ensure YouTube API key is enabled for "YouTube Data API v3"
- Check Supabase connection in browser console
- Verify `.env.local` is configured

**Notes/favorites not saving**
- Check Supabase connection
- Verify RLS policies are permissive (see schema.sql)
- Check browser console for errors

## Future Improvements

- [ ] Multi-user support with authentication
- [ ] Advanced filtering (date, duration, etc.)
- [ ] Video recommendations
- [ ] Transcript search
- [ ] Video download
- [ ] Scheduled refresh
- [ ] Email notifications

## License

MIT

---

**Note**: This is a demo application. For production, add user authentication and proper data isolation via RLS policies.
