import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/lib/i18n/context'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SocialAI - Professional Social Media Management',
  description: 'Schedule posts, automate replies, track analytics, and grow your audience across all social platforms.',
  keywords: 'social media management, scheduling, AI content writer, analytics, Instagram, Facebook, Twitter',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #111)',
                border: '1px solid var(--toast-border, #e5e7eb)',
                borderRadius: '12px',
              },
            }}
          />
        </I18nProvider>
      </body>
    </html>
  )
}
