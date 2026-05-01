import { createClient } from '@/lib/supabase/server'
import { verifyWebhookSignature } from '@/lib/webhook-verify'
import { sendReply } from '@/lib/facebook'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!verifyWebhookSignature(rawBody, signature, process.env.FACEBOOK_APP_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: any
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.object !== 'page') {
    return NextResponse.json({ status: 'ignored' })
  }

  const supabase = createClient()

  for (const entry of body.entry || []) {
    const pageId = entry.id as string

    const { data: account } = await supabase
      .from('connected_accounts')
      .select('id, user_id, access_token')
      .eq('platform', 'facebook')
      .eq('account_id', pageId)
      .eq('is_active', true)
      .maybeSingle()

    if (!account) continue

    const { data: botSettings } = await supabase
      .from('bot_settings')
      .select('*')
      .eq('user_id', account.user_id)
      .maybeSingle()

    if (!botSettings?.is_enabled) continue

    const { data: rules } = await supabase
      .from('bot_rules')
      .select('*')
      .eq('user_id', account.user_id)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    const messagingEvents = entry.messaging || []

    for (const event of messagingEvents) {
      if (!event.message || event.message.is_echo) continue

      const senderId = event.sender?.id as string
      const messageText = (event.message?.text || '') as string

      if (!senderId || !messageText) continue

      const lowerText = messageText.toLowerCase()
      let replyText: string | null = null

      for (const rule of rules || []) {
        const keywords: string[] = rule.trigger_keywords || []
        const matched = rule.match_exact
          ? keywords.some((kw: string) =>
              rule.case_sensitive
                ? messageText === kw
                : lowerText === kw.toLowerCase()
            )
          : keywords.some((kw: string) =>
              rule.case_sensitive
                ? messageText.includes(kw)
                : lowerText.includes(kw.toLowerCase())
            )

        if (matched) {
          replyText = rule.reply_template
          await supabase
            .from('bot_rules')
            .update({ trigger_count: (rule.trigger_count || 0) + 1 })
            .eq('id', rule.id)
          break
        }
      }

      if (!replyText) continue

      try {
        await sendReply(account.access_token, senderId, replyText)

        await supabase.from('bot_reply_logs').insert({
          user_id: account.user_id,
          connected_account_id: account.id,
          platform: 'facebook',
          sender_id: senderId,
          incoming_message: messageText,
          reply_sent: replyText,
          replied_at: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Failed to send bot reply:', err)
      }
    }
  }

  return NextResponse.json({ status: 'ok' })
}
