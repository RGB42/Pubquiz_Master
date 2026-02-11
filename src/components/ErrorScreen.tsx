import { useState } from 'react';
import { Language } from '../types/quiz';

interface ErrorScreenProps {
  error: string;
  rawResponse?: string;
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
    cause3: 'API-Ratenlimit erreicht',
    cause4: 'Ungültige KI-Antwort',
    forDevelopers: '🔧 Für Entwickler',
    hideDetails: 'Details ausblenden',
    rawResponse: 'Rohe KI-Antwort:',
    copyToClipboard: '📋 Kopieren',
    copied: '✓ Kopiert!'
  },
  en: {
    title: 'Oops! Something went wrong',
    retry: '🔄 Try again',
    back: '← Back to configuration',
    possibleCauses: 'Possible causes:',
    cause1: 'Invalid API key',
    cause2: 'Network issues',
    cause3: 'API rate limit reached',
    cause4: 'Invalid AI response',
    forDevelopers: '🔧 For Developers',
    hideDetails: 'Hide details',
    rawResponse: 'Raw AI Response:',
    copyToClipboard: '📋 Copy',
    copied: '✓ Copied!'
  }
};

export function ErrorScreen({ error, rawResponse, onRetry, onBack, language }: ErrorScreenProps) {
  const t = TRANSLATIONS[language];
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (rawResponse) {
      try {
        await navigator.clipboard.writeText(rawResponse);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-red-500/30 text-center">
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
            {rawResponse && <li>• {t.cause4}</li>}
          </ul>
        </div>

        {/* Für Entwickler Button - nur anzeigen wenn rawResponse vorhanden */}
        {rawResponse && (
          <div className="mt-6">
            <button
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-sm rounded-lg transition-colors border border-yellow-500/30"
            >
              {showRawResponse ? t.hideDetails : t.forDevelopers}
            </button>
            
            {showRawResponse && (
              <div className="mt-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-300 text-sm font-medium">{t.rawResponse}</span>
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      copied 
                        ? 'bg-green-500/30 text-green-300' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {copied ? t.copied : t.copyToClipboard}
                  </button>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-yellow-500/20 max-h-96 overflow-y-auto">
                  <pre className="text-yellow-200/80 text-xs whitespace-pre-wrap break-words font-mono">
                    {rawResponse}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
