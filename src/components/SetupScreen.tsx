import { useState, useEffect } from 'react';
import { QuizConfig, Language, Difficulty, CATEGORIES_DE, CATEGORIES_EN } from '../types/quiz';
import { getArticleCount, clearUsedArticles, getUsedArticles } from '../services/articleHistory';

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
  onBack?: () => void;
}

const DEFAULT_MODEL = 'tngtech/deepseek-r1t2-chimera:free';

const STORAGE_KEYS = {
  apiKey: 'pubquiz_api_key',
  model: 'pubquiz_model',
  language: 'pubquiz_language',
  selectedCategories: 'pubquiz_selected_categories',
  customCategories: 'pubquiz_custom_categories',
  numCategories: 'pubquiz_num_categories',
  questionsPerCategory: 'pubquiz_questions_per_category',
  difficulty: 'pubquiz_difficulty'
};

const TRANSLATIONS = {
  de: {
    title: 'PubQuiz Master',
    subtitle: 'Dein KI-gestütztes Quiz-Erlebnis',
    language: 'Sprache',
    apiKey: 'OpenRouter API Key',
    apiKeyHelp: 'Wo bekomme ich einen Key?',
    apiKeyInfo1: '1. Gehe zu',
    apiKeyInfo2: '2. Erstelle einen kostenlosen Account',
    apiKeyInfo3: '3. Generiere einen API Key unter "Keys"',
    model: 'KI-Modell',
    modelHelp: 'Welche Modelle gibt es?',
    modelInfo: 'Kostenlose Modelle (empfohlen):',
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
    apiKeyRequired: 'Bitte gib deinen OpenRouter API Key ein!',
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
    historyNote: 'Eigene Kategorien werden nicht getrackt, um Wiederholungen zu ermöglichen.'
  },
  en: {
    title: 'PubQuiz Master',
    subtitle: 'Your AI-powered quiz experience',
    language: 'Language',
    apiKey: 'OpenRouter API Key',
    apiKeyHelp: 'Where do I get a key?',
    apiKeyInfo1: '1. Go to',
    apiKeyInfo2: '2. Create a free account',
    apiKeyInfo3: '3. Generate an API key under "Keys"',
    model: 'AI Model',
    modelHelp: 'Which models are available?',
    modelInfo: 'Free models (recommended):',
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
    apiKeyRequired: 'Please enter your OpenRouter API Key!',
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
    historyNote: 'Custom categories are not tracked to allow repeated use.'
  }
};

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [language, setLanguage] = useState<Language>('de');
  const [numCategories, setNumCategories] = useState(3);
  const [questionsPerCategory, setQuestionsPerCategory] = useState(3);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [articleCount, setArticleCount] = useState(0);

  const t = TRANSLATIONS[language];
  const categories = language === 'de' ? CATEGORIES_DE : CATEGORIES_EN;

  // Lade Artikelanzahl
  useEffect(() => {
    setArticleCount(getArticleCount());
  }, []);

  // Lade gespeicherte Werte beim Start
  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    const savedModel = localStorage.getItem(STORAGE_KEYS.model);
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language) as Language;
    const savedSelectedCategories = localStorage.getItem(STORAGE_KEYS.selectedCategories);
    const savedCustomCategories = localStorage.getItem(STORAGE_KEYS.customCategories);
    const savedNumCategories = localStorage.getItem(STORAGE_KEYS.numCategories);
    const savedQuestionsPerCategory = localStorage.getItem(STORAGE_KEYS.questionsPerCategory);

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedNumCategories) setNumCategories(parseInt(savedNumCategories));
    if (savedQuestionsPerCategory) setQuestionsPerCategory(parseInt(savedQuestionsPerCategory));
    
    const savedDifficulty = localStorage.getItem(STORAGE_KEYS.difficulty) as Difficulty;
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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
    // Reset selected categories when language changes
    setSelectedCategories([]);
    localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify([]));
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEYS.apiKey, value.trim());
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
      
      // Auto-select the new category
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
    
    // Also remove from selected
    const newSelected = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newSelected);
    localStorage.setItem(STORAGE_KEYS.selectedCategories, JSON.stringify(newSelected));
  };

  const allCategories = [...categories, ...customCategories];
  const totalSelected = selectedCategories.length;
  const needsMoreCategories = totalSelected < numCategories;

  const handleStart = () => {
    if (!apiKey.trim()) {
      alert(t.apiKeyRequired);
      return;
    }
    if (!model.trim()) {
      alert(t.modelRequired);
      return;
    }
    if (needsMoreCategories) {
      alert(t.notEnoughCategories);
      return;
    }
    onStart({
      numCategories,
      questionsPerCategory,
      apiKey: apiKey.trim(),
      model: model.trim(),
      language,
      selectedCategories: selectedCategories.slice(0, numCategories),
      customCategories,
      difficulty
    });
  };

  const totalQuestions = numCategories * questionsPerCategory;

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

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white font-medium">{t.apiKey}</label>
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
              placeholder="sk-or-..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {showApiInfo && (
              <div className="mt-2 p-3 bg-purple-800/50 rounded-lg text-sm text-purple-200">
                <p>{t.apiKeyInfo1} <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline text-white">openrouter.ai</a></p>
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
              placeholder="z.B. tngtech/deepseek-r1t2-chimera:free"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm"
            />
            {showModelInfo && (
              <div className="mt-2 p-3 bg-purple-800/50 rounded-lg text-sm text-purple-200">
                <p className="font-bold mb-2">{t.modelInfo}</p>
                <ul className="space-y-1 font-mono text-xs">
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('tngtech/deepseek-r1t2-chimera:free')}>• tngtech/deepseek-r1t2-chimera:free ⭐</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('xiaomi/mimo-v2-flash:free')}>• xiaomi/mimo-v2-flash:free</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('google/gemma-2-9b-it:free')}>• google/gemma-2-9b-it:free</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('mistralai/mistral-7b-instruct:free')}>• mistralai/mistral-7b-instruct:free</li>
                </ul>
                <p className="mt-2 text-purple-300">{t.modelTip}</p>
                <p className="mt-1">
                  <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="underline text-white">
                    {t.allModels}
                  </a>
                </p>
              </div>
            )}
          </div>

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
