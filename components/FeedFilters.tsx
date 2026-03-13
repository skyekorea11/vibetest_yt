'use client'

/**
 * FeedFilters component - filter videos by channel
 */

import { Channel } from '@/types'
import { cn } from '@/lib/utils'

interface FeedFiltersProps {
  channels: Channel[]
  selectedChannels: string[]
  onToggleChannel: (channelId: string) => void
}

export default function FeedFilters({
  channels,
  selectedChannels,
  onToggleChannel,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* "All channels" chip */}
      <button
        onClick={() => {
          if (selectedChannels.length === channels.length) {
            // Remove all
            selectedChannels.forEach((id) => onToggleChannel(id))
          } else {
            // Add all
            channels.forEach((ch) => {
              if (!selectedChannels.includes(ch.youtube_channel_id)) {
                onToggleChannel(ch.youtube_channel_id)
              }
            })
          }
        }}
        className={cn(
          'px-4 py-2 rounded-full font-medium transition-colors text-sm',
          selectedChannels.length === 0 || selectedChannels.length === channels.length
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        모든 채널
      </button>

      {/* Channel chips */}
      {channels.map((channel) => (
        <button
          key={channel.youtube_channel_id}
          onClick={() => onToggleChannel(channel.youtube_channel_id)}
          className={cn(
            'px-4 py-2 rounded-full font-medium transition-colors text-sm',
            selectedChannels.includes(channel.youtube_channel_id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {channel.title}
        </button>
      ))}
    </div>
  )
}
