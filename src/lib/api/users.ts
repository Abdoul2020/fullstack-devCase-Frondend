import { User, UserApiParams, UsersResponse } from '../types/users';
import { AuthService } from './auth';

const API_BASE_URL = 'http://localhost:3000/api/v1';

interface CurrentUserResponse {
  status: string;
  data: User;
}

interface CreateUserRequest {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarUrl: string;
  isActive: boolean;
}

interface CreateUserResponse {
  status: string;
  message: string;
  data?: User;
}

export class UsersService {
  static async fetchCurrentUser(): Promise<CurrentUserResponse> {
    const token = AuthService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    try {
      console.log('🔍 Fetching current user from API...');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          //  clear the token
          AuthService.logout();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CurrentUserResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUsers(params: UserApiParams): Promise<UsersResponse> {
    const token = AuthService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // clear the token
          AuthService.logout();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const token = AuthService.getToken();
    
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    // Test authentication first by trying to get current user
    try {
      await this.fetchCurrentUser();
    } catch (authError) {
      throw new Error('Authentication failed. Please login again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });


      if (!response.ok) {
        if (response.status === 401) {
          // clear the token
          AuthService.logout();
          throw new Error('Authentication failed. Please login again.');
        }
        
        try {
          const errorData = await response.json();
          // Handle the specific validation error format
          const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data: CreateUserResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
