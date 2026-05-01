'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useI18n } from '@/lib/i18n/context'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userEmail?: string
}

export function DashboardLayout({ children, userName, userEmail }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isRTL } = useI18n()

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved) setCollapsed(saved === 'true')
  }, [])

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebarCollapsed', String(next))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          userName={userName}
          userEmail={userEmail}
        />
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed top-0 h-full z-40 md:hidden transition-transform duration-300',
        isRTL ? 'right-0' : 'left-0',
        mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      )}>
        <Sidebar
          onToggle={() => setMobileOpen(false)}
          userName={userName}
          userEmail={userEmail}
        />
      </div>

      {/* Main content */}
      <div className={cn(
        'transition-all duration-300 flex flex-col min-h-screen',
        isRTL
          ? collapsed ? 'md:mr-16' : 'md:mr-64'
          : collapsed ? 'md:ml-16' : 'md:ml-64'
      )}>
        <Header
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          userName={userName}
        />
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
