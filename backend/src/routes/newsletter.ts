import express from 'express';
import * as newsletterController from '../controllers/newsletterController';
import { auth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { newsletterLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Rotas públicas
router.post('/subscribe', newsletterLimiter, validate(schemas.subscribeNewsletter), newsletterController.subscribe);
router.post('/unsubscribe', validate(schemas.subscribeNewsletter), newsletterController.unsubscribe);

// Rotas protegidas (admin)
router.get('/subscribers', auth, newsletterController.getSubscribers);

export default router;
