// src/app/api/facebook/auth/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://artai23.netlify.app'

  if (!APP_ID) {
    console.error('❌ NEXT_PUBLIC_FACEBOOK_APP_ID is not defined')
    return NextResponse.redirect(new URL('/dashboard/accounts?error=missing_app_id', SITE_URL))
  }

  const state = randomBytes(16).toString('hex')
  const redirectUri = `${SITE_URL}/api/facebook/callback`

  // ✅ استخدم v25.0
  const scope = [
  'pages_show_list',
  'public_profile',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish',
  'pages_read_engagement',
].join(',')

  const facebookAuthUrl = `https://www.facebook.com/v25.0/dialog/oauth?` +
    `client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code` +
    `&state=${state}`

  console.log('🔗 Redirecting to:', facebookAuthUrl)

  const response = NextResponse.redirect(facebookAuthUrl)

  response.cookies.set('fb_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
