'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, CircleCheck as CheckCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const passwordStrength = password.length >= 8
    ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'strong' : 'medium')
    : password.length > 0 ? 'weak' : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {done ? 'Password updated. Redirecting to sign in...' : 'Choose a strong password for your account.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Your password has been updated successfully.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft size={14} />
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This link has expired or is invalid.
              </p>
              <Link href="/forgot-password">
                <Button variant="outline" className="w-full">Request a new reset link</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {passwordStrength && (
                  <div className="mt-2 flex gap-1 items-center">
                    {['weak', 'medium', 'strong'].map((s, i) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength === 'weak' && i === 0 ? 'bg-red-400' :
                        passwordStrength === 'medium' && i <= 1 ? 'bg-amber-400' :
                        passwordStrength === 'strong' ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1 capitalize">{passwordStrength}</span>
                  </div>
                )}
              </div>
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
              />
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!password || !confirm || password !== confirm}>
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
