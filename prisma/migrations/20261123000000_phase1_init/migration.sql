-- Phase 1 initial schema.
-- Base DDL generated with `prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`,
-- then hardened by hand: case-insensitive email uniqueness, one-open-submission
-- constraint, settings singleton guard, and deny-by-default RLS.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client', 'team_member');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending_verification', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "MeetingPreference" AS ENUM ('yes', 'no');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('submitted', 'meeting_acknowledged', 'account_created', 'contacted', 'closed');

-- CreateEnum
CREATE TYPE "BookingState" AS ENUM ('none', 'acknowledged', 'confirmed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "company" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "status" "AccountStatus" NOT NULL DEFAULT 'pending_verification',
    "emailVerifiedAt" TIMESTAMP(3),
    "ownerVerifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_submissions" (
    "id" UUID NOT NULL,
    "referenceId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "meetingPreference" "MeetingPreference" NOT NULL,
    "meetingAcknowledgedAt" TIMESTAMP(3),
    "bookingState" "BookingState" NOT NULL DEFAULT 'none',
    "bookingExternalId" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'submitted',
    "clerkUserId" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "earlySignUpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    CONSTRAINT "application_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "actorClerkId" TEXT,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_isDemo_idx" ON "users"("isDemo");
CREATE UNIQUE INDEX "onboarding_submissions_referenceId_key" ON "onboarding_submissions"("referenceId");
CREATE INDEX "onboarding_submissions_email_idx" ON "onboarding_submissions"("email");
CREATE INDEX "onboarding_submissions_status_idx" ON "onboarding_submissions"("status");
CREATE INDEX "onboarding_submissions_meetingPreference_idx" ON "onboarding_submissions"("meetingPreference");
CREATE INDEX "onboarding_submissions_createdAt_idx" ON "onboarding_submissions"("createdAt");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
CREATE INDEX "audit_logs_actorClerkId_createdAt_idx" ON "audit_logs"("actorClerkId", "createdAt");
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "onboarding_submissions" ADD CONSTRAINT "onboarding_submissions_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "users"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- Hand-authored hardening ---------------------------------------------------

-- Case-insensitive uniqueness on user email.
CREATE UNIQUE INDEX "users_email_lower_key" ON "users"(lower("email"));

-- At most one open submission per email address (race-proof duplicate guard).
CREATE UNIQUE INDEX "onboarding_submissions_open_email_key"
  ON "onboarding_submissions"(lower("email"))
  WHERE "status" IN ('submitted', 'meeting_acknowledged');

-- Singleton settings row.
ALTER TABLE "application_settings"
  ADD CONSTRAINT "application_settings_singleton" CHECK ("id" = 1);

INSERT INTO "application_settings" ("id", "earlySignUpEnabled", "updatedAt")
VALUES (1, false, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Deny-by-default RLS for anon/authenticated roles. No policies are added,
-- so only the service role (server-side Prisma) can touch these tables.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "application_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
