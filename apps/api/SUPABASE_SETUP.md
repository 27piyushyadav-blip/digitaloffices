# Supabase + Prisma Setup

You're using **Supabase** for PostgreSQL. Follow these steps to connect and create your tables.

## 1. Connection URL in `.env`

Your `DATABASE_URL` in `apps/api/.env` should use:

- **Direct connection** (recommended for Prisma migrations):  
  Supabase Dashboard → **Project Settings** → **Database** → **Connection string** → **URI**  
  Use the **Direct connection** URL, not the pooled one.

- **Important:** If your database password contains `@`, `#`, or `%`, URL-encode them in the string:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

Example:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
```

The `?schema=public` is required so Prisma uses the `public` schema (Supabase default).

## 2. Generate Prisma Client

From the **repo root**:

```bash
cd apps/api
pnpm prisma:generate
```

Or from repo root:

```bash
pnpm --filter api exec prisma generate
```

## 3. Run Migrations (create tables in Supabase)

Still in `apps/api`:

```bash
pnpm prisma:migrate dev
```

When prompted for a migration name, you can use: `init`

This will:

- Create the `migrations` folder and first migration
- Apply it to your Supabase database
- Create `users`, `email_verification_tokens`, and `refresh_tokens`

## 4. Verify in Supabase

1. Open your project in [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Table Editor**
3. You should see: `users`, `email_verification_tokens`, `refresh_tokens`

## 5. Start the API

```bash
cd apps/api
pnpm start:dev
```

API base URL: `http://localhost:3000/api`  
Docs: `http://localhost:3000/api/docs`

---

## Optional: Connection pooling (e.g. for serverless)

For serverless or high concurrency, Supabase recommends the **Session mode** pooled URL.  
Prisma 5+ supports it with `?pgbouncer=true`:

```env
# Pooled (Transaction mode) - use for serverless
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-xx-x.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

For **migrations**, keep using the **Direct** (non-pooled) URL, because Prisma Migrate doesn’t work through PgBouncer. You can use a second variable:

```env
# Direct - for migrations and Prisma Migrate
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"

# Pooled - for app at runtime (optional)
# DATABASE_POOLED_URL="postgresql://..."
```

Then in `schema.prisma` you’d use `directUrl` for migrations (see Prisma docs for Supabase).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **Connection refused** | Check Supabase project is running; use Direct URL from Database settings. |
| **Authentication failed** | Confirm password in URL is correct and special chars are URL-encoded. |
| **SSL required** | Supabase uses SSL. Prisma uses it by default; no extra config needed. |
| **Migration fails** | Use the **Direct** connection string, not the pooled one. |

If you hit a specific error, share the exact message and we can fix it.
