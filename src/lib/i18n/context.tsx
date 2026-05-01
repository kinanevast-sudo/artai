'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, type Translations } from './translations'
import type { Language } from '@/types'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  isRTL: false,
  dir: 'ltr',
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && ['en', 'ar', 'fr', 'es'].includes(saved)) {
      setLanguageState(saved)
      document.documentElement.lang = saved
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const isRTL = language === 'ar'

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isRTL,
        dir: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
