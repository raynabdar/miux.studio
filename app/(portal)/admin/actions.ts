'use server'

import { revalidatePath } from 'next/cache'
import { requireFounder } from '@/lib/auth/session'
import {
  addClientNote,
  changeClientRole,
  setAccountVerification,
} from '@/lib/admin/accounts'
import { markRequestSeen } from '@/lib/meetings'
import { clientNoteSchema, roleChangeSchema, verifyAccountSchema } from '@/lib/validation/admin'

function revalidateAdmin(clerkId?: string) {
  revalidatePath('/admin')
  revalidatePath('/admin/meetings')
  revalidatePath('/admin/submissions')
  revalidatePath('/admin/audit')
  if (clerkId) {
    revalidatePath('/admin/clients')
    revalidatePath(`/admin/clients/${clerkId}`)
  }
}

export async function verifyAccountForm(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const parsed = verifyAccountSchema.safeParse({
    clerkId: formData.get('clerkId'),
    mode: formData.get('mode'),
  })
  if (!parsed.success) return

  const result = await setAccountVerification(userId, parsed.data.clerkId, parsed.data.mode === 'verify')
  if (result.ok) revalidateAdmin(parsed.data.clerkId)
}

export async function changeRoleForm(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const parsed = roleChangeSchema.safeParse({
    clerkId: formData.get('clerkId'),
    role: formData.get('role'),
  })
  if (!parsed.success) return

  const result = await changeClientRole(userId, parsed.data.clerkId, parsed.data.role)
  if (result.ok) revalidateAdmin(parsed.data.clerkId)
}

export async function addNoteForm(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const parsed = clientNoteSchema.safeParse({
    clientId: formData.get('clientId'),
    body: formData.get('body'),
  })
  if (!parsed.success) return

  const result = await addClientNote(userId, parsed.data.clientId, parsed.data.body)
  if (result.ok) revalidateAdmin(parsed.data.clientId)
}

export async function markMeetingSeenAdmin(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const requestId = formData.get('requestId')
  if (typeof requestId !== 'string' || !requestId) return

  const result = await markRequestSeen(requestId, { clerkId: userId, role: 'founder' })
  if (result.ok) revalidatePath('/admin/meetings')
}
