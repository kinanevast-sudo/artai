// src/app/dashboard/create-post/page.tsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Save, Clock, Hash, X, Sparkles, Image as ImageIcon, Video, CircleAlert as AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, getCharLimit } from '@/lib/utils'
import { getPlatformIcon } from '@/components/ui/platform-icons'
import { createClient } from '@/lib/supabase/client'
import { uploadMedia } from '@/lib/supabase/storage'

type MediaType = 'none' | 'image' | 'video'

interface ConnectedAccount {
  id: string
  platform: string
  account_name: string
  avatar_url: string
}

export default function CreatePostPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>('none')
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [accountsLoading, setAccountsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedAccount = accounts.find(a => a.id === selectedAccountId)
  const charLimit = selectedAccount ? getCharLimit(selectedAccount.platform) : 63206
  const fullContent = content + (hashtags.length ? '\n\n' + hashtags.map(h => `#${h}`).join(' ') : '')
  const charsLeft = charLimit - fullContent.length
  const isOverLimit = charsLeft < 0

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('connected_accounts')
      .select('id, platform, account_name, avatar_url')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setAccounts(data || [])
    if (data && data.length > 0) setSelectedAccountId(data[0].id)
    setAccountsLoading(false)
  }

  const addHashtag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = hashtagInput.trim().replace(/^#/, '')
      if (tag && !hashtags.includes(tag)) setHashtags([...hashtags, tag])
      setHashtagInput('')
    }
  }

  const removeHashtag = (tag: string) => setHashtags(hashtags.filter(h => h !== tag))

  // ✅ دالة معالجة رفع الملف (معدلة)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isVideo && !isImage) {
      toast.error('Please select an image or video file')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be under 50MB')
      return
    }

    // عرض المعاينة فوراً
    const objectUrl = URL.createObjectURL(file)
    setMediaPreview(objectUrl)
    setMediaType(isVideo ? 'video' : 'image')
    
    // ✅ رفع الملف إلى Supabase
    setMediaUploading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')
      
      const publicUrl = await uploadMedia(user.id, file, isVideo ? 'video' : 'image')
      setMediaUrl(publicUrl)
      console.log('✅ File uploaded to:', publicUrl)
      toast.success('Media uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload media. Please try again.')
      removeMedia()
    } finally {
      setMediaUploading(false)
    }
  }

  const removeMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview)
    setMediaPreview(null)
    setMediaUrl('')
    setMediaType('none')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAISuggest = async () => {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setContent("Big things are happening! Our team has been working hard to bring you something truly special. Stay tuned for the big reveal coming very soon.")
    setHashtags(['ComingSoon', 'Exciting', 'StayTuned'])
    setAiLoading(false)
    toast.success('AI content generated!')
  }

  const handlePublishNow = async () => {
    if (!content.trim()) { toast.error('Post content cannot be empty'); return }
    if (!selectedAccountId) { toast.error('Please select a connected account'); return }
    if (isOverLimit) { toast.error('Content exceeds character limit'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/posts/publish-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: selectedAccountId,
          content: fullContent,
          media_url: mediaUrl || '',
          media_type: mediaType,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to publish')

      toast.success('Post published successfully!')
      resetForm()
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish post')
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async () => {
    if (!content.trim()) { toast.error('Post content cannot be empty'); return }
    if (!selectedAccountId) { toast.error('Please select a connected account'); return }
    if (!scheduledAt) { toast.error('Please select a schedule date and time'); return }
    if (isOverLimit) { toast.error('Content exceeds character limit'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/posts/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: selectedAccountId,
          content: fullContent,
          media_url: mediaUrl || '',
          media_type: mediaType,
          scheduled_at: new Date(scheduledAt).toISOString(),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to schedule')

      toast.success('Post scheduled successfully!')
      resetForm()
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule post')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content.trim()) { toast.error('Post content cannot be empty'); return }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setLoading(true)
    const { error } = await supabase.from('scheduled_posts').insert({
      user_id: user.id,
      connected_account_id: selectedAccountId || null,
      content: fullContent,
      media_url: mediaUrl || '',
      media_type: mediaType,
      status: 'draft',
      hashtags,
    })

    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Draft saved!')
    resetForm()
  }

  const resetForm = () => {
    setContent('')
    setHashtags([])
    setHashtagInput('')
    setScheduledAt('')
    removeMedia()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Post</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Write and schedule content for your connected Facebook Pages.</p>
      </div>

      {!accountsLoading && accounts.length === 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">No connected accounts</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                You need to connect a Facebook Page before creating posts.{' '}
                <a href="/dashboard/accounts" className="underline font-medium">Connect an account</a>
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Publish to</p>
            {accountsLoading ? (
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ) : accounts.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No accounts connected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all',
                      selectedAccountId === account.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    )}
                  >
                    {account.avatar_url ? (
                      <img src={account.avatar_url} alt={account.account_name} className="w-5 h-5 rounded-full" />
                    ) : (
                      <span className="text-base">{getPlatformIcon(account.platform, 16)}</span>
                    )}
                    {account.account_name}
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Post Content</p>
              <Button variant="ghost" size="xs" onClick={handleAISuggest} loading={aiLoading} className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                <Sparkles size={14} />
                AI Suggest
              </Button>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              placeholder="What's on your mind? Write your post here..."
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400">{charLimit.toLocaleString()} char limit</span>
              <span className={cn('text-xs font-medium', isOverLimit ? 'text-red-500' : charsLeft < 100 ? 'text-amber-500' : 'text-gray-400')}>
                {charsLeft.toLocaleString()} left
              </span>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Hash size={14} className="inline mr-1" />
              Hashtags
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full">
                  #{tag}
                  <button onClick={() => removeHashtag(tag)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
            <input
              value={hashtagInput}
              onChange={e => setHashtagInput(e.target.value)}
              onKeyDown={addHashtag}
              placeholder="Type a hashtag and press Enter..."
              className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none border border-gray-200 dark:border-gray-700"
            />
          </Card>

          <Card>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Media Attachment</p>
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {mediaType === 'video' ? (
                  <video src={mediaPreview} controls className="w-full max-h-64 object-contain" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-contain" />
                )}
                <button
                  onClick={removeMedia}
                  disabled={mediaUploading}
                  className="absolute top-2 right-2 p-1.5 bg-gray-900/70 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {mediaUploading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                </button>
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs bg-gray-900/70 text-white px-2 py-1 rounded-md capitalize">{mediaType}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !mediaUploading && fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all group',
                  !mediaUploading && 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
                )}
              >
                {mediaUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uploading media...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3 text-gray-400 group-hover:text-blue-500 mb-2">
                      <ImageIcon size={20} />
                      <Video size={20} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image or video</p>
                    <p className="text-xs text-gray-400 mt-1">Max 50MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={mediaUploading}
            />
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Clock size={14} className="inline mr-1" />
              Schedule
            </p>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {scheduledAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Will publish on {new Date(scheduledAt).toLocaleString()}
              </p>
            )}
          </Card>

          <Card>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 min-h-[120px]">
              <div className="flex items-center gap-2 mb-2">
                {selectedAccount?.avatar_url ? (
                  <img src={selectedAccount.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    {getPlatformIcon(selectedAccount?.platform || 'facebook', 14)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{selectedAccount?.account_name || 'Your Page'}</div>
                  <div className="text-xs text-gray-400">Just now</div>
                </div>
              </div>
              {mediaPreview && mediaType === 'image' && (
                <img src={mediaPreview} alt="Post media" className="w-full rounded-lg mb-2 max-h-32 object-cover" />
              )}
              <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {content || <span className="text-gray-400 italic">Your post preview will appear here...</span>}
                {hashtags.length > 0 && '\n\n' + hashtags.map(h => `#${h}`).join(' ')}
              </p>
            </div>
          </Card>

          <div className="space-y-2.5">
            <Button
              className="w-full gap-2"
              onClick={handlePublishNow}
              loading={loading}
              disabled={isOverLimit || accounts.length === 0 || mediaUploading}
            >
              <Send size={14} />
              Publish Now
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleSchedule}
              disabled={loading || isOverLimit || accounts.length === 0 || mediaUploading}
            >
              <Clock size={14} />
              Schedule Post
            </Button>
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              <Save size={14} />
              Save Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
