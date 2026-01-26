import { useState, useCallback } from 'react';
import { QuizConfig, Question, UserAnswer, QuizResult, Language } from './types/quiz';
import { generateQuestions, evaluateAnswers } from './services/api';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';

type AppState = 'setup' | 'generating' | 'playing' | 'evaluating' | 'finished' | 'error';

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

export function App() {
  const [state, setState] = useState<AppState>('setup');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<Language>('de');

  const t = MESSAGES[language];

  const handleStart = useCallback(async (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    setLanguage(quizConfig.language);
    setState('generating');
    setError('');

    try {
      const generatedQuestions = await generateQuestions(
        quizConfig.apiKey,
        quizConfig.model,
        quizConfig.selectedCategories,
        quizConfig.questionsPerCategory,
        quizConfig.language
      );

      if (generatedQuestions.length === 0) {
        throw new Error(MESSAGES[quizConfig.language].noQuestions);
      }

      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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

  const handleUpdateResult = useCallback((updatedResult: QuizResult) => {
    setResult(updatedResult);
  }, []);

  switch (state) {
    case 'setup':
      return <SetupScreen onStart={handleStart} />;

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
              
              evaluateAnswers(config.apiKey, config.model, questions, finalAnswers, config.language)
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
                  setError(err instanceof Error ? err.message : t.evaluationError);
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
          onRetry={handleRetry}
          onBack={handleRestart}
          language={language}
        />
      );

    default:
      return null;
  }
}
