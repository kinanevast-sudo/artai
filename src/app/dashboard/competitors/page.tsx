'use client'

import React, { useState } from 'react'
import { Plus, Trash2, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal, ConfirmModal } from '@/components/ui/modal'
import { cn, formatNumber } from '@/lib/utils'
import { getPlatformIcon } from '@/components/ui/platform-icons'

const PLATFORM_OPTIONS = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']

const SAMPLE_COMPETITORS = [
  { id: '1', platform: 'instagram', username: '@socialbrand_co', display_name: 'Social Brand', followers_count: 145000, posts_count: 892, engagement_rate: 4.2, avg_likes: 6090, avg_comments: 234, last_synced_at: '2026-04-09T08:00:00Z' },
  { id: '2', platform: 'twitter', username: '@digitalmktpro', display_name: 'Digital Marketing Pro', followers_count: 89500, posts_count: 3420, engagement_rate: 2.8, avg_likes: 2506, avg_comments: 89, last_synced_at: '2026-04-09T07:30:00Z' },
  { id: '3', platform: 'linkedin', username: 'saas-growth-hub', display_name: 'SaaS Growth Hub', followers_count: 62000, posts_count: 445, engagement_rate: 6.1, avg_likes: 3782, avg_comments: 178, last_synced_at: '2026-04-08T15:00:00Z' },
]

const MY_METRICS = { followers: 33050, engagement_rate: 5.4, avg_likes: 4240, posts: 287 }

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(SAMPLE_COMPETITORS)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newUsername, setNewUsername] = useState('')
  const [newPlatform, setNewPlatform] = useState('instagram')
  const [refreshing, setRefreshing] = useState(false)

  const handleAdd = () => {
    if (!newUsername.trim()) { toast.error('Enter a username'); return }
    setCompetitors([...competitors, {
      id: Date.now().toString(),
      platform: newPlatform,
      username: newUsername.startsWith('@') ? newUsername : `@${newUsername}`,
      display_name: newUsername.replace('@', ''),
      followers_count: Math.floor(Math.random() * 200000),
      posts_count: Math.floor(Math.random() * 1000),
      engagement_rate: parseFloat((Math.random() * 8).toFixed(1)),
      avg_likes: Math.floor(Math.random() * 5000),
      avg_comments: Math.floor(Math.random() * 200),
      last_synced_at: new Date().toISOString(),
    }])
    setNewUsername('')
    setShowAdd(false)
    toast.success('Competitor added!')
  }

  const handleDelete = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id))
    setDeleteId(null)
    toast.success('Competitor removed')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 1200))
    setRefreshing(false)
    toast.success('Data refreshed!')
  }

  const getDiff = (mine: number, theirs: number) => {
    const diff = ((mine - theirs) / theirs * 100).toFixed(1)
    const isUp = mine > theirs
    return { diff, isUp }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and compare your performance against competitors.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} loading={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Sync Data
          </Button>
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={14} />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* My performance */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-3">Your Performance (All Platforms)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Followers', value: formatNumber(MY_METRICS.followers) },
              { label: 'Engagement', value: `${MY_METRICS.engagement_rate}%` },
              { label: 'Avg Likes', value: formatNumber(MY_METRICS.avg_likes) },
              { label: 'Posts', value: MY_METRICS.posts.toString() },
            ].map(m => (
              <div key={m.label}>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-blue-200 text-xs mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Competitors table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Competitor</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Platform</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Followers</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Engagement</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Avg Likes</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">vs You</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {competitors.map(comp => {
                const followerDiff = getDiff(MY_METRICS.followers, comp.followers_count)
                const engDiff = getDiff(MY_METRICS.engagement_rate, comp.engagement_rate)
                return (
                  <tr key={comp.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{comp.display_name}</p>
                        <p className="text-xs text-gray-400">{comp.username}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn('flex items-center gap-1.5 text-xs font-medium capitalize')}>
                        {getPlatformIcon(comp.platform, 14)}
                        {comp.platform}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">{formatNumber(comp.followers_count)}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={cn('text-sm font-medium', comp.engagement_rate > MY_METRICS.engagement_rate ? 'text-red-500' : 'text-green-600 dark:text-green-400')}>
                        {comp.engagement_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">{formatNumber(comp.avg_likes)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className={cn('flex items-center justify-end gap-1 text-xs font-medium', followerDiff.isUp ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                        {followerDiff.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {followerDiff.isUp ? '+' : ''}{followerDiff.diff}%
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDeleteId(comp.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Competitor" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(p => (
                <button key={p} onClick={() => setNewPlatform(p)}
                  className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-all',
                    newPlatform === p ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}>
                  {getPlatformIcon(p, 14)}
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Username / Handle"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            placeholder="@username"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Remove Competitor"
        message="Remove this competitor from tracking? You can add them back anytime."
        confirmLabel="Remove"
        danger
      />
    </div>
  )
}
