import { QuizResult, EvaluationResult } from '../types/quiz';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  
  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🥇';
    if (percentage >= 50) return '🥈';
    if (percentage >= 30) return '🥉';
    return '💪';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Unglaublich! Du bist ein Quiz-Champion!';
    if (percentage >= 70) return 'Großartig! Sehr beeindruckend!';
    if (percentage >= 50) return 'Gut gemacht! Über der Hälfte richtig!';
    if (percentage >= 30) return 'Nicht schlecht! Übung macht den Meister!';
    return 'Weiter so! Jedes Quiz macht dich besser!';
  };

  const getGradeColor = () => {
    if (percentage >= 70) return 'from-green-400 to-emerald-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Score Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl text-center mb-8">
          <div className="text-7xl mb-4">{getScoreEmoji()}</div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Quiz beendet!</h1>
          <p className="text-purple-200 mb-6">{getScoreMessage()}</p>
          
          {/* Score Circle */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.83} 283`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold bg-gradient-to-r ${getGradeColor()} bg-clip-text text-transparent`}>
                {percentage}%
              </span>
              <span className="text-purple-300 text-sm">
                {result.correctAnswers} / {result.totalQuestions}
              </span>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 Neues Quiz starten
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">📊 Detaillierte Auswertung</h2>
          
          <div className="space-y-4">
            {result.evaluations.map((evaluation, index) => (
              <EvaluationCard key={evaluation.questionId} evaluation={evaluation} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation, index }: { evaluation: EvaluationResult; index: number }) {
  return (
    <div className={`rounded-xl p-4 border ${
      evaluation.isCorrect 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-red-500/10 border-red-500/30'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          evaluation.isCorrect 
            ? 'bg-green-500/30 text-green-300' 
            : 'bg-red-500/30 text-red-300'
        }`}>
          {evaluation.isCorrect ? '✓' : '✗'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-300 text-sm">Frage {index + 1}</span>
          </div>
          
          <p className="text-white font-medium mb-3">{evaluation.question}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-purple-300 shrink-0">Deine Antwort:</span>
              <span className={evaluation.isCorrect ? 'text-green-300' : 'text-red-300'}>
                {evaluation.userAnswer || '(keine Antwort)'}
              </span>
            </div>
            
            {!evaluation.isCorrect && (
              <div className="flex items-start gap-2">
                <span className="text-purple-300 shrink-0">Richtige Antwort:</span>
                <span className="text-green-300">{evaluation.correctAnswer}</span>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-purple-200 italic">{evaluation.explanation}</p>
            </div>
            
            {/* Wikipedia Link zur Verifizierung */}
            {evaluation.wikipediaUrl && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <a
                  href={evaluation.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>Auf Wikipedia verifizieren</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
