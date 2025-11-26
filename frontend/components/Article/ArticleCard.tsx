import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiEye, FiClock } from 'react-icons/fi';
import type { Article } from '@/types';
import { formatDate, calculateReadingTime, truncate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const readingTime = calculateReadingTime(article.content);

  if (featured) {
    return (
      <Link href={`/blog/${article.slug}`} className="group block">
        <article className="card card-hover overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            {article.featured_image && (
              <div className="relative h-64 md:h-full overflow-hidden">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
            <div className="p-6 flex flex-col justify-center">
              {article.category && (
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full w-fit mb-3">
                  {article.category.name}
                </span>
              )}
              <h2 className="text-3xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {formatDate(article.published_at || article.created_at)}
                </span>
                <span className="flex items-center">
                  <FiClock className="w-4 h-4 mr-1" />
                  {readingTime} min
                </span>
                <span className="flex items-center">
                  <FiEye className="w-4 h-4 mr-1" />
                  {article.views_count}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <article className="card card-hover h-full flex flex-col">
        {article.featured_image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          {article.category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full w-fit mb-3">
              {article.category.name}
            </span>
          )}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <span className="flex items-center">
              <FiCalendar className="w-4 h-4 mr-1" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              {readingTime} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
