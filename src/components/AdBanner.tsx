import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ adSlot, adFormat = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Placeholder für Entwicklung - wird im Production durch echte Ads ersetzt
  // @ts-ignore - Vite specific
  const isProduction = typeof import.meta !== 'undefined' && import.meta.env?.PROD;

  if (!isProduction) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 ${className}`}>
        <div className="text-center p-4">
          <p className="font-medium">📢 Werbung / Ad</p>
          <p className="text-xs">Slot: {adSlot}</p>
        </div>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3292688178679342" // Ersetze mit deiner AdSense Publisher ID
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
