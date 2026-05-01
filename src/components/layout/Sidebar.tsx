'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, SquarePen as PenSquare, Calendar, Image, Inbox, Sparkles, Bot, ChartBar as BarChart3, Users as Users2, Link2, CreditCard, Settings, Circle as HelpCircle, ChevronLeft, ChevronRight, Zap, LogOut, CircleUser as UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'
import { signOut } from '@/lib/auth'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { key: 'createPost', icon: PenSquare, href: '/dashboard/create-post' },
  { key: 'calendar', icon: Calendar, href: '/dashboard/calendar' },
  { key: 'mediaLibrary', icon: Image, href: '/dashboard/media' },
  { key: 'inbox', icon: Inbox, href: '/dashboard/inbox' },
  { key: 'aiWriter', icon: Sparkles, href: '/dashboard/ai-writer' },
  { key: 'botSettings', icon: Bot, href: '/dashboard/bot' },
  { key: 'analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { key: 'competitors', icon: Users2, href: '/dashboard/competitors' },
  { key: 'accounts', icon: Link2, href: '/dashboard/accounts' },
  { key: 'billing', icon: CreditCard, href: '/dashboard/billing' },
  { key: 'settings', icon: Settings, href: '/dashboard/settings' },
  { key: 'help', icon: HelpCircle, href: '/dashboard/help' },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  userEmail?: string
  userName?: string
}

export function Sidebar({ collapsed = false, onToggle, userEmail, userName }: SidebarProps) {
  const pathname = usePathname()
  const { t, isRTL } = useI18n()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
    toast.success('Signed out successfully')
  }

  return (
    <aside className={cn(
      'fixed top-0 bottom-0 z-20 flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
      isRTL ? 'right-0 border-l border-r-0' : 'left-0',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">SocialAI</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
        )}
        {onToggle && !collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
        {NAV_ITEMS.map(({ key, icon: Icon, href }) => {
          const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
          const label = t.nav[key as keyof typeof t.nav]

          return (
            <Link
              key={key}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon size={18} className={cn('flex-shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : '')} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User / Sign out */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        {!collapsed && (userEmail || userName) && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <UserCircle size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              {userName && <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{userName}</p>}
              {userEmail && <p className="text-xs text-gray-400 truncate">{userEmail}</p>}
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>{t.common.signOut}</span>}
        </button>
      </div>

      {/* Collapse toggle when collapsed */}
      {onToggle && collapsed && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      )}
    </aside>
  )
}
