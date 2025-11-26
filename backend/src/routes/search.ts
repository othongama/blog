import express from 'express';
import * as searchController from '../controllers/searchController';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

// Rotas públicas de busca
router.get('/', validate(schemas.pagination), searchController.searchArticles);
router.get('/suggestions', searchController.searchSuggestions);

export default router;
