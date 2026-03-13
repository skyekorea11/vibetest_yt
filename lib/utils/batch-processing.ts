/**
 * Batch processing utilities for transcript extraction and summarization
 */

import pLimit from 'p-limit'

/**
 * Process videos in batches with concurrency control
 */
export const batchProcessor = {
  /**
   * Process videos with limited concurrency
   */
  async processVideos<T, U>(
    videos: T[],
    processor: (video: T) => Promise<U>,
    concurrency = 4
  ): Promise<U[]> {
    const limit = pLimit(concurrency)
    const promises = videos.map((video) => limit(() => processor(video)))
    return Promise.all(promises)
  },

  /**
   * Extract transcripts for multiple videos
   */
  async extractTranscripts<U>(
    videoIds: string[],
    extractFn: (videoId: string) => Promise<U>,
    concurrency = 4
  ): Promise<U[]> {
    return this.processVideos(videoIds, extractFn, concurrency)
  },

  /**
   * Generate summaries for multiple videos
   */
  async generateSummaries<U>(
    videoIds: string[],
    summarizeFn: (videoId: string) => Promise<U>,
    concurrency = 4
  ): Promise<U[]> {
    return this.processVideos(videoIds, summarizeFn, concurrency)
  },
}

/**
 * Error handling utilities
 */
export const errorHandler = {
  /**
   * Check if Gemini API is configured
   */
  isGeminiConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY?.trim()
  },

  /**
   * Check if yt-dlp is available
   */
  async isYtDlpAvailable(): Promise<boolean> {
    try {
      const { execSync } = require('child_process')
      execSync('which yt-dlp', { stdio: 'ignore' })
      return true
    } catch {
      return false
    }
  },

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('GEMINI_API_KEY')) {
      return 'Gemini API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.'
    }
    if (msg.includes('not available')) {
      return '이 영상에는 자막이 없습니다.'
    }
    if (msg.includes('Failed to fetch')) {
      return '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    }
    return '알 수 없는 오류가 발생했습니다.'
  },
}