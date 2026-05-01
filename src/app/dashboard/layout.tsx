import React from 'react'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <DashboardLayout userName="" userEmail="">
        {children}
      </DashboardLayout>
    )
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('display_name, email')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <DashboardLayout
      userName={profile?.display_name || user.email?.split('@')[0]}
      userEmail={profile?.email || user.email}
    >
      {children}
    </DashboardLayout>
  )
}
