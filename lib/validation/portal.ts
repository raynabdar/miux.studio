import { z } from 'zod'

export const sendMessageSchema = z.object({
  projectId: z.string().uuid('Invalid project.'),
  body: z
    .string()
    .trim()
    .min(1, 'Write a message first.')
    .max(2000, 'Messages are limited to 2000 characters.'),
})

export const meetingRequestSchema = z.object({
  projectId: z.string().uuid('Invalid project.').optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us briefly what you would like to discuss.')
    .max(1000, 'Requests are limited to 1000 characters.'),
})

const httpUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Enter a valid http(s) link.')

export const publishUpdateSchema = z.object({
  projectId: z.string().uuid('Invalid project.'),
  title: z.string().trim().min(2, 'Add a title.').max(160, 'Titles are limited to 160 characters.'),
  description: z
    .string()
    .trim()
    .min(1, 'Add a description.')
    .max(5000, 'Updates are limited to 5000 characters.'),
  attachmentUrl: z.union([httpUrl, z.literal('')]).default(''),
  attachmentName: z.string().trim().max(160).optional().default(''),
})

export const markMeetingSchema = z.object({
  requestId: z.string().uuid('Invalid request.'),
})

export const aiMessageSchema = z.object({
  projectId: z.string().uuid('Invalid project.'),
  message: z.string().trim().min(1, 'Ask a question first.').max(2000, 'Questions are limited to 2000 characters.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string().max(4000),
      })
    )
    .max(12, 'Conversation history is too long.')
    .default([]),
})
