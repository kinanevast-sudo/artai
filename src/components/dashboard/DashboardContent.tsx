'use client'

import React from 'react'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SquarePen as PenSquare, Calendar, Sparkles, ChartBar as BarChart3, TrendingUp, Users, FileText, Link2, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

const reachData = [
  { day: 'Mon', reach: 1200, engagement: 340 },
  { day: 'Tue', reach: 1900, engagement: 520 },
  { day: 'Wed', reach: 1500, engagement: 410 },
  { day: 'Thu', reach: 2400, engagement: 680 },
  { day: 'Fri', reach: 2100, engagement: 590 },
  { day: 'Sat', reach: 3000, engagement: 820 },
  { day: 'Sun', reach: 2700, engagement: 760 },
]

const quickActions = [
  { title: 'Create Post', description: 'Draft and schedule content', href: '/dashboard/create-post', icon: PenSquare, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  { title: 'Calendar', description: 'View scheduled content', href: '/dashboard/calendar', icon: Calendar, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  { title: 'AI Writer', description: 'Generate content with AI', href: '/dashboard/ai-writer', icon: Sparkles, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  { title: 'Analytics', description: 'Track your performance', href: '/dashboard/analytics', icon: BarChart3, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
]

interface DashboardContentProps {
  userName: string
  scheduledCount: number
  accountsCount: number
  userPlan: string
}

export default function DashboardContent({
  userName,
  scheduledCount,
  accountsCount,
  userPlan,
}: DashboardContentProps) {
  const { t } = useI18n()

  const stats = [
    {
      label: t.dashboard.totalPosts,
      value: '0',
      icon: FileText,
      trend: '+0%',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: t.dashboard.scheduledPosts,
      value: formatNumber(scheduledCount),
      icon: Calendar,
      trend: '+0%',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Connected Accounts',
      value: formatNumber(accountsCount),
      icon: Link2,
      trend: '+0',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: t.dashboard.totalFollowers,
      value: '0',
      icon: Users,
      trend: '+0%',
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.dashboard.welcome}, {userName}! 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your social media today.
          </p>
        </div>
        <Link href="/dashboard/create-post">
          <Button>
            <PenSquare size={16} />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">{stat.trend}</span>
                    <span className="text-xs text-gray-400">vs last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Reach & Engagement</CardTitle>
          <Badge variant="info">Demo Data</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={reachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="reach" name="Reach" stroke="#3b82f6" strokeWidth={2} fill="url(#reachGrad)" />
              <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#06b6d4" strokeWidth={2} fill="url(#engGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${action.color}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{action.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{action.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Upgrade banner */}
      {userPlan === 'trial' && (
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">You&apos;re on a Free Trial</h3>
            <p className="text-blue-100 text-sm mt-1">Upgrade to unlock unlimited posts, advanced analytics, and more.</p>
          </div>
          <Link href="/dashboard/billing">
            <Button variant="outline" className="whitespace-nowrap text-gray-900 bg-white">
              Upgrade Now
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
