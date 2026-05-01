'use client'

import React, { useState } from 'react'
import { Bell, Moon, Sun, Menu, Globe, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'
import type { Language } from '@/types'

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
]

interface HeaderProps {
  onMenuToggle?: () => void
  title?: string
  userName?: string
}

export function Header({ onMenuToggle, title, userName }: HeaderProps) {
  const { language, setLanguage, isRTL } = useI18n()
  const [darkMode, setDarkMode] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(!langOpen); setNotifOpen(false) }}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          >
            <Globe size={18} />
            <span className="text-xs font-medium uppercase hidden sm:block">{language}</span>
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              <div className={cn(
                'absolute top-full mt-2 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden w-44',
                isRTL ? 'left-0' : 'right-0'
              )}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false) }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                      language === lang.code && 'bg-blue-50 dark:bg-blue-950/30'
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className={cn('flex-1', language === lang.code ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300')}>
                      {lang.native}
                    </span>
                    {language === lang.code && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setLangOpen(false) }}
            className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className={cn(
                'absolute top-full mt-2 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg w-80',
                isRTL ? 'left-0' : 'right-0'
              )}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                </div>
                <div className="p-2 max-h-72 overflow-y-auto">
                  {[
                    { title: 'Post Published', msg: 'Your Instagram post was published successfully', time: '2m ago', dot: 'bg-green-500' },
                    { title: 'Trial Ending Soon', msg: 'Your free trial ends in 3 days. Upgrade to continue.', time: '1h ago', dot: 'bg-amber-500' },
                    { title: 'New Comment', msg: 'Someone commented on your latest post', time: '3h ago', dot: 'bg-blue-500' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.msg}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                  <button className="w-full text-xs text-blue-600 dark:text-blue-400 py-1.5 hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold ml-1">
          {userName ? userName[0].toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  )
}
