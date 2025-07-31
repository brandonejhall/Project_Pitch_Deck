// API client for connecting frontend to backend
const API_BASE_URL = 'http://localhost:3001';

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    userId: number;
    email: string;
    name: string;
  };
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    userId: number;
    email: string;
    name: string;
  };
}

export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  slides: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlideUpdateRequest {
  title?: string;
  content?: string;
  type?: string;
}

export interface ChatRequest {
  prompt: string;
  slide_id: number;
  slideData?: {
    id: string;
    title: string;
    content: string;
    heroImageUrl?: string;
    layout?: string;
  };
}

export interface ChatResponse {
  edit: string;
  context: string;
  slideUpdates?: {
    title?: string;
    content?: string;
    heroImageUrl?: string;
    layout?: string;
  };
}

export interface Slide {
  id: number;
  title: string;
  content: string;
  type: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

// API client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Try to get token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

      // Add authorization header if token exists
  // Commented out for testing - no auth required
  // if (this.token) {
  //   headers['Authorization'] = `Bearer ${this.token}`;
  // }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    this.token = response.access_token;
    localStorage.setItem('auth_token', response.access_token);
    
    return response;
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    return this.request<VerifyTokenResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Always return true for testing since auth is disabled
    return true;
    // return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Generate methods
  async generateSlides(prompt: string): Promise<GenerateResponse> {
    console.log('Frontend: Sending generate request with prompt:', prompt);
    const requestBody = { prompt };
    console.log('Frontend: Request body:', JSON.stringify(requestBody));
    
    return this.request<GenerateResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // Project methods
  async createProject(projectData: ProjectCreateRequest): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProject(projectId: number): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`);
  }

  // Slide methods
  async updateSlide(slideId: number, updateData: SlideUpdateRequest): Promise<Slide> {
    return this.request<Slide>(`/slides/${slideId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  // Chat methods
  async chatRequest(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return { status: response.ok ? 'ok' : 'error' };
    } catch (error) {
      return { status: 'error' };
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient }; 