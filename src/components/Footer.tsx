import { Language } from '../types/quiz';

interface FooterProps {
  language: Language;
  showAds: boolean;
  onPrivacyClick: () => void;
  onImprintClick: () => void;
  onCookieSettingsClick: () => void;
}

const TEXTS = {
  de: {
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    cookies: 'Cookie-Einstellungen',
    premium: 'Premium'
  },
  en: {
    privacy: 'Privacy Policy',
    imprint: 'Legal Notice',
    cookies: 'Cookie Settings',
    premium: 'Premium'
  }
};

export function Footer({ language, showAds, onPrivacyClick, onImprintClick, onCookieSettingsClick }: FooterProps) {
  const t = TEXTS[language];

  return (
    <footer className={`mt-auto ${!showAds ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' : 'bg-white/90'} backdrop-blur-sm border-t py-3 px-4`}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span className={!showAds ? 'text-amber-700 font-medium' : 'text-gray-500'}>v2.3.0</span>
          {!showAds && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold rounded-full shadow-sm">
              <span>⭐</span>
              {t.premium}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onPrivacyClick}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {t.privacy}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onImprintClick}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {t.imprint}
          </button>
          {showAds && (
            <>
              <span className="text-gray-300">|</span>
              <button
                onClick={onCookieSettingsClick}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {t.cookies}
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
