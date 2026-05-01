import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
    primary: 'bg-blue-600 text-white',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-full font-medium',
    md: 'px-2.5 py-1 text-xs rounded-full font-medium',
  }

  return (
    <span className={cn('inline-flex items-center gap-1', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
