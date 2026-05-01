'use client'

import React, { useState } from 'react'
import { Search, ChevronRight, ChevronDown, Mail, MessageSquare, Book, Play, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const FAQ = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I connect my social media accounts?', a: 'Go to Connected Accounts in the sidebar. Click Connect Account and select your platform. You will be redirected to authorize the connection with OAuth.' },
      { q: 'How do I schedule my first post?', a: 'Click Create Post in the sidebar. Write your content, select platforms, set a date and time, then click Schedule Post.' },
      { q: 'What platforms are supported?', a: 'We support Instagram, Facebook, Twitter/X, LinkedIn, and TikTok. More platforms coming soon!' },
    ]
  },
  {
    category: 'AI Features',
    items: [
      { q: 'How does the AI Writer work?', a: 'The AI Writer uses GPT-4 to generate post content based on your topic, tone, platform, and target audience. Available on Basic plan and above.' },
      { q: 'What is the Auto-Reply Bot?', a: 'The bot monitors your comments and messages and automatically replies based on keyword rules. On Pro plans, it uses AI for context-aware replies.' },
      { q: 'How many AI generations do I get?', a: 'Basic plan: 100/month. Pro and Enterprise: unlimited. Trial: AI not included.' },
    ]
  },
  {
    category: 'Billing & Plans',
    items: [
      { q: 'Can I change my plan at any time?', a: 'Yes! You can upgrade or downgrade at any time from the Billing page. Changes take effect immediately.' },
      { q: 'Is there a free trial?', a: 'Yes! All new accounts get a 14-day free trial with 1 connected account and 30 posts per month. No credit card required.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe. Bank transfers available for Enterprise plans.' },
    ]
  },
  {
    category: 'Privacy & Security',
    items: [
      { q: 'How is my data protected?', a: 'We use enterprise-grade encryption for all data. Access tokens are encrypted at rest. We are CCPA and PIPEDA compliant.' },
      { q: 'Can I delete my account?', a: 'Yes. Go to Settings > Data & Privacy and click Delete My Account. This permanently removes all your data within 30 days.' },
    ]
  },
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [supportMessage, setSupportMessage] = useState('')

  const toggle = (id: string) => setOpenItem(prev => prev === id ? null : id)

  const filteredFAQ = FAQ.map(section => ({
    ...section,
    items: section.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => s.items.length > 0)

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find answers and contact our support team.</p>
      </div>

      <Input
        placeholder="Search help articles..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={14} />}
      />

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Book, title: 'Documentation', desc: 'Detailed guides and API reference', action: 'Browse Docs' },
          { icon: Play, title: 'Video Tutorials', desc: 'Step-by-step video walkthroughs', action: 'Watch Videos' },
          { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with support team in real-time', action: 'Start Chat' },
        ].map(item => (
          <Card key={item.title} hover onClick={() => toast.info(`Opening ${item.title}...`)} className="cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <item.icon size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              {item.action}
              <ExternalLink size={12} />
            </Button>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {filteredFAQ.map(section => (
            <div key={section.category}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const id = `${section.category}-${i}`
                  const isOpen = openItem === id
                  return (
                    <div key={id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
                        {isOpen ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-blue-600 dark:text-blue-400" />
            <CardTitle>Contact Support</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Average response time: under 2 hours during business hours.</p>
          <div className="space-y-3">
            <textarea
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              rows={4}
              placeholder="Describe your issue in detail..."
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <Button
              onClick={() => { setSupportMessage(''); toast.success('Message sent! We will respond within 2 hours.') }}
              disabled={!supportMessage.trim()}
            >
              <Mail size={14} />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
