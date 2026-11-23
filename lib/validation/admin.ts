import { z } from 'zod'

export const clientNoteSchema = z.object({
  clientId: z.string().trim().min(1, 'Client is required.').max(200),
  body: z
    .string()
    .trim()
    .min(2, 'Write a note first.')
    .max(4000, 'Notes are limited to 4000 characters.'),
})

export const roleChangeSchema = z.object({
  clerkId: z.string().trim().min(1, 'Client is required.').max(200),
  role: z.enum(['client', 'team_member']),
})

export const verifyAccountSchema = z.object({
  clerkId: z.string().trim().min(1, 'Client is required.').max(200),
  mode: z.enum(['verify', 'unverify']),
})
