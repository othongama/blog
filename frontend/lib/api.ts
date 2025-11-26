import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  Article,
  Category,
  Tag,
  User,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  NewsletterSubscriber
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Articles API
export const articlesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Article>> => {
    const { data } = await api.get<PaginatedResponse<Article>>('/posts', { params });
    return data;
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const { data } = await api.get<ApiResponse<Article>>(`/posts/${slug}`);
    return data.data!;
  },

  create: async (article: Partial<Article>): Promise<Article> => {
    const { data } = await api.post<ApiResponse<Article>>('/posts', article);
    return data.data!;
  },

  update: async (id: number, article: Partial<Article>): Promise<Article> => {
    const { data } = await api.put<ApiResponse<Article>>(`/posts/${id}`, article);
    return data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  incrementViews: async (slug: string): Promise<void> => {
    await api.post(`/posts/${slug}/view`);
  },

  getRelated: async (slug: string, limit: number = 3): Promise<Article[]> => {
    const { data } = await api.get<ApiResponse<Article[]>>(`/posts/${slug}/related`, {
      params: { limit }
    });
    return data.data!;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data!;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data!;
  },

  create: async (category: Partial<Category>): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>('/categories', category);
    return data.data!;
  },

  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, category);
    return data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Tags API
export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await api.get<ApiResponse<Tag[]>>('/tags');
    return data.data!;
  },

  create: async (tag: Partial<Tag>): Promise<Tag> => {
    const { data } = await api.post<ApiResponse<Tag>>('/tags', tag);
    return data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};

// Newsletter API
export const newsletterApi = {
  subscribe: async (email: string): Promise<void> => {
    await api.post('/newsletter/subscribe', { email });
  },

  getSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    const { data } = await api.get<ApiResponse<NewsletterSubscriber[]>>('/newsletter/subscribers');
    return data.data!;
  },

  unsubscribe: async (email: string): Promise<void> => {
    await api.post('/newsletter/unsubscribe', { email });
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data!;
  },
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post<ApiResponse<{ url: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data!.url;
  },
};

export default api;
