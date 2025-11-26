import { Request, Response } from 'express';
import pool from '../config/database';
import slugify from 'slugify';
import type { Tag, ApiResponse } from '../types';

// Listar todas as tags
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Tag>(
      'SELECT * FROM tags ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<Tag[]>);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tags',
    } as ApiResponse);
  }
};

// Criar nova tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const result = await pool.query<Tag>(
      'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Tag criada com sucesso',
    } as ApiResponse<Tag>);
  } catch (error: any) {
    console.error('Error creating tag:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Tag já existe',
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao criar tag',
    } as ApiResponse);
  }
};

// Deletar tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tags WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tag não encontrada',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Tag deletada com sucesso',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar tag',
    } as ApiResponse);
  }
};

// Buscar posts por tag
export const getPostsByTag = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       INNER JOIN post_tags pt ON p.id = pt.post_id
       INNER JOIN tags t ON pt.tag_id = t.id
       WHERE t.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL
       ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [slug, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM posts p
       INNER JOIN post_tags pt ON p.id = pt.post_id
       INNER JOIN tags t ON pt.tag_id = t.id
       WHERE t.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL`,
      [slug]
    );

    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar posts',
    } as ApiResponse);
  }
};
