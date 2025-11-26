import { Request } from 'express';

// User Types
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  role: 'admin' | 'author' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// Article/Post Types
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  author_id?: number;
  category_id?: number;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  comments_count: number;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ArticleWithRelations extends Article {
  author?: UserWithoutPassword;
  category?: Category;
  tags?: Tag[];
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: Date;
  updated_at: Date;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: Date;
  unsubscribed_at?: Date;
}

// Article View Types
export interface ArticleView {
  id: number;
  article_id: number;
  ip_address?: string;
  user_agent?: string;
  viewed_at: Date;
}

// Request with Auth
export interface AuthRequest extends Request {
  user?: UserWithoutPassword;
}

// API Response Types
export interface ApiResponse<T = any> {
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

// Dashboard Stats
export interface DashboardStats {
  total_articles: number;
  total_views: number;
  total_categories: number;
  total_subscribers: number;
  recent_articles: ArticleWithRelations[];
  popular_articles: ArticleWithRelations[];
  views_by_day?: Array<{
    date: string;
    count: number;
  }>;
}

// Database Query Result
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}
