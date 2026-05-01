import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const days = parseInt(searchParams.get('days') ?? '30', 10)

  const since = new Date()
  since.setDate(since.getDate() - days)

  let query = supabase
    .from('analytics_data')
    .select('*')
    .eq('user_id', user.id)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: false })

  if (platform) {
    query = query.eq('platform', platform)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const aggregated: Record<string, { impressions: number; likes: number; comments: number; shares: number; followers: number; records: number }> = {}

  for (const row of data ?? []) {
    const key = row.platform as string
    if (!aggregated[key]) {
      aggregated[key] = { impressions: 0, likes: 0, comments: 0, shares: 0, followers: 0, records: 0 }
    }
    aggregated[key].impressions += row.impressions ?? 0
    aggregated[key].likes += row.likes ?? 0
    aggregated[key].comments += row.comments ?? 0
    aggregated[key].shares += row.shares ?? 0
    aggregated[key].followers += row.followers ?? 0
    aggregated[key].records += 1
  }

  return NextResponse.json({ data: aggregated, raw: data, period_days: days })
}
