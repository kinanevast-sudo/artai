import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, data } = body

  const supabase = createClient()

  if (type === 'checkout.session.completed') {
    const session = data.object
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string
    const customerEmail = session.customer_email as string | null

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'active',
          customer_email: customerEmail,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_customer_id' }
      )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (type === 'customer.subscription.updated') {
    const subscription = data.object
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id as string
    const status = subscription.status as string
    const currentPeriodEnd = subscription.current_period_end as number | null
    const planId = subscription.items?.data?.[0]?.price?.id as string | undefined

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status,
          plan_id: planId ?? null,
          current_period_end: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_customer_id' }
      )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (type === 'customer.subscription.deleted') {
    const subscription = data.object
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id as string

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'canceled',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_customer_id' }
      )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
