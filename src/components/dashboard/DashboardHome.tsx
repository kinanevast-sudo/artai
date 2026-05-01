'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Clock, Link2, Users, TrendingUp, SquarePen as PenSquare, Calendar, Sparkles, ChartBar as BarChart3, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

const CHART_DATA = [
  { day: 'Mon', reach: 1200, engagement: 340 },
  { day: 'Tue', reach: 1900, engagement: 520 },
  { day: 'Wed', reach: 1500, engagement: 410 },
  { day: 'Thu', reach: 2800, engagement: 680 },
  { day: 'Fri', reach: 2100, engagement: 590 },
  { day: 'Sat', reach: 3200, engagement: 780 },
  { day: 'Sun', reach: 3800, engagement: 920 },
]

const PLATFORM_DATA = [
  { platform: 'Instagram', posts: 42, color: '#E1306C' },
  { platform: 'Facebook', posts: 28, color: '#1877F2' },
  { platform: 'Twitter', posts: 65, color: '#1DA1F2' },
  { platform: 'LinkedIn', posts: 19, color: '#0A66C2' },
]

const QUICK_ACTIONS = [
  { icon: PenSquare, label: 'Create Post', href: '/dashboard/create-post', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
  { icon: Calendar, label: 'View Calendar', href: '/dashboard/calendar', color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' },
  { icon: Sparkles, label: 'AI Writer', href: '/dashboard/ai-writer', color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' },
]

interface DashboardHomeProps {
  totalPosts: number
  scheduledPosts: number
  connectedAccounts: number
  totalFollowers: number
  subscription: { plan_type?: string; status?: string; current_period_end?: string } | null
  userName: string
}

export function DashboardHome({ totalPosts, scheduledPosts, connectedAccounts, totalFollowers, subscription, userName }: DashboardHomeProps) {
  const { t } = useI18n()

  const stats = [
    { label: t.dashboard.totalPosts, value: formatNumber(totalPosts), icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', trend: '+12%' },
    { label: t.dashboard.scheduledPosts, value: formatNumber(scheduledPosts), icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', trend: '+5%' },
    { label: 'Connected Accounts', value: connectedAccounts.toString(), icon: Link2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', trend: '' },
    { label: t.dashboard.totalFollowers, value: formatNumber(totalFollowers), icon: Users, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', trend: '+8.2%' },
  ]

  const planLabel = subscription?.plan_type
    ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)
    : 'Trial'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.dashboard.welcome}, {userName}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s what&apos;s happening across your social accounts today.
          </p>
        </div>
        <Badge variant={subscription?.plan_type === 'trial' ? 'warning' : 'success'} size="md">
          {planLabel} Plan
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={11} className="text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">{stat.trend} this month</span>
                  </div>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-5 pb-0">
            <CardTitle>Reach &amp; Engagement — Last 7 Days</CardTitle>
          </div>
          <div className="p-5 pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="reach" name="Reach" stroke="#3b82f6" fill="url(#reachGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#10b981" fill="url(#engGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader><CardTitle>{t.dashboard.quickActions}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">{action.label}</span>
                  <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts by Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 pb-0">
            <CardTitle>Posts by Platform</CardTitle>
          </div>
          <div className="p-5 pt-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={PLATFORM_DATA} barSize={32}>
                <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="posts" name="Posts" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Upgrade prompt or activity */}
        {(!subscription || subscription.plan_type === 'trial') ? (
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0 text-white">
            <div className="space-y-3">
              <Badge variant="primary" className="bg-white/20 text-white border-0">Upgrade Available</Badge>
              <h3 className="text-lg font-bold">Unlock All Features</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Get unlimited posts, AI writer, auto-reply bot, advanced analytics, and competitor tracking.
              </p>
              <ul className="space-y-1.5 text-sm text-blue-100">
                {['Unlimited posts/month', 'AI content writer', 'Auto-reply bot', 'Advanced analytics'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/billing">
                <button className="mt-2 w-full bg-white text-blue-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                  Upgrade Now — From $9/mo
                </button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader><CardTitle>{t.dashboard.recentActivity}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Post published', platform: 'Instagram', time: '2m ago', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
                  { action: 'Post scheduled', platform: 'LinkedIn', time: '1h ago', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
                  { action: 'Bot replied', platform: 'Facebook', time: '3h ago', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {item.platform[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.platform}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
