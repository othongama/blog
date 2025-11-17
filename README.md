# MonetizePro Blog

Um blog completo e funcional com CMS (Sistema de Gerenciamento de Conteúdo) construído com React, Node.js e PostgreSQL, gerenciado como **monorepo com Turborepo**.

## 🚀 Tecnologias

### Monorepo
- **Turborepo** - Sistema de build otimizado para monorepos
- **npm Workspaces** - Gerenciamento de dependências

### Frontend
- **React 18** - Biblioteca JavaScript para construir interfaces de usuário
- **Vite** - Build tool rápida e moderna
- **React Router** - Roteamento para aplicações React
- **TailwindCSS** - Framework CSS utilitário
- **React Quill** - Editor de texto rico
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações toast
- **Date-fns** - Biblioteca de manipulação de datas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Compartilhamento de recursos entre origens

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm (v8 ou superior)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd blog
```

### 2. Configure o banco de dados PostgreSQL

Crie um novo banco de dados:

```sql
CREATE DATABASE monetizepro_blog;
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example backend/.env
```

Edite o arquivo `backend/.env` com suas configurações:

```env
# Backend Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=monetizepro_blog
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT Secret
JWT_SECRET=seu_secret_jwt_seguro_aqui

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin User
ADMIN_EMAIL=admin@monetizepro.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Carlos Silva
```

Configure também o frontend:

```bash
cp .env.example frontend/.env
```

### 4. Instale todas as dependências (monorepo)

Com Turborepo, um único comando instala tudo:

```bash
npm install
```

Isso instalará:
- ✅ Dependências da raiz (Turborepo)
- ✅ Dependências do backend
- ✅ Dependências do frontend

### 5. Configure o banco de dados

```bash
npm run db:setup
```

Este comando irá:
- Criar todas as tabelas necessárias
- Inserir categorias padrão
- Criar o usuário administrador

## 🚀 Executando o projeto

### Desenvolvimento (Monorepo)

Execute **TUDO** com um único comando:

```bash
npm run dev
```

Isso iniciará automaticamente:
- ✅ Backend em `http://localhost:5000`
- ✅ Frontend em `http://localhost:5173`

Turborepo executará ambos em paralelo com cache otimizado! 🚀

### Comandos individuais (se necessário)

```bash
# Apenas backend
npm run dev --workspace=backend

# Apenas frontend
npm run dev --workspace=frontend
```

### Produção

**Build tudo:**

```bash
npm run build
```

**Executar em produção:**

```bash
npm start
```

### Outros comandos úteis

```bash
# Limpar node_modules e builds
npm run clean

# Configurar banco de dados
npm run db:setup
```

## 👤 Acesso ao Sistema

### Painel Administrativo

Acesse: `http://localhost:5173/login`

**Credenciais padrão:**
- Email: `admin@monetizepro.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere as credenciais padrão em produção!

## 📁 Estrutura do Projeto (Monorepo)

```
blog/                        # Raiz do monorepo
├── package.json            # Root package.json com workspaces
├── turbo.json              # Configuração do Turborepo
├── .env.example            # Exemplo de variáveis de ambiente
├── README.md               # Este arquivo
│
├── backend/                # Workspace: Backend
│   ├── src/
│   │   ├── config/         # Configurações (database)
│   │   ├── controllers/    # Controladores (auth, post, category)
│   │   ├── middleware/     # Middlewares (auth)
│   │   ├── models/         # Modelos (User, Post, Category)
│   │   ├── routes/         # Rotas da API
│   │   ├── utils/          # Utilitários (setupDatabase)
│   │   └── server.js       # Servidor principal
│   └── package.json        # Backend package.json
│
├── frontend/               # Workspace: Frontend
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── context/        # Context API (Auth)
│   │   ├── App.jsx         # Componente principal
│   │   └── main.jsx        # Ponto de entrada
│   └── package.json        # Frontend package.json
│
└── database/
    └── schema.sql          # Schema do banco de dados
```

## 🔌 API Endpoints

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `GET /api/auth/me` - Obter usuário autenticado

### Posts

- `GET /api/posts` - Listar posts
- `GET /api/posts/:slug` - Obter post por slug
- `POST /api/posts` - Criar novo post (autenticado)
- `PUT /api/posts/:id` - Atualizar post (autenticado)
- `DELETE /api/posts/:id` - Deletar post (admin)
- `POST /api/posts/:id/like` - Curtir post

### Categorias

- `GET /api/categories` - Listar categorias
- `GET /api/categories/:slug` - Obter categoria por slug
- `POST /api/categories` - Criar categoria (admin)
- `PUT /api/categories/:id` - Atualizar categoria (admin)
- `DELETE /api/categories/:id` - Deletar categoria (admin)

## ✨ Funcionalidades

### Público
- ✅ Visualizar artigos publicados
- ✅ Filtrar por categoria
- ✅ Pesquisar artigos
- ✅ Curtir artigos
- ✅ Design responsivo
- ✅ Interface moderna com TailwindCSS

### CMS (Área Administrativa)
- ✅ Dashboard com estatísticas
- ✅ Criar, editar e excluir artigos
- ✅ Editor de texto rico (WYSIWYG)
- ✅ Gerenciar categorias
- ✅ Sistema de tags
- ✅ Controle de status (rascunho/publicado)
- ✅ Autenticação JWT
- ✅ Proteção de rotas

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação baseada em JWT
- Proteção contra XSS e SQL Injection
- Helmet.js para headers HTTP seguros
- CORS configurado
- Validação de dados

## 🎨 Design

O design é baseado no template fornecido, com:
- Cores personalizadas (fantasy palette)
- Tipografia Inter
- Componentes card com hover effects
- Gradientes modernos
- Ícones Font Awesome
- Layout responsivo

## 🛠️ Scripts Disponíveis (Monorepo)

### Root (executa em todos os workspaces)

- `npm install` - Instala todas as dependências do monorepo
- `npm run dev` - Inicia backend E frontend em desenvolvimento
- `npm run build` - Build de produção de todos os projetos
- `npm start` - Inicia todos os projetos em produção
- `npm run clean` - Limpa node_modules e builds
- `npm run db:setup` - Configura o banco de dados

### Workspace específico

```bash
# Backend
npm run dev --workspace=backend
npm run start --workspace=backend

# Frontend
npm run dev --workspace=frontend
npm run build --workspace=frontend
```

## 🚀 Vantagens do Turborepo

- ⚡ **Cache inteligente** - Não rebuilda o que não mudou
- 🔄 **Execução paralela** - Backend e frontend rodam juntos
- 📦 **Gerenciamento unificado** - Um `npm install` para tudo
- 🎯 **Pipeline otimizado** - Builds mais rápidos
- 🔗 **Dependências compartilhadas** - Economia de espaço

## 📝 Licença

MIT

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido como um blog completo com CMS em **arquitetura monorepo**, incluindo:
- Sistema de autenticação robusto
- API RESTful completa
- Interface administrativa moderna
- Frontend responsivo e otimizado
- Banco de dados PostgreSQL bem estruturado
- **Turborepo para gerenciamento otimizado**

## 🚀 Próximos Passos

Sugestões para expandir o projeto:
- [ ] Upload de imagens
- [ ] Sistema de comentários
- [ ] Newsletter
- [ ] SEO otimizado
- [ ] Analytics integrado
- [ ] Exportação de posts
- [ ] Múltiplos autores
- [ ] Permissões granulares
- [ ] Temas customizáveis
- [ ] API para mobile app
- [ ] CI/CD com cache do Turborepo
