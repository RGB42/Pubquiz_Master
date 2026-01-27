import { useState } from 'react';
import { Language } from '../types/quiz';

interface CookieConsentProps {
  language: Language;
  onAccept: (analytics: boolean, ads: boolean) => void;
  onDecline: () => void;
}

const TEXTS = {
  de: {
    title: '🍪 Cookie-Einstellungen',
    description: 'Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein optimales Erlebnis zu bieten. Mit Ihrer Zustimmung nutzen wir auch Cookies für Werbezwecke (Google AdSense).',
    necessary: 'Notwendige Cookies',
    necessaryDesc: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    analytics: 'Analyse-Cookies',
    analyticsDesc: 'Helfen uns zu verstehen, wie Besucher die Website nutzen.',
    ads: 'Werbe-Cookies',
    adsDesc: 'Werden verwendet, um Ihnen relevante Werbung anzuzeigen (Google AdSense).',
    acceptAll: 'Alle akzeptieren',
    acceptSelected: 'Auswahl akzeptieren',
    declineAll: 'Nur notwendige',
    moreInfo: 'Mehr Informationen in unserer',
    privacy: 'Datenschutzerklärung'
  },
  en: {
    title: '🍪 Cookie Settings',
    description: 'We use cookies and similar technologies to provide you with an optimal experience. With your consent, we also use cookies for advertising purposes (Google AdSense).',
    necessary: 'Necessary Cookies',
    necessaryDesc: 'These cookies are required for the basic functions of the website.',
    analytics: 'Analytics Cookies',
    analyticsDesc: 'Help us understand how visitors use the website.',
    ads: 'Advertising Cookies',
    adsDesc: 'Used to show you relevant advertisements (Google AdSense).',
    acceptAll: 'Accept All',
    acceptSelected: 'Accept Selected',
    declineAll: 'Necessary Only',
    moreInfo: 'More information in our',
    privacy: 'Privacy Policy'
  }
};

export function CookieConsent({ language, onAccept, onDecline }: CookieConsentProps) {
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const t = TEXTS[language];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.title}</h2>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {showDetails ? (
            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{t.necessary}</h3>
                    <p className="text-sm text-gray-500">{t.necessaryDesc}</p>
                  </div>
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    {language === 'de' ? 'Immer aktiv' : 'Always active'}
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t.analytics}</h3>
                    <p className="text-sm text-gray-500">{t.analyticsDesc}</p>
                  </div>
                  <button
                    onClick={() => setAnalytics(!analytics)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      analytics ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      analytics ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Ads Cookies */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{t.ads}</h3>
                    <p className="text-sm text-gray-500">{t.adsDesc}</p>
                  </div>
                  <button
                    onClick={() => setAds(!ads)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      ads ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      ads ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm mb-6 underline"
            >
              {language === 'de' ? 'Einstellungen anzeigen' : 'Show settings'}
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t.declineAll}
            </button>
            {showDetails ? (
              <button
                onClick={() => onAccept(analytics, ads)}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {t.acceptSelected}
              </button>
            ) : (
              <button
                onClick={() => onAccept(true, true)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t.acceptAll}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            {t.moreInfo}{' '}
            <a href="#privacy" className="text-indigo-600 hover:underline">
              {t.privacy}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
