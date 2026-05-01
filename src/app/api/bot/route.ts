import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code === 'PGRST116') {
    return NextResponse.json({ data: null })
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { enabled, ai_enabled } = body

  const updates: Record<string, unknown> = {}
  if (enabled !== undefined) updates.enabled = enabled
  if (ai_enabled !== undefined) updates.ai_enabled = ai_enabled

  const { data: existing } = await supabase
    .from('bot_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let data, error

  if (existing) {
    ;({ data, error } = await supabase
      .from('bot_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single())
  } else {
    ;({ data, error } = await supabase
      .from('bot_settings')
      .insert({ user_id: user.id, ...updates })
      .select()
      .single())
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
