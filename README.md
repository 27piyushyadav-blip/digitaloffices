# Digital Offices - Monorepo

Contract-driven monorepo with NestJS backend and Next.js frontend.

## Architecture

- **Backend**: NestJS + PostgreSQL (Prisma) + Fastify
- **Frontend**: Next.js + TypeScript (to be implemented)
- **Contracts**: Shared Zod schemas in `packages/contracts`
- **Package Manager**: pnpm workspaces

## Core Principles

1. **Contracts First**: All APIs defined as Zod contracts before implementation
2. **Type Safety**: TypeScript types inferred from Zod schemas only
3. **Monorepo Discipline**: Decoupled packages, shared contracts
4. **No Duplication**: Single source of truth for types

<!-- ## Getting Started -->

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL (local or remote)

### Installation

```bash
# Install all dependencies
pnpm install
```

### Backend Setup

See [apps/api/README.md](./apps/api/README.md) for detailed backend setup.

Quick start:

```bash
# Navigate to API
cd apps/api

# Copy environment template
cp .env.example .env

# Edit .env with your database URL and secrets
# Then generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate dev

# Start dev server
pnpm start:dev
```

### Frontend Setup

Frontend will be implemented here (Next.js app).

## Workspace Structure

```
.
├── apps/
│   └── api/              # NestJS backend
│       ├── src/
│       ├── prisma/
│       └── README.md
├── packages/
│   └── contracts/        # Shared Zod contracts
│       └── src/
│           └── auth/      # Authentication contracts
└── package.json          # Root workspace config
```

## Contracts Package

The `@digitaloffices/contracts` package contains all API contracts as Zod schemas.

**Usage:**

```typescript
import { auth } from '@digitaloffices/contracts';

// Use schemas for validation
const result = auth.RegisterRequestSchema.parse(data);

// Use inferred types
type RegisterRequest = auth.RegisterRequest;
```

**Available Contracts:**

- `auth.*` - Authentication contracts (register, login, OAuth, email verification)

## Development

### Root Commands

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

### Adding New Contracts

1. Create Zod schemas in `packages/contracts/src/`
2. Export from `packages/contracts/src/index.ts`
3. Use in backend controllers/services
4. Use in frontend API clients

### Adding New API Endpoints

1. **Define contract** in `packages/contracts/src/`
2. **Create controller route** using `createZodDto` from contract
3. **Implement service** using contract types
4. **Frontend imports** same contract for API calls

## Environment Variables

Each app has its own `.env` file:

- `apps/api/.env` - Backend configuration
- `apps/web/.env` - Frontend configuration (when created)

See `apps/api/.env.example` for backend environment variables.

## Database

PostgreSQL database managed with Prisma:

```bash
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Create migration
pnpm prisma:migrate dev

# Open Prisma Studio
pnpm prisma:studio
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/email/verify` - Verify email
- `POST /api/auth/email/request-verification` - Request verification email
- `POST /api/auth/refresh` - Refresh access token

**Interactive API Documentation:**
- Swagger UI: http://localhost:3000/api/docs (when API is running)
- Test endpoints directly from your browser!

See [apps/api/README.md](./apps/api/README.md) for detailed API documentation.

## Testing

```bash
# Run all tests
pnpm test

# Run tests in specific app
cd apps/api && pnpm test
```

## Building

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/api && pnpm build
```

## Contributing

1. **Contracts First**: Always define contracts before implementation
2. **Type Safety**: Use inferred types from Zod, never manual types
3. **No `any`**: Strict TypeScript, no `any` types
4. **Consistent Naming**: Follow existing patterns
5. **Documentation**: Update READMEs when adding features

## License

[Add your license here]
