import { createHmac } from 'crypto'

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader) return false

  const [algo, signature] = signatureHeader.split('=')
  if (algo !== 'sha256' || !signature) return false

  const expected = createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex')

  return expected === signature
}
