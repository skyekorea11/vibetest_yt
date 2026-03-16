/**
 * TopNav component - main navigation bar
 */

'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Play, RefreshCw, Moon, Sun, Palette } from 'lucide-react'

interface TopNavProps {
  onManualRefresh?: () => Promise<void>
  mode: 'light' | 'dark'
  tone: 'cool' | 'beige'
  onModeToggle: () => void
  onToneToggle: () => void
}

export default function TopNav({
  onManualRefresh,
  mode,
  tone,
  onModeToggle,
  onToneToggle,
}: TopNavProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [cooldownActive, setCooldownActive] = useState(false)

  const handleManualRefresh = useCallback(async () => {
    if (isRefreshing || cooldownActive || !onManualRefresh) return
    setIsRefreshing(true)
    setCooldownActive(true)
    setTimeout(() => setCooldownActive(false), 60000)
    try {
      await onManualRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, cooldownActive, onManualRefresh])

  const modeLabel = mode === 'dark' ? '다크 모드 (클릭 시 라이트)' : '라이트 모드 (클릭 시 다크)'
  const toneLabel = tone === 'beige' ? '쿨 톤으로 전환' : '베이지 톤으로 전환'

  return (
    <nav className="bg-slate-50 border-b border-slate-200 sticky top-0 z-30">
      <div className="px-5">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-slate-700 transition-colors min-w-0"
            >
              <div className="flex items-center justify-center w-7 h-7 bg-slate-900 rounded-lg">
                <Play size={14} className="text-white fill-white ml-0.5" />
              </div>
              <span className="truncate">YouTube Digest</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {onManualRefresh && (
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing || cooldownActive}
                className="ui-btn ui-btn-icon sm:w-auto sm:min-w-0 sm:px-3 sm:gap-1.5 disabled:opacity-40"
                title={cooldownActive ? '1분 후 다시 시도 가능' : '지금 새로고침'}
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            )}
            <button
              onClick={onModeToggle}
              className="ui-btn ui-btn-icon"
              title={modeLabel}
              aria-label={modeLabel}
            >
              {mode === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              onClick={onToneToggle}
              className="ui-btn ui-btn-icon"
              title={toneLabel}
              aria-label={toneLabel}
            >
              <Palette size={15} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
