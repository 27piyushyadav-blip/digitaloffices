/**
 * Shared API Client for Frontend Apps
 * Works with both Client and Expert frontend applications
 */

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Token management
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuthToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Expert endpoints
  async registerExpert(data: unknown): Promise<any> {
    const response = await this.request<any>('/experts/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
    }
    return response;
  }

  async loginExpert(data: unknown): Promise<any> {
    const response = await this.request<any>('/experts/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
    }
    return response;
  }

  async getExpertProfile(): Promise<any> {
    return this.request<any>('/experts/profile', {
      method: 'GET',
    });
  }

  async updateExpertProfile(data: unknown): Promise<any> {
    const response = await this.request<any>('/experts/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getPublicExpert(username: string): Promise<any> {
    return this.request<any>(`/experts/public/${username}`, {
      method: 'GET',
    });
  }

  async listPublicExperts(): Promise<any> {
    return this.request<any>('/experts/public', {
      method: 'GET',
    });
  }

  // Admin endpoints
  async loginAdmin(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
    }
    return response;
  }

  async getPendingExperts(): Promise<any> {
    return this.request<any>('/admin/experts/pending', {
      method: 'GET',
    });
  }

  async approveExpert(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/experts/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async rejectExpert(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/experts/reject', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getExpertChanges(expertId: string): Promise<any> {
    return this.request<any>(`/admin/experts/${expertId}/changes`, {
      method: 'GET',
    });
  }

  async approveExpertChanges(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/experts/approve-changes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async rejectExpertChanges(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/experts/reject-changes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async blockUser(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/users/block', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async unblockUser(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/users/unblock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async unlistUser(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/users/unlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async listUser(data: unknown): Promise<any> {
    const response = await this.request<any>('/admin/users/list', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getDashboard(): Promise<any> {
    return this.request<any>('/admin/dashboard', {
      method: 'GET',
    });
  }

  // Utility methods
  logout(): void {
    this.clearAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
