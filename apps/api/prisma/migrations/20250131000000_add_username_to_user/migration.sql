-- Add username column: backend-generated, unique, human-readable (for URLs e.g. /profile/{username}).
-- Handles existing rows by backfilling with a unique value derived from id.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" TEXT;

-- Backfill existing rows with a unique placeholder (user_<uuid-without-dashes>)
UPDATE "users" SET "username" = 'user_' || REPLACE("id"::text, '-', '')
WHERE "username" IS NULL;

-- Enforce NOT NULL and UNIQUE
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
