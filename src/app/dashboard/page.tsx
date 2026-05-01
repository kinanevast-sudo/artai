import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardHome } from '@/components/dashboard/DashboardHome'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [postsResult, scheduledResult, accountsResult, subscriptionResult] = await Promise.all([
    supabase.from('scheduled_posts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('scheduled_posts').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'scheduled'),
    supabase.from('connected_accounts').select('followers_count').eq('user_id', user.id).eq('is_active', true),
    supabase.from('subscriptions').select('plan_type, status, current_period_end').eq('user_id', user.id).maybeSingle(),
  ])

  const totalFollowers = (accountsResult.data || []).reduce((sum, a) => sum + (a.followers_count || 0), 0)

  return (
    <DashboardHome
      totalPosts={postsResult.count || 0}
      scheduledPosts={scheduledResult.count || 0}
      connectedAccounts={(accountsResult.data || []).length}
      totalFollowers={totalFollowers}
      subscription={subscriptionResult.data}
      userName={user.email?.split('@')[0] || 'there'}
    />
  )
}
