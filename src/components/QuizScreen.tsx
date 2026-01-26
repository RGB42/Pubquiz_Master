import { useState } from 'react';
import { Question, UserAnswer } from '../types/quiz';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  onAnswer: (answer: string) => void;
  onFinish: (lastAnswer?: string) => void;
}

export function QuizScreen({ 
  questions, 
  currentIndex, 
  userAnswers, 
  onAnswer, 
  onFinish 
}: QuizScreenProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleLockAnswer = () => {
    if (!currentAnswer.trim()) {
      if (!confirm('Möchtest du wirklich ohne Antwort fortfahren?')) {
        return;
      }
    }
    onAnswer(currentAnswer.trim());
    setCurrentAnswer('');
  };

  const handleFinish = () => {
    if (!currentAnswer.trim()) {
      if (!confirm('Möchtest du wirklich ohne Antwort abschließen?')) {
        return;
      }
    }
    // Letzte Antwort direkt an onFinish übergeben
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
      case 'easy': return 'Leicht';
      case 'medium': return 'Mittel';
      case 'hard': return 'Schwer';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <span className="text-purple-300">Frage</span>{' '}
            <span className="text-2xl font-bold">{currentIndex + 1}</span>
            <span className="text-purple-300"> von {questions.length}</span>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
          >
            📜 Historie {userAnswers.length > 0 && `(${userAnswers.length})`}
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
                  📚 Wikipedia verifiziert
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
                placeholder="Deine Antwort eingeben..."
                className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none transition-colors"
                autoFocus
              />

              <div className="flex gap-3">
                {isLastQuestion ? (
                  <button
                    onClick={handleFinish}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    ✅ Antwort abgeben & Quiz beenden
                  </button>
                ) : (
                  <button
                    onClick={handleLockAnswer}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    🔒 Antwort einlocken & Weiter
                  </button>
                )}
              </div>

              <p className="text-center text-purple-300/60 text-sm">
                Nach dem Einlocken kann die Antwort nicht mehr geändert werden!
              </p>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-white/10 backdrop-blur-lg rounded-3xl p-4 border border-white/20 shadow-xl max-h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4 sticky top-0 bg-white/10 -mx-4 px-4 py-2 -mt-4 backdrop-blur-lg">
              📜 Deine Antworten
            </h3>
            
            {userAnswers.length === 0 ? (
              <p className="text-purple-300/70 text-sm text-center py-8">
                Noch keine Antworten abgegeben
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
                            ➤ {answer.answer || '(keine Antwort)'}
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
