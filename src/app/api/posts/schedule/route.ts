import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { connected_account_id, content, media_url, media_type, scheduled_at } = body

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }
  if (!scheduled_at) {
    return NextResponse.json({ error: 'scheduled_at is required' }, { status: 400 })
  }

  const scheduledDate = new Date(scheduled_at)
  if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
    return NextResponse.json({ error: 'scheduled_at must be a future date' }, { status: 400 })
  }

  if (connected_account_id) {
    const { data: account } = await supabase
      .from('connected_accounts')
      .select('id')
      .eq('id', connected_account_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!account) {
      return NextResponse.json({ error: 'Connected account not found' }, { status: 404 })
    }
  }

  const { data, error } = await supabase
    .from('scheduled_posts')
    .insert({
      user_id: user.id,
      connected_account_id: connected_account_id || null,
      content,
      media_url: media_url || '',
      media_type: media_type || 'none',
      scheduled_at: scheduledDate.toISOString(),
      status: 'scheduled',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
