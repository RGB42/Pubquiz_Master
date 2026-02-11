import { useState } from 'react';
import { Question, UserAnswer, Language } from '../types/quiz';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  onAnswer: (answer: string) => void;
  onFinish: (lastAnswer?: string) => void;
  language: Language;
}

const TRANSLATIONS = {
  de: {
    question: 'Frage',
    of: 'von',
    history: 'Historie',
    yourAnswers: 'Deine Antworten',
    noAnswersYet: 'Noch keine Antworten abgegeben',
    noAnswer: '(keine Antwort)',
    enterAnswer: 'Deine Antwort eingeben...',
    lockAndContinue: '🔒 Antwort einlocken & Weiter',
    submitAndFinish: '✅ Antwort abgeben & Quiz beenden',
    cannotChange: 'Nach dem Einlocken kann die Antwort nicht mehr geändert werden!',
    confirmEmpty: 'Möchtest du wirklich ohne Antwort fortfahren?',
    confirmFinish: 'Möchtest du wirklich ohne Antwort abschließen?',
    wikipediaVerified: 'Wikipedia verifiziert',
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer'
  },
  en: {
    question: 'Question',
    of: 'of',
    history: 'History',
    yourAnswers: 'Your Answers',
    noAnswersYet: 'No answers submitted yet',
    noAnswer: '(no answer)',
    enterAnswer: 'Enter your answer...',
    lockAndContinue: '🔒 Lock Answer & Continue',
    submitAndFinish: '✅ Submit Answer & Finish Quiz',
    cannotChange: 'After locking, the answer cannot be changed!',
    confirmEmpty: 'Do you really want to continue without an answer?',
    confirmFinish: 'Do you really want to finish without an answer?',
    wikipediaVerified: 'Wikipedia verified',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  }
};

export function QuizScreen({ 
  questions, 
  currentIndex, 
  userAnswers, 
  onAnswer, 
  onFinish,
  language 
}: QuizScreenProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [imageError, setImageError] = useState<{[key: string]: string}>({});
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  
  const t = TRANSLATIONS[language];
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleLockAnswer = () => {
    if (!currentAnswer.trim()) {
      if (!confirm(t.confirmEmpty)) {
        return;
      }
    }
    onAnswer(currentAnswer.trim());
    setCurrentAnswer('');
  };

  const handleFinish = () => {
    if (!currentAnswer.trim()) {
      if (!confirm(t.confirmFinish)) {
        return;
      }
    }
    onFinish(currentAnswer.trim());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t.easy;
      case 'medium': return t.medium;
      case 'hard': return t.hard;
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <span className="text-purple-300">{t.question}</span>{' '}
            <span className="text-2xl font-bold">{currentIndex + 1}</span>
            <span className="text-purple-300"> {t.of} {questions.length}</span>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
          >
            📜 {t.history} {userAnswers.length > 0 && `(${userAnswers.length})`}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Main Question Area */}
        <div className={`flex-1 transition-all ${showHistory ? 'w-2/3' : 'w-full'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            {/* Category & Difficulty */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium">
                {currentQuestion.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {getDifficultyLabel(currentQuestion.difficulty)}
              </span>
            </div>

            {/* Image for image questions */}
            {currentQuestion.questionType === 'image' && (
              <div className="mb-6 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                {!currentQuestion.imageUrl ? (
                  <div className="p-6 text-center">
                    <div className="text-red-400 text-4xl mb-2">🖼️❌</div>
                    <p className="text-red-300 font-medium">
                      {language === 'de' ? 'Kein Bild verfügbar' : 'No image available'}
                    </p>
                    <p className="text-red-300/70 text-sm mt-1">
                      {language === 'de' 
                        ? 'Die KI hat kein Bild-URL angegeben' 
                        : 'The AI did not provide an image URL'}
                    </p>
                  </div>
                ) : imageError[currentQuestion.id] ? (
                  <div className="p-6 text-center">
                    <div className="text-red-400 text-4xl mb-2">⚠️</div>
                    <p className="text-red-300 font-medium">
                      {language === 'de' ? 'Bild konnte nicht geladen werden' : 'Image could not be loaded'}
                    </p>
                    <p className="text-red-300/70 text-sm mt-1 break-all">
                      {imageError[currentQuestion.id]}
                    </p>
                    <div className="mt-3 p-2 bg-black/30 rounded-lg">
                      <p className="text-white/50 text-xs break-all">
                        URL: {currentQuestion.imageUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {imageLoading[currentQuestion.id] && (
                      <div className="p-6 text-center">
                        <div className="text-purple-400 text-4xl mb-2 animate-pulse">🖼️</div>
                        <p className="text-purple-300">
                          {language === 'de' ? 'Bild wird geladen...' : 'Loading image...'}
                        </p>
                      </div>
                    )}
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt={currentQuestion.imageAlt || 'Quiz image'} 
                      className={`w-full max-h-80 object-contain mx-auto ${imageLoading[currentQuestion.id] ? 'hidden' : ''}`}
                      onLoad={() => {
                        setImageLoading(prev => ({...prev, [currentQuestion.id]: false}));
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        setImageLoading(prev => ({...prev, [currentQuestion.id]: false}));
                        setImageError(prev => ({
                          ...prev, 
                          [currentQuestion.id]: `HTTP ${img.naturalWidth === 0 ? 'Fehler' : 'OK'} - ${language === 'de' ? 'Bild konnte nicht geladen werden' : 'Image failed to load'}`
                        }));
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Question */}
            <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Wikipedia Source Badge */}
            {currentQuestion.wikipediaSource && (
              <div className="mb-4">
                <a
                  href={currentQuestion.wikipediaSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-full text-xs transition-colors"
                >
                  📚 {t.wikipediaVerified}
                </a>
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-4">
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentAnswer.trim()) {
                    if (isLastQuestion) handleFinish();
                    else handleLockAnswer();
                  }
                }}
                placeholder={t.enterAnswer}
                className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none transition-colors"
                autoFocus
              />

              <div className="flex gap-3">
                {isLastQuestion ? (
                  <button
                    onClick={handleFinish}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t.submitAndFinish}
                  </button>
                ) : (
                  <button
                    onClick={handleLockAnswer}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t.lockAndContinue}
                  </button>
                )}
              </div>

              <p className="text-center text-purple-300/60 text-sm">
                {t.cannotChange}
              </p>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-white/10 backdrop-blur-lg rounded-3xl p-4 border border-white/20 shadow-xl max-h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4 sticky top-0 bg-white/10 -mx-4 px-4 py-2 -mt-4 backdrop-blur-lg">
              📜 {t.yourAnswers}
            </h3>
            
            {userAnswers.length === 0 ? (
              <p className="text-purple-300/70 text-sm text-center py-8">
                {t.noAnswersYet}
              </p>
            ) : (
              <div className="space-y-3">
                {userAnswers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div 
                      key={answer.questionId}
                      className="bg-white/5 rounded-xl p-3 border border-white/10"
                    >
                      <div className="flex items-start gap-2">
                        <span className="bg-purple-500/30 text-purple-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm line-clamp-2 mb-1">
                            {question?.question}
                          </p>
                          <p className="text-purple-300 text-sm font-medium truncate">
                            ➤ {answer.answer || t.noAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
