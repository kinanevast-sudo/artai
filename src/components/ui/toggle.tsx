'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, description, disabled, size = 'md' }: ToggleProps) {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', on: 'translate-x-4', off: 'translate-x-0.5' },
    md: { track: 'w-10 h-6', thumb: 'w-4 h-4', on: 'translate-x-5', off: 'translate-x-1' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>}
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          s.track
        )}
      >
        <div className={cn(
          'absolute top-1 bg-white rounded-full shadow transition-transform',
          checked ? s.on : s.off,
          s.thumb
        )} />
      </button>
    </div>
  )
}
