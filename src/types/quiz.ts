export interface QuizConfig {
  numCategories: number;
  questionsPerCategory: number;
  apiKey: string;
  model: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  wikipediaSource?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  lockedAt: Date;
}

export interface QuizSession {
  id: string;
  config: QuizConfig;
  questions: Question[];
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  status: 'setup' | 'generating' | 'playing' | 'evaluating' | 'finished';
  startedAt?: Date;
  finishedAt?: Date;
}

export interface EvaluationResult {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  wikipediaUrl?: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  evaluations: EvaluationResult[];
}

export const CATEGORIES = [
  'Geschichte',
  'Geografie',
  'Wissenschaft',
  'Kunst & Kultur',
  'Sport',
  'Musik',
  'Film & Fernsehen',
  'Literatur',
  'Natur & Tiere',
  'Technologie',
  'Politik',
  'Essen & Trinken'
];
