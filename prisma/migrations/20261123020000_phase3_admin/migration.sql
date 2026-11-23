-- Phase 3 — admin dashboard: owner-only client notes and append-only audit log.

CREATE TABLE "client_notes" (
    "id" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "authorClerkId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "client_notes_clientId_createdAt_idx" ON "client_notes"("clientId", "createdAt");

ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "client_notes" ENABLE ROW LEVEL SECURITY;

-- Audit records are append-only even for bugs or compromised application code.
CREATE OR REPLACE FUNCTION prevent_audit_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "audit_logs_no_mutation" ON "audit_logs";
CREATE TRIGGER "audit_logs_no_mutation"
  BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();
