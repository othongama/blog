// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'user';
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Article/Post Types
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: number;
  author?: User;
  category_id?: number;
  category?: Category;
  tags?: Tag[];
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  category_id?: number;
  tags?: number[];
  status?: 'draft' | 'published';
  published_at?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  article_count?: number;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

// View Types
export interface ArticleView {
  id: number;
  article_id: number;
  viewed_at: string;
  ip_address?: string;
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    type: 'website' | 'article';
    url: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  twitter?: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    images: string[];
  };
  jsonLd?: Record<string, any>;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_articles: number;
  total_views: number;
  total_categories: number;
  total_subscribers: number;
  recent_articles: Article[];
  popular_articles: Article[];
  views_by_day?: {
    date: string;
    count: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search Types
export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'popular';
}
