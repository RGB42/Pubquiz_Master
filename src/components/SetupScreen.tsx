import { useState, useEffect } from 'react';
import { QuizConfig, Language, Difficulty, ApiProvider, API_PROVIDERS, CATEGORIES_DE, CATEGORIES_EN } from '../types/quiz';
import { getArticleCount, clearUsedArticles, getUsedArticles } from '../services/articleHistory';
import { ProviderIcon } from './ProviderIcons';

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
  onBack?: () => void;
}

const STORAGE_KEYS = {
  apiProvider: 'pubquiz_api_provider',
  apiKey: 'pubquiz_api_key',
  model: 'pubquiz_model',
  language: 'pubquiz_language',
  selectedCategories: 'pubquiz_selected_categories',
  customCategories: 'pubquiz_custom_categories',
  numCategories: 'pubquiz_num_categories',
  questionsPerCategory: 'pubquiz_questions_per_category',
  difficulty: 'pubquiz_difficulty',
  // Provider-spezifische Keys
  openrouterKey: 'pubquiz_openrouter_key',
  groqKey: 'pubquiz_groq_key',
  nvidiaKey: 'pubquiz_nvidia_key',
  openaiKey: 'pubquiz_openai_key',
  anthropicKey: 'pubquiz_anthropic_key',
  googleKey: 'pubquiz_google_key',
  // Expertenmodus Keys
  expertGoogleKey: 'pubquiz_expert_google_key',
  expertGroqKey: 'pubquiz_expert_groq_key',
};

const TRANSLATIONS = {
  de: {
    title: 'PubQuiz Master',
    subtitle: 'Dein KI-gestütztes Quiz-Erlebnis',
    language: 'Sprache',
    apiProvider: 'KI-Anbieter',
    apiKey: 'API Key',
    apiKeyHelp: 'Wo bekomme ich einen Key?',
    apiKeyInfo1: '1. Gehe zu',
    apiKeyInfo2: '2. Erstelle einen kostenlosen Account',
    apiKeyInfo3: '3. Generiere einen API Key',
    model: 'KI-Modell',
    modelHelp: 'Verfügbare Modelle',
    modelInfo: 'Empfohlene Modelle:',
    modelTip: '💡 Klicke auf ein Modell um es auszuwählen',
    allModels: 'Alle Modelle ansehen →',
    numCategories: 'Anzahl Kategorien',
    questionsPerCategory: 'Fragen pro Kategorie',
    totalQuestions: 'Gesamte Fragen',
    estimatedTime: 'Geschätzte Dauer',
    minutes: 'Minuten',
    startQuiz: '🚀 Quiz starten!',
    footer: 'Fragen werden durch KI generiert und mit Wikipedia verifiziert',
    selectCategories: 'Kategorien auswählen',
    selectedCount: 'ausgewählt',
    addCustomCategory: 'Eigene Kategorie hinzufügen...',
    add: 'Hinzufügen',
    needMore: 'Du brauchst mindestens',
    categories: 'Kategorien',
    apiKeyRequired: 'Bitte gib deinen API Key ein!',
    modelRequired: 'Bitte gib ein Modell ein!',
    notEnoughCategories: 'Bitte wähle genug Kategorien aus!',
    difficulty: 'Schwierigkeitsgrad',
    difficultyEasy: 'Leicht',
    difficultyMedium: 'Mittel',
    difficultyHard: 'Schwer',
    difficultyMixed: 'Gemischt',
    difficultyEasyDesc: 'Einfache Fragen für Einsteiger',
    difficultyMediumDesc: 'Mittelschwere Fragen für Fortgeschrittene',
    difficultyHardDesc: 'Knifflige Fragen für Experten',
    difficultyMixedDesc: 'Mix aus allen Schwierigkeitsgraden',
    articleHistory: 'Fragenhistorie',
    articleHistoryInfo: 'Bereits gestellte Themen',
    clearHistory: 'Historie löschen',
    clearHistoryConfirm: 'Möchtest du die Fragenhistorie löschen? Dadurch können bereits gestellte Themen wieder vorkommen.',
    historyCleared: 'Historie gelöscht!',
    showHistory: 'Historie anzeigen',
    hideHistory: 'Historie ausblenden',
    noHistory: 'Es wurden noch keine Themen abgefragt.',
    historyNote: 'Eigene Kategorien werden nicht getrackt, um Wiederholungen zu ermöglichen.',
    free: 'Kostenlos',
    providerNote: 'Jeder Anbieter speichert seinen eigenen API Key',
    expertMode: 'Expertenmodus',
    expertModeDesc: 'Nutzt zwei KI-Modelle: eines für Recherche, eines für Quiz-Generierung - komplett kostenlos mit Groq!',
    expertResearchKey: 'Groq API Key',
    expertGenerationKey: 'Groq API Key (Quiz-Generierung)',
    expertResearchModel: 'Recherche-Modell',
    expertGenerationModel: 'Generierungs-Modell',
    expertHowItWorks: 'So funktioniert der Expertenmodus',
    expertStep1: '1. Erstes Modell recherchiert und verifiziert Fakten',
    expertStep2: '2. Zweites Modell erstellt daraus präzise Quiz-Fragen',
    expertStep3: '3. Chain-of-Thought für plausible falsche Antworten',
    expertBenefit: '✨ Höhere Genauigkeit durch Zwei-Stufen-Verifikation - 100% kostenlos!'
  },
  en: {
    title: 'PubQuiz Master',
    subtitle: 'Your AI-powered quiz experience',
    language: 'Language',
    apiProvider: 'AI Provider',
    apiKey: 'API Key',
    apiKeyHelp: 'Where do I get a key?',
    apiKeyInfo1: '1. Go to',
    apiKeyInfo2: '2. Create a free account',
    apiKeyInfo3: '3. Generate an API key',
    model: 'AI Model',
    modelHelp: 'Available models',
    modelInfo: 'Recommended models:',
    modelTip: '💡 Click on a model to select it',
    allModels: 'View all models →',
    numCategories: 'Number of Categories',
    questionsPerCategory: 'Questions per Category',
    totalQuestions: 'Total Questions',
    estimatedTime: 'Estimated Duration',
    minutes: 'Minutes',
    startQuiz: '🚀 Start Quiz!',
    footer: 'Questions are AI-generated and verified with Wikipedia',
    selectCategories: 'Select Categories',
    selectedCount: 'selected',
    addCustomCategory: 'Add custom category...',
    add: 'Add',
    needMore: 'You need at least',
    categories: 'categories',
    apiKeyRequired: 'Please enter your API Key!',
    modelRequired: 'Please enter a model!',
    notEnoughCategories: 'Please select enough categories!',
    difficulty: 'Difficulty Level',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    difficultyMixed: 'Mixed',
    difficultyEasyDesc: 'Simple questions for beginners',
    difficultyMediumDesc: 'Medium questions for intermediate players',
    difficultyHardDesc: 'Tricky questions for experts',
    difficultyMixedDesc: 'Mix of all difficulty levels',
    articleHistory: 'Question History',
    articleHistoryInfo: 'Already asked topics',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Do you want to delete the question history? This allows previously asked topics to appear again.',
    historyCleared: 'History cleared!',
    showHistory: 'Show History',
    hideHistory: 'Hide History',
    noHistory: 'No topics have been asked yet.',
    historyNote: 'Custom categories are not tracked to allow repeated use.',
    free: 'Free',
    providerNote: 'Each provider stores its own API key',
    expertMode: 'Expert Mode',
    expertModeDesc: 'Uses two AI models: one for research, one for quiz generation - completely free with Groq!',
    expertResearchKey: 'Groq API Key',
    expertGenerationKey: 'Groq API Key (Quiz Generation)',
    expertResearchModel: 'Research Model',
    expertGenerationModel: 'Generation Model',
    expertHowItWorks: 'How Expert Mode works',
    expertStep1: '1. First model researches and verifies facts',
    expertStep2: '2. Second model creates precise quiz questions',
    expertStep3: '3. Chain-of-Thought for plausible wrong answers',
    expertBenefit: '✨ Higher accuracy through two-stage verification - 100% free!'
  }
};

// Provider-spezifische Storage Keys
const getProviderStorageKey = (provider: ApiProvider): string => {
  const keys: Record<ApiProvider, string> = {
    openrouter: STORAGE_KEYS.openrouterKey,
    groq: STORAGE_KEYS.groqKey,
    nvidia: STORAGE_KEYS.nvidiaKey,
    openai: STORAGE_KEYS.openaiKey,
    anthropic: STORAGE_KEYS.anthropicKey,
    google: STORAGE_KEYS.googleKey,
    expert: STORAGE_KEYS.expertGoogleKey, // Für Expert-Modus verwenden wir Google als Haupt-Key
  };
  return keys[provider];
};

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [language, setLanguage] = useState<Language>('de');
  const [apiProvider, setApiProvider] = useState<ApiProvider>('openrouter');
  const [numCategories, setNumCategories] = useState(3);
  const [questionsPerCategory, setQuestionsPerCategory] = useState(3);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(API_PROVIDERS.openrouter.defaultModel);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [articleCount, setArticleCount] = useState(0);
  
  // Expertenmodus State
  const [expertGroqKey, setExpertGroqKey] = useState('');
  const [expertResearchModel, setExpertResearchModel] = useState('llama-3.3-70b-versatile');
  const [expertGenerationModel, setExpertGenerationModel] = useState('llama-3.3-70b-versatile');

  const t = TRANSLATIONS[language];
  const categories = language === 'de' ? CATEGORIES_DE : CATEGORIES_EN;
  const currentProvider = API_PROVIDERS[apiProvider];

  // Lade Artikelanzahl
  useEffect(() => {
    setArticleCount(getArticleCount());
  }, []);

  // Lade gespeicherte Werte beim Start
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language) as Language;
    const savedProvider = localStorage.getItem(STORAGE_KEYS.apiProvider) as ApiProvider;
    const savedSelectedCategories = localStorage.getItem(STORAGE_KEYS.selectedCategories);
    const savedCustomCategories = localStorage.getItem(STORAGE_KEYS.customCategories);
    const savedNumCategories = localStorage.getItem(STORAGE_KEYS.numCategories);
    const savedQuestionsPerCategory = localStorage.getItem(STORAGE_KEYS.questionsPerCategory);
    const savedDifficulty = localStorage.getItem(STORAGE_KEYS.difficulty) as Difficulty;

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedProvider && API_PROVIDERS[savedProvider]) {
      setApiProvider(savedProvider);
      // Lade den API-Key für diesen Provider
      const providerKey = localStorage.getItem(getProviderStorageKey(savedProvider));
      if (providerKey) setApiKey(providerKey);
      // Lade das gespeicherte Modell oder verwende das Standard-Modell
      const savedModel = localStorage.getItem(STORAGE_KEYS.model);
      if (savedModel) {
        setModel(savedModel);
      } else {
        setModel(API_PROVIDERS[savedProvider].defaultModel);
      }
    }
    if (savedNumCategories) setNumCategories(parseInt(savedNumCategories));
    if (savedQuestionsPerCategory) setQuestionsPerCategory(parseInt(savedQuestionsPerCategory));
    if (savedDifficulty && ['easy', 'medium', 'hard', 'mixed'].includes(savedDifficulty)) {
      setDifficulty(savedDifficulty);
    }
    if (savedSelectedCategories) {
      try {
        setSelectedCategories(JSON.parse(savedSelectedCategories));
      } catch (e) {
        console.error('Error parsing selected categories:', e);
      }
    }
    if (savedCustomCategories) {
      try {
        setCustomCategories(JSON.parse(savedCustomCategories));
      } catch (e) {
        console.error('Error parsing custom categories:', e);
      }
    }
  }, []);

  // Lade API-Key wenn Provider wechselt
  useEffect(() => {
    if (apiProvider === 'expert') {
      // Expertenmodus: Lade Groq Key
      const savedGroqKey = localStorage.getItem(STORAGE_KEYS.expertGroqKey);
      if (savedGroqKey) setExpertGroqKey(savedGroqKey);
      
      // Lade gespeicherte Modelle oder verwende Standard
      const savedResearchModel = localStorage.getItem('pubquiz_expert_research_model');
      const savedGenerationModel = localStorage.getItem('pubquiz_expert_generation_model');
      
      // Validiere die Modelle - nur aktuelle Groq-Modelle zulassen
      const validGroqModels = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
      
      if (savedResearchModel && validGroqModels.includes(savedResearchModel)) {
        setExpertResearchModel(savedResearchModel);
      } else {
        setExpertResearchModel('llama-3.3-70b-versatile');
        localStorage.setItem('pubquiz_expert_research_model', 'llama-3.3-70b-versatile');
      }
      
      if (savedGenerationModel && validGroqModels.includes(savedGenerationModel)) {
        setExpertGenerationModel(savedGenerationModel);
      } else {
        setExpertGenerationModel('llama-3.3-70b-versatile');
        localStorage.setItem('pubquiz_expert_generation_model', 'llama-3.3-70b-versatile');
      }
    } else {
      const providerKey = localStorage.getItem(getProviderStorageKey(apiProvider));
      setApiKey(providerKey || '');
      setModel(API_PROVIDERS[apiProvider].defaultModel);
    }
    setShowApiInfo(false);
    setShowModelInfo(false);
  }, [apiProvider]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
    setSelectedCategories([]);
    localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify([]));
  };

  const handleProviderChange = (provider: ApiProvider) => {
    setApiProvider(provider);
    localStorage.setItem(STORAGE_KEYS.apiProvider, provider);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      localStorage.setItem(getProviderStorageKey(apiProvider), value.trim());
    }
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEYS.model, value.trim());
    }
  };

  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelected);
    localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify(newSelected));
  };

  const addCustomCategory = () => {
    if (newCustomCategory.trim() && !customCategories.includes(newCustomCategory.trim())) {
      const newCustom = [...customCategories, newCustomCategory.trim()];
      setCustomCategories(newCustom);
      localStorage.setItem(STORAGE_KEYS.customCategories, JSON.stringify(newCustom));
      
      const newSelected = [...selectedCategories, newCustomCategory.trim()];
      setSelectedCategories(newSelected);
      localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify(newSelected));
      
      setNewCustomCategory('');
    }
  };

  const removeCustomCategory = (category: string) => {
    const newCustom = customCategories.filter(c => c !== category);
    setCustomCategories(newCustom);
    localStorage.setItem(STORAGE_KEYS.customCategories, JSON.stringify(newCustom));
    
    const newSelected = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newSelected);
    localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify(newSelected));
  };

  const allCategories = [...categories, ...customCategories];
  const totalSelected = selectedCategories.length;
  const needsMoreCategories = totalSelected < numCategories;

  const handleStart = () => {
    // Validierung für Expertenmodus
    if (apiProvider === 'expert') {
      if (!expertGroqKey.trim()) {
        alert(language === 'de' ? 'Bitte gib deinen Groq API Key ein!' : 'Please enter your Groq API Key!');
        return;
      }
    } else {
      if (!apiKey.trim()) {
        alert(t.apiKeyRequired);
        return;
      }
      if (!model.trim()) {
        alert(t.modelRequired);
        return;
      }
    }
    
    if (needsMoreCategories) {
      alert(t.notEnoughCategories);
      return;
    }
    
    onStart({
      numCategories,
      questionsPerCategory,
      apiKey: apiProvider === 'expert' ? expertGroqKey.trim() : apiKey.trim(),
      model: apiProvider === 'expert' ? `${expertResearchModel} + ${expertGenerationModel}` : model.trim(),
      apiProvider,
      language,
      selectedCategories: selectedCategories.slice(0, numCategories),
      customCategories,
      difficulty,
      expertMode: apiProvider === 'expert' ? {
        researchApiKey: expertGroqKey.trim(),
        generationApiKey: expertGroqKey.trim(),
        researchModel: expertResearchModel,
        generationModel: expertGenerationModel,
      } : undefined
    });
  };

  const totalQuestions = numCategories * questionsPerCategory;

  const providerTabs: ApiProvider[] = [
    'openrouter',
    'groq',
    'nvidia',
    'openai',
    'anthropic',
    'google',
    'expert',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 relative">
        <div className="text-center mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
            >
              ← {language === 'de' ? 'Zurück' : 'Back'}
            </button>
          )}
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-purple-200">{t.subtitle}</p>
        </div>

        <div className="space-y-6">
          {/* Sprachauswahl */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleLanguageChange('de')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                language === 'de'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              🇩🇪 Deutsch
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                language === 'en'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* API Provider Tabs */}
          <div>
            <label className="text-white font-medium block mb-3">{t.apiProvider}</label>
            <div className="flex flex-wrap gap-2">
              {providerTabs.map((providerId) => (
                <button
                  key={providerId}
                  onClick={() => handleProviderChange(providerId)}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
                    apiProvider === providerId
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-2 ring-purple-300'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  <ProviderIcon 
                    provider={providerId} 
                    size={28} 
                    className={apiProvider === providerId ? 'text-white' : 'text-purple-200'}
                  />
                  <span className="text-xs">{API_PROVIDERS[providerId].name}</span>
                </button>
              ))}
            </div>
            <p className="text-purple-300/70 text-xs mt-2 text-center">
              💡 {t.providerNote}
            </p>
          </div>

          {/* API Key Input - Normal Mode */}
          {apiProvider !== 'expert' ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">
                    {currentProvider.name} {t.apiKey}
                  </label>
                  <button
                    onClick={() => setShowApiInfo(!showApiInfo)}
                    className="text-purple-300 hover:text-white text-sm underline"
                  >
                    {t.apiKeyHelp}
                  </button>
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder={`${currentProvider.keyPrefix}...`}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {showApiInfo && (
                  <div className="mt-2 p-3 bg-purple-800/50 rounded-lg text-sm text-purple-200">
                    <p>{t.apiKeyInfo1} <a href={currentProvider.docsUrl} target="_blank" rel="noopener noreferrer" className="underline text-white">{currentProvider.docsUrl}</a></p>
                    <p>{t.apiKeyInfo2}</p>
                    <p>{t.apiKeyInfo3}</p>
                  </div>
                )}
              </div>

              {/* Model Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">{t.model}</label>
                  <button
                    onClick={() => setShowModelInfo(!showModelInfo)}
                    className="text-purple-300 hover:text-white text-sm underline"
                  >
                    {t.modelHelp}
                  </button>
                </div>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  placeholder={currentProvider.defaultModel}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm"
                />
                {showModelInfo && (
                  <div className="mt-2 p-3 bg-purple-800/50 rounded-lg text-sm text-purple-200">
                    <p className="font-bold mb-2">{t.modelInfo}</p>
                    <ul className="space-y-1 font-mono text-xs">
                      {currentProvider.models.map((m) => (
                        <li 
                          key={m.id}
                          className="cursor-pointer hover:text-white flex items-center gap-2"
                          onClick={() => handleModelChange(m.id)}
                        >
                          • {m.id}
                          {m.free && (
                            <span className="px-1.5 py-0.5 bg-green-500/30 text-green-300 text-[10px] rounded">
                              {t.free}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-purple-300">{t.modelTip}</p>
                    <p className="mt-1">
                      <a href={currentProvider.docsUrl} target="_blank" rel="noopener noreferrer" className="underline text-white">
                        {t.allModels}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Expert Mode UI */
            <div className="space-y-4">
              {/* Expert Mode Info Box */}
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ProviderIcon provider="expert" size={28} className="text-amber-400" />
                  <h3 className="text-white font-bold">{t.expertMode}</h3>
                  <span className="px-2 py-0.5 bg-green-500/30 text-green-300 text-xs rounded-full">
                    100% {t.free}
                  </span>
                </div>
                <p className="text-amber-200 text-sm mb-3">{t.expertModeDesc}</p>
                
                <button
                  onClick={() => setShowApiInfo(!showApiInfo)}
                  className="text-amber-300 hover:text-white text-sm underline"
                >
                  {t.expertHowItWorks}
                </button>
                
                {showApiInfo && (
                  <div className="mt-3 pt-3 border-t border-amber-400/30 space-y-2 text-sm">
                    <p className="text-amber-200">🔍 {t.expertStep1}</p>
                    <p className="text-amber-200">🧠 {t.expertStep2}</p>
                    <p className="text-amber-200">💭 {t.expertStep3}</p>
                    <p className="text-green-300 font-medium mt-2">{t.expertBenefit}</p>
                  </div>
                )}
              </div>

              {/* Groq API Key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <ProviderIcon provider="groq" size={20} className="text-yellow-400" /> {t.expertResearchKey}
                  </label>
                </div>
                <input
                  type="password"
                  value={expertGroqKey}
                  onChange={(e) => {
                    setExpertGroqKey(e.target.value);
                    localStorage.setItem(STORAGE_KEYS.expertGroqKey, e.target.value);
                  }}
                  placeholder="gsk_..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <p className="text-purple-300/70 text-xs mt-1">
                  → <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">console.groq.com/keys</a> (kostenlos)
                </p>
              </div>

              {/* Research Model Selection */}
              <div>
                <label className="text-white font-medium block mb-2">
                  🔍 {t.expertResearchModel}
                </label>
                <select
                  value={expertResearchModel}
                  onChange={(e) => {
                    setExpertResearchModel(e.target.value);
                    localStorage.setItem('pubquiz_expert_research_model', e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="llama-3.3-70b-versatile" className="bg-gray-800">⭐ Llama 3.3 70B Versatile (empfohlen)</option>
                  <option value="llama-3.1-70b-versatile" className="bg-gray-800">Llama 3.1 70B Versatile</option>
                  <option value="llama3-70b-8192" className="bg-gray-800">Llama 3 70B</option>
                  <option value="mixtral-8x7b-32768" className="bg-gray-800">Mixtral 8x7B (schneller)</option>
                  <option value="gemma2-9b-it" className="bg-gray-800">Gemma 2 9B</option>
                </select>
                <p className="text-purple-300/60 text-xs mt-1">Sammelt und verifiziert Fakten zum Thema</p>
              </div>

              {/* Generation Model Selection */}
              <div>
                <label className="text-white font-medium block mb-2">
                  🧠 {t.expertGenerationModel}
                </label>
                <select
                  value={expertGenerationModel}
                  onChange={(e) => {
                    setExpertGenerationModel(e.target.value);
                    localStorage.setItem('pubquiz_expert_generation_model', e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="llama-3.3-70b-versatile" className="bg-gray-800">⭐ Llama 3.3 70B Versatile (empfohlen)</option>
                  <option value="llama-3.1-70b-versatile" className="bg-gray-800">Llama 3.1 70B Versatile</option>
                  <option value="llama3-70b-8192" className="bg-gray-800">Llama 3 70B</option>
                  <option value="mixtral-8x7b-32768" className="bg-gray-800">Mixtral 8x7B (schneller)</option>
                </select>
                <p className="text-purple-300/60 text-xs mt-1">Erstellt Quiz-Fragen mit Chain-of-Thought</p>
              </div>
            </div>
          )}

          {/* Kategorien Slider */}
          <div>
            <label className="text-white font-medium block mb-2">
              {t.numCategories}: <span className="text-purple-300 font-bold">{numCategories}</span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={numCategories}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setNumCategories(value);
                localStorage.setItem(STORAGE_KEYS.numCategories, value.toString());
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-purple-300 text-xs mt-1">
              <span>1</span>
              <span>6</span>
            </div>
          </div>

          {/* Kategorien Auswahl */}
          <div>
            <label className="text-white font-medium block mb-3">
              {t.selectCategories}: <span className={`font-bold ${needsMoreCategories ? 'text-yellow-400' : 'text-green-400'}`}>
                {totalSelected}/{numCategories} {t.selectedCount}
              </span>
            </label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {allCategories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const isCustom = customCategories.includes(category);
                return (
                  <div key={category} className="relative">
                    <button
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? isCustom 
                            ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                            : 'bg-green-500 text-white ring-2 ring-green-300'
                          : 'bg-white/10 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      {isSelected && '✓ '}{category}
                    </button>
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomCategory(category);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Eigene Kategorie hinzufügen */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomCategory}
                onChange={(e) => setNewCustomCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                placeholder={t.addCustomCategory}
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              <button
                onClick={addCustomCategory}
                disabled={!newCustomCategory.trim()}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
              >
                ➕ {t.add}
              </button>
            </div>

            {needsMoreCategories && (
              <p className="text-yellow-400 text-sm mt-2">
                ⚠️ {t.needMore} {numCategories} {t.categories}
              </p>
            )}
          </div>

          {/* Fragen pro Kategorie Slider */}
          <div>
            <label className="text-white font-medium block mb-2">
              {t.questionsPerCategory}: <span className="text-purple-300 font-bold">{questionsPerCategory}</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={questionsPerCategory}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuestionsPerCategory(value);
                localStorage.setItem(STORAGE_KEYS.questionsPerCategory, value.toString());
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-purple-300 text-xs mt-1">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          {/* Schwierigkeitsgrad */}
          <div>
            <label className="text-white font-medium block mb-3">{t.difficulty}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'easy' as Difficulty, label: t.difficultyEasy, desc: t.difficultyEasyDesc, icon: '🟢', color: 'green' },
                { value: 'medium' as Difficulty, label: t.difficultyMedium, desc: t.difficultyMediumDesc, icon: '🟡', color: 'yellow' },
                { value: 'hard' as Difficulty, label: t.difficultyHard, desc: t.difficultyHardDesc, icon: '🔴', color: 'red' },
                { value: 'mixed' as Difficulty, label: t.difficultyMixed, desc: t.difficultyMixedDesc, icon: '🎲', color: 'purple' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDifficulty(option.value);
                    localStorage.setItem(STORAGE_KEYS.difficulty, option.value);
                  }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    difficulty === option.value
                      ? option.color === 'green' ? 'bg-green-500/20 border-green-500 ring-2 ring-green-400/50'
                      : option.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-400/50'
                      : option.color === 'red' ? 'bg-red-500/20 border-red-500 ring-2 ring-red-400/50'
                      : 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-400/50'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-bold text-white">{option.label}</span>
                  </div>
                  <p className="text-xs text-purple-300">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Zusammenfassung */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between text-purple-200">
              <span>{t.totalQuestions}:</span>
              <span className="font-bold text-white">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-purple-200 mt-2">
              <span>{t.estimatedTime}:</span>
              <span className="font-bold text-white">~{Math.ceil(totalQuestions * 1.5)} {t.minutes}</span>
            </div>
          </div>

          {/* Artikelhistorie */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">📚 {t.articleHistory}</span>
                <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs rounded-full">
                  {articleCount} {t.articleHistoryInfo}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-200 text-sm rounded-lg transition-colors"
                >
                  {showHistoryPanel ? t.hideHistory : t.showHistory}
                </button>
                {articleCount > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(t.clearHistoryConfirm)) {
                        clearUsedArticles();
                        setArticleCount(0);
                        alert(t.historyCleared);
                      }
                    }}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded-lg transition-colors"
                  >
                    🗑️ {t.clearHistory}
                  </button>
                )}
              </div>
            </div>
            
            {showHistoryPanel && (
              <div className="mt-3 pt-3 border-t border-white/10">
                {articleCount === 0 ? (
                  <p className="text-purple-300/70 text-sm text-center py-4">
                    {t.noHistory}
                  </p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {getUsedArticles().slice(-30).reverse().map((article, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                        <div className="flex-1 min-w-0">
                          <span className="text-white truncate block">{article.topic.replace(/_/g, ' ')}</span>
                          <span className="text-purple-400 text-xs">{article.category}</span>
                        </div>
                        <span className="text-purple-300/50 text-xs ml-2 shrink-0">
                          {new Date(article.usedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-purple-300/50 text-xs mt-3 text-center">
                  ℹ️ {t.historyNote}
                </p>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={needsMoreCategories}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all transform shadow-lg ${
              needsMoreCategories
                ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 hover:shadow-purple-500/50'
            }`}
          >
            {t.startQuiz}
          </button>
        </div>

        <p className="text-center text-purple-300/70 text-sm mt-6">
          {t.footer}
        </p>
      </div>
    </div>
  );
}
