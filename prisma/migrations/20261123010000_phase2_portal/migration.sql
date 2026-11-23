-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('discovery', 'design', 'development', 'review', 'launched', 'on_hold');

-- CreateEnum
CREATE TYPE "MeetingRequestStatus" AS ENUM ('pending', 'seen', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('team_message', 'project_update', 'meeting_request_update', 'account_event');

-- CreateEnum
CREATE TYPE "MessageSenderRole" AS ENUM ('client', 'team_member');

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'discovery',
    "startDate" TIMESTAMP(3),
    "expectedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "clerkId" TEXT NOT NULL,
    "roleLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_updates" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "authorClerkId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "attachmentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderClerkId" TEXT,
    "senderRole" "MessageSenderRole" NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_requests" (
    "id" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" UUID,
    "message" TEXT NOT NULL,
    "status" "MeetingRequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "meeting_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "recipientClerkId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkUrl" TEXT,
    "dedupeKey" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_clientId_idx" ON "projects"("clientId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "project_members_clerkId_idx" ON "project_members"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_clerkId_key" ON "project_members"("projectId", "clerkId");

-- CreateIndex
CREATE INDEX "project_updates_projectId_createdAt_idx" ON "project_updates"("projectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_projectId_key" ON "conversations"("projectId");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "meeting_requests_clientId_status_idx" ON "meeting_requests"("clientId", "status");

-- CreateIndex
CREATE INDEX "meeting_requests_status_createdAt_idx" ON "meeting_requests"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_dedupeKey_key" ON "notifications"("dedupeKey");

-- CreateIndex
CREATE INDEX "notifications_recipientClerkId_readAt_idx" ON "notifications"("recipientClerkId", "readAt");

-- CreateIndex
CREATE INDEX "notifications_recipientClerkId_createdAt_idx" ON "notifications"("recipientClerkId", "createdAt");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_requests" ADD CONSTRAINT "meeting_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_requests" ADD CONSTRAINT "meeting_requests_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientClerkId_fkey" FOREIGN KEY ("recipientClerkId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Hand-authored: Phase 2 integrity and Realtime access ─────────────────────

-- Exactly one pending meeting request per client, enforced by the database.
CREATE UNIQUE INDEX "meeting_requests_one_pending_per_client"
  ON "meeting_requests" ("clientId") WHERE "status" = 'pending';

-- Row Level Security on all portal tables. The application uses Prisma with
-- the database owner role, so these policies do not gate server access; they
-- exist so Supabase Realtime can authorize subscribers whose JWT is issued by
-- Clerk (auth.jwt() ->> 'sub' is the Clerk user id). Deny by default.
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_updates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meeting_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;

-- Realtime subscribers may read messages only for projects they belong to.
CREATE POLICY "messages_realtime_select" ON "messages" FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM "conversations" c
    JOIN "projects" p ON p."id" = c."projectId"
    WHERE c."id" = "messages"."conversationId"
      AND (
        p."clientId" = (auth.jwt() ->> 'sub')
        OR EXISTS (
          SELECT 1
          FROM "project_members" m
          WHERE m."projectId" = p."id"
            AND m."clerkId" = (auth.jwt() ->> 'sub')
        )
      )
  )
);

-- Realtime subscribers may read only their own notifications.
CREATE POLICY "notifications_realtime_select" ON "notifications" FOR SELECT USING (
  "recipientClerkId" = (auth.jwt() ->> 'sub')
);

-- Add the realtime-facing tables to the Supabase publication (no-op when the
-- publication or table membership already exists, e.g. self-hosted Postgres).
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE "messages";
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE "notifications";
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
END $$;


-- Per-side read tracking for chat unread indicators.
ALTER TABLE "conversations" ADD COLUMN "clientLastReadAt" TIMESTAMP(3);
ALTER TABLE "conversations" ADD COLUMN "teamLastReadAt" TIMESTAMP(3);

-- AI assistant replies live in the same conversation as human messages.
ALTER TYPE "MessageSenderRole" ADD VALUE 'assistant';
