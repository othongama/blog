import express from 'express';
import * as uploadController from '../controllers/uploadController';
import { auth } from '../middleware/auth';
import { createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Todas as rotas de upload requerem autenticação
router.post('/image', auth, createLimiter, uploadController.upload.single('image'), uploadController.uploadImage);
router.delete('/image/:filename', auth, uploadController.deleteImage);

export default router;
