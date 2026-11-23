type Fetcher = typeof fetch

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Public Cloudflare Turnstile site key (client-visible identifier, never a secret).
export const DEFAULT_TURNSTILE_SITE_KEY = '0x4AAAAAAGOyoyrkcIFjLbQ8'

// Cloudflare's documented always-pass test site key. The production widget rejects
// hostnames missing from its Hostname Management list (client error 110200), which
// breaks local dev; without a secret nothing is verified server-side anyway, so a
// passing test widget keeps dev usable and unchanged in production.
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'

export type TurnstileAction = 'onboarding' | 'sign_in' | 'sign_up'

export function getTurnstileSiteKey(): string {
  if (process.env.NODE_ENV === 'development' && !isTurnstileSecretConfigured()) {
    return TURNSTILE_TEST_SITE_KEY
  }
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  return configured || DEFAULT_TURNSTILE_SITE_KEY
}

function getTurnstileSecret(): string | undefined {
  const secret = (process.env.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET)?.trim()
  return secret || undefined
}

export function isTurnstileSecretConfigured(): boolean {
  return Boolean(getTurnstileSecret())
}

function getExpectedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? '')
      .split(',')
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean)
  )
}

export type VerifyTurnstileOptions = {
  remoteIp?: string
  expectedAction?: TurnstileAction
  fetcher?: Fetcher
}

type SiteverifyResponse = {
  success?: boolean
  action?: string
  hostname?: string
}

// Canonical server-side Turnstile siteverify. Fails closed: a missing secret,
// malformed token, network error, action mismatch, or hostname mismatch never
// lets a submission through.
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIpOrOptions?: string | VerifyTurnstileOptions,
  fetcherArg?: Fetcher
): Promise<boolean> {
  const options: VerifyTurnstileOptions =
    typeof remoteIpOrOptions === 'string'
      ? { remoteIp: remoteIpOrOptions, fetcher: fetcherArg }
      : { ...(remoteIpOrOptions ?? {}), fetcher: remoteIpOrOptions?.fetcher ?? fetcherArg }

  const secret = getTurnstileSecret()
  if (!secret || typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return false
  }

  const expectedHostnames = getExpectedHostnames()
  const body = new URLSearchParams({ secret, response: token })
  if (options.remoteIp && options.remoteIp !== 'unknown') {
    body.set('remoteip', options.remoteIp)
  }

  const doFetch = options.fetcher ?? fetch

  try {
    const response = await doFetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body,
    })
    if (!response.ok) return false

    const data = (await response.json()) as SiteverifyResponse
    if (data.success !== true) return false
    if (options.expectedAction && data.action !== options.expectedAction) return false
    if (
      expectedHostnames.size > 0 &&
      (!data.hostname || !expectedHostnames.has(data.hostname.toLowerCase()))
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}
