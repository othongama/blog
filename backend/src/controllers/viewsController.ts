import { Request, Response } from 'express';
import pool from '../config/database';
import type { ApiResponse } from '../types';

// Registrar visualização de artigo
export const trackView = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');

    // Buscar o artigo
    const articleResult = await pool.query(
      'SELECT id FROM posts WHERE slug = $1 AND status = $2 AND deleted_at IS NULL',
      [slug, 'published']
    );

    if (articleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artigo não encontrado',
      } as ApiResponse);
    }

    const article_id = articleResult.rows[0].id;

    // Registrar visualização detalhada
    await pool.query(
      `INSERT INTO article_views (article_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [article_id, ip_address, user_agent]
    );

    // Incrementar contador de views do artigo
    await pool.query(
      'UPDATE posts SET views = views + 1 WHERE id = $1',
      [article_id]
    );

    res.json({
      success: true,
      message: 'Visualização registrada',
    } as ApiResponse);
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar visualização',
    } as ApiResponse);
  }
};

// Obter estatísticas de visualizações
export const getViewStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    // Views por dia
    const viewsByDay = await pool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count
       FROM article_views
       WHERE article_id = $1
         AND viewed_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(viewed_at)
       ORDER BY date DESC`,
      [id]
    );

    // Total de views
    const totalViews = await pool.query(
      'SELECT views FROM posts WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        total_views: totalViews.rows[0]?.views || 0,
        views_by_day: viewsByDay.rows,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching view stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
    } as ApiResponse);
  }
};
