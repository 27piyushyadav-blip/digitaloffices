# Quick Start Guide

Get the authentication API running in 5 minutes.

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL database (local or remote)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Database

1. Create a PostgreSQL database (or use an existing one)

2. Copy environment template:
```bash
cp .env.example .env
```

3. Edit `.env` and set your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/digitaloffices?schema=public"
```

## Step 3: Generate Prisma Client & Run Migrations

```bash
pnpm prisma:generate
pnpm prisma:migrate dev
```

This will:
- Generate Prisma Client
- Create database tables
- Set up the schema

## Step 4: Configure Environment Variables

Edit `.env` and set required values:

```env
# Generate secrets (see below)
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Optional: Google OAuth (can skip for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:3001"
```

### Generate JWT Secrets

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Run twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## Step 5: Start the Server

```bash
pnpm start:dev
```

You should see:
```
🚀 API is running on: http://localhost:3000/api
📚 API Documentation: http://localhost:3000/api/docs
```

## Step 6: Test the API

### Option 1: Swagger UI (Recommended)

Open http://localhost:3000/api/docs in your browser and test endpoints directly.

### Option 2: HTTP File

Use `api.http` file with REST Client extension in VS Code:
1. Open `apps/api/api.http`
2. Click "Send Request" above any endpoint
3. Update variables (`@accessToken`, `@refreshToken`) as needed

### Option 3: cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Common Issues

### Database Connection Error

- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### Prisma Client Not Found

```bash
pnpm prisma:generate
```

### Port Already in Use

Change `PORT` in `.env` or stop the process using port 3000.

### Migration Errors

```bash
# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Or create fresh migration
pnpm prisma migrate dev --name init
```

## Next Steps

1. **Implement Email Service**: Add email sending for verification emails
2. **Set Up Frontend**: Create Next.js app and import contracts
3. **Add More Features**: Password reset, 2FA, etc.

## Resources

- [Full API Documentation](./README.md)
- [Contracts Package](../../packages/contracts/README.md)
- [Swagger UI](http://localhost:3000/api/docs)
