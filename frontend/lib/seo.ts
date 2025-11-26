import type { Article, SEOMetadata } from '@/types';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'MonetizePro Blog';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Blog otimizado para monetização com Google AdSense';

// Gerar metadata para artigo
export function generateArticleMetadata(article: Article): SEOMetadata {
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || '';
  const url = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.featured_image || `${SITE_URL}/og-default.jpg`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description: description.substring(0, 160),
    canonical: url,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    jsonLd: generateArticleJsonLd(article),
  };
}

// Gerar JSON-LD para artigo
export function generateArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

// Gerar breadcrumb JSON-LD
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Gerar Organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      // Adicione suas redes sociais aqui
    ],
  };
}

// Gerar WebSite JSON-LD com SearchAction
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Truncar meta description para tamanho ideal
export function optimizeMetaDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  // Tenta cortar em uma frase completa
  const lastPeriod = text.substring(0, maxLength).lastIndexOf('.');
  if (lastPeriod > maxLength - 30) {
    return text.substring(0, lastPeriod + 1);
  }

  // Se não, corta na última palavra
  const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
  return text.substring(0, lastSpace) + '...';
}

// Otimizar título para SEO
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;

  const lastSpace = title.substring(0, maxLength).lastIndexOf(' ');
  return title.substring(0, lastSpace) + '...';
}
