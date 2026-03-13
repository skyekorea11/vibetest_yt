'use client'

/**
 * ChannelSection component - displays videos for a specific channel
 */

import { Channel, Video } from '@/types'
import VideoCard from './VideoCard'
import EmptyState from './EmptyState'
import { Trash2 } from 'lucide-react'
import { removeChannelAction } from '@/actions/channel-actions'
import { useState } from 'react'

interface ChannelSectionProps {
  channel: Channel
  videos: Video[]
  onRemove?: () => void
  onRefreshSummary?: (videoId: string) => Promise<void>
  showSummary?: boolean
}

export default function ChannelSection({
  channel,
  videos,
  onRemove,
  onRefreshSummary,
  showSummary = true,
}: ChannelSectionProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    if (!confirm(`"${channel.title}" 채널을 제거하시겠습니까?`)) {
      return
    }

    setIsRemoving(true)
    try {
      const result = await removeChannelAction(channel.youtube_channel_id)
      if (result.success) {
        onRemove?.()
      } else {
        alert('채널 제거에 실패했습니다.')
      }
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="mb-16">
      {/* Channel header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {channel.thumbnail_url && (
            <img
              src={channel.thumbnail_url}
              alt={channel.title}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{channel.title}</h2>
            {channel.handle && (
              <p className="text-gray-500 text-sm">
                @{channel.handle}
              </p>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="채널 제거"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Videos grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.youtube_video_id}
              video={video}
              showSummary={showSummary}
              onRefreshSummary={onRefreshSummary}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="동영상 없음"
          description="이 채널에는 아직 동영상이 없습니다."
        />
      )}
    </div>
  )
}
