// ApiClient is a shared HTTP wrapper that handles JWT tokens, 401 redirects, and normalized error responses.

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private tokenKey = 'auth_token';

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
  }

  private buildHeaders(skipAuth?: boolean): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { skipAuth, ...fetchConfig } = config;
    
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(skipAuth);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: {
          ...headers,
          ...fetchConfig.headers,
        },
      });

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        throw this.createError('Unauthorized. Please login again.', 401);
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw this.createError(
          data?.message || data?.error || 'Request failed',
          response.status,
          data?.errors
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error && !(error as any).status) {
        throw this.createError('Network error. Please check your connection.', 0);
      }
      throw error;
    }
  }

  private createError(message: string, status: number, errors?: Record<string, string[]>): ApiError {
    const error = new Error(message) as Error & ApiError;
    error.status = status;
    error.errors = errors;
    return error as ApiError;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Singleton instance
// Default to deployed backend with /api prefix; allow override via NEXT_PUBLIC_API_URL for flexibility
const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'https://invoicesystembackend-1.onrender.com/api'
);

export default apiClient;
export type { ApiError };
