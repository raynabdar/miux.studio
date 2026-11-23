import { getDb } from '@/lib/db/client'
import type { Prisma } from '@/generated/prisma/client'

export type AuditEntry = {
  actorClerkId?: string | null
  actorRole: string
  action: string
  targetType: string
  targetId?: string | null
  metadata?: Record<string, unknown>
  ipHash?: string | null
}

// Append-only audit trail. Callers must never update or delete audit rows.
export async function audit(entry: AuditEntry): Promise<void> {
  await getDb().auditLog.create({
    data: {
      actorClerkId: entry.actorClerkId ?? null,
      actorRole: entry.actorRole,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId ?? null,
      metadata: (entry.metadata ?? {}) as Prisma.InputJsonValue,
      ipHash: entry.ipHash ?? null,
    },
  })
}

// For non-critical trails (e.g. access-attempt logging) where a failed write
// must not break the request.
export async function auditSafe(entry: AuditEntry): Promise<void> {
  try {
    await audit(entry)
  } catch (error) {
    console.error('[audit] failed to write entry', entry.action, (error as Error).message)
  }
}
