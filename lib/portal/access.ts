import { getDb } from '@/lib/db/client'
import { isFounder } from '@/lib/auth/session'

// Every project access goes through these helpers so ownership checks cannot
// drift between pages and actions. Return `null` instead of throwing so callers
// can render `notFound()` without leaking whether a project exists.

export async function loadClientProject(clerkId: string, projectId: string) {
  return getDb().project.findFirst({
    where: { id: projectId, clientId: clerkId },
    include: {
      client: { select: { fullName: true, email: true, company: true } },
      members: { orderBy: { createdAt: 'asc' } },
    },
  })
}

export async function loadTeamProject(clerkId: string, projectId: string) {
  const founder = isFounder(clerkId)
  return getDb().project.findFirst({
    where: founder ? { id: projectId } : { id: projectId, members: { some: { clerkId } } },
    include: {
      client: { select: { fullName: true, email: true, company: true } },
      members: { orderBy: { createdAt: 'asc' } },
    },
  })
}
