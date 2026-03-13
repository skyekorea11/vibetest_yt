'use client'

/**
 * NoteDrawer component - modal for editing video notes
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoteDrawerProps {
  isOpen: boolean
  onClose: () => void
  note: string
  onSave: (note: string) => Promise<void>
  videoTitle: string
}

export default function NoteDrawer({
  isOpen,
  onClose,
  note,
  onSave,
  videoTitle,
}: NoteDrawerProps) {
  const [editedNote, setEditedNote] = useState(note)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditedNote(note)
  }, [note, isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editedNote)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed bottom-0 right-0 w-full sm:w-96 h-full sm:h-auto max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl z-50 flex flex-col',
          'transform transition-all duration-300',
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">메모</h2>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{videoTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            placeholder="이 동영상에 대한 메모를 작성하세요..."
            className="w-full h-full min-h-48 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </>
  )
}
