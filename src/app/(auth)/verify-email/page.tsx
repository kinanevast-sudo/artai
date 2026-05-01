'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Zap, Mail, RefreshCw, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { resendVerification } from '@/lib/auth'
import { Button } from '@/components/ui/button'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    if (!email || countdown > 0) return
    setLoading(true)
    const { error } = await resendVerification(email)
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setResent(true)
    setCountdown(60)
    toast.success('Verification email sent!')
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
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            We sent a verification link to
          </p>
          {email && (
            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-6">{email}</p>
          )}

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 text-left mb-6">
            <p className="font-medium mb-1">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>Open the email from SocialAI</li>
              <li>Click the &quot;Verify email address&quot; link</li>
              <li>You&apos;ll be redirected to your dashboard</li>
            </ol>
          </div>

          {resent && (
            <div className="flex items-center gap-2 justify-center text-green-600 dark:text-green-400 text-sm mb-4">
              <CheckCircle size={14} />
              Verification email resent successfully
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full gap-2"
              loading={loading}
              disabled={countdown > 0}
            >
              <RefreshCw size={14} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="w-full gap-2 text-gray-500 dark:text-gray-400">
                <ArrowLeft size={14} />
                Back to Sign In
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href="/resend-verification" className="text-blue-600 dark:text-blue-400 hover:underline">
              try a different email
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
