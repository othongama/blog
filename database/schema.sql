-- MonetizePro Blog Database Schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'author',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, bio, role)
VALUES (
    'admin@monetizepro.com',
    '$2a$10$YourHashedPasswordHere',
    'Carlos Silva',
    'Especialista em monetização digital com mais de 5 anos de experiência.',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
    ('Google Adsense', 'google-adsense', 'Tudo sobre monetização com Google Adsense'),
    ('Estratégias', 'estrategias', 'Estratégias avançadas de monetização'),
    ('Ferramentas', 'ferramentas', 'Ferramentas úteis para criadores de conteúdo'),
    ('Casos de Sucesso', 'casos-de-sucesso', 'Histórias de sucesso em monetização'),
    ('Dúvidas Frequentes', 'duvidas-frequentes', 'Respostas para as dúvidas mais comuns')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
    ('Google Adsense', 'google-adsense'),
    ('Monetização', 'monetizacao'),
    ('Blogging', 'blogging'),
    ('Marketing Digital', 'marketing-digital')
ON CONFLICT (slug) DO NOTHING;
