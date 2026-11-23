import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export type LimitName =
  | 'onboarding-submit'
  | 'sign-in'
  | 'sign-up'
  | 'password-reset'
  | 'meeting-request'
  | 'messaging'
  | 'ai'

const CONFIG: Record<LimitName, { limit: number; window: `${number} ${'s' | 'm' | 'h'}` }> = {
  'onboarding-submit': { limit: 5, window: '15 m' },
  'sign-in': { limit: 10, window: '10 m' },
  'sign-up': { limit: 5, window: '1 h' },
  'password-reset': { limit: 3, window: '1 h' },
  'meeting-request': { limit: 5, window: '1 h' },
  messaging: { limit: 60, window: '10 m' },
  ai: { limit: 20, window: '1 h' },
}

const limiters = new Map<LimitName, Ratelimit>()

function getLimiter(name: LimitName): Ratelimit | null {
  const redis = getRedisClient()
  if (!redis) return null
  const existing = limiters.get(name)
  if (existing) return existing
  const { limit, window } = CONFIG[name]
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `miux:rl:${name}`,
  })
  limiters.set(name, limiter)
  return limiter
}

export type LimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

/**
 * Mandatory in production: if Upstash is not configured there, writes fail
 * closed. In development, allow through with a warning so local work continues.
 */
export async function enforceLimit(name: LimitName, identifier: string): Promise<LimitResult> {
  const limiter = getLimiter(name)
  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[ratelimit] ${name}: Upstash is not configured; failing closed`)
      return { ok: false, retryAfterSeconds: 60 }
    }
    console.warn(`[ratelimit] ${name}: Upstash not configured; allowing in development`)
    return { ok: true }
  }
  try {
    const result = await limiter.limit(identifier)
    if (result.success) return { ok: true }
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) }
  } catch (error) {
    console.error(`[ratelimit] ${name}: check failed`, (error as Error).message)
    return process.env.NODE_ENV === 'production'
      ? { ok: false, retryAfterSeconds: 60 }
      : { ok: true }
  }
}
