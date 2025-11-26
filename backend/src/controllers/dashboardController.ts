import { Request, Response } from 'express';
import pool from '../config/database';
import type { DashboardStats, ApiResponse } from '../types';

// Obter estatísticas do dashboard
export const getStats = async (req: Request, res: Response) => {
  try {
    // Total de artigos
    const totalArticles = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE deleted_at IS NULL'
    );

    // Total de visualizações
    const totalViews = await pool.query(
      'SELECT SUM(views) as total FROM posts WHERE deleted_at IS NULL'
    );

    // Total de categorias
    const totalCategories = await pool.query(
      'SELECT COUNT(*) as count FROM categories'
    );

    // Total de inscritos
    const totalSubscribers = await pool.query(
      'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = true'
    );

    // Artigos recentes
    const recentArticles = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              u.name as author_name, u.email as author_email
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.deleted_at IS NULL
       ORDER BY p.created_at DESC
       LIMIT 5`
    );

    // Artigos mais populares
    const popularArticles = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              u.name as author_name, u.email as author_email
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.status = 'published' AND p.deleted_at IS NULL
       ORDER BY p.views DESC
       LIMIT 5`
    );

    // Visualizações por dia (últimos 30 dias)
    const viewsByDay = await pool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count
       FROM article_views
       WHERE viewed_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(viewed_at)
       ORDER BY date ASC`
    );

    const stats: DashboardStats = {
      total_articles: parseInt(totalArticles.rows[0].count),
      total_views: parseInt(totalViews.rows[0].total || '0'),
      total_categories: parseInt(totalCategories.rows[0].count),
      total_subscribers: parseInt(totalSubscribers.rows[0].count),
      recent_articles: recentArticles.rows,
      popular_articles: popularArticles.rows,
      views_by_day: viewsByDay.rows.map(row => ({
        date: row.date,
        count: parseInt(row.count),
      })),
    };

    res.json({
      success: true,
      data: stats,
    } as ApiResponse<DashboardStats>);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
    } as ApiResponse);
  }
};

// Obter estatísticas por período
export const getStatsByPeriod = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    let interval = '7 days';

    switch (period) {
      case 'week':
        interval = '7 days';
        break;
      case 'month':
        interval = '30 days';
        break;
      case 'year':
        interval = '365 days';
        break;
      default:
        interval = '30 days';
    }

    const stats = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM posts WHERE created_at >= CURRENT_DATE - INTERVAL '${interval}' AND deleted_at IS NULL) as new_articles,
         (SELECT COUNT(*) FROM article_views WHERE viewed_at >= CURRENT_DATE - INTERVAL '${interval}') as period_views,
         (SELECT COUNT(*) FROM newsletter_subscribers WHERE subscribed_at >= CURRENT_DATE - INTERVAL '${interval}') as new_subscribers`
    );

    res.json({
      success: true,
      data: stats.rows[0],
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching period stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
    } as ApiResponse);
  }
};
