# Fetch API Integration Examples

## 🚀 Using the Fetch-based API Client

The API client now uses native `fetch` instead of axios. Here's how to integrate it in your frontend apps.

## 📦 Installation

No additional dependencies needed! Uses built-in `fetch`.

## 🔧 Setup in Frontend

### 1. Import the API Client
```typescript
// In your frontend components or services
import { apiClient } from '@digitaloffices/shared/api-client';
```

### 2. Environment Variable
Create `.env.local` in your frontend apps:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🎯 Usage Examples

### Expert Registration
```typescript
// ExpertRegistrationForm.tsx
import { useState } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const ExpertRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    specialization: '',
    experience: '',
    qualifications: '',
    bio: '',
    website: '',
    linkedin: '',
    portfolio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await apiClient.registerExpert(formData);
      console.log('Registration successful:', result);
      alert('Registration successful! Please wait for admin approval.');
      
      // Redirect to login or dashboard
      window.location.href = '/expert/login';
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Specialization"
        value={formData.specialization}
        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
        required
      />
      <textarea
        placeholder="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({...formData, bio: e.target.value})}
      />
      <button type="submit">Register as Expert</button>
    </form>
  );
};
```

### Expert Login
```typescript
// ExpertLoginForm.tsx
import { useState } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const ExpertLoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await apiClient.loginExpert(credentials);
      console.log('Login successful:', result);
      alert('Login successful!');
      
      // Redirect to expert dashboard
      window.location.href = '/expert/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      <button type="submit">Login as Expert</button>
    </form>
  );
};
```

### Expert Profile Management
```typescript
// ExpertProfile.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const ExpertProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiClient.getExpertProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdate = async (updatedData: any) => {
    try {
      const result = await apiClient.updateExpertProfile(updatedData);
      console.log('Profile updated:', result);
      alert('Profile updated successfully!');
      
      // Reload profile
      window.location.reload();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h2>Expert Profile</h2>
      <p><strong>Status:</strong> {profile.expertProfile.verificationStatus}</p>
      <p><strong>Specialization:</strong> {profile.expertProfile.specialization}</p>
      <p><strong>Experience:</strong> {profile.expertProfile.experience}</p>
      <p><strong>Bio:</strong> {profile.expertProfile.bio}</p>
      
      {profile.expertProfile.verificationStatus === 'PENDING' && (
        <div style={{color: 'orange'}}>
          ⚠️ Your profile is pending admin approval
        </div>
      )}
      
      {profile.expertProfile.verificationStatus === 'VERIFIED' && (
        <div style={{color: 'green'}}>
          ✅ Your profile is verified and publicly visible
        </div>
      )}
      
      <button onClick={() => handleUpdate(profile.expertProfile)}>
        Update Profile
      </button>
    </div>
  );
};
```

### Admin Login
```typescript
// AdminLoginForm.tsx
import { useState } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const AdminLoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await apiClient.loginAdmin(credentials);
      console.log('Admin login successful:', result);
      alert('Admin login successful!');
      
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Admin Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      <button type="submit">Login as Admin</button>
    </form>
  );
};
```

### Admin Dashboard
```typescript
// AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [pendingExperts, setPendingExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardData, pendingData] = await Promise.all([
          apiClient.getDashboard(),
          apiClient.getPendingExperts()
        ]);
        
        setDashboard(dashboardData);
        setPendingExperts(pendingData.experts || []);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (expertId: string) => {
    try {
      await apiClient.approveExpert({ expertId });
      alert('Expert approved successfully!');
      
      // Reload pending experts
      window.location.reload();
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed: ' + error.message);
    }
  };

  const handleReject = async (expertId: string, rejectionReasons: string[]) => {
    try {
      await apiClient.rejectExpert({ expertId, rejectionReasons });
      alert('Expert rejected successfully!');
      
      // Reload pending experts
      window.location.reload();
    } catch (error) {
      console.error('Rejection failed:', error);
      alert('Rejection failed: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {dashboard && (
        <div>
          <h2>Statistics</h2>
          <p>Total Users: {dashboard.stats.totalUsers}</p>
          <p>Total Experts: {dashboard.stats.totalExperts}</p>
          <p>Verified Experts: {dashboard.stats.verifiedExperts}</p>
          <p>Pending Experts: {dashboard.stats.pendingExperts}</p>
          <p>Blocked Users: {dashboard.stats.blockedUsers}</p>
        </div>
      )}
      
      <div>
        <h2>Pending Experts ({pendingExperts.length})</h2>
        {pendingExperts.map((expert: any) => (
          <div key={expert.expertProfile.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
            <h3>{expert.user.firstName} {expert.user.lastName}</h3>
            <p><strong>Email:</strong> {expert.user.email}</p>
            <p><strong>Specialization:</strong> {expert.expertProfile.specialization}</p>
            <p><strong>Status:</strong> {expert.expertProfile.verificationStatus}</p>
            
            <div style={{marginTop: '10px'}}>
              <button 
                onClick={() => handleApprove(expert.expertProfile.id)}
                style={{backgroundColor: 'green', color: 'white', marginRight: '10px'}}
              >
                Approve
              </button>
              <button 
                onClick={() => handleReject(expert.expertProfile.id, ['Insufficient qualifications'])}
                style={{backgroundColor: 'red', color: 'white'}}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🔧 Authentication Check

### Protected Route Example
```typescript
// ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '@digitaloffices/shared/api-client';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(apiClient.isAuthenticated());
  }, []);

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  return <>{children}</>;
};

// Usage
<ProtectedRoute>
  <ExpertProfile />
</ProtectedRoute>
```

## 🎯 Benefits of Fetch vs Axios

### ✅ **Fetch Advantages**
- Built into all modern browsers
- No additional dependencies
- Smaller bundle size
- Better tree-shaking
- Native performance

### ✅ **Our Implementation**
- Automatic JWT token management
- Error handling with 401 redirect
- Type-safe requests
- Consistent API across all frontends

## 🚀 Ready to Use

Your frontend apps are now ready to connect to the backend using the fetch-based API client! Just import and start building your UI components.
