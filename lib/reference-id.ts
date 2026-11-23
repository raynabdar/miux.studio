import { randomInt } from 'node:crypto'

// Unambiguous alphabet (no 0/O, 1/I/L).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateReferenceId(now = new Date()): string {
  let suffix = ''
  for (let i = 0; i < 5; i += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)]
  }
  return `MIUX-${now.getFullYear()}-${suffix}`
}

export const REFERENCE_ID_PATTERN = /^MIUX-\d{4}-[A-HJKMNP-Z2-9]{5}$/

// Retries on unique-reference collisions. P2002 (unique constraint) is thrown
// by Prisma when two submissions race for the same suffix.
export async function createWithReference<T>(
  create: (referenceId: string) => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await create(generateReferenceId())
    } catch (error) {
      lastError = error
      const code = (error as { code?: string }).code
      if (code !== 'P2002') throw error
    }
  }
  throw lastError
}
