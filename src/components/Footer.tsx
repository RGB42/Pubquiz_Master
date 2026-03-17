import { Language } from '../types/quiz';
import { Link } from 'react-router-dom';

interface FooterProps {
  language: Language;
  showAds: boolean;
  onCookieSettingsClick: () => void;
}

const TEXTS = {
  de: {
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    about: 'Ueber uns',
    contact: 'Kontakt',
    cookies: 'Cookie-Einstellungen',
    premium: 'Premium'
  },
  en: {
    privacy: 'Privacy Policy',
    imprint: 'Legal Notice',
    about: 'About',
    contact: 'Contact',
    cookies: 'Cookie Settings',
    premium: 'Premium'
  }
};

export function Footer({ language, showAds, onCookieSettingsClick }: FooterProps) {
  const t = TEXTS[language];

  return (
    <footer className={`mt-auto ${!showAds ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' : 'bg-white/90'} backdrop-blur-sm border-t py-3 px-4`}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span className={!showAds ? 'text-amber-700 font-medium' : 'text-gray-500'}>v4.3.0</span>
          {!showAds && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold rounded-full shadow-sm">
              <span>⭐</span>
              {t.premium}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {t.about}
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {t.contact}
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {t.privacy}
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/imprint" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {t.imprint}
          </Link>
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
