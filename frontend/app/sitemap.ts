import { MetadataRoute } from 'next';
import { articlesApi, categoriesApi } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Páginas estáticas
  sitemap.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  sitemap.push({
    url: `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  sitemap.push({
    url: `${SITE_URL}/categorias`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Artigos
  try {
    const response = await articlesApi.getAll({ limit: 1000, status: 'published' });
    const articles = response.data || [];

    articles.forEach((article) => {
      sitemap.push({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  // Categorias
  try {
    const categories = await categoriesApi.getAll();

    categories.forEach((category) => {
      sitemap.push({
        url: `${SITE_URL}/categoria/${category.slug}`,
        lastModified: new Date(category.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return sitemap;
}
