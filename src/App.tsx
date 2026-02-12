import { useState, useCallback, useEffect } from 'react';
import { QuizConfig, Question, UserAnswer, QuizResult, Language } from './types/quiz';
import { generateQuestions, evaluateAnswers } from './services/api';
import { LandingPage } from './components/LandingPage';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { CookieConsent } from './components/CookieConsent';
import { BlogPage } from './components/BlogArticles';
import { Footer } from './components/Footer';
import { PrivacyPage, ImprintPage } from './components/LegalPages';

type AppState = 'landing' | 'blog' | 'setup' | 'generating' | 'playing' | 'evaluating' | 'finished' | 'error';

const MESSAGES = {
  de: {
    generating: 'Fragen werden generiert...',
    generatingSub: 'Die KI erstellt einzigartige Quizfragen für dich',
    evaluating: 'Antworten werden ausgewertet...',
    evaluatingSub: 'Die KI prüft deine Antworten',
    noQuestions: 'Keine Fragen konnten generiert werden',
    evaluationError: 'Fehler bei der Auswertung'
  },
  en: {
    generating: 'Generating questions...',
    generatingSub: 'The AI is creating unique quiz questions for you',
    evaluating: 'Evaluating answers...',
    evaluatingSub: 'The AI is checking your answers',
    noQuestions: 'No questions could be generated',
    evaluationError: 'Error during evaluation'
  }
};

// Prüfen ob Werbung angezeigt werden soll basierend auf URL
function shouldShowAds(): boolean {
  const params = new URLSearchParams(window.location.search);
  
  // ?toll=true -> keine Werbung (geheimer Parameter)
  if (params.get('toll') === 'true') {
    return false;
  }
  
  // Standard: Werbung anzeigen
  return true;
}

// Cookie-Einstellungen aus localStorage laden
function getCookieSettings(): { accepted: boolean; analytics: boolean; ads: boolean } | null {
  try {
    const stored = localStorage.getItem('pubquiz_cookie_consent');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

// Cookie-Einstellungen speichern
function saveCookieSettings(analytics: boolean, ads: boolean): void {
  localStorage.setItem('pubquiz_cookie_consent', JSON.stringify({
    accepted: true,
    analytics,
    ads,
    timestamp: new Date().toISOString()
  }));
}

export function App() {
  const [state, setState] = useState<AppState>('landing');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>('');
  const [rawErrorResponse, setRawErrorResponse] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('pubquiz_language') as Language) || 'de';
  });
  
  // Ads & Cookie State
  const [showAds] = useState<boolean>(shouldShowAds);
  const [cookieSettings, setCookieSettings] = useState<{ accepted: boolean; analytics: boolean; ads: boolean } | null>(getCookieSettings);
  const [showCookieConsent, setShowCookieConsent] = useState<boolean>(false);
  const [adsEnabled, setAdsEnabled] = useState<boolean>(false);
  
  // Legal Pages
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showImprint, setShowImprint] = useState(false);

  const t = MESSAGES[language];

  // Cookie-Consent beim Start anzeigen wenn nötig (NUR bei Werbevariante)
  useEffect(() => {
    // Bei der "tollen" Variante keine Cookie-Abfrage
    if (!showAds) {
      return;
    }
    
    if (!cookieSettings?.accepted) {
      setShowCookieConsent(true);
    }
    if (cookieSettings?.ads) {
      setAdsEnabled(true);
    }
  }, [showAds, cookieSettings]);

  // AdSense Script laden wenn Ads aktiviert
  useEffect(() => {
    if (adsEnabled && showAds) {
      // AdSense Script dynamisch laden
      const existingScript = document.querySelector('script[src*="adsbygoogle"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3292688178679342'; // Ersetze mit deiner Publisher ID
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [adsEnabled, showAds]);

  const handleCookieAccept = useCallback((analytics: boolean, ads: boolean) => {
    saveCookieSettings(analytics, ads);
    setCookieSettings({ accepted: true, analytics, ads });
    setShowCookieConsent(false);
    if (ads) {
      setAdsEnabled(true);
    }
  }, []);

  const handleCookieDecline = useCallback(() => {
    saveCookieSettings(false, false);
    setCookieSettings({ accepted: true, analytics: false, ads: false });
    setShowCookieConsent(false);
    setAdsEnabled(false);
  }, []);

  const handleStart = useCallback(async (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    setLanguage(quizConfig.language);
    setState('generating');
    setError('');

    try {
      // Expertenmodus-Konfiguration erstellen wenn nötig
      const expertConfig = quizConfig.apiProvider === 'expert' && quizConfig.expertMode
        ? quizConfig.expertMode
        : undefined;

      const generatedQuestions = await generateQuestions(
        quizConfig.apiKey,
        quizConfig.model,
        quizConfig.selectedCategories,
        quizConfig.questionsPerCategory,
        quizConfig.language,
        quizConfig.difficulty,
        [],
        quizConfig.apiProvider,
        expertConfig
      );

      if (generatedQuestions.length === 0) {
        throw new Error(MESSAGES[quizConfig.language].noQuestions);
      }

      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setState('playing');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const rawResponse = (err as any)?.rawResponse;
      console.log('Error caught:', errorMessage, 'Raw response:', rawResponse);
      setError(errorMessage);
      setRawErrorResponse(rawResponse);
      setState('error');
    }
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        answer,
        lockedAt: new Date()
      }
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions]);

  const handleRestart = useCallback(() => {
    setState('setup');
    setConfig(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError('');
    setRawErrorResponse(undefined);
  }, []);

  const handleRetry = useCallback(() => {
    if (config) {
      handleStart(config);
    } else {
      handleRestart();
    }
  }, [config, handleStart, handleRestart]);

  const handleUpdateResult = useCallback((updatedResult: QuizResult) => {
    setResult(updatedResult);
  }, []);

  // Haupt-Content rendern
  const renderContent = () => {
    switch (state) {
      case 'landing':
        return (
          <LandingPage
            language={language}
            onStartQuiz={() => setState('setup')}
            onBlogClick={() => setState('blog')}
            adsEnabled={adsEnabled && showAds}
          />
        );
      
      case 'blog':
        return (
          <BlogPage
            language={language}
            onBack={() => setState('landing')}
            adsEnabled={adsEnabled && showAds}
          />
        );
      
      case 'setup':
        return <SetupScreen onStart={handleStart} onBack={() => setState('landing')} />;

      case 'generating':
        return (
          <LoadingScreen
            message={t.generating}
            subMessage={t.generatingSub}
          />
        );

      case 'playing':
        return (
          <QuizScreen
            questions={questions}
            currentIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onAnswer={handleAnswer}
            language={language}
            onFinish={(lastAnswer?: string) => {
              if (lastAnswer !== undefined && config) {
                const currentQuestion = questions[currentQuestionIndex];
                const finalAnswers = [
                  ...userAnswers,
                  {
                    questionId: currentQuestion.id,
                    answer: lastAnswer,
                    lockedAt: new Date()
                  }
                ];
                
                setState('evaluating');
                
                evaluateAnswers(config.apiKey, config.model, questions, finalAnswers, config.language, config.apiProvider)
                  .then(evaluations => {
                    const correctCount = evaluations.filter(e => e.isCorrect).length;
                    setResult({
                      totalQuestions: questions.length,
                      correctAnswers: correctCount,
                      score: Math.round((correctCount / questions.length) * 100),
                      evaluations
                    });
                    setState('finished');
                  })
                  .catch(err => {
                    const errorMessage = err instanceof Error ? err.message : t.evaluationError;
                    const rawResponse = (err as any)?.rawResponse;
                    console.log('Evaluation error caught:', errorMessage, 'Raw response:', rawResponse);
                    setError(errorMessage);
                    setRawErrorResponse(rawResponse);
                    setState('error');
                  });
              }
            }}
          />
        );

      case 'evaluating':
        return (
          <LoadingScreen
            message={t.evaluating}
            subMessage={t.evaluatingSub}
          />
        );

      case 'finished':
        return result ? (
          <ResultsScreen 
            result={result} 
            onRestart={handleRestart} 
            language={language}
            onUpdateResult={handleUpdateResult}
          />
        ) : null;

      case 'error':
        return (
          <ErrorScreen
            error={error}
            rawResponse={rawErrorResponse}
            onRetry={handleRetry}
            onBack={handleRestart}
            language={language}
          />
        );

      default:
        return null;
    }
  };

  // Premium Header für die "tolle" Variante
  const renderPremiumHeader = () => {
    if (showAds) return null;
    
    return (
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-3">
          <span className="text-2xl">⭐</span>
          <span className="font-bold text-lg tracking-wide">
            {language === 'de' ? 'PREMIUM EDITION' : 'PREMIUM EDITION'}
          </span>
          <span className="text-2xl">⭐</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${!showAds ? 'premium-mode' : ''}`}>
      {/* Premium Header für werbefreie Version */}
      {renderPremiumHeader()}
      
      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* WICHTIG: Werbung wird NUR auf der Landing Page angezeigt - dort ist genug Publisher Content! */}
      {/* Keine Werbung auf Setup, Quiz oder Result Screens (interaktive Screens ohne redaktionellen Content) */}

      {/* Footer mit rechtlichen Links */}
      <Footer
        language={language}
        showAds={showAds}
        onPrivacyClick={() => setShowPrivacy(true)}
        onImprintClick={() => setShowImprint(true)}
        onCookieSettingsClick={() => setShowCookieConsent(true)}
      />

      {/* Cookie Consent Banner */}
      {showCookieConsent && showAds && (
        <CookieConsent
          language={language}
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
        />
      )}

      {/* Legal Pages */}
      {showPrivacy && (
        <PrivacyPage language={language} onClose={() => setShowPrivacy(false)} />
      )}
      {showImprint && (
        <ImprintPage language={language} onClose={() => setShowImprint(false)} />
      )}
    </div>
  );
}
