import { createHash } from 'node:crypto'

// Store only a salted hash of IP addresses in the database.
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}
