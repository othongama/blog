import express from 'express';
import * as tagController from '../controllers/tagController';
import { auth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Rotas públicas
router.get('/', tagController.getAllTags);
router.get('/:slug/posts', tagController.getPostsByTag);

// Rotas protegidas (admin)
router.post('/', auth, createLimiter, validate(schemas.createTag), tagController.createTag);
router.delete('/:id', auth, tagController.deleteTag);

export default router;
