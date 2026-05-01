'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { resendVerification } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    const { error } = await resendVerification(email)
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">SocialAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resend Verification</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {sent ? 'Check your inbox for the new verification link.' : "Enter your email and we'll send a new verification link."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                We sent a new verification link to
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-6">{email}</p>
              <Link href="/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Send Verification Link
              </Button>
            </form>
          )}

          {!sent && (
            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                <ArrowLeft size={12} />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
