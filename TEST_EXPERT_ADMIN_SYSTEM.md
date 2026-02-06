# Testing Expert & Admin System

This guide provides step-by-step testing instructions for the Expert & Admin verification system.

## Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and DATABASE_URL is configured
2. **Run Migration**: `npx prisma migrate dev --name add-expert-admin-features`
3. **Start API**: `npm run start:dev`

## Testing Scenarios

### 1. Expert Registration Flow

**Step 1: Register Expert**
```bash
curl -X POST http://localhost:3000/experts/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "expert@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "specialization": "Software Development",
    "experience": "5 years",
    "qualifications": "[\"BSc Computer Science\", \"AWS Certified\"]",
    "bio": "Experienced software developer specializing in web applications.",
    "website": "https://johndoe.dev",
    "linkedin": "https://linkedin.com/in/johndoe",
    "portfolio": "https://johndoe.dev/portfolio"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "username": "john-doe-expert",
  "message": "Verification email sent. Your expert profile is pending admin approval."
}
```

**Step 2: Try Public Access (Should Fail)**
```bash
curl -X GET http://localhost:3000/experts/public/john-doe-expert
```

**Expected Response:** 404 - Expert not found or not publicly available

### 2. Admin Management Flow

**Step 1: Create Admin User (Direct DB Insert)**
```sql
INSERT INTO users (id, username, email, passwordHash, firstName, lastName, emailVerified, role, isBlocked, isUnlisted, createdAt, updatedAt)
VALUES (
  'admin-id',
  'admin',
  'admin@test.com',
  '$2b$10$hashedpassword...',
  'Admin',
  'User',
  true,
  'ADMIN',
  false,
  false,
  NOW(),
  NOW()
);
```

**Step 2: Admin Login**
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

**Step 3: Get Pending Experts**
```bash
curl -X GET http://localhost:3000/admin/experts/pending \
  -H "Authorization: Bearer {admin-token}"
```

**Step 4: Approve Expert**
```bash
curl -X POST http://localhost:3000/admin/experts/approve \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{"expertId": "expert-profile-id"}'
```

**Step 5: Verify Public Access (Should Work)**
```bash
curl -X GET http://localhost:3000/experts/public/john-doe-expert
```

### 3. Expert Profile Update Flow

**Step 1: Expert Login**
```bash
curl -X POST http://localhost:3000/experts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "expert@test.com",
    "password": "password123"
  }'
```

**Step 2: Update Profile**
```bash
curl -X PUT http://localhost:3000/experts/profile \
  -H "Authorization: Bearer {expert-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Senior Software Development",
    "experience": "7 years",
    "bio": "Updated bio with more experience."
  }'
```

**Step 3: Check Pending Changes (Admin)**
```bash
curl -X GET http://localhost:3000/admin/experts/{expert-id}/changes \
  -H "Authorization: Bearer {admin-token}"
```

**Step 4: Approve Changes**
```bash
curl -X POST http://localhost:3000/admin/experts/approve-changes \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{"expertId": "expert-user-id"}'
```

### 4. User Management Tests

**Block User:**
```bash
curl -X POST http://localhost:3000/admin/users/block \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "reason": "Violation of terms"
  }'
```

**Unblock User:**
```bash
curl -X POST http://localhost:3000/admin/users/unblock \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id"}'
```

**Unlist User:**
```bash
curl -X POST http://localhost:3000/admin/users/unlist \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "reason": "Requested privacy"
  }'
```

### 5. Error Handling Tests

**Invalid Expert Access:**
```bash
curl -X GET http://localhost:3000/experts/profile \
  -H "Authorization: Bearer invalid-token"
```
**Expected:** 401 Unauthorized

**Admin Access Required:**
```bash
curl -X GET http://localhost:3000/admin/experts/pending \
  -H "Authorization: Bearer expert-token"
```
**Expected:** 401 Unauthorized

**Expert Not Found:**
```bash
curl -X GET http://localhost:3000/experts/public/nonexistent-expert
```
**Expected:** 404 Not Found

## Database Verification

After running tests, verify database state:

```sql
-- Check user roles
SELECT username, email, role, isBlocked, isUnlisted FROM users;

-- Check expert profiles
SELECT u.username, ep.verificationStatus, ep.rejectionReasons 
FROM users u 
JOIN expert_profiles ep ON u.id = ep.userId;

-- Check pending experts
SELECT u.username, u.email, ep.createdAt 
FROM users u 
JOIN expert_profiles ep ON u.id = ep.userId 
WHERE ep.verificationStatus = 'PENDING';
```

## Expected Behaviors

### Public Visibility Rules
✅ Only VERIFIED experts appear in public listings
✅ Blocked experts never appear publicly
✅ Unlisted experts don't appear in listings
✅ Rejection reasons are never shown publicly
✅ Pending changes are not visible publicly

### Security Rules
✅ Admin endpoints require ADMIN role
✅ Expert endpoints require EXPERT role
✅ Blocked users cannot access protected endpoints
✅ All inputs validated against schemas

### Workflow Rules
✅ Expert registration creates PENDING profile
✅ Profile updates by verified experts create PENDING changes
✅ Admin approval makes changes live
✅ Admin rejection maintains old verified data
✅ Rejected experts can update and retry verification

## Troubleshooting

### Common Issues

**Migration Errors:**
- Ensure DATABASE_URL is set in .env
- Check PostgreSQL connection
- Run `npx prisma generate` after migration

**TypeScript Errors:**
- Run `npx prisma generate` to update types
- Restart TypeScript server in IDE

**Authentication Issues:**
- Verify JWT secrets in .env
- Check token expiration
- Ensure user roles are correct in database

**Permission Issues:**
- Verify user role in database
- Check if user is blocked/unlisted
- Ensure guards are properly applied

### Debug Commands

```bash
# Check Prisma client generation
npx prisma generate

# Reset database (development only)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Seed test data
npx prisma db seed
```

## Success Indicators

✅ All API endpoints return expected responses
✅ Database schema matches design
✅ TypeScript compilation succeeds
✅ Expert verification workflow works end-to-end
✅ Admin controls function properly
✅ Public display rules enforced correctly
