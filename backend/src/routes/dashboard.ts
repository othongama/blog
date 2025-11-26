import express from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Todas as rotas de dashboard requerem autenticação
router.get('/stats', auth, dashboardController.getStats);
router.get('/stats/period', auth, dashboardController.getStatsByPeriod);

export default router;
