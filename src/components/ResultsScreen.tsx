import { useState } from 'react';
import { QuizResult, EvaluationResult, Language } from '../types/quiz';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
  language: Language;
  onUpdateResult: (result: QuizResult) => void;
}

const TRANSLATIONS = {
  de: {
    quizFinished: 'Quiz beendet!',
    newQuiz: '🔄 Neues Quiz starten',
    detailedResults: '📊 Detaillierte Auswertung',
    question: 'Frage',
    yourAnswer: 'Deine Antwort',
    correctAnswer: 'Richtige Antwort',
    noAnswer: '(keine Antwort)',
    verifyWikipedia: 'Quelle verifizieren',
    edit: 'Bearbeiten',
    save: 'Speichern',
    cancel: 'Abbrechen',
    markCorrect: 'Als richtig markieren',
    markWrong: 'Als falsch markieren',
    manuallyEdited: 'Manuell korrigiert',
    explanation: 'Erklärung',
    score90: 'Unglaublich! Du bist ein Quiz-Champion!',
    score70: 'Großartig! Sehr beeindruckend!',
    score50: 'Gut gemacht! Über der Hälfte richtig!',
    score30: 'Nicht schlecht! Übung macht den Meister!',
    scoreDefault: 'Weiter so! Jedes Quiz macht dich besser!'
  },
  en: {
    quizFinished: 'Quiz Finished!',
    newQuiz: '🔄 Start New Quiz',
    detailedResults: '📊 Detailed Results',
    question: 'Question',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    noAnswer: '(no answer)',
    verifyWikipedia: 'Verify source',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    markCorrect: 'Mark as correct',
    markWrong: 'Mark as wrong',
    manuallyEdited: 'Manually edited',
    explanation: 'Explanation',
    score90: 'Incredible! You are a Quiz Champion!',
    score70: 'Great! Very impressive!',
    score50: 'Well done! More than half correct!',
    score30: 'Not bad! Practice makes perfect!',
    scoreDefault: 'Keep going! Every quiz makes you better!'
  }
};

export function ResultsScreen({ result, onRestart, language, onUpdateResult }: ResultsScreenProps) {
  const t = TRANSLATIONS[language];
  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  
  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🥇';
    if (percentage >= 50) return '🥈';
    if (percentage >= 30) return '🥉';
    return '💪';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return t.score90;
    if (percentage >= 70) return t.score70;
    if (percentage >= 50) return t.score50;
    if (percentage >= 30) return t.score30;
    return t.scoreDefault;
  };

  const getGradeColor = () => {
    if (percentage >= 70) return 'from-green-400 to-emerald-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const handleUpdateEvaluation = (updatedEvaluation: EvaluationResult) => {
    const newEvaluations = result.evaluations.map(e => 
      e.questionId === updatedEvaluation.questionId ? updatedEvaluation : e
    );
    const correctCount = newEvaluations.filter(e => e.isCorrect).length;
    onUpdateResult({
      ...result,
      evaluations: newEvaluations,
      correctAnswers: correctCount,
      score: Math.round((correctCount / result.totalQuestions) * 100)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Score Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl text-center mb-8">
          <div className="text-7xl mb-4">{getScoreEmoji()}</div>
          
          <h1 className="text-3xl font-bold text-white mb-2">{t.quizFinished}</h1>
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
            {t.newQuiz}
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">{t.detailedResults}</h2>
          
          <div className="space-y-4">
            {result.evaluations.map((evaluation, index) => (
              <EvaluationCard 
                key={evaluation.questionId} 
                evaluation={evaluation} 
                index={index} 
                language={language}
                onUpdate={handleUpdateEvaluation}
              />
            ))}
          </div>
        </div>
        
        <p className="text-center text-purple-300/50 text-xs mt-6">
          v3.2.0
        </p>
      </div>
    </div>
  );
}

interface EvaluationCardProps {
  evaluation: EvaluationResult;
  index: number;
  language: Language;
  onUpdate: (evaluation: EvaluationResult) => void;
}

function EvaluationCard({ evaluation, index, language, onUpdate }: EvaluationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(evaluation.correctAnswer);
  const [editedExplanation, setEditedExplanation] = useState(evaluation.explanation);
  const [editedWikipediaUrl, setEditedWikipediaUrl] = useState(evaluation.wikipediaUrl || '');
  const [editedIsCorrect, setEditedIsCorrect] = useState(evaluation.isCorrect);

  const t = TRANSLATIONS[language];

  const handleSave = () => {
    onUpdate({
      ...evaluation,
      correctAnswer: editedCorrectAnswer,
      explanation: editedExplanation,
      wikipediaUrl: editedWikipediaUrl,
      isCorrect: editedIsCorrect,
      manualOverride: true
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCorrectAnswer(evaluation.correctAnswer);
    setEditedExplanation(evaluation.explanation);
    setEditedWikipediaUrl(evaluation.wikipediaUrl || '');
    setEditedIsCorrect(evaluation.isCorrect);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-xl p-4 border bg-blue-500/10 border-blue-500/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-sm">{t.question} {index + 1}</span>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
              >
                {t.save}
              </button>
            </div>
          </div>
          
          <p className="text-white font-medium">{evaluation.question}</p>
          
          <div>
            <label className="text-purple-300 text-sm block mb-1">{t.yourAnswer}:</label>
            <p className="text-white/70">{evaluation.userAnswer || t.noAnswer}</p>
          </div>
          
          <div>
            <label className="text-purple-300 text-sm block mb-1">{t.correctAnswer}:</label>
            <input
              type="text"
              value={editedCorrectAnswer}
              onChange={(e) => setEditedCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          
          <div>
            <label className="text-purple-300 text-sm block mb-1">{t.explanation}:</label>
            <textarea
              value={editedExplanation}
              onChange={(e) => setEditedExplanation(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          
          <div>
            <label className="text-purple-300 text-sm block mb-1">Wikipedia URL:</label>
            <input
              type="text"
              value={editedWikipediaUrl}
              onChange={(e) => setEditedWikipediaUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setEditedIsCorrect(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                editedIsCorrect 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✓ {t.markCorrect}
            </button>
            <button
              onClick={() => setEditedIsCorrect(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                !editedIsCorrect 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✗ {t.markWrong}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-purple-300 text-sm">{t.question} {index + 1}</span>
              {evaluation.manualOverride && (
                <span className="px-2 py-0.5 bg-blue-500/30 text-blue-300 text-xs rounded-full">
                  {t.manuallyEdited}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              ✏️ {t.edit}
            </button>
          </div>
          
          {/* Image if present */}
          {evaluation.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden bg-white/5">
              <img 
                src={evaluation.imageUrl} 
                alt="Quiz image" 
                className="w-full max-h-48 object-contain"
                loading="lazy"
              />
            </div>
          )}
          
          <p className="text-white font-medium mb-3">{evaluation.question}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-purple-300 shrink-0">{t.yourAnswer}:</span>
              <span className={evaluation.isCorrect ? 'text-green-300' : 'text-red-300'}>
                {evaluation.userAnswer || t.noAnswer}
              </span>
            </div>
            
            {!evaluation.isCorrect && (
              <div className="flex items-start gap-2">
                <span className="text-purple-300 shrink-0">{t.correctAnswer}:</span>
                <span className="text-green-300">
                  {evaluation.correctAnswer}
                  {evaluation.alternativeAnswers && evaluation.alternativeAnswers.length > 0 && (
                    <span className="text-purple-300 text-xs ml-2">
                      ({language === 'de' ? 'oder' : 'or'}: {evaluation.alternativeAnswers.join(', ')})
                    </span>
                  )}
                </span>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-purple-200 italic">{evaluation.explanation}</p>
            </div>
            
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
                  <span>{t.verifyWikipedia} ({evaluation.sourceName || 'Wikipedia'})</span>
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
