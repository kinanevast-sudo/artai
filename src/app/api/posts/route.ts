import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*, post_platforms(*)')
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: false })

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
  const { content, platforms, scheduled_at, status } = body

  if (!content || !platforms || !scheduled_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: post, error: postError } = await supabase
    .from('scheduled_posts')
    .insert({ user_id: user.id, content, scheduled_at, status: status ?? 'scheduled' })
    .select()
    .single()

  if (postError) return NextResponse.json({ error: postError.message }, { status: 500 })

  const platformRows = (platforms as string[]).map((platform) => ({
    post_id: post.id,
    platform,
  }))

  const { error: platformsError } = await supabase
    .from('post_platforms')
    .insert(platformRows)

  if (platformsError) return NextResponse.json({ error: platformsError.message }, { status: 500 })

  const { data: fullPost, error: fetchError } = await supabase
    .from('scheduled_posts')
    .select('*, post_platforms(*)')
    .eq('id', post.id)
    .single()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  return NextResponse.json({ data: fullPost }, { status: 201 })
}
