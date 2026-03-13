/**
 * LoadingSkeleton component - loading placeholders for video cards
 */

export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Thumbnail skeleton */}
      <div className="w-full aspect-video bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Channel name skeleton */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>

        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />

        {/* Summary skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
        </div>
      </div>
    </div>
  )
}

export function LoadingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  )
}
