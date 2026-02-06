# Expert & Admin Verification System

This document describes the implemented Expert & Admin verification and display rules system for the Digital Offices platform.

## Overview

The system provides role-based authentication with three user roles:
- **USER**: Regular users
- **EXPERT**: Experts who must be verified by admins
- **ADMIN**: Administrators who manage users and expert verification

## Database Schema Changes

### New Fields Added to Users Table
- `role` (UserRole enum): USER | EXPERT | ADMIN
- `isBlocked` (Boolean): Controls user access
- `isUnlisted` (Boolean): Controls public visibility

### New Expert Profiles Table
- `verificationStatus` (VerificationStatus enum): PENDING | VERIFIED | REJECTED
- `rejectionReasons` (String[]): Reasons for rejection
- `verifiedAt` (DateTime): When expert was verified
- `verifiedBy` (String): Admin ID who verified
- `pendingChanges` (JSON): Stores changes awaiting approval
- Profile fields: specialization, experience, qualifications, bio, website, linkedin, portfolio

## API Endpoints

### Expert Authentication

#### Register Expert
```
POST /experts/register
```
Creates expert account with PENDING verification status.

**Request:**
```json
{
  "email": "expert@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "specialization": "Software Development",
  "experience": "5 years",
  "qualifications": "[\"BSc Computer Science\", \"AWS Certified\"]",
  "bio": "Experienced software developer...",
  "website": "https://johndoe.dev",
  "linkedin": "https://linkedin.com/in/johndoe",
  "portfolio": "https://johndoe.dev/portfolio"
}
```

**Response:**
```json
{
  "success": true,
  "username": "john-doe-expert",
  "message": "Verification email sent. Your expert profile is pending admin approval."
}
```

#### Expert Login
```
POST /experts/login
```
Validates expert credentials and role.

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "username": "john-doe-expert",
    "email": "expert@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true,
    "role": "EXPERT",
    "isBlocked": false,
    "isUnlisted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "accessTokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 604800,
    "tokenType": "Bearer"
  }
}
```

#### Get Expert Profile
```
GET /experts/profile
Authorization: Bearer {token}
```
Returns expert's own profile with verification status.

#### Update Expert Profile
```
PUT /experts/profile
Authorization: Bearer {token}
```
Updates profile. Changes require admin re-verification if expert was previously verified.

#### Get Public Expert
```
GET /experts/public/{username}
```
Returns public expert info. Only available for VERIFIED experts.

#### List Public Experts
```
GET /experts/public
```
Returns all VERIFIED, unblocked, and listed experts.

### Admin Authentication

#### Admin Login
```
POST /admin/login
```
Validates admin credentials and role.

### Admin User Management

#### Block User
```
POST /admin/users/block
Authorization: Bearer {admin-token}
```
Blocks a user from accessing the platform.

#### Unblock User
```
POST /admin/users/unblock
Authorization: Bearer {admin-token}
```
Unblocks a previously blocked user.

#### Unlist User
```
POST /admin/users/unlist
Authorization: Bearer {admin-token}
```
Removes user from public listings.

#### List User
```
POST /admin/users/list
Authorization: Bearer {admin-token}
```
Adds user back to public listings.

### Admin Expert Management

#### Get Pending Experts
```
GET /admin/experts/pending
Authorization: Bearer {admin-token}
```
Returns all experts awaiting approval.

#### Approve Expert
```
POST /admin/experts/approve
Authorization: Bearer {admin-token}
```
Approves an expert, making them publicly visible.

#### Reject Expert
```
POST /admin/experts/reject
Authorization: Bearer {admin-token}
```
Rejects an expert with provided reasons.

#### Get Expert Changes
```
GET /admin/experts/{expertId}/changes
Authorization: Bearer {admin-token}
```
Returns pending changes for an expert profile.

#### Approve Expert Changes
```
POST /admin/experts/approve-changes
Authorization: Bearer {admin-token}
```
Approves pending changes to expert profile.

#### Reject Expert Changes
```
POST /admin/experts/reject-changes
Authorization: Bearer {admin-token}
```
Rejects pending changes to expert profile.

#### Admin Dashboard
```
GET /admin/dashboard
Authorization: Bearer {admin-token}
```
Returns dashboard statistics and recent activity.

## Verification Workflow

### Expert Registration Flow
1. Expert registers with profile information
2. User account created with EXPERT role
3. Expert profile created with PENDING status
4. Email verification sent
5. Expert appears in admin pending queue
6. Admin reviews and approves/rejects
7. If approved: Expert becomes publicly visible
8. If rejected: Expert receives rejection reasons

### Expert Profile Update Flow
1. Expert updates profile information
2. If expert was VERIFIED:
   - Changes stored in `pendingChanges` field
   - Expert maintains VERIFIED status with old data
   - Admin notified of pending changes
3. If expert was PENDING/REJECTED:
   - Profile updated directly
   - Status reset to PENDING
   - Admin reviews updated profile
4. Admin approves/rejects changes
5. If approved: New data becomes live, status = VERIFIED
6. If rejected: Rejection reasons stored, status = VERIFIED (maintains old data)

## Public Display Rules

### Who is publicly visible?
- Only VERIFIED experts
- Who are NOT blocked
- Who are NOT unlisted

### What information is shown?
- Basic user info: id, username, firstName, lastName
- Expert profile: specialization, experience, qualifications, bio, website, linkedin, portfolio
- Verification timestamp (when they were verified)

### What is NOT shown publicly?
- Email address
- Verification status (implied by visibility)
- Rejection reasons
- Pending changes
- Admin notes
- Block/unlist status

## Error Handling

### Expert Error Codes
- `EXPERT_NOT_FOUND`: Expert account not found
- `EXPERT_NOT_VERIFIED`: Expert not verified (for protected actions)
- `EXPERT_BLOCKED`: Expert account is blocked
- `EXPERT_UNLISTED`: Expert is unlisted
- `PROFILE_UPDATE_PENDING`: Profile changes pending approval
- `INVALID_EXPERT_DATA`: Invalid expert profile data

### Admin Error Codes
- `ADMIN_ACCESS_REQUIRED`: Admin access required
- `USER_NOT_FOUND`: User not found
- `EXPERT_NOT_FOUND`: Expert not found
- `EXPERT_ALREADY_VERIFIED`: Expert already verified
- `EXPERT_NOT_PENDING`: Expert not in pending status
- `INVALID_ADMIN_ACTION`: Invalid admin action
- `INSUFFICIENT_PERMISSIONS`: Insufficient permissions

## Security Considerations

1. **Role Validation**: All admin endpoints require ADMIN role
2. **Expert Guards**: Expert endpoints require EXPERT role and non-blocked status
3. **JWT Authentication**: All protected endpoints require valid JWT
4. **Input Validation**: All inputs validated against Zod schemas
5. **SQL Injection Prevention**: Prisma ORM provides protection
6. **Authorization Checks**: Users can only access their own data

## Database Migration

To apply the schema changes:

1. Set up your `.env` file with `DATABASE_URL`
2. Run migration: `npx prisma migrate dev --name add-expert-admin-features`
3. Generate Prisma client: `npx prisma generate`

## Testing

### Expert Registration
```bash
curl -X POST http://localhost:3000/experts/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "expert@test.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Expert",
    "specialization": "Testing"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

### Get Pending Experts (Admin)
```bash
curl -X GET http://localhost:3000/admin/experts/pending \
  -H "Authorization: Bearer {admin-token}"
```

## Future Enhancements

1. **Activity Logging**: Track all admin actions for audit trail
2. **Email Notifications**: Notify experts of status changes
3. **Bulk Operations**: Allow bulk approval/rejection of experts
4. **Expert Categories**: Add categorization system
5. **Rating System**: Add user ratings for verified experts
6. **Search & Filtering**: Advanced search for public experts
7. **Webhooks**: Notify external systems of verification changes
