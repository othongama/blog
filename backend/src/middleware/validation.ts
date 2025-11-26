import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Wrapper para validação com Zod
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Dados de entrada inválidos',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Schemas de validação
export const schemas = {
  // Auth schemas
  login: z.object({
    body: z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    }),
  }),

  register: z.object({
    body: z.object({
      name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    }),
  }),

  // Article schemas
  createArticle: z.object({
    body: z.object({
      title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(500),
      content: z.string().min(50, 'Conteúdo deve ter no mínimo 50 caracteres'),
      summary: z.string().optional(),
      featured_image: z.string().url().optional(),
      meta_title: z.string().max(60).optional(),
      meta_description: z.string().max(160).optional(),
      category_id: z.number().int().positive().optional(),
      tags: z.array(z.number().int().positive()).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      published_at: z.string().datetime().optional(),
    }),
  }),

  updateArticle: z.object({
    body: z.object({
      title: z.string().min(5).max(500).optional(),
      content: z.string().min(50).optional(),
      summary: z.string().optional(),
      featured_image: z.string().url().optional().nullable(),
      meta_title: z.string().max(60).optional().nullable(),
      meta_description: z.string().max(160).optional().nullable(),
      category_id: z.number().int().positive().optional().nullable(),
      tags: z.array(z.number().int().positive()).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      published_at: z.string().datetime().optional().nullable(),
    }),
  }),

  // Category schemas
  createCategory: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      description: z.string().optional(),
    }),
  }),

  updateCategory: z.object({
    body: z.object({
      name: z.string().min(2).max(100).optional(),
      description: z.string().optional().nullable(),
    }),
  }),

  // Tag schemas
  createTag: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
    }),
  }),

  // Newsletter schema
  subscribeNewsletter: z.object({
    body: z.object({
      email: z.string().email('Email inválido'),
    }),
  }),

  // Pagination schema
  pagination: z.object({
    query: z.object({
      page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
      limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
      search: z.string().optional(),
      category: z.string().optional(),
      tag: z.string().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
    }),
  }),
};
