import { createClient } from '@/lib/supabase/server'
import { publishPost } from '@/lib/facebook'
import type { MediaType } from '@/lib/facebook'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const now = new Date().toISOString()

  const { data: posts, error: fetchError } = await supabase
    .from('scheduled_posts')
    .select('*, connected_accounts(id, account_id, access_token, platform)')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .limit(50)

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (!posts || posts.length === 0) {
    return NextResponse.json({ data: { published: 0, failed: 0 } })
  }

  const postIds = posts.map(p => p.id)
  await supabase
    .from('scheduled_posts')
    .update({ status: 'publishing' })
    .in('id', postIds)

  let published = 0
  let failed = 0

  for (const post of posts) {
    const account = post.connected_accounts as any

    if (!account?.access_token) {
      await supabase
        .from('scheduled_posts')
        .update({ status: 'failed', error_message: 'No connected account or access token found' })
        .eq('id', post.id)
      failed++
      continue
    }

    try {
      await publishPost(
        account.account_id,
        post.content,
        post.media_url || '',
        (post.media_type || 'none') as MediaType,
        account.access_token
      )

      await supabase
        .from('scheduled_posts')
        .update({ status: 'published', published_at: new Date().toISOString(), error_message: '' })
        .eq('id', post.id)

      published++
    } catch (err: any) {
      await supabase
        .from('scheduled_posts')
        .update({ status: 'failed', error_message: err?.message || 'Publish failed' })
        .eq('id', post.id)
      failed++
    }
  }

  return NextResponse.json({ data: { published, failed, total: posts.length } })
}
