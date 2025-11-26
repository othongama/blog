import { Metadata } from 'next';
import type { SEOMetadata } from '@/types';

interface SEOHeadProps {
  metadata: SEOMetadata;
}

// Componente para gerar metadata do Next.js 14
export function generateMetadata(seoData: SEOMetadata): Metadata {
  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default SEOHead;
