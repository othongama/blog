import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/Article/ArticleCard';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import AdUnit from '@/components/AdSense/AdUnit';
import { categoriesApi, articlesApi } from '@/lib/api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const category = await categoriesApi.getBySlug(params.slug);

    return {
      title: category.name,
      description: category.description || `Artigos sobre ${category.name}`,
    };
  } catch (error) {
    return {
      title: 'Categoria não encontrada',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let category;
  let articles = [];

  try {
    category = await categoriesApi.getBySlug(params.slug);
    const response = await articlesApi.getAll({
      category: params.slug,
      status: 'published',
      limit: 12
    });
    articles = response.data || [];
  } catch (error) {
    notFound();
  }

  return (
    <div className="container-custom py-12">
      <Breadcrumbs
        items={[
          { name: 'Categorias', url: '/categorias' },
          { name: category.name, url: `/categoria/${category.slug}` },
        ]}
      />

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {category.description}
          </p>
        )}
        <div className="w-20 h-1 bg-gradient-primary rounded-full mt-4"></div>
      </div>

      <AdUnit slot="8888888888" format="horizontal" className="mb-8" />

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum artigo nesta categoria ainda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
