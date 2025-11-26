import { Metadata } from 'next';
import ArticleCard from '@/components/Article/ArticleCard';
import AdUnit from '@/components/AdSense/AdUnit';
import { articlesApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore nossos artigos sobre monetização, SEO, marketing digital e muito mais.',
};

export const revalidate = 1800; // Revalidar a cada 30 minutos

export default async function BlogPage() {
  let articles = [];

  try {
    const response = await articlesApi.getAll({ limit: 12, status: 'published' });
    articles = response.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Artigos e guias sobre monetização, SEO e marketing digital
        </p>
        <div className="w-20 h-1 bg-gradient-primary rounded-full mt-4"></div>
      </div>

      {/* AdSense Header */}
      <AdUnit slot="5555555555" format="horizontal" className="mb-8" />

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum artigo publicado ainda.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <>
                <ArticleCard key={article.id} article={article} />
                {/* AdSense a cada 6 artigos */}
                {(index + 1) % 6 === 0 && index !== articles.length - 1 && (
                  <div className="col-span-full">
                    <AdUnit slot="6666666666" format="horizontal" className="my-4" />
                  </div>
                )}
              </>
            ))}
          </div>

          {/* TODO: Adicionar paginação */}
        </>
      )}

      {/* AdSense Footer */}
      <AdUnit slot="7777777777" format="horizontal" className="mt-12" />
    </div>
  );
}
