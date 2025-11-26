import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';

// Importar rotas
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';
import newsletterRoutes from './routes/newsletter';
import dashboardRoutes from './routes/dashboard';
import uploadRoutes from './routes/upload';
import searchRoutes from './routes/search';

// Importar middleware
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middlewares de segurança e performance
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(morgan('combined'));

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting geral
app.use('/api', apiLimiter);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

// Rota de health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'MonetizePro Blog API',
    version: '2.0.0',
    documentation: '/api/health',
  });
});

// Middleware de erro 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
  });
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📝 Environment: ${process.env.NODE_ENV || 'development'}
  🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  `);
});

export default app;
