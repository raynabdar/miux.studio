import { beforeEach, describe, expect, it, vi } from 'vitest'

type FakeRedis = {
  get: (key: string) => Promise<number | null>
  incr: (key: string) => Promise<number>
  expire: (key: string, seconds: number) => Promise<number>
  del: (key: string) => Promise<number>
  store: Map<string, number>
}

const state = vi.hoisted(() => ({ redis: null as FakeRedis | null }))

vi.mock('@/lib/ratelimit', () => ({
  getRedisClient: () => state.redis,
}))

import { clearSignInFailures, isSignInLocked, recordSignInFailure } from '@/lib/security/lockout'

function createRedis(): FakeRedis {
  const store = new Map<string, number>()
  return {
    store,
    get: async (key) => store.get(key) ?? null,
    incr: async (key) => {
      const next = (store.get(key) ?? 0) + 1
      store.set(key, next)
      return next
    },
    expire: vi.fn(async () => 1),
    del: async (key) => (store.delete(key) ? 1 : 0),
  }
}

beforeEach(() => {
  state.redis = createRedis()
})

describe('sign-in lockout', () => {
  it('locks after five failures and sets the window on the first failure', async () => {
    const results: boolean[] = []
    for (let i = 0; i < 5; i += 1) {
      const { locked } = await recordSignInFailure('User@Example.com ')
      results.push(locked)
    }
    expect(results).toEqual([false, false, false, false, true])
    expect(state.redis?.expire).toHaveBeenCalledTimes(1)
    expect(state.redis?.expire).toHaveBeenCalledWith('miux:lockout:user@example.com', 900)
    await expect(isSignInLocked('user@example.com')).resolves.toBe(true)
  })

  it('normalizes email casing and whitespace to one counter', async () => {
    await recordSignInFailure('  A@B.com')
    await recordSignInFailure('a@b.com ')
    expect(state.redis?.store.get('miux:lockout:a@b.com')).toBe(2)
    expect(state.redis?.store.size).toBe(1)
  })

  it('clears failures after a successful sign-in', async () => {
    for (let i = 0; i < 5; i += 1) await recordSignInFailure('client@example.com')
    await clearSignInFailures('client@example.com')
    await expect(isSignInLocked('client@example.com')).resolves.toBe(false)
    const { locked } = await recordSignInFailure('client@example.com')
    expect(locked).toBe(false)
  })

  it('fails open when Redis is unavailable or errors', async () => {
    state.redis = null
    await expect(isSignInLocked('client@example.com')).resolves.toBe(false)
    await expect(recordSignInFailure('client@example.com')).resolves.toEqual({ locked: false })

    state.redis = {
      ...createRedis(),
      get: async () => {
        throw new Error('connection refused')
      },
      incr: async () => {
        throw new Error('connection refused')
      },
    }
    await expect(isSignInLocked('client@example.com')).resolves.toBe(false)
    await expect(recordSignInFailure('client@example.com')).resolves.toEqual({ locked: false })
  })
})
