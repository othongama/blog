'use client';

import { useEffect } from 'react';

export type AdFormat = 'horizontal' | 'vertical' | 'square' | 'in-article';

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  responsive?: boolean;
}

// Mapeamento de formatos para estilos
const formatStyles: Record<AdFormat, string> = {
  horizontal: 'min-h-[90px] md:min-h-[250px]',
  vertical: 'min-h-[600px]',
  square: 'min-h-[250px]',
  'in-article': 'min-h-[180px]',
};

export default function AdUnit({
  slot,
  format = 'horizontal',
  className = '',
  responsive = true,
}: AdUnitProps) {
  const adSenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adSenseEnabled && clientId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSenseEnabled, clientId]);

  // Se AdSense não estiver habilitado, mostra placeholder
  if (!adSenseEnabled || !clientId) {
    return (
      <div className={`ad-container disabled ${formatStyles[format]} ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm font-medium">Espaço para Anúncio</p>
          <p className="text-xs mt-1">Google AdSense ({format})</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${formatStyles[format]} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : undefined}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
