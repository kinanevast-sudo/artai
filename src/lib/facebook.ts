// src/lib/facebook.ts

const GRAPH_API = 'https://graph.facebook.com/v25.0'
export async function exchangeCodeForAccessToken(code: string, redirectUri: string): Promise<string> {
  // ✅ اصلاح: استخدام NEXT_PUBLIC_FACEBOOK_APP_ID
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    redirect_uri: redirectUri,
    code,
  })

  const res = await fetch(`${GRAPH_API}/oauth/access_token?${params}`)
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to exchange code for access token')
  }

  return json.access_token as string
}

export async function getLongLivedToken(shortLivedToken: string): Promise<string> {
  // ✅ اصلاح: استخدام NEXT_PUBLIC_FACEBOOK_APP_ID
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    fb_exchange_token: shortLivedToken,
  })

  const res = await fetch(`${GRAPH_API}/oauth/access_token?${params}`)
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to get long-lived token')
  }

  return json.access_token as string
}

export interface FacebookPage {
  id: string
  name: string
  access_token: string
  picture?: { data: { url: string } }
  fan_count?: number
}

export async function getUserPages(userAccessToken: string): Promise<FacebookPage[]> {
  const res = await fetch(
    `${GRAPH_API}/me/accounts?fields=id,name,access_token,picture,fan_count&access_token=${userAccessToken}`
  )
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to fetch pages')
  }

  return (json.data || []) as FacebookPage[]
}

export async function getPageAccessToken(pageId: string, userAccessToken: string): Promise<string> {
  const res = await fetch(
    `${GRAPH_API}/${pageId}?fields=access_token&access_token=${userAccessToken}`
  )
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to get page access token')
  }

  return json.access_token as string
}

export type MediaType = 'none' | 'image' | 'video'

export async function publishPost(
  pageId: string,
  content: string,
  mediaUrl: string,
  mediaType: MediaType,
  pageAccessToken: string
): Promise<string> {
  let endpoint: string
  let body: Record<string, string>

  if (mediaType === 'image' && mediaUrl) {
    endpoint = `${GRAPH_API}/${pageId}/photos`
    body = { url: mediaUrl, caption: content, access_token: pageAccessToken }
  } else if (mediaType === 'video' && mediaUrl) {
    endpoint = `${GRAPH_API}/${pageId}/videos`
    body = { file_url: mediaUrl, description: content, access_token: pageAccessToken }
  } else {
    endpoint = `${GRAPH_API}/${pageId}/feed`
    body = { message: content, access_token: pageAccessToken }
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to publish post')
  }

  return (json.id || json.post_id || '') as string
}

export async function sendReply(
  pageAccessToken: string,
  recipientId: string,
  messageText: string
): Promise<void> {
  const res = await fetch(`${GRAPH_API}/me/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: messageText },
      access_token: pageAccessToken,
    }),
  })

  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Failed to send reply')
  }
}

export function buildOAuthUrl(redirectUri: string, state: string): string {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
  
  if (!appId) {
    throw new Error('NEXT_PUBLIC_FACEBOOK_APP_ID is not defined')
  }

  // ✅ استخدم v25.0 بدلاً من v19.0
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: [
      'pages_show_list',
      'public_profile',
      'pages_manage_posts'
    ].join(','),
    response_type: 'code',
    state: state,
  })

  return `https://www.facebook.com/v25.0/dialog/oauth?${params}`
}
