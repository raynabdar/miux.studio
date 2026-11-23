import { afterEach, describe, expect, it, vi } from 'vitest'
import { enforceLimit } from '@/lib/ratelimit'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('rate limiting fallback', () => {
  it('allows requests in non-production when Upstash is not configured', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    await expect(enforceLimit('sign-in', '203.0.113.10')).resolves.toEqual({ ok: true })
  })

  it('fails closed in production when Upstash is not configured', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubEnv('NODE_ENV', 'production')
    const result = await enforceLimit('onboarding-submit', '203.0.113.10')
    expect(result).toEqual({ ok: false, retryAfterSeconds: 60 })
  })
})
