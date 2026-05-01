'use client'

import React, { useState } from 'react'
import { Search, Reply, Heart, Star, RefreshCw, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeTime } from '@/lib/utils'
import { getPlatformIcon } from '@/components/ui/platform-icons'

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin'

const SAMPLE_MESSAGES = [
  { id: '1', platform: 'instagram' as Platform, user: '@sarah_tech', avatar: 'S', message: 'Love your new product! Can you tell me more about the pricing?', time: '2026-04-09T10:30:00Z', type: 'comment', liked: false, starred: false, replied: false },
  { id: '2', platform: 'twitter' as Platform, user: '@john_marketing', avatar: 'J', message: 'Great article! Just what I needed. Thanks for sharing this valuable content with the community.', time: '2026-04-09T09:15:00Z', type: 'mention', liked: true, starred: false, replied: true },
  { id: '3', platform: 'facebook' as Platform, user: 'Mohammed Al-Rashid', avatar: 'M', message: 'When will you have Arabic support? Very interested in using your platform.', time: '2026-04-09T08:45:00Z', type: 'comment', liked: false, starred: true, replied: false },
  { id: '4', platform: 'linkedin' as Platform, user: 'Marie Dubois', avatar: 'D', message: "Excellent insights on the latest industry trends. Would love to connect and discuss further.", time: '2026-04-08T15:20:00Z', type: 'comment', liked: false, starred: false, replied: false },
  { id: '5', platform: 'instagram' as Platform, user: '@alex_creator', avatar: 'A', message: 'Absolutely amazing content! Keep it up! 🔥🚀', time: '2026-04-08T12:00:00Z', type: 'comment', liked: true, starred: false, replied: true },
]

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'text-pink-500',
  facebook: 'text-blue-600',
  twitter: 'text-sky-500',
  linkedin: 'text-blue-700',
}

export default function InboxPage() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [selected, setSelected] = useState<string | null>('1')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | Platform>('all')
  const [replyText, setReplyText] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = messages.filter(m => {
    const matchSearch = !search || m.message.toLowerCase().includes(search.toLowerCase()) || m.user.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || m.platform === filter
    return matchSearch && matchFilter
  })

  const selectedMsg = messages.find(m => m.id === selected)

  const handleLike = (id: string) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, liked: !m.liked } : m))
  }

  const handleStar = (id: string) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  const handleReply = () => {
    if (!replyText.trim()) return
    setMessages(msgs => msgs.map(m => m.id === selected ? { ...m, replied: true } : m))
    setReplyText('')
    toast.success('Reply sent!')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setRefreshing(false)
    toast.success('Inbox refreshed')
  }

  const unreadCount = messages.filter(m => !m.replied).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount} unread &middot; All comments and messages in one place.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} loading={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Message list */}
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
          />
          <div className="flex gap-1 flex-wrap">
            {(['all', 'instagram', 'facebook', 'twitter', 'linkedin'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors',
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelected(msg.id)}
                className={cn(
                  'p-3 rounded-xl border cursor-pointer transition-all',
                  selected === msg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">{msg.user}</span>
                      <span className={cn('flex-shrink-0', PLATFORM_COLORS[msg.platform])}>
                        {getPlatformIcon(msg.platform, 12)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{msg.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">{formatRelativeTime(msg.time)}</span>
                      {!msg.replied && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        {selectedMsg ? (
          <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden" padding="none">
            <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                {selectedMsg.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{selectedMsg.user}</span>
                  <Badge variant="info" size="sm" className="capitalize">{selectedMsg.platform}</Badge>
                  <Badge variant="default" size="sm" className="capitalize">{selectedMsg.type}</Badge>
                </div>
                <p className="text-xs text-gray-400">{formatRelativeTime(selectedMsg.time)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleLike(selectedMsg.id)}
                  className={cn('p-2 rounded-lg transition-colors', selectedMsg.liked ? 'text-red-500 bg-red-50 dark:bg-red-950/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30')}
                >
                  <Heart size={16} className={selectedMsg.liked ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={() => handleStar(selectedMsg.id)}
                  className={cn('p-2 rounded-lg transition-colors', selectedMsg.starred ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30')}
                >
                  <Star size={16} className={selectedMsg.starred ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedMsg.message}</p>
              </div>
              {selectedMsg.replied && (
                <div className="mt-4 ml-6">
                  <p className="text-xs text-gray-400 mb-2">Your reply</p>
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">Thank you for your message! We appreciate your engagement. Our team will get back to you shortly.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 resize-none"
                />
                <Button onClick={handleReply} disabled={!replyText.trim()} className="self-end">
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center">
            <p className="text-gray-400">Select a message to view</p>
          </Card>
        )}
      </div>
    </div>
  )
}
