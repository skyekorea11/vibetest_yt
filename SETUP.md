# YouTube Digest - Complete Setup Guide

This guide will walk you through setting up the YouTube Digest app from scratch.

## Prerequisites

Before starting, make sure you have:
- **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- **npm** or **Yarn** (Node.js includes npm)
- A **Supabase account** ([supabase.com](https://supabase.com)) - Free tier is fine
- A **Google Cloud account** for YouTube API key

## Setting Up Your Development Environment

### 1. Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

### 2. Navigate to Project Directory

```bash
cd /Users/skye/vibe_coding/yt
```

### 3. Install Dependencies

All dependencies are already listed in `package.json`. If you haven't run this yet:

```bash
npm install
```

## Setting Up the Database (Supabase)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Enter:
   - **Name**: `youtube-digest` (or any name)
   - **Database Password**: Create a secure password
   - **Region**: Choose closest to you
4. Click "Create new project" and wait 1-2 minutes

### Step 2: Get Your Supabase Credentials

1. Once project is created, go to **Settings > API**
2. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Save these somewhere temporarily.

### Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `lib/supabase/schema.sql` in your code editor
4. Copy the **entire** SQL content
5. Paste into the Supabase SQL editor
6. Click **Run** (or Cmd+Enter)
7. You should see "Success" message

Tables created:
- `channels` - YouTube channel metadata
- `videos` - Video information and summaries
- `channel_subscriptions_demo` - Which channels you're tracking
- `video_notes` - Your personal notes on videos
- `video_favorites` - Your liked videos

## Setting Up YouTube API Access

### Step 1: Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a **New Project**
   - Name: `YouTube Digest`
   - Organization: (default)
   - Click **Create**

### Step 2: Enable YouTube Data API v3

1. Go to **APIs & Services > Library**
2. Search for **"YouTube Data API v3"**
3. Click on it
4. Click **ENABLE**

### Step 3: Create API Key

1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Choose **API Key**
4. Copy the key (this is your `NEXT_PUBLIC_YOUTUBE_API_KEY`)
5. Click **Close**

**Important**: Your API key is now visible. Keep it private! Never commit it to Git.

## Configuring the App

### Step 1: Create `.env.local` File

1. In the project root (`/Users/skye/vibe_coding/yt`), create a file named `.env.local`

```bash
# macOS/Linux
touch .env.local

# Or just create it in your code editor
```

### Step 2: Add Your Credentials

Open `.env.local` and paste (replace the placeholders with your actual values):

```env
# YouTube Data API v3 Key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_youtube_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Optional: For future transcript extraction service
# TRANSCRIPT_SERVICE_URL=http://localhost:5000

# Optional: For future local summarization service
# SUMMARIZER_SERVICE_URL=http://localhost:5001
```

**Example** (with fake values):

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**:
- `.env.local` is **git-ignored** - your secrets won't be committed
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser (safe for anonymous API keys)
- Never share your API keys or database passwords

## Running the Development Server

### Start the App

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://10.x.x.x:3000

✓ Ready in ...ms
```

### Open in Browser

1. Go to [http://localhost:3000](http://localhost:3000)
2. You should see the YouTube Digest dashboard

## Testing Without Setup

Don't have API key/Supabase yet? No problem!

1. **Leave `.env.local` empty** (or with empty values)
2. The app automatically loads **demo data**
3. Test the entire UI without external setup
4. Switch to real data by adding API key later

## Using the App

### Adding Your First Channel

1. Go to Dashboard (home page)
2. Find the **"채널 추가"** (Add Channel) form
3. Try one of these methods:
   - **YouTube URL**: Paste a full channel URL: `https://www.youtube.com/@channelname`
   - **@Handle**: Type just the handle: `@channelname`
   - **Channel ID**: Paste a channel ID: `UCxxxxxxxxxxxxxxxxxxxxxx`

Examples to try:
- `@TED` - TED Talks
- `@Google` - Official Google Channel
- `@LinusTechtips` - Linus Tech Tips

### Exploring Videos

- **Combined Feed**: See latest videos from all channels at top
- **Filter**: Click channel names to filter the feed
- **Search**: Use search box to find videos by title/description
- **❤️ Favorite**: Click heart to save videos to favorites
- **📝 Note**: Click message icon to add personal notes
- **🔄 Refresh**: Regenerate summary for a video

### Saving & Persistence

- **Favorites** and **Notes** are saved to Supabase
- **Refresh the page** - your data persists
- Your notes are saved locally and to database

## Troubleshooting

### "Could not resolve channel" Error

**Cause**: Invalid channel identifier or API key issue

**Solutions**:
- Check the YouTube channel URL/handle is correct
- Go to `https://youtube.com/` and verify the channel exists
- Check your API key in [Google Cloud Console](https://console.cloud.google.com)
- Verify API key is enabled for "YouTube Data API v3"
- Check you haven't exceeded API quota (100,000 units/day)

### "Supabase connection failed"

**Cause**: Database credentials incorrect or missing

**Solutions**:
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check credentials in Supabase dashboard > Settings > API
- Make sure Supabase project is active (not paused)
- No need to add secret key - only use **anon** key from Settings > API

### Videos Not Showing

**Cause**: Channel might not have public videos

**Solutions**:
- Try a popular channel like `@Google` or `@TED`
- Check channel has recent uploads
- Check YouTube API quota usage in Google Cloud Console

### Notes/Favorites Not Saving

**Cause**: Database connection issue

**Solutions**:
- Check browser console for errors (F12 > Console tab)
- Verify RLS is enabled on Supabase (it should be from schema.sql)
- Try refreshing page - data might be there
- Check Supabase project is not paused

### Build Errors

If `npm run dev` shows errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm run dev
```

## Setting Up Advanced Features (Optional)

### Transcript Extraction

To automatically extract video transcripts for better summaries:

1. Install yt-dlp:
   ```bash
   pip install yt-dlp
   ```

2. Edit `lib/transcript/transcript-provider.ts`
   - Find the TODO in `LocalTranscriptProvider.extractTranscript()`
   - Implement the method to:
     - Spawn yt-dlp process
     - Extract subtitle file
     - Return transcript text

### Local LLM Summarization

To use Ollama for AI summaries:

1. Install [Ollama](https://ollama.ai) from ollama.ai
2. Download a model:
   ```bash
   ollama pull llama2
   ```
3. Start Ollama:
   ```bash
   ollama serve
   ```
4. Edit `lib/summarization/local-summarizer.ts`
   - Find the TODO in `OllamaLocalSummarizer.summarize()`
   - Implement to:
     - POST to http://localhost:11434/api/generate
     - Send prompt with text to summarize
     - Parse response

Both features have clear TODO comments showing what needs to be implemented.

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in `.next/` folder.

### Run Production Build Locally

```bash
npm run start
```

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Connect your GitHub repo
5. Add environment variables:
   - `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click Deploy

### Other Hosting

For any Node.js hosting (Netlify, Railway, Fly.io, etc.):

1. Set the same environment variables
2. Run `npm install && npm run build && npm start`
3. Point to http://localhost:3000

## Project Structure Quick Reference

```
yt/
├── app/                          # Next.js pages
│   ├── (main)/page.tsx          # Dashboard
│   ├── favorites/page.tsx       # Favorites view
│   ├── settings/page.tsx        # Settings page
│   └── layout.tsx               # Root layout
├── components/                   # Reusable React components
│   ├── VideoCard.tsx            # Main video display
│   ├── ChannelAddForm.tsx       # Add channel form
│   ├── NoteDrawer.tsx           # Note editor
│   ├── TopNav.tsx               # Top navigation
│   └── ... (more components)
├── lib/
│   ├── youtube/                 # YouTube API integration
│   ├── supabase/                # Database & repositories
│   ├── transcript/              # Transcript abstraction
│   ├── summarization/           # Summary generation
│   └── utils.ts                 # Utilities
├── actions/                      # Server actions
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript definitions
├── .env.local                    # Your secrets (git-ignored)
├── .env.example                  # Template for .env.local
├── README.md                     # Project README
└── SETUP.md                      # This file
```

## Getting Help

### Check These First

1. **README.md** - Project overview and quick start
2. **Browser Console** - F12, then Console tab for errors
3. **Google Cloud Console** - Check API quota and errors
4. **Supabase Dashboard** - Check database status

### Common Issues & Solutions

See "Troubleshooting" section above.

### Code Comments

All service files have detailed comments:
- `lib/youtube/youtube-service.ts` - YouTube API usage
- `lib/supabase/channels.ts` - Database operations
- `lib/summarization/summary-service.ts` - Summary pipeline
- `actions/channel-actions.ts` - Server operations

## Next Steps

After setup:

1. ✅ Add 3-4 YouTube channels
2. ✅ Add hearts to some videos
3. ✅ Leave notes on videos
4. ✅ Try the Favorites page
5. ✅ Check Settings page for system info
6. ✅ Explore the search and filter functionality

## Tips & Tricks

- **Better summaries**: Channels with detailed descriptions get better summaries
- **Faster loading**: Summaries are cached - refresh summary button is for manual re-generation
- **Offline mode**: App still works without internet for viewing cached videos
- **Mobile friendly**: Responsive design works on phones and tablets
- **Demo mode**: Leave API key empty to test with demo data

## Support

If you encounter issues:

1. Check browser console (F12)
2. Review error messages carefully
3. Check `.env.local` has correct values
4. Try the troubleshooting section
5. Review inline code comments for implementation details

---

**You're all set! Go celebrate your YouTube Digest app! 🚀**
