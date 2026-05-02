'use client'

import React, { useState, useEffect } from 'react'
import { Trash2, Check, CircleAlert as AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmModal } from '@/components/ui/modal'
import { cn, formatNumber } from '@/lib/utils'
import { getPlatformIcon } from '@/components/ui/platform-icons'
import { createClient } from '@/lib/supabase/client'

const PLATFORM_CONFIG = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    desc: 'Connect your Facebook Pages to publish posts and use the Messenger bot',
    oauthPath: '/api/facebook/auth',
    available: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    desc: 'Share photos, videos, stories and reels',
    available: true,
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    desc: 'Tweets, threads, and spaces',
    available: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: 'text-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    desc: 'Professional content and company pages',
    available: false,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    color: 'text-gray-900 dark:text-gray-100',
    bg: 'bg-gray-50 dark:bg-gray-800',
    desc: 'Short-form video content',
    available: false,
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnectId, setDisconnectId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'facebook_connected') {
      toast.success('Facebook Pages connected successfully!')
    } else if (error === 'facebook_denied') {
      toast.error('Facebook connection was cancelled.')
    } else if (error === 'no_pages') {
      toast.error('No Facebook Pages found on your account.')
    } else if (error === 'oauth_failed') {
      toast.error('Facebook connection failed. Please try again.')
    } else if (error === 'invalid_state') {
      toast.error('Invalid OAuth state. Please try again.')
    }

    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('connected_accounts')
      .select('id, platform, account_name, account_username, avatar_url, is_active, followers_count, posts_count, token_expires_at, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setAccounts(data || [])
    setLoading(false)
  }

  const handleConnect = (platform: typeof PLATFORM_CONFIG[0]) => {
    if (!platform.available) {
      toast.info(`${platform.label} integration coming soon!`)
      return
    }
    window.location.href = platform.oauthPath!
  }

  const handleDisconnect = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('connected_accounts')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      toast.error('Failed to disconnect account')
      return
    }

    setAccounts(accounts.filter(a => a.id !== id))
    setDisconnectId(null)
    toast.success('Account disconnected')
  }

  const isTokenExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const connectedPlatforms = accounts.map(a => a.platform)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : accounts.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Connected</h2>
          {accounts.map(account => {
            const cfg = PLATFORM_CONFIG.find(p => p.id === account.platform)
            const expired = isTokenExpired(account.token_expires_at)
            return (
              <Card key={account.id} hover className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', cfg?.bg || 'bg-gray-50')}>
                  {account.avatar_url ? (
                    <img src={account.avatar_url} alt={account.account_name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <span className={cn(cfg?.color || 'text-gray-500')}>
                      {getPlatformIcon(account.platform, 22)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{account.account_name}</p>
                    {expired ? (
                      <Badge variant="warning" size="sm"><AlertCircle size={10} /> Token Expired</Badge>
                    ) : (
                      <Badge variant="success" size="sm"><Check size={10} /> Connected</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.platform} Page</p>
                  <div className="flex gap-4 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatNumber(account.followers_count || 0)} followers</span>
                    {account.posts_count > 0 && <span>{formatNumber(account.posts_count)} posts</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {expired && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConnect(cfg!)}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      <RefreshCw size={12} />
                      Reconnect
                    </Button>
                  )}
                  <button
                    onClick={() => setDisconnectId(account.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : null}

      <div>
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {accounts.length > 0 ? 'Add More Accounts' : 'Connect an Account'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM_CONFIG.filter(p => !connectedPlatforms.includes(p.id)).map(platform => (
            <Card key={platform.id} hover>
              <div className="flex items-start gap-3">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', platform.bg)}>
                  <span className={platform.color}>{getPlatformIcon(platform.id, 22)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{platform.label}</p>
                    {!platform.available && (
                      <Badge variant="default" size="sm">Soon</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{platform.desc}</p>
                  <Button
                    size="sm"
                    variant={platform.available ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleConnect(platform)}
                  >
                    {platform.available ? (
                      <>
                        <ExternalLink size={12} />
                        Connect with {platform.label}
                      </>
                    ) : (
                      'Coming Soon'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {connectedPlatforms.length === PLATFORM_CONFIG.length && (
            <Card className="col-span-full text-center py-8 border-dashed">
              <Check size={24} className="mx-auto text-green-500 mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">All platforms connected!</p>
            </Card>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!disconnectId}
        onClose={() => setDisconnectId(null)}
        onConfirm={() => disconnectId && handleDisconnect(disconnectId)}
        title="Disconnect Account"
        message="Disconnecting will stop publishing to this account and disable the bot for it. You can reconnect anytime."
        confirmLabel="Disconnect"
        danger
      />
    </div>
  )
}
