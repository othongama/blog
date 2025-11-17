# 🚀 Deploy do Backend no Railway

Guia completo para fazer deploy do backend e banco de dados PostgreSQL no Railway.

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Código do backend commitado no GitHub
- Repositório GitHub configurado

## 🎯 Passo a Passo

### 1️⃣ Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app/)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `othongama/blog`
5. Selecione o branch `claude/google-ads-guide-site-01STbzxPfDrAyhxSAqqbshQd`

### 2️⃣ Adicionar PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Railway criará automaticamente o banco de dados

### 3️⃣ Configurar Variáveis de Ambiente do Backend

No Railway, vá em **Settings** > **Variables** e adicione:

```env
# Configurações do Node
NODE_ENV=production
PORT=5000

# JWT Secret
JWT_SECRET=seu_secret_jwt_super_seguro_aqui_mude_isso

# URL do Frontend (CORS)
FRONTEND_URL=https://seu-frontend.vercel.app

# Dados do Admin
ADMIN_EMAIL=admin@monetizepro.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Carlos Silva
```

### 4️⃣ Conectar Backend ao PostgreSQL

O Railway fornece automaticamente as variáveis do PostgreSQL. Você precisa mapeá-las:

**Opção A: Usar variável DATABASE_URL diretamente**

No código `backend/src/config/database.js`, você pode usar:

```javascript
const connectionString = process.env.DATABASE_URL;
```

**Opção B: Mapear variáveis individuais**

No Railway, adicione estas variáveis:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

### 5️⃣ Configurar Root Directory (IMPORTANTE)

Como estamos em um monorepo, precisamos dizer ao Railway onde está o backend:

1. Vá em **Settings** do serviço backend
2. Em **Build & Deploy**, configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 6️⃣ Executar Setup do Banco de Dados

**Opção 1: Via Railway CLI**

```bash
# Instale o Railway CLI
npm i -g @railway/cli

# Faça login
railway login

# Entre no projeto
railway link

# Execute o setup
railway run npm run db:setup --workspace=backend
```

**Opção 2: Via Dashboard**

1. No Railway, vá em **Deployments**
2. Clique em **"Deploy"** > **"Custom Start Command"**
3. Use: `npm run deploy` (isso executa db:setup + start)
4. Após primeira execução, volte para `npm start`

**Opção 3: Conectar ao PostgreSQL e executar SQL**

```bash
# Conecte ao PostgreSQL do Railway
railway connect Postgres

# Execute o schema manualmente
\i /path/to/database/schema.sql
```

### 7️⃣ Deploy Automático

Agora sempre que você fizer push no GitHub:

```bash
git push origin claude/google-ads-guide-site-01STbzxPfDrAyhxSAqqbshQd
```

O Railway automaticamente:
- ✅ Detecta mudanças
- ✅ Faz build
- ✅ Deploy do backend

## 🔗 URLs Importantes

Após o deploy, você terá:

- **Backend API**: `https://seu-projeto.up.railway.app`
- **PostgreSQL**: Acessível internamente no Railway

## ⚙️ Variáveis de Ambiente Completas

```env
# Backend Configuration
NODE_ENV=production
PORT=5000

# Database (Railway auto-fornece)
DATABASE_URL=${{Postgres.DATABASE_URL}}
# OU
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# JWT Secret
JWT_SECRET=seu_secret_jwt_super_seguro_mude_isso

# Frontend URL (para CORS)
FRONTEND_URL=https://seu-frontend.vercel.app

# Admin User
ADMIN_EMAIL=admin@monetizepro.com
ADMIN_PASSWORD=admin123_mude_isso_em_producao
ADMIN_NAME=Carlos Silva
```

## 🧪 Testar o Backend

Após deploy, teste os endpoints:

```bash
# Health check
curl https://seu-projeto.up.railway.app/api/health

# Login
curl -X POST https://seu-projeto.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@monetizepro.com","password":"admin123"}'

# Listar posts
curl https://seu-projeto.up.railway.app/api/posts

# Listar categorias
curl https://seu-projeto.up.railway.app/api/categories
```

## 📊 Monitoramento

No Railway Dashboard você pode:
- Ver logs em tempo real
- Monitorar uso de recursos
- Ver métricas de performance
- Configurar alertas

## 🔄 Atualizações

Para atualizar o backend:

```bash
# Faça suas mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push origin claude/google-ads-guide-site-01STbzxPfDrAyhxSAqqbshQd

# Railway fará deploy automaticamente!
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Verifique se `Root Directory` está configurado como `backend`
- Certifique-se que `npm install` está rodando

### Erro de conexão com banco
- Verifique as variáveis de ambiente do PostgreSQL
- Certifique-se que o PostgreSQL está no mesmo projeto

### Erro 503 / Timeout
- Verifique os logs no Railway
- Certifique-se que a porta está correta (Railway define automaticamente)

### Banco não inicializado
- Execute `railway run npm run db:setup` via CLI
- Ou use deploy command temporário: `npm run deploy`

## 💡 Dicas

1. **Use segredos fortes em produção!**
   - JWT_SECRET deve ser uma string aleatória longa
   - Mude a senha do admin após primeiro acesso

2. **Configure domínio customizado**
   - No Railway: Settings > Domains
   - Adicione seu domínio personalizado

3. **Habilite logs**
   - Use Morgan para logs HTTP (já configurado)
   - Railway armazena logs por 7 dias

4. **Monorepo**
   - O Railway detecta automaticamente via `railway.toml`
   - Ou configure Root Directory manualmente

## 📚 Recursos Úteis

- [Railway Docs](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [PostgreSQL no Railway](https://docs.railway.app/databases/postgresql)

## ✅ Checklist de Deploy

- [ ] Projeto criado no Railway
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Root Directory configurado como `backend`
- [ ] Database schema executado (`npm run db:setup`)
- [ ] Deploy bem-sucedido
- [ ] Health check funcionando (`/api/health`)
- [ ] Login testado
- [ ] CORS configurado com URL do frontend
- [ ] Senha do admin alterada (IMPORTANTE!)

---

🎉 **Pronto! Seu backend está no ar no Railway!**

Agora você pode conectar seu frontend (Vercel, Netlify, etc.) usando a URL do Railway.
