import { LoginRequest, LoginResponse } from '../types/users';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export class AuthService {
  private static token: string | null = null;

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      
      if (data.status === 'success' && data.token) {
        this.token = data.token;
        // Store token in localStorage 
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  static logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
