'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SummaryDoneInfo {
  videoId: string
  title: string
}

export default function SummaryDoneNotification() {
  const [info, setInfo] = useState<SummaryDoneInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('summary-done')
        setInfo(raw ? JSON.parse(raw) : null)
      } catch { setInfo(null) }
    }
    check()
    window.addEventListener('summary-done-updated', check)
    return () => window.removeEventListener('summary-done-updated', check)
  }, [])

  if (!info) return null

  const handleGo = () => {
    localStorage.removeItem('summary-done')
    setInfo(null)
    router.push(`/?selectVideo=${info.videoId}`)
  }

  const handleDismiss = () => {
    localStorage.removeItem('summary-done')
    setInfo(null)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium shadow-lg tone-notify-done max-w-xs">
      <span className="truncate">✅ 요약 완료!</span>
      <button onClick={handleGo} className="shrink-0 rounded-lg tone-notify-done-btn text-xs px-2.5 py-1 transition-colors">
        바로가기
      </button>
      <button onClick={handleDismiss} className="shrink-0 text-current opacity-50 hover:opacity-100 text-base leading-none">
        ✕
      </button>
    </div>
  )
}
