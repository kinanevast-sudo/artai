import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { topic, platform, tone, audience } = body

  if (!topic || !platform) {
    return NextResponse.json({ error: 'Missing required fields: topic and platform' }, { status: 400 })
  }

  const systemPrompt = `You are a social media content expert specializing in creating engaging posts for ${platform}. Generate content that is optimized for the platform's format, audience expectations, and algorithmic preferences. Always return exactly 3 distinct variations.`

  const userPrompt = `Create 3 variations of a social media post for ${platform} about the following topic: "${topic}".
Tone: ${tone ?? 'professional'}
Target audience: ${audience ?? 'general'}

Return a JSON object with this exact structure:
{
  "variations": [
    { "id": 1, "content": "..." },
    { "id": 2, "content": "..." },
    { "id": 3, "content": "..." }
  ]
}

Platform-specific guidelines:
- Twitter/X: Max 280 characters, concise, use hashtags sparingly
- Instagram: Up to 2200 characters, engaging, use relevant hashtags
- LinkedIn: Professional tone, up to 3000 characters, thought leadership
- Facebook: Conversational, up to 63206 characters, encourage engagement
- TikTok: Casual, trending language, include hook in first line`

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })

  if (!openAIResponse.ok) {
    const errBody = await openAIResponse.text()
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      topic,
      platform,
      tone: tone ?? 'professional',
      audience: audience ?? 'general',
      status: 'error',
      error_message: errBody,
    })
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 502 })
  }

  const openAIData = await openAIResponse.json()
  const rawContent = openAIData.choices?.[0]?.message?.content

  let variations: { id: number; content: string }[] = []
  try {
    const parsed = JSON.parse(rawContent)
    variations = parsed.variations ?? []
  } catch {
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      topic,
      platform,
      tone: tone ?? 'professional',
      audience: audience ?? 'general',
      status: 'error',
      error_message: 'Failed to parse OpenAI response',
    })
    return NextResponse.json({ error: 'Failed to parse generated content' }, { status: 500 })
  }

  await supabase.from('ai_generation_logs').insert({
    user_id: user.id,
    topic,
    platform,
    tone: tone ?? 'professional',
    audience: audience ?? 'general',
    status: 'success',
    tokens_used: openAIData.usage?.total_tokens ?? null,
  })

  return NextResponse.json({ data: { variations } }, { status: 200 })
}
