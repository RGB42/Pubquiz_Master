import { Language } from '../types/quiz';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
  language: Language;
}

const TRANSLATIONS = {
  de: {
    title: 'Oops! Etwas ist schiefgelaufen',
    retry: '🔄 Erneut versuchen',
    back: '← Zurück zur Konfiguration',
    possibleCauses: 'Mögliche Ursachen:',
    cause1: 'Ungültiger API Key',
    cause2: 'Netzwerkprobleme',
    cause3: 'API-Ratenlimit erreicht'
  },
  en: {
    title: 'Oops! Something went wrong',
    retry: '🔄 Try again',
    back: '← Back to configuration',
    possibleCauses: 'Possible causes:',
    cause1: 'Invalid API key',
    cause2: 'Network issues',
    cause3: 'API rate limit reached'
  }
};

export function ErrorScreen({ error, onRetry, onBack, language }: ErrorScreenProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-red-500/30 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        
        <div className="bg-red-500/20 rounded-xl p-4 mb-6 border border-red-500/30">
          <p className="text-red-200 text-sm">{error}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all"
          >
            {t.retry}
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
          >
            {t.back}
          </button>
        </div>

        <div className="mt-6 text-purple-300/70 text-sm">
          <p>{t.possibleCauses}</p>
          <ul className="mt-2 space-y-1">
            <li>• {t.cause1}</li>
            <li>• {t.cause2}</li>
            <li>• {t.cause3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
