import { Request, Response } from 'express';
import pool from '../config/database';
import type { ApiResponse, PaginatedResponse } from '../types';

// Busca avançada de artigos
export const searchArticles = async (req: Request, res: Response) => {
  try {
    const {
      q, // query de busca
      category,
      tag,
      status = 'published',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT DISTINCT p.*, c.name as category_name, c.slug as category_slug,
             u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Filtro por status
    if (status) {
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Busca full-text
    if (q) {
      query += ` AND (
        to_tsvector('portuguese', p.title || ' ' || p.content) @@ plainto_tsquery('portuguese', $${paramCount})
        OR p.title ILIKE $${paramCount + 1}
        OR p.content ILIKE $${paramCount + 1}
      )`;
      params.push(q, `%${q}%`);
      paramCount += 2;
    }

    // Filtro por categoria
    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Filtro por tag
    if (tag) {
      query += ` AND t.slug = $${paramCount}`;
      params.push(tag);
      paramCount++;
    }

    // Contagem total
    const countQuery = `SELECT COUNT(DISTINCT p.id) FROM (${query}) p`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Adicionar ordenação e paginação
    query += ` ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limitNum, offset);

    // Executar busca
    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    } as PaginatedResponse<any>);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar artigos',
    } as ApiResponse);
  }
};

// Sugestões de busca (autocomplete)
export const searchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || (q as string).length < 2) {
      return res.json({
        success: true,
        data: [],
      } as ApiResponse<string[]>);
    }

    const result = await pool.query(
      `SELECT DISTINCT title
       FROM posts
       WHERE title ILIKE $1
         AND status = 'published'
         AND deleted_at IS NULL
       LIMIT 5`,
      [`%${q}%`]
    );

    const suggestions = result.rows.map(row => row.title);

    res.json({
      success: true,
      data: suggestions,
    } as ApiResponse<string[]>);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar sugestões',
    } as ApiResponse);
  }
};
