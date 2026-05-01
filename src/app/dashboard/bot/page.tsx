'use client'

import React, { useState, useEffect } from 'react'
import { Bot, Plus, Trash2, MessageSquare, Settings, History } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Modal } from '@/components/ui/modal'
import { cn, formatRelativeTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type Tab = 'settings' | 'rules' | 'logs'

interface BotRule {
  id: string
  name: string
  trigger_keywords: string[]
  reply_template: string
  is_active: boolean
  trigger_count: number
  platforms: string[]
  created_at: string
}

interface BotLog {
  id: string
  platform: string
  sender_id: string
  incoming_message: string
  reply_sent: string
  replied_at: string
}

export default function BotPage() {
  const [botEnabled, setBotEnabled] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [rules, setRules] = useState<BotRule[]>([])
  const [logs, setLogs] = useState<BotLog[]>([])
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const [newRule, setNewRule] = useState({ name: '', keywords: '', reply: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addingRule, setAddingRule] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [settingsRes, rulesRes] = await Promise.all([
        fetch('/api/bot'),
        fetch('/api/bot/rules'),
      ])

      if (settingsRes.ok) {
        const { data } = await settingsRes.json()
        if (data) {
          setBotEnabled(data.is_enabled ?? false)
          setAiEnabled(data.ai_replies_enabled ?? false)
        }
      }

      if (rulesRes.ok) {
        const { data } = await rulesRes.json()
        setRules(data || [])
      }

      await loadLogs()
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('bot_reply_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('replied_at', { ascending: false })
      .limit(50)

    setLogs(data || [])
  }

  const handleToggleBot = async (value: boolean) => {
    setSaving(true)
    const res = await fetch('/api/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: value }),
    })

    if (res.ok) {
      setBotEnabled(value)
      toast.success(value ? 'Bot enabled!' : 'Bot disabled')
    } else {
      toast.error('Failed to update bot settings')
    }
    setSaving(false)
  }

  const handleToggleAI = async (value: boolean) => {
    setSaving(true)
    const res = await fetch('/api/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ai_enabled: value }),
    })

    if (res.ok) {
      setAiEnabled(value)
      toast.success(value ? 'AI replies enabled!' : 'AI replies disabled')
    } else {
      toast.error('Failed to update bot settings')
    }
    setSaving(false)
  }

  const handleToggleRule = async (rule: BotRule) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('bot_rules')
      .update({ is_active: !rule.is_active, updated_at: new Date().toISOString() })
      .eq('id', rule.id)

    if (error) { toast.error('Failed to update rule'); return }
    setRules(rules.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
  }

  const handleDeleteRule = async (id: string) => {
    const res = await fetch(`/api/bot/rules?id=${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete rule'); return }
    setRules(rules.filter(r => r.id !== id))
    toast.success('Rule deleted')
  }

  const handleAddRule = async () => {
    if (!newRule.name || !newRule.keywords || !newRule.reply) {
      toast.error('Fill in all fields')
      return
    }

    setAddingRule(true)
    const keywords = newRule.keywords.split(',').map(k => k.trim()).filter(Boolean)

    const res = await fetch('/api/bot/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newRule.name,
        keywords,
        reply_template: newRule.reply,
      }),
    })

    const json = await res.json()
    setAddingRule(false)

    if (!res.ok) { toast.error(json.error || 'Failed to add rule'); return }

    setRules([json.data, ...rules])
    setNewRule({ name: '', keywords: '', reply: '' })
    setShowModal(false)
    toast.success('Reply rule added!')
  }

  const tabs = [
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
    { id: 'rules' as Tab, label: 'Reply Rules', icon: MessageSquare },
    { id: 'logs' as Tab, label: 'Reply Logs', icon: History },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auto-Reply Bot</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automatically reply to Facebook Messenger messages.</p>
        </div>
        <div className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors',
          botEnabled ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 dark:border-gray-800'
        )}>
          <Bot size={16} className={botEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
          <span className={cn('text-sm font-medium', botEnabled ? 'text-green-700 dark:text-green-400' : 'text-gray-500')}>
            {botEnabled ? 'Bot Active' : 'Bot Inactive'}
          </span>
          <Toggle
            checked={botEnabled}
            onChange={handleToggleBot}
            size="sm"
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bot Configuration</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-4">
                <Toggle
                  checked={botEnabled}
                  onChange={handleToggleBot}
                  label="Auto-Reply Bot"
                  description="Automatically reply to Messenger messages matching your rules"
                  disabled={saving}
                />
                <Toggle
                  checked={aiEnabled}
                  onChange={handleToggleAI}
                  label="AI-Powered Replies"
                  description="Use AI for context-aware replies (coming soon)"
                  disabled={saving}
                />
              </div>
            )}
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Active Rules', value: rules.filter(r => r.is_active).length.toString(), color: 'text-green-600 dark:text-green-400' },
                { label: 'Total Rules', value: rules.length.toString(), color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Total Triggers', value: rules.reduce((sum, r) => sum + (r.trigger_count || 0), 0).toString(), color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Replies Logged', value: logs.length.toString(), color: 'text-gray-600 dark:text-gray-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                  <span className={cn('font-bold text-lg', s.color)}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowModal(true)}>
              <Plus size={14} />
              Add Rule
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : rules.length === 0 ? (
            <Card className="text-center py-12 border-dashed">
              <MessageSquare size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No reply rules yet</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">Add rules to automatically reply to messages with matching keywords.</p>
              <Button size="sm" onClick={() => setShowModal(true)}>
                <Plus size={14} />
                Add Your First Rule
              </Button>
            </Card>
          ) : (
            rules.map(rule => (
              <Card key={rule.id}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    rule.is_active ? 'bg-green-50 dark:bg-green-950/30' : 'bg-gray-50 dark:bg-gray-800'
                  )}>
                    <MessageSquare size={18} className={rule.is_active ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{rule.name}</h4>
                      <Badge variant={rule.is_active ? 'success' : 'default'} size="sm">
                        {rule.is_active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(rule.trigger_keywords || []).map((kw: string) => (
                        <span key={kw} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rule.reply_template}</p>
                    {rule.trigger_count > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">{rule.trigger_count} triggers</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Toggle checked={rule.is_active} onChange={() => handleToggleRule(rule)} size="sm" />
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <Card>
          <CardHeader><CardTitle>Recent Bot Replies</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <History size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No bot replies yet</p>
                <p className="text-xs text-gray-400 mt-1">Replies will appear here once the bot starts responding to messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold flex-shrink-0">
                      {log.sender_id?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{log.sender_id}</span>
                        <Badge variant="info" size="sm">{log.platform}</Badge>
                        <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(log.replied_at)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">&ldquo;{log.incoming_message}&rdquo;</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Bot: &ldquo;{log.reply_sent}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Reply Rule">
        <div className="space-y-4">
          <Input
            label="Rule Name"
            value={newRule.name}
            onChange={e => setNewRule({ ...newRule, name: e.target.value })}
            placeholder="e.g. Pricing Inquiry"
          />
          <Input
            label="Trigger Keywords (comma separated)"
            value={newRule.keywords}
            onChange={e => setNewRule({ ...newRule, keywords: e.target.value })}
            placeholder="price, cost, how much"
          />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Reply Template</label>
            <textarea
              value={newRule.reply}
              onChange={e => setNewRule({ ...newRule, reply: e.target.value })}
              rows={4}
              placeholder="The automatic reply that will be sent..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddRule} loading={addingRule}>Add Rule</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
