type Fetcher = typeof fetch

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Server-side Turnstile verification. Fails closed: a missing secret or a
// network error never lets a submission through.
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string,
  fetcher: Fetcher = fetch
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetcher(SITEVERIFY_URL, { method: 'POST', body })
    if (!response.ok) return false
    const data = (await response.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
