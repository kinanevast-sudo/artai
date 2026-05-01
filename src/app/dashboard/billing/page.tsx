'use client'

import React, { useState } from 'react'
import { Check, Zap, Crown, Building2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmModal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'trial',
    name: 'Trial',
    icon: Star,
    price: 0,
    period: '14 days',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800',
    features: [
      '1 connected account',
      '30 posts/month',
      '100 MB storage',
      'Basic scheduling',
      'Email support',
    ],
    unavailable: ['AI writer', 'Auto-reply bot', 'Advanced analytics', 'Competitor analysis', 'Team members'],
  },
  {
    id: 'basic',
    name: 'Basic',
    icon: Zap,
    price: 9,
    period: 'month',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    features: [
      '3 connected accounts',
      '150 posts/month',
      '2 GB storage',
      'AI writer (100/month)',
      'Bot (rules only)',
      'Priority support',
    ],
    unavailable: ['Advanced analytics', 'Competitor analysis', 'Team members'],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    price: 29,
    period: 'month',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    popular: true,
    features: [
      '10 connected accounts',
      'Unlimited posts',
      '20 GB storage',
      'AI writer (unlimited)',
      'AI bot replies',
      'Advanced analytics',
      'Competitor analysis (5)',
      '3 team members',
      'Priority support',
    ],
    unavailable: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 99,
    period: 'month',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    features: [
      'Unlimited accounts',
      'Unlimited posts',
      '200 GB storage',
      'Full AI suite',
      'Full bot features',
      'Advanced analytics',
      'Unlimited competitors',
      '10+ team members',
      'Dedicated support',
      'Custom integrations',
    ],
    unavailable: [],
  },
]

const INVOICES = [
  { id: 'INV-001', date: 'Mar 1, 2026', amount: '$29.00', plan: 'Pro', status: 'paid' },
  { id: 'INV-002', date: 'Feb 1, 2026', amount: '$29.00', plan: 'Pro', status: 'paid' },
  { id: 'INV-003', date: 'Jan 1, 2026', amount: '$9.00', plan: 'Basic', status: 'paid' },
]

export default function BillingPage() {
  const [currentPlan] = useState('trial')
  const [cancelModal, setCancelModal] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState<string | null>(null)

  const handleUpgrade = (planId: string) => {
    setUpgradeModal(null)
    toast.success(`Redirecting to Stripe checkout for ${planId} plan...`)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and payment information.</p>
      </div>

      {/* Current plan banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">Current Plan</p>
            <h2 className="text-2xl font-bold">Trial Plan</h2>
            <p className="text-blue-200 text-sm mt-1">Expires in 11 days &middot; Apr 23, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm mb-2">Usage this month</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Posts</span><span>14 / 30</span>
                </div>
                <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '47%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Storage</span><span>32 / 100 MB</span>
                </div>
                <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '32%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Plan cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border p-5 transition-all',
                plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800',
                currentPlan === plan.id ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-900'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', plan.bg)}>
                <plan.icon size={18} className={plan.color} />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</p>
              <div className="mt-1 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                <span className="text-gray-400 text-xs">/{plan.period}</span>
              </div>
              <div className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
                {plan.unavailable?.map(f => (
                  <div key={f} className="flex items-start gap-2 text-xs text-gray-300 dark:text-gray-600">
                    <span className="text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0 text-xs">✕</span>
                    {f}
                  </div>
                ))}
              </div>
              {currentPlan === plan.id ? (
                <div className="w-full py-2 rounded-xl text-xs font-medium text-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Current Plan
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="sm"
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={() => setUpgradeModal(plan.name)}
                >
                  {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader><CardTitle>Invoice History</CardTitle></CardHeader>
        <CardContent>
          {INVOICES.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {INVOICES.map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{inv.date}</p>
                    </div>
                    <Badge variant="default" size="sm">{inv.plan} Plan</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{inv.amount}</span>
                    <Badge variant="success" size="sm">Paid</Badge>
                    <Button variant="ghost" size="xs" onClick={() => toast.info('Downloading invoice...')}>
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No invoices yet. Invoices appear after your first payment.</p>
          )}
        </CardContent>
      </Card>

      {/* Cancel subscription */}
      <Card className="border-red-100 dark:border-red-900/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Cancel Subscription</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You will retain access until the end of your billing period.</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setCancelModal(true)}>Cancel Plan</Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={() => { setCancelModal(false); toast.success('Subscription cancelled. You retain access until period end.') }}
        title="Cancel Subscription"
        message="Are you sure you want to cancel? You will lose access to premium features at the end of your current billing period."
        confirmLabel="Cancel Subscription"
        danger
      />

      <ConfirmModal
        isOpen={!!upgradeModal}
        onClose={() => setUpgradeModal(null)}
        onConfirm={() => handleUpgrade(upgradeModal || '')}
        title={`Upgrade to ${upgradeModal}`}
        message={`You will be redirected to Stripe to complete payment for the ${upgradeModal} plan.`}
        confirmLabel="Proceed to Payment"
      />
    </div>
  )
}
