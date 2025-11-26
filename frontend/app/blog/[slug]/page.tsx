import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiEye, FiShare2 } from 'react-icons/fi';
import { articlesApi } from '@/lib/api';
import { generateArticleMetadata } from '@/lib/seo';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import JsonLd from '@/components/SEO/JsonLd';
import AdUnit from '@/components/AdSense/AdUnit';
import ArticleCard from '@/components/Article/ArticleCard';
import ShareButtons from '@/components/Article/ShareButtons';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Gerar metadata para SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await articlesApi.getBySlug(params.slug);
    const seoMetadata = generateArticleMetadata(article);

    return {
      title: seoMetadata.title,
      description: seoMetadata.description,
      openGraph: seoMetadata.openGraph,
      twitter: seoMetadata.twitter,
      alternates: {
        canonical: seoMetadata.canonical,
      },
    };
  } catch (error) {
    return {
      title: 'Artigo não encontrado',
    };
  }
}

// Incrementar visualizações (lado do servidor)
async function incrementViews(slug: string) {
  try {
    await articlesApi.incrementViews(slug);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article;
  let relatedArticles = [];

  try {
    article = await articlesApi.getBySlug(params.slug);

    // Incrementar visualizações
    await incrementViews(params.slug);

    // Buscar artigos relacionados
    relatedArticles = await articlesApi.getRelated(params.slug, 3);
  } catch (error) {
    notFound();
  }

  const readingTime = calculateReadingTime(article.content);
  const seoMetadata = generateArticleMetadata(article);

  const breadcrumbItems = [
    { name: 'Blog', url: '/blog' },
    ...(article.category ? [{ name: article.category.name, url: `/categoria/${article.category.slug}` }] : []),
    { name: article.title, url: `/blog/${article.slug}` },
  ];

  return (
    <article>
      {/* JSON-LD para SEO */}
      <JsonLd data={seoMetadata.jsonLd} />

      {/* Header do artigo */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-12">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs items={breadcrumbItems} />

          {article.category && (
            <Link
              href={`/categoria/${article.category.slug}`}
              className="inline-block px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4"
            >
              {article.category.name}
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <FiCalendar className="w-4 h-4 mr-2" />
              {formatDate(article.published_at || article.created_at)}
            </div>
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-2" />
              {readingTime} min de leitura
            </div>
            <div className="flex items-center">
              <FiEye className="w-4 h-4 mr-2" />
              {article.views_count} visualizações
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Imagem destacada */}
      {article.featured_image && (
        <div className="container-custom max-w-4xl my-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      )}

      {/* AdSense após imagem */}
      <div className="container-custom max-w-4xl">
        <AdUnit slot="1111111111" format="horizontal" />
      </div>

      {/* Conteúdo do artigo */}
      <div className="container-custom max-w-4xl py-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* AdSense in-article */}
        <AdUnit slot="2222222222" format="in-article" className="my-12" />

        {/* Botões de compartilhamento */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiShare2 className="mr-2" />
            Compartilhe este artigo
          </h3>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`}
            title={article.title}
          />
        </div>

        {/* Autor */}
        {article.author && (
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Sobre o Autor</h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>{article.author.name}</strong>
            </p>
          </div>
        )}
      </div>

      {/* AdSense sidebar simulado */}
      <div className="container-custom max-w-4xl">
        <AdUnit slot="3333333333" format="square" />
      </div>

      {/* Artigos relacionados */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 py-12 mt-12">
          <div className="container-custom max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AdSense footer */}
      <div className="container-custom max-w-4xl my-8">
        <AdUnit slot="4444444444" format="horizontal" />
      </div>
    </article>
  );
}
