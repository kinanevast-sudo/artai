'use client'

import React, { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw, Wand as Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getPlatformIcon } from '@/components/ui/platform-icons'

const TONES = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational', 'Promotional']
const PLATFORMS_LIST = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']
const AUDIENCES = ['General Public', 'Tech Professionals', 'Small Business Owners', 'Creatives', 'Students', 'Entrepreneurs']

const SAMPLE_OUTPUTS = [
  "🚀 Innovation isn't just a buzzword — it's our daily mission. Every line of code, every design decision, every team meeting is focused on one thing: making YOUR experience better. Join thousands of businesses who've already transformed their social presence. What's holding you back? 👇",
  "Ready to level up your social media game? We've helped 10,000+ businesses grow their online presence by an average of 300%. The secret? Smart scheduling, AI-powered content, and data-driven insights — all in one platform. Start your free trial today. No credit card needed. ✨",
  "Your competitors are already using AI to create better content faster. Are you? Our AI writer generates platform-perfect posts in seconds, tailored to your brand voice and audience. Save 10+ hours every week and never run out of ideas again. 💡 #SocialMediaMarketing #AI",
]

export default function AIWriterPage() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [platform, setPlatform] = useState('instagram')
  const [audience, setAudience] = useState('General Public')
  const [outputs, setOutputs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [selectedOutput, setSelectedOutput] = useState<number | null>(null)
  const [usageCount] = useState(23)
  const [usageLimit] = useState(100)

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Please enter a topic or description'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setOutputs(SAMPLE_OUTPUTS)
    setSelectedOutput(0)
    setLoading(false)
    toast.success('3 variations generated!')
  }

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Content Writer</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate engaging posts with GPT-4.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(usageCount / usageLimit) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{usageCount}/{usageLimit} this month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings panel */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Content Settings</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Topic / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  rows={3}
                  placeholder="e.g. New product launch for AI-powered social media tool for small businesses..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Target Platform</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS_LIST.map(p => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-all',
                        platform === p
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {getPlatformIcon(p, 14)}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                        tone === t ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Target Audience</label>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <Button onClick={handleGenerate} loading={loading} className="w-full" size="lg">
                <Wand2 size={16} />
                {loading ? 'Generating...' : 'Generate 3 Variations'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {outputs.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles size={36} className="text-gray-200 dark:text-gray-700 mb-4" />
              <p className="text-sm text-gray-400 dark:text-gray-600">Configure settings and click Generate to see AI-powered content.</p>
            </Card>
          ) : (
            outputs.map((output, i) => (
              <Card
                key={i}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedOutput === i ? 'border-blue-500 ring-2 ring-blue-500/20' : 'hover:border-gray-300 dark:hover:border-gray-600'
                )}
                onClick={() => setSelectedOutput(i)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="sm">Variation {i + 1}</Badge>
                    {selectedOutput === i && <Badge variant="success" size="sm">Selected</Badge>}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleCopy(output, i) }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {copiedIdx === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{output}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400">{output.length} characters</span>
                  {selectedOutput === i && (
                    <Button size="xs" onClick={e => { e.stopPropagation() }}>
                      Use This Post
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
          {outputs.length > 0 && (
            <Button variant="outline" className="w-full" onClick={handleGenerate} loading={loading}>
              <RefreshCw size={14} />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
