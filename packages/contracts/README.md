# @digitaloffices/contracts

Shared Zod contracts for API type safety across frontend and backend.

## Usage

### Import Contracts

```typescript
import { auth } from '@digitaloffices/contracts';

// Use schemas for validation
const validated = auth.RegisterRequestSchema.parse(data);

// Use inferred types
type RegisterRequest = auth.RegisterRequest;
type AuthSession = auth.AuthSession;
```

### In NestJS (Backend)

```typescript
import { createZodDto } from 'nestjs-zod';
import { auth } from '@digitaloffices/contracts';

// Create DTO from schema
class RegisterDto extends createZodDto(auth.RegisterRequestSchema) {}

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<auth.RegisterResponse> {
    // dto is validated and typed
  }
}
```

### In Next.js (Frontend)

```typescript
import { auth } from '@digitaloffices/contracts';

// Type API responses
async function login(data: auth.LoginCredentialsRequest): Promise<auth.LoginCredentialsResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return auth.LoginCredentialsResponseSchema.parse(await response.json());
}
```

## Available Contracts

### Authentication (`auth.*`)

#### Request Schemas
- `auth.RegisterRequestSchema` - User registration
- `auth.LoginCredentialsRequestSchema` - Email/password login
- `auth.GoogleOAuthRequestSchema` - Google OAuth ID token
- `auth.VerifyEmailRequestSchema` - Email verification token
- `auth.RefreshTokenRequestSchema` - Token refresh

#### Response Schemas
- `auth.RegisterResponseSchema` - Registration success (no tokens)
- `auth.LoginCredentialsResponseSchema` - Login session (user + tokens)
- `auth.GoogleOAuthResponseSchema` - OAuth session (user + tokens)
- `auth.VerifyEmailResponseSchema` - Verification session (user + tokens)
- `auth.RefreshTokenResponseSchema` - Refreshed session (user + tokens)
- `auth.RequestEmailVerificationResponseSchema` - Verification email sent

#### Core Types
- `auth.AuthUser` - User object
- `auth.AuthTokens` - JWT tokens with expiration
- `auth.AuthSession` - User + tokens (full session)
- `auth.AuthError` - Error response format
- `auth.AuthErrorCode` - Error code enum

## Type Inference

All types are inferred from Zod schemas:

```typescript
// ✅ Correct - inferred from schema
type User = auth.AuthUser;

// ❌ Wrong - don't create manual types
type User = { id: string; email: string; ... };
```

## Adding New Contracts

1. Create Zod schema in `src/[domain]/[domain].contracts.ts`
2. Export schema and inferred type
3. Export from `src/[domain]/index.ts`
4. Export from `src/index.ts`

Example:

```typescript
// src/posts/posts.contracts.ts
import { z } from 'zod';

export const CreatePostRequestSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
```

```typescript
// src/posts/index.ts
export * from './posts.contracts';
```

```typescript
// src/index.ts
export * as posts from './posts';
```

## Validation

Contracts use Zod for runtime validation:

```typescript
// Parse and validate
try {
  const data = auth.RegisterRequestSchema.parse(input);
} catch (error) {
  // Handle validation errors
}

// Safe parse (returns result object)
const result = auth.RegisterRequestSchema.safeParse(input);
if (result.success) {
  const data = result.data;
} else {
  const errors = result.error;
}
```

## Best Practices

1. **No Business Logic**: Contracts are pure schemas, no functions
2. **Explicit Naming**: Use clear, descriptive names
3. **Consistent Structure**: Follow existing patterns
4. **Documentation**: Add JSDoc comments for complex schemas
5. **Versioning**: Breaking changes require new schema versions

## Error Handling

All error responses follow the `AuthError` contract:

```typescript
{
  code: 'INVALID_CREDENTIALS',
  message: 'Invalid email or password',
  details?: Record<string, unknown>
}
```

Use error codes from `auth.AuthErrorCode` enum for consistency.
