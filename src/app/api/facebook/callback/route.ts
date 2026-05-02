import { createClient } from '@/lib/supabase/server'
import {
  exchangeCodeForAccessToken,
  getLongLivedToken,
  getUserPages,
  getInstagramAccount,
} from '@/lib/facebook'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://artai23.netlify.app'

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl))
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')

  if (errorParam) {
    console.error('Facebook OAuth error:', errorParam)
    return NextResponse.redirect(
      new URL('/dashboard/accounts?error=facebook_denied', siteUrl)
    )
  }

  const storedState = request.cookies.get('fb_oauth_state')?.value
  
  if (!code || !state || state !== storedState) {
    console.error('State mismatch or missing code')
    return NextResponse.redirect(
      new URL('/dashboard/accounts?error=invalid_state', siteUrl)
    )
  }

  try {
    const redirectUri = `${siteUrl}/api/facebook/callback`
    
    const shortToken = await exchangeCodeForAccessToken(code, redirectUri)
    const longToken = await getLongLivedToken(shortToken)
    const pages = await getUserPages(longToken)

    if (pages.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/accounts?error=no_pages', siteUrl)
      )
    }

    const tokenExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

    for (const page of pages) {
      // حفظ صفحة فيسبوك
      const { error: fbError } = await supabase
        .from('connected_accounts')
        .upsert(
          {
            user_id: user.id,
            platform: 'facebook',
            account_id: page.id,
            page_id: page.id,
            account_name: page.name,
            account_username: page.name,
            avatar_url: page.picture?.data?.url || '',
            access_token: page.access_token,
            token_expires_at: tokenExpiresAt,
            is_active: true,
            followers_count: page.fan_count || 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,account_id' }
        )

      if (fbError) {
        console.error('Error saving Facebook page:', fbError)
      }

      // ✅ جلب وحفظ حساب Instagram المرتبط
      const igAccount = await getInstagramAccount(page.access_token, page.id)
      
      if (igAccount) {
        const { error: igError } = await supabase
          .from('connected_accounts')
          .upsert(
            {
              user_id: user.id,
              platform: 'instagram',
              account_id: igAccount.id,
              account_name: igAccount.name || igAccount.username,
              account_username: igAccount.username,
              avatar_url: igAccount.profile_picture_url || '',
              access_token: page.access_token,
              token_expires_at: tokenExpiresAt,
              is_active: true,
              followers_count: igAccount.followers_count || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,account_id' }
          )

        if (igError) {
          console.error('Error saving Instagram account:', igError)
        }
      }
    }

    const response = NextResponse.redirect(
      new URL('/dashboard/accounts?success=facebook_connected', siteUrl)
    )
    response.cookies.delete('fb_oauth_state')
    return response
    
  } catch (err) {
    console.error('Facebook callback error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/accounts?error=oauth_failed', siteUrl)
    )
  }
}
