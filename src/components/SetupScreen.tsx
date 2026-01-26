import { useState, useEffect } from 'react';
import { QuizConfig } from '../types/quiz';

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
}

const DEFAULT_MODEL = 'tngtech/deepseek-r1t2-chimera:free';
const STORAGE_KEY_API = 'pubquiz_api_key';
const STORAGE_KEY_MODEL = 'pubquiz_model';

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [numCategories, setNumCategories] = useState(3);
  const [questionsPerCategory, setQuestionsPerCategory] = useState(3);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);

  // Lade gespeicherte Werte beim Start
  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEY_API);
    const savedModel = localStorage.getItem(STORAGE_KEY_MODEL);
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  // Speichere API-Key wenn er sich ändert
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEY_API, value.trim());
    }
  };

  // Speichere Modell wenn es sich ändert
  const handleModelChange = (value: string) => {
    setModel(value);
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEY_MODEL, value.trim());
    }
  };

  const handleStart = () => {
    if (!apiKey.trim()) {
      alert('Bitte gib deinen OpenRouter API Key ein!');
      return;
    }
    if (!model.trim()) {
      alert('Bitte gib ein Modell ein!');
      return;
    }
    onStart({ numCategories, questionsPerCategory, apiKey: apiKey.trim(), model: model.trim() });
  };

  const totalQuestions = numCategories * questionsPerCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-2">PubQuiz Master</h1>
          <p className="text-purple-200">Dein KI-gestütztes Quiz-Erlebnis</p>
        </div>

        <div className="space-y-6">
          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white font-medium">OpenRouter API Key</label>
              <button
                onClick={() => setShowApiInfo(!showApiInfo)}
                className="text-purple-300 hover:text-white text-sm underline"
              >
                Wo bekomme ich einen Key?
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
                <p>1. Gehe zu <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline text-white">openrouter.ai</a></p>
                <p>2. Erstelle einen kostenlosen Account</p>
                <p>3. Generiere einen API Key unter "Keys"</p>
              </div>
            )}
          </div>

          {/* Model Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white font-medium">KI-Modell</label>
              <button
                onClick={() => setShowModelInfo(!showModelInfo)}
                className="text-purple-300 hover:text-white text-sm underline"
              >
                Welche Modelle gibt es?
              </button>
            </div>
            <input
              type="text"
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              placeholder="z.B. xiaomi/mimo-v2-flash:free"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm"
            />
            {showModelInfo && (
              <div className="mt-2 p-3 bg-purple-800/50 rounded-lg text-sm text-purple-200">
                <p className="font-bold mb-2">Kostenlose Modelle (empfohlen):</p>
                <ul className="space-y-1 font-mono text-xs">
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('tngtech/deepseek-r1t2-chimera:free')}>• tngtech/deepseek-r1t2-chimera:free ⭐</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('xiaomi/mimo-v2-flash:free')}>• xiaomi/mimo-v2-flash:free</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('google/gemma-2-9b-it:free')}>• google/gemma-2-9b-it:free</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('mistralai/mistral-7b-instruct:free')}>• mistralai/mistral-7b-instruct:free</li>
                  <li className="cursor-pointer hover:text-white" onClick={() => handleModelChange('meta-llama/llama-3.2-3b-instruct:free')}>• meta-llama/llama-3.2-3b-instruct:free</li>
                </ul>
                <p className="mt-2 text-purple-300">💡 Klicke auf ein Modell um es auszuwählen</p>
                <p className="mt-1">
                  <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="underline text-white">
                    Alle Modelle ansehen →
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Kategorien Slider */}
          <div>
            <label className="text-white font-medium block mb-2">
              Anzahl Kategorien: <span className="text-purple-300 font-bold">{numCategories}</span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={numCategories}
              onChange={(e) => setNumCategories(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-purple-300 text-xs mt-1">
              <span>1</span>
              <span>6</span>
            </div>
          </div>

          {/* Fragen pro Kategorie Slider */}
          <div>
            <label className="text-white font-medium block mb-2">
              Fragen pro Kategorie: <span className="text-purple-300 font-bold">{questionsPerCategory}</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={questionsPerCategory}
              onChange={(e) => setQuestionsPerCategory(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-purple-300 text-xs mt-1">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          {/* Zusammenfassung */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between text-purple-200">
              <span>Gesamte Fragen:</span>
              <span className="font-bold text-white">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-purple-200 mt-2">
              <span>Geschätzte Dauer:</span>
              <span className="font-bold text-white">~{Math.ceil(totalQuestions * 1.5)} Minuten</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            🚀 Quiz starten!
          </button>
        </div>

        <p className="text-center text-purple-300/70 text-sm mt-6">
          Fragen werden durch KI generiert und mit Wikipedia verifiziert
        </p>
      </div>
    </div>
  );
}
