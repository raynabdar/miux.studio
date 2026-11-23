import { describe, expect, it } from 'vitest'
import { generateReferenceId, REFERENCE_ID_PATTERN } from '@/lib/reference-id'
import { isDisposableEmail } from '@/lib/security/disposable-emails'
import { startSubmissionSchema } from '@/lib/validation/onboarding'

const valid = {
  fullName: 'Ayesha Rahman',
  email: 'Ayesha@Example.com',
  company: 'Northstar Labs',
  service: 'Web Design',
  budgetRange: '$10,000 – $25,000',
  message: 'We need a new marketing site and a small client portal.',
  meetingPreference: 'yes',
  turnstileToken: 'token-123',
}

describe('onboarding validation', () => {
  it('accepts a valid submission and normalizes the email', () => {
    const parsed = startSubmissionSchema.parse(valid)
    expect(parsed.email).toBe('ayesha@example.com')
  })

  it('rejects disposable email domains', () => {
    expect(isDisposableEmail('someone@mailinator.com')).toBe(true)
    const result = startSubmissionSchema.safeParse({ ...valid, email: 'someone@mailinator.com' })
    expect(result.success).toBe(false)
  })

  it('rejects unknown services and budgets', () => {
    expect(startSubmissionSchema.safeParse({ ...valid, service: 'Astrology' }).success).toBe(false)
    expect(startSubmissionSchema.safeParse({ ...valid, budgetRange: '$1' }).success).toBe(false)
  })

  it('rejects short messages and missing challenge tokens', () => {
    expect(startSubmissionSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
    expect(startSubmissionSchema.safeParse({ ...valid, turnstileToken: '' }).success).toBe(false)
  })
})

describe('reference IDs', () => {
  it('generates IDs in the documented format', () => {
    for (let i = 0; i < 20; i += 1) {
      const id = generateReferenceId(new Date('2026-11-23T00:00:00Z'))
      expect(id).toMatch(REFERENCE_ID_PATTERN)
      expect(id.startsWith('MIUX-2026-')).toBe(true)
    }
  })

  it('rejects malformed reference IDs before any database access', async () => {
    const { getSubmissionByReferenceId } = await import('@/lib/onboarding/submission')
    await expect(getSubmissionByReferenceId('../../etc/passwd')).resolves.toBeNull()
    await expect(getSubmissionByReferenceId('MIUX-2026-AAAAA')).resolves.toBeNull()
  })
})
