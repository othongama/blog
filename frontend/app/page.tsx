import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ArticleCard from '@/components/Article/ArticleCard';
import AdUnit from '@/components/AdSense/AdUnit';
import { articlesApi, categoriesApi } from '@/lib/api';

// Revalidar a cada 1 hora
export const revalidate = 3600;

async function getFeaturedArticles() {
  try {
    const response = await articlesApi.getAll({ limit: 6, status: 'published' });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await categoriesApi.getAll();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const [articles, categories] = await Promise.all([
    getFeaturedArticles(),
    getCategories(),
  ]);

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bem-vindo ao MonetizePro
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Descubra estratégias comprovadas de monetização, SEO e marketing digital
              para aumentar seus resultados online.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <span>Explorar Artigos</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* AdSense Header */}
      <div className="container-custom">
        <AdUnit slot="1234567890" format="horizontal" className="my-8" />
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="container-custom py-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Artigo em Destaque</h2>
            <div className="w-20 h-1 bg-gradient-primary rounded-full"></div>
          </div>
          <ArticleCard article={featuredArticle} featured />
        </section>
      )}

      {/* Latest Articles */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Últimos Artigos</h2>
            <div className="w-20 h-1 bg-gradient-primary rounded-full"></div>
          </div>
          <Link
            href="/blog"
            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1"
          >
            <span>Ver todos</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* AdSense Mid */}
      <div className="container-custom">
        <AdUnit slot="9876543210" format="horizontal" className="my-8" />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-custom py-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Categorias</h2>
            <div className="w-20 h-1 bg-gradient-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="card card-hover p-6 text-center group"
              >
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                {category.article_count !== undefined && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.article_count} artigos
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-primary text-white py-16 mt-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não perca nossas atualizações!
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Receba as melhores estratégias de monetização e SEO diretamente no seu email.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <span>Inscrever-se Agora</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
