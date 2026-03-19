'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SummaryInfo {
  videoId: string
  title: string
}

export default function SummaryDoneNotification() {
  const [loadingInfo, setLoadingInfo] = useState<SummaryInfo | null>(null)
  const [doneInfo, setDoneInfo] = useState<SummaryInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkLoading = () => {
      try {
        const raw = localStorage.getItem('summary-loading')
        setLoadingInfo(raw ? JSON.parse(raw) : null)
      } catch { setLoadingInfo(null) }
    }
    const checkDone = () => {
      try {
        const raw = localStorage.getItem('summary-done')
        setDoneInfo(raw ? JSON.parse(raw) : null)
      } catch { setDoneInfo(null) }
    }
    checkLoading()
    checkDone()
    window.addEventListener('summary-loading-updated', checkLoading)
    window.addEventListener('summary-done-updated', checkDone)
    return () => {
      window.removeEventListener('summary-loading-updated', checkLoading)
      window.removeEventListener('summary-done-updated', checkDone)
    }
  }, [])

  const handleGo = () => {
    localStorage.removeItem('summary-done')
    setDoneInfo(null)
    router.push(`/?selectVideo=${doneInfo!.videoId}`)
  }

  const handleDismiss = () => {
    localStorage.removeItem('summary-done')
    setDoneInfo(null)
  }

  if (doneInfo) {
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

  if (loadingInfo) {
    return (
      <div className="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium shadow-lg tone-notify-loading max-w-xs">
        <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="truncate">요약 작업 중입니다...</span>
      </div>
    )
  }

  return null
}
