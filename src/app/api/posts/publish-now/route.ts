import { createClient } from '@/lib/supabase/server'
import { publishPost } from '@/lib/facebook'
import type { MediaType } from '@/lib/facebook'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { connected_account_id, content, media_url, media_type } = body

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }
  if (!connected_account_id) {
    return NextResponse.json({ error: 'connected_account_id is required' }, { status: 400 })
  }

  const { data: account } = await supabase
    .from('connected_accounts')
    .select('id, account_id, access_token, platform')
    .eq('id', connected_account_id)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!account) {
    return NextResponse.json({ error: 'Connected account not found' }, { status: 404 })
  }

  const now = new Date().toISOString()

  const { data: post, error: insertError } = await supabase
    .from('scheduled_posts')
    .insert({
      user_id: user.id,
      connected_account_id,
      content,
      media_url: media_url || '',
      media_type: media_type || 'none',
      status: 'publishing',
      published_at: now,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  try {
    const externalId = await publishPost(
      account.account_id,
      content,
      media_url || '',
      (media_type || 'none') as MediaType,
      account.access_token
    )

    await supabase
      .from('scheduled_posts')
      .update({ status: 'published', published_at: now, error_message: '' })
      .eq('id', post.id)

    return NextResponse.json({ data: { post_id: post.id, external_id: externalId } })
  } catch (err: any) {
    await supabase
      .from('scheduled_posts')
      .update({ status: 'failed', error_message: err?.message || 'Unknown error' })
      .eq('id', post.id)

    return NextResponse.json({ error: err?.message || 'Failed to publish' }, { status: 502 })
  }
}
