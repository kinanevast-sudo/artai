'use client'

import React, { useState } from 'react'
import { Download, TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days']

const FOLLOWER_DATA = [
  { date: 'Apr 2', ig: 12400, fb: 8200, tw: 5100, li: 3400 },
  { date: 'Apr 5', ig: 12800, fb: 8350, tw: 5300, li: 3500 },
  { date: 'Apr 8', ig: 13100, fb: 8400, tw: 5200, li: 3600 },
  { date: 'Apr 11', ig: 13600, fb: 8550, tw: 5500, li: 3750 },
  { date: 'Apr 14', ig: 14000, fb: 8700, tw: 5800, li: 3900 },
  { date: 'Apr 17', ig: 14500, fb: 8900, tw: 6100, li: 4100 },
  { date: 'Apr 20', ig: 15200, fb: 9100, tw: 6400, li: 4350 },
]

const ENGAGEMENT_DATA = [
  { date: 'Mon', likes: 340, comments: 78, shares: 45 },
  { date: 'Tue', likes: 520, comments: 102, shares: 67 },
  { date: 'Wed', likes: 410, comments: 89, shares: 52 },
  { date: 'Thu', likes: 680, comments: 134, shares: 89 },
  { date: 'Fri', likes: 590, comments: 115, shares: 73 },
  { date: 'Sat', likes: 780, comments: 156, shares: 98 },
  { date: 'Sun', likes: 920, comments: 184, shares: 112 },
]

const PIE_DATA = [
  { name: 'Instagram', value: 42, color: '#E1306C' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'Twitter', value: 20, color: '#1DA1F2' },
  { name: 'LinkedIn', value: 13, color: '#0A66C2' },
]

const TOP_POSTS = [
  { platform: 'instagram', content: '🚀 Exciting product launch announcement! Check out what we built...', likes: 1240, comments: 89, reach: 15600 },
  { platform: 'twitter', content: 'Hot take: Most social media tools are overpriced. Here\'s how we changed that...', likes: 892, comments: 234, reach: 28400 },
  { platform: 'linkedin', content: '5 lessons learned from scaling our startup from 0 to 10,000 customers...', likes: 678, comments: 156, reach: 12800 },
]

const METRICS = [
  { label: 'Total Followers', value: 33050, change: '+8.2%', up: true, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { label: 'Total Likes', value: 4240, change: '+14.5%', up: true, icon: Heart, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/30' },
  { label: 'Total Comments', value: 858, change: '+9.3%', up: true, icon: MessageCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { label: 'Total Reach', value: 126800, change: '-2.1%', up: false, icon: Eye, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState('Last 7 Days')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track performance across all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'px-3 py-2 text-xs font-medium transition-colors',
                  range === r ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success('Report exported!')}>
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => (
          <Card key={m.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(m.value)}</p>
                <div className={cn('flex items-center gap-1 mt-1', m.up ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                  {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span className="text-xs">{m.change}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center flex-shrink-0`}>
                <m.icon size={18} className={m.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Follower growth */}
      <Card padding="none">
        <div className="p-5 pb-0">
          <CardTitle>Follower Growth</CardTitle>
        </div>
        <div className="p-5 pt-4">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={FOLLOWER_DATA}>
              <defs>
                {[['ig', '#E1306C'], ['fb', '#1877F2'], ['tw', '#1DA1F2'], ['li', '#0A66C2']].map(([k, c]) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => formatNumber(Number(v))} />
              <Area type="monotone" dataKey="ig" name="Instagram" stroke="#E1306C" fill="url(#grad-ig)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="fb" name="Facebook" stroke="#1877F2" fill="url(#grad-fb)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="tw" name="Twitter" stroke="#1DA1F2" fill="url(#grad-tw)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="li" name="LinkedIn" stroke="#0A66C2" fill="url(#grad-li)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Engagement + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 pb-0"><CardTitle>Daily Engagement</CardTitle></div>
          <div className="p-5 pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ENGAGEMENT_DATA} barSize={20}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="likes" name="Likes" fill="#EC4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" name="Comments" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shares" name="Shares" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Traffic by Platform</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <PieChart width={160} height={160}>
                <Pie data={PIE_DATA} cx={75} cy={75} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-2 flex-1">
                {PIE_DATA.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader><CardTitle>Top Performing Posts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_POSTS.map((post, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{post.content}</p>
                  <Badge variant="info" size="sm" className="mt-1 capitalize">{post.platform}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  <span className="flex items-center gap-1"><Heart size={11} className="text-pink-500" /> {formatNumber(post.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11} className="text-emerald-500" /> {formatNumber(post.comments)}</span>
                  <span className="flex items-center gap-1"><Eye size={11} className="text-blue-500" /> {formatNumber(post.reach)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
