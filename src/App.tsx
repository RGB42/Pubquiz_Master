import { useState, useCallback } from 'react';
import { QuizConfig, Question, UserAnswer, QuizResult } from './types/quiz';
import { generateQuestions, evaluateAnswers } from './services/api';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';

type AppState = 'setup' | 'generating' | 'playing' | 'evaluating' | 'finished' | 'error';

export function App() {
  const [state, setState] = useState<AppState>('setup');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleStart = useCallback(async (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    setState('generating');
    setError('');

    try {
      const generatedQuestions = await generateQuestions(
        quizConfig.apiKey,
        quizConfig.model,
        quizConfig.numCategories,
        quizConfig.questionsPerCategory
      );

      if (generatedQuestions.length === 0) {
        throw new Error('Keine Fragen konnten generiert werden');
      }

      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
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
  }, []);

  const handleRetry = useCallback(() => {
    if (config) {
      handleStart(config);
    } else {
      handleRestart();
    }
  }, [config, handleStart, handleRestart]);

  switch (state) {
    case 'setup':
      return <SetupScreen onStart={handleStart} />;

    case 'generating':
      return (
        <LoadingScreen
          message="Fragen werden generiert..."
          subMessage="Die KI erstellt einzigartige Quizfragen für dich"
        />
      );

    case 'playing':
      return (
        <QuizScreen
          questions={questions}
          currentIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswer={handleAnswer}
          onFinish={(lastAnswer?: string) => {
            // Die letzte Antwort wird direkt übergeben
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
              
              evaluateAnswers(config.apiKey, config.model, questions, finalAnswers)
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
                  setError(err instanceof Error ? err.message : 'Fehler bei der Auswertung');
                  setState('error');
                });
            }
          }}
        />
      );

    case 'evaluating':
      return (
        <LoadingScreen
          message="Antworten werden ausgewertet..."
          subMessage="Die KI prüft deine Antworten"
        />
      );

    case 'finished':
      return result ? (
        <ResultsScreen result={result} onRestart={handleRestart} />
      ) : null;

    case 'error':
      return (
        <ErrorScreen
          error={error}
          onRetry={handleRetry}
          onBack={handleRestart}
        />
      );

    default:
      return null;
  }
}
