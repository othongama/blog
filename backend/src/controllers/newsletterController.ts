import { Request, Response } from 'express';
import pool from '../config/database';
import type { NewsletterSubscriber, ApiResponse } from '../types';

// Inscrever na newsletter
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Verificar se já está inscrito
    const existing = await pool.query<NewsletterSubscriber>(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      const subscriber = existing.rows[0];

      // Se estava inativo, reativar
      if (!subscriber.is_active) {
        await pool.query(
          'UPDATE newsletter_subscribers SET is_active = true, unsubscribed_at = NULL WHERE email = $1',
          [email]
        );

        return res.json({
          success: true,
          message: 'Inscrição reativada com sucesso',
        } as ApiResponse);
      }

      return res.status(400).json({
        success: false,
        error: 'Email já está inscrito',
      } as ApiResponse);
    }

    // Criar nova inscrição
    await pool.query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1)',
      [email]
    );

    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso',
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email já está inscrito',
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao processar inscrição',
    } as ApiResponse);
  }
};

// Cancelar inscrição
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      `UPDATE newsletter_subscribers
       SET is_active = false, unsubscribed_at = CURRENT_TIMESTAMP
       WHERE email = $1 AND is_active = true
       RETURNING id`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Email não encontrado ou já cancelado',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Inscrição cancelada com sucesso',
    } as ApiResponse);
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar inscrição',
    } as ApiResponse);
  }
};

// Listar inscritos (admin only)
export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<NewsletterSubscriber>(
      `SELECT id, email, is_active, subscribed_at, unsubscribed_at
       FROM newsletter_subscribers
       ORDER BY subscribed_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<NewsletterSubscriber[]>);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar inscritos',
    } as ApiResponse);
  }
};
