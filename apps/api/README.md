# API - Authentication Service

NestJS backend API with contract-driven authentication system.

## Architecture

- **Contracts First**: All API contracts defined in `@digitaloffices/contracts` using Zod
- **Type Safety**: TypeScript types inferred from Zod schemas
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with Passport.js strategies
- **Validation**: Automatic Zod validation via `nestjs-zod`

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database and update `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/digitaloffices?schema=public"
```

Generate Prisma Client:

```bash
pnpm prisma:generate
```

Run migrations:

```bash
pnpm prisma:migrate dev
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/digitaloffices?schema=public"

# JWT Secrets (generate strong random strings)
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
JWT_ACCESS_EXPIRES_IN=3600        # seconds (1 hour)
JWT_REFRESH_EXPIRES_IN=604800     # seconds (7 days)

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Application
PORT=3000
NODE_ENV=development

# Frontend URL (for email verification links)
FRONTEND_URL="http://localhost:3001"
```

### 4. Generate JWT Secrets

Generate secure random secrets:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Development

Start development server:

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/api`

**API Documentation (Swagger):** `http://localhost:3000/api/docs`

Interactive API documentation with Swagger UI - test endpoints directly from your browser!

## API Documentation

Interactive Swagger documentation is available at:
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

You can test all endpoints directly from the Swagger UI interface.

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "rememberMe": true  // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": false,
    "createdAt": "2026-01-30T...",
    "updatedAt": "2026-01-30T..."
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessTokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 604800,
    "tokenType": "Bearer"
  }
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google-id-token-from-frontend"
}
```

**Response:** Same as Login (AuthSession)

#### Verify Email
```http
POST /api/auth/email/verify
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Response:** Same as Login (AuthSession - auto-login)

#### Request Email Verification
```http
POST /api/auth/email/request-verification
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-string"
}
```

**Response:** Same as Login (AuthSession with new tokens)

## Error Responses

All errors follow the contract format:

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "details": {}  // optional
}
```

**Error Codes:**
- `INVALID_CREDENTIALS`
- `EMAIL_ALREADY_IN_USE`
- `EMAIL_NOT_VERIFIED`
- `INVALID_OR_EXPIRED_TOKEN`
- `OAUTH_ERROR`
- `UNAUTHENTICATED`
- `UNAUTHORIZED`
- `UNKNOWN`

## Database Schema

### User
- `id`: UUID (primary key)
- `email`: String (unique)
- `passwordHash`: String? (null for OAuth users)
- `firstName`: String
- `lastName`: String
- `emailVerified`: Boolean
- `emailVerifiedAt`: DateTime?
- `provider`: String ('credentials' | 'google')
- `providerId`: String? (Google user ID)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EmailVerificationToken
- `id`: UUID
- `userId`: UUID (foreign key)
- `token`: String (unique)
- `expiresAt`: DateTime
- `usedAt`: DateTime?
- `createdAt`: DateTime

### RefreshToken
- `id`: UUID
- `userId`: UUID (foreign key)
- `token`: String (unique)
- `expiresAt`: DateTime
- `revokedAt`: DateTime?
- `createdAt`: DateTime

## Prisma Commands

```bash
# Generate Prisma Client
pnpm prisma:generate

# Create and run migration
pnpm prisma:migrate dev

# Open Prisma Studio (database GUI)
pnpm prisma:studio

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Production

Build:

```bash
pnpm build
```

Start:

```bash
pnpm start:prod
```

## Next Steps

1. **Email Service**: Implement email sending for verification emails
   - Update `AuthService.createEmailVerificationToken()` method
   - Consider using SendGrid, Resend, or AWS SES

2. **Rate Limiting**: Add rate limiting for auth endpoints
   - Use `@nestjs/throttler`

3. **Password Reset**: Add password reset flow
   - Create contracts in `@digitaloffices/contracts`
   - Implement in AuthService

4. **2FA**: Add two-factor authentication (optional)
   - TOTP-based 2FA
   - SMS or email codes

5. **Session Management**: Add session revocation endpoint
   - Allow users to see active sessions
   - Revoke specific refresh tokens

## Contract-Driven Development

All API contracts are defined in `packages/contracts`. When adding new endpoints:

1. Define Zod schemas in `packages/contracts/src/`
2. Export types from contracts
3. Use contracts in controller (via `createZodDto`)
4. Use contracts in service for type safety
5. Frontend imports same contracts for API calls

This ensures type safety and consistency across frontend and backend.
