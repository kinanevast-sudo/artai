import { createClient } from '@/lib/supabase/server'
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
    .select('*, post_platforms(*)')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  if (!posts || posts.length === 0) {
    return NextResponse.json({ data: { published: 0, message: 'No posts to publish' } })
  }

  const postIds = posts.map((p) => p.id)

  const { error: updateError } = await supabase
    .from('scheduled_posts')
    .update({ status: 'published', published_at: now })
    .in('id', postIds)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  const publishedLogs = posts.map((post) => ({
    post_id: post.id,
    user_id: post.user_id,
    published_at: now,
    platforms: (post.post_platforms ?? []).map((pp: { platform: string }) => pp.platform),
  }))

  const { error: logError } = await supabase
    .from('published_posts')
    .insert(publishedLogs)

  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 })

  return NextResponse.json({ data: { published: posts.length, post_ids: postIds } })
}
