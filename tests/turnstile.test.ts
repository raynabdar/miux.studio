import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTurnstileSiteKey, verifyTurnstile } from '@/lib/security/turnstile'

describe('Turnstile verification', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
    process.env.TURNSTILE_HOSTNAMES = 'www.miux.studio,localhost'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns the configured site key or default public site key', () => {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    expect(getTurnstileSiteKey()).toBe('0x4AAAAAAGOyoyrkcIFjLbQ8')

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = '0xCUSTOM'
    expect(getTurnstileSiteKey()).toBe('0xCUSTOM')
  })

  it('accepts valid siteverify responses matching action and hostname', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: 'onboarding',
          hostname: 'www.miux.studio',
        }),
        { status: 200 }
      )
    )

    const ok = await verifyTurnstile('valid-token', {
      remoteIp: '203.0.113.10',
      expectedAction: 'onboarding',
      fetcher,
    })

    expect(ok).toBe(true)
    expect(fetcher).toHaveBeenCalledOnce()
  })

  it('rejects mismatched actions and unapproved hostnames', async () => {
    const wrongAction = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, action: 'sign_in', hostname: 'www.miux.studio' }),
        { status: 200 }
      )
    )
    const wrongHost = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, action: 'onboarding', hostname: 'evil.example' }),
        { status: 200 }
      )
    )

    expect(
      await verifyTurnstile('token', { expectedAction: 'onboarding', fetcher: wrongAction })
    ).toBe(false)
    expect(
      await verifyTurnstile('token', { expectedAction: 'onboarding', fetcher: wrongHost })
    ).toBe(false)
  })

  it('fails closed when secret is missing or token is invalid/oversized', async () => {
    const fetcher = vi.fn()
    expect(await verifyTurnstile('', { fetcher })).toBe(false)
    expect(await verifyTurnstile('a'.repeat(2049), { fetcher })).toBe(false)

    delete process.env.TURNSTILE_SECRET_KEY
    delete process.env.TURNSTILE_SECRET
    expect(await verifyTurnstile('valid-token', { fetcher })).toBe(false)
    expect(fetcher).not.toHaveBeenCalled()
  })
})
