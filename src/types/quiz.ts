export type Language = 'de' | 'en';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface QuizConfig {
  numCategories: number;
  questionsPerCategory: number;
  apiKey: string;
  model: string;
  language: Language;
  selectedCategories: string[];
  customCategories: string[];
  difficulty: Difficulty;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  wikipediaSource?: string;
  sourceType?: 'wikipedia' | 'fandom' | 'other'; // Art der Quelle
  sourceName?: string; // Name des Wikis (z.B. "Pokewiki", "Wikipedia")
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
  sourceName?: string; // Name der Quelle (Wikipedia, Pokewiki, etc.)
  manualOverride?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  evaluations: EvaluationResult[];
}

// Für Debug-Informationen bei API-Fehlern
export interface ApiErrorDetails {
  message: string;
  rawResponse?: string;
  timestamp: string;
}

export const CATEGORIES_DE = [
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

export const CATEGORIES_EN = [
  'History',
  'Geography',
  'Science',
  'Art & Culture',
  'Sports',
  'Music',
  'Film & Television',
  'Literature',
  'Nature & Animals',
  'Technology',
  'Politics',
  'Food & Drinks'
];
