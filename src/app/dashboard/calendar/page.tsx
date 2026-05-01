'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const SAMPLE_POSTS = [
  { date: '2026-04-09', title: 'Product launch announcement', platform: 'instagram', status: 'scheduled' },
  { date: '2026-04-09', title: 'Weekly tips thread', platform: 'twitter', status: 'scheduled' },
  { date: '2026-04-11', title: 'Behind the scenes', platform: 'facebook', status: 'draft' },
  { date: '2026-04-14', title: 'Customer success story', platform: 'linkedin', status: 'scheduled' },
  { date: '2026-04-16', title: 'New feature highlight', platform: 'instagram', status: 'scheduled' },
  { date: '2026-04-20', title: 'Weekly roundup', platform: 'twitter', status: 'draft' },
]

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  facebook: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  twitter: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
  linkedin: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  tiktok: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
}

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week'>('month')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => setCurrentDate(new Date(year, month - 1, 1))
  const next = () => setCurrentDate(new Date(year, month + 1, 1))

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return SAMPLE_POSTS.filter(p => p.date === dateStr)
  }

  const today = new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all your scheduled content.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {(['month', 'week'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-2 text-sm font-medium capitalize transition-colors',
                  view === v ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Link href="/dashboard/create-post">
            <Button size="sm">
              <Plus size={14} />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <Card padding="none">
        {/* Calendar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={prev} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={next} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
          {DAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const posts = getPostsForDay(day)
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
            return (
              <div
                key={day}
                className={cn(
                  'min-h-[100px] p-2 border-b border-r border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors',
                  (day + firstDay - 1) % 7 === 0 && 'border-l-0'
                )}
              >
                <div className={cn(
                  'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1.5',
                  isToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'
                )}>
                  {day}
                </div>
                <div className="space-y-1">
                  {posts.slice(0, 2).map((post, i) => (
                    <div
                      key={i}
                      className={cn('text-xs px-1.5 py-0.5 rounded truncate cursor-pointer', PLATFORM_COLORS[post.platform])}
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  ))}
                  {posts.length > 2 && (
                    <div className="text-xs text-gray-400 px-1">+{posts.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
          <div key={platform} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium', color)}>
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </div>
        ))}
      </div>
    </div>
  )
}
