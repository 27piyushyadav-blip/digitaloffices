# Frontend-Backend Connection Guide

## 🚀 Current Status

**Backend**: ✅ Ready and configured with CORS
**Frontend**: ❌ Not present in workspace

## 📋 What You Have Now

### Backend API (Port 3000)
- Expert registration/login endpoints
- Admin management endpoints  
- Public expert listings
- JWT authentication
- CORS enabled for frontend connections

### API Documentation
- Swagger UI: `http://localhost:3000/api/docs`
- All endpoints documented with request/response schemas

## 🔗 Next Steps for Frontend Connection

### 1. Create Frontend Application
You need a frontend app (React, Vue, Angular, etc.) that can:

```typescript
// Example API client configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Expert endpoints
POST /experts/register
POST /experts/login  
GET /experts/public
GET /experts/profile
PUT /experts/profile

// Admin endpoints
POST /admin/login
GET /admin/experts/pending
POST /admin/experts/approve
POST /admin/experts/reject
```

### 2. Frontend Directory Structure
```
digitaloffices/
├── apps/
│   ├── api/           # ✅ Backend (ready)
│   └── web/           # ❌ Frontend (needed)
└── packages/
    └── contracts/       # ✅ Shared types
```

### 3. Example Frontend Setup

**React Example:**
```bash
# Create React app
npx create-react-app apps/web
cd apps/web

# Install dependencies
npm install axios
```

**API Client Example:**
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expert registration
export const registerExpert = async (data: ExpertRegisterRequest) => {
  const response = await apiClient.post('/experts/register', data);
  return response.data;
};

// Expert login
export const loginExpert = async (credentials: ExpertLoginRequest) => {
  const response = await apiClient.post('/experts/login', credentials);
  return response.data;
};
```

### 4. Frontend Components

**Expert Registration Form:**
```typescript
// src/components/ExpertRegistration.tsx
import { useState } from 'react';
import { registerExpert } from '../services/api';

export const ExpertRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    specialization: '',
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerExpert(formData);
      alert('Registration successful! Please wait for admin approval.');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Register as Expert</button>
    </form>
  );
};
```

## 🧪 Testing the Connection

### 1. Start Backend
```bash
cd apps/api
npm run start:dev
# Backend runs on http://localhost:3000/api
```

### 2. Start Frontend
```bash
cd apps/web  
npm start
# Frontend runs on http://localhost:3001
```

### 3. Test Connection
- Open `http://localhost:3001` (frontend)
- Try registering an expert
- Check browser network tab for API calls
- Verify CORS is working

## 🔧 Troubleshooting

### CORS Issues
If you get CORS errors:
1. Check `main.ts` CORS configuration
2. Ensure frontend URL is in allowed origins
3. Verify both are running (different ports)

### Connection Issues
1. Backend running? Check `http://localhost:3000/api/docs`
2. Frontend running? Check `http://localhost:3001`
3. Network tab shows failed requests?

### Authentication Issues
1. Check JWT token storage
2. Verify Authorization header format
3. Check token expiration

## 📚 API Endpoints Reference

### Expert Endpoints
```
POST   /api/experts/register     # Register new expert
POST   /api/experts/login        # Expert login
GET    /api/experts/profile       # Get expert profile (auth)
PUT    /api/experts/profile       # Update expert profile (auth)
GET    /api/experts/public/:username # Get public expert info
GET    /api/experts/public       # List all public experts
```

### Admin Endpoints
```
POST   /api/admin/login           # Admin login
GET    /api/admin/experts/pending # Get pending experts
POST   /api/admin/experts/approve # Approve expert
POST   /api/admin/experts/reject  # Reject expert
POST   /api/admin/users/block     # Block user
POST   /api/admin/users/unblock   # Unblock user
GET    /api/admin/dashboard       # Admin dashboard
```

## 🎯 Ready to Connect

Your backend is now ready for frontend connection! The CORS is configured and all endpoints are documented. Just create your frontend app and start building the UI.
