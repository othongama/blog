# 🚀 MonetizePro Blog - Full Stack Blog otimizado para SEO e Google AdSense

Um blog completo e profissional construído com **Next.js 14**, **Node.js/Express** com **TypeScript** e **PostgreSQL**, otimizado para monetização com Google AdSense e SEO avançado.

## ✨ Características Principais

### Frontend (Next.js 14 + TypeScript)
- ✅ **Next.js 14 com App Router** para SSR/SSG otimizado
- ✅ **TypeScript** para type safety completo
- ✅ **Tailwind CSS** para estilização responsiva
- ✅ **SEO Avançado**:
  - Meta tags dinâmicas por artigo
  - JSON-LD structured data (Article, Organization, BreadcrumbList)
  - Open Graph e Twitter Cards
  - Sitemap.xml dinâmico
  - Robots.txt configurado
  - Canonical URLs
- ✅ **Google AdSense** pronto para monetização:
  - Componentes de anúncio otimizados
  - Lazy loading de scripts
  - Posicionamento estratégico (header, sidebar, in-article, footer)
- ✅ **Performance Otimizada**:
  - Code splitting automático
  - Lazy loading de imagens com next/image
  - Compressão de assets
  - Core Web Vitals otimizados
- ✅ **Funcionalidades**:
  - Modo claro/escuro
  - Newsletter signup
  - Busca avançada
  - Compartilhamento social
  - Artigos relacionados
  - Breadcrumbs para navegação

### Backend (Node.js/Express + TypeScript)
- ✅ **TypeScript** completo com tipos robustos
- ✅ **API RESTful** com Express.js
- ✅ **Autenticação JWT**
- ✅ **CRUD completo** de artigos, categorias e tags
- ✅ **Upload de imagens** com compressão automática (Sharp)
- ✅ **Tracking de visualizações** detalhado
- ✅ **Sistema de tags** completo
- ✅ **Newsletter** com gerenciamento de inscritos
- ✅ **Busca avançada** com full-text search (PostgreSQL)
- ✅ **Dashboard administrativo** com métricas e gráficos
- ✅ **Segurança**:
  - Rate limiting (express-rate-limit)
  - Validação com Zod
  - Helmet.js para headers seguros
  - CORS configurado
  - Proteção contra SQL injection

### Banco de Dados (PostgreSQL)
- ✅ Schema otimizado com índices
- ✅ Tabelas: users, posts, categories, tags, post_tags, newsletter_subscribers, article_views
- ✅ Full-text search em português
- ✅ Soft deletes
- ✅ Timestamps automáticos

## 📋 Pré-requisitos

- Node.js >= 18.17.0
- PostgreSQL >= 12
- npm >= 9.0.0

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd blog
```

### 2. Configure o PostgreSQL

Crie um novo banco de dados:

```sql
CREATE DATABASE monetizepro_blog;
```

### 3. Configure as variáveis de ambiente

#### Backend (.env)
Crie `backend/.env`:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=monetizepro_blog
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=seu_secret_jwt_super_seguro_aqui

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000

# Admin padrão
ADMIN_EMAIL=admin@monetizepro.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Carlos Silva
```

#### Frontend (.env.local)
Crie `frontend/.env.local`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Site
NEXT_PUBLIC_SITE_NAME=MonetizePro Blog
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=Blog otimizado para monetização com Google AdSense

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ENABLED=false

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=
```

### 4. Instale as dependências

```bash
npm install
```

Isso instalará todas as dependências do monorepo (frontend + backend).

### 5. Configure o banco de dados

```bash
npm run db:setup --workspace=backend
```

Este comando criará todas as tabelas e inserirá dados iniciais.

## 🚀 Executando o Projeto

### Desenvolvimento

Execute **tudo** com um único comando:

```bash
npm run dev
```

Isso iniciará:
- ✅ Backend em `http://localhost:5000`
- ✅ Frontend em `http://localhost:3000`

### Comandos individuais

```bash
# Apenas backend
npm run dev --workspace=backend

# Apenas frontend
npm run dev --workspace=frontend
```

### Produção

```bash
# Build de tudo
npm run build

# Executar em produção
npm start
```

## 👤 Acesso ao Sistema

### Painel Administrativo

Acesse: `http://localhost:3000/admin`

**Credenciais padrão:**
- Email: `admin@monetizepro.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere as credenciais padrão em produção!

## 📁 Estrutura do Projeto

```
blog/
├── frontend/                    # Next.js 14 Frontend
│   ├── app/                     # App Router
│   │   ├── blog/[slug]/        # Página de artigo
│   │   ├── categoria/[slug]/   # Página de categoria
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Home page
│   │   ├── sitemap.ts          # Sitemap dinâmico
│   │   └── robots.ts           # Robots.txt
│   ├── components/             # Componentes reutilizáveis
│   │   ├── AdSense/            # Componentes de anúncios
│   │   ├── Article/            # Componentes de artigos
│   │   ├── Layout/             # Header, Footer
│   │   ├── Newsletter/         # Newsletter form
│   │   └── SEO/                # Componentes SEO
│   ├── lib/                    # Bibliotecas
│   │   ├── api.ts              # Cliente API
│   │   ├── seo.ts              # Funções SEO
│   │   └── utils.ts            # Utilitários
│   ├── providers/              # Providers (Theme, Toast)
│   └── types/                  # TypeScript types
│
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── controllers/        # Controllers
│   │   │   ├── authController.ts
│   │   │   ├── postController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── tagController.ts
│   │   │   ├── newsletterController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── uploadController.ts
│   │   │   └── searchController.ts
│   │   ├── middleware/         # Middleware
│   │   │   ├── auth.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validation.ts
│   │   ├── routes/             # Rotas da API
│   │   ├── types/              # TypeScript types
│   │   └── server.ts           # Servidor principal
│   └── tsconfig.json
│
└── database/
    └── schema.sql              # Schema do banco
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário autenticado

### Artigos
- `GET /api/posts` - Listar artigos (com paginação)
- `GET /api/posts/:slug` - Obter artigo por slug
- `POST /api/posts` - Criar artigo (auth)
- `PUT /api/posts/:id` - Atualizar artigo (auth)
- `DELETE /api/posts/:id` - Deletar artigo (admin)
- `POST /api/posts/:slug/view` - Registrar visualização

### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:slug` - Obter categoria
- `POST /api/categories` - Criar categoria (admin)
- `PUT /api/categories/:id` - Atualizar categoria (admin)
- `DELETE /api/categories/:id` - Deletar categoria (admin)

### Tags
- `GET /api/tags` - Listar tags
- `GET /api/tags/:slug/posts` - Artigos por tag
- `POST /api/tags` - Criar tag (admin)
- `DELETE /api/tags/:id` - Deletar tag (admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Inscrever
- `POST /api/newsletter/unsubscribe` - Cancelar inscrição
- `GET /api/newsletter/subscribers` - Listar inscritos (admin)

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais (admin)
- `GET /api/dashboard/stats/period` - Estatísticas por período (admin)

### Upload
- `POST /api/upload/image` - Upload de imagem (auth)
- `DELETE /api/upload/image/:filename` - Deletar imagem (admin)

### Busca
- `GET /api/search` - Buscar artigos
- `GET /api/search/suggestions` - Sugestões de busca

## 🎨 Configurando o Google AdSense

1. Obtenha seu ID de cliente no [Google AdSense](https://www.google.com/adsense/)
2. Atualize `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_ENABLED=true
   ```
3. Crie slots de anúncio no AdSense e atualize os componentes em `frontend/components/AdSense/`

## 📊 Métricas de Performance

O projeto está otimizado para alcançar:
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1
- SEO Score: 100

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Rate limiting em todas as rotas
- Validação de dados com Zod
- Headers de segurança com Helmet
- Proteção contra SQL injection
- CORS configurado
- Soft deletes para dados sensíveis

## 🚀 Deploy

### Railway / Heroku / Vercel

O projeto está pronto para deploy em plataformas modernas:

1. **Backend**: Deploy em Railway, Heroku ou Render
2. **Frontend**: Deploy em Vercel ou Netlify
3. **Database**: PostgreSQL gerenciado (Railway, Supabase, etc.)

Veja `DEPLOY_RAILWAY.md` para instruções detalhadas.

## 📝 Scripts Disponíveis

### Root (monorepo)
- `npm install` - Instala todas as dependências
- `npm run dev` - Inicia backend e frontend
- `npm run build` - Build de produção
- `npm start` - Inicia em produção
- `npm run clean` - Limpa node_modules e builds
- `npm run db:setup` - Configura banco de dados

### Backend
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Compila TypeScript
- `npm run start` - Produção (requer build)
- `npm run typecheck` - Verifica tipos

### Frontend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linter

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 🎯 Próximos Passos

- [ ] Implementar comentários em artigos
- [ ] Sistema de múltiplos autores
- [ ] Exportação de posts (markdown/PDF)
- [ ] PWA support
- [ ] API para mobile app
- [ ] Integração com mais plataformas de anúncios
- [ ] A/B testing para anúncios
- [ ] Analytics avançado

## 👨‍💻 Desenvolvido com

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [Zod](https://zod.dev/)

---

**MonetizePro Blog** - Maximize seu potencial de monetização com SEO otimizado 🚀
