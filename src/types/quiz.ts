export type Language = 'de' | 'en';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type ApiProvider = 'openrouter' | 'groq' | 'nvidia' | 'openai' | 'anthropic' | 'google' | 'expert';

// Expertenmodus: Kombiniert zwei APIs
export interface ExpertModeConfig {
  researchApiKey: string; // Google Gemini für Recherche
  generationApiKey: string; // Groq für Quiz-Generierung
  researchModel: string;
  generationModel: string;
}

export interface ApiConfig {
  provider: ApiProvider;
  apiKey: string;
  model: string;
}

export interface QuizConfig {
  numCategories: number;
  questionsPerCategory: number;
  apiKey: string;
  model: string;
  apiProvider: ApiProvider;
  language: Language;
  selectedCategories: string[];
  customCategories: string[];
  difficulty: Difficulty;
  // Für Expertenmodus
  expertMode?: ExpertModeConfig;
}

// Provider-spezifische Informationen
export const API_PROVIDERS: Record<ApiProvider, {
  name: string;
  url: string;
  docsUrl: string;
  keyPrefix: string;
  defaultModel: string;
  models: { id: string; name: string; free?: boolean }[];
}> = {
  openrouter: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    docsUrl: 'https://openrouter.ai',
    keyPrefix: 'sk-or-',
    defaultModel: 'tngtech/deepseek-r1t2-chimera:free',
    models: [
      { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2 Chimera', free: true },
      { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi MiMo V2 Flash', free: true },
      { id: 'google/gemma-2-9b-it:free', name: 'Google Gemma 2 9B', free: true },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct', free: true },
      { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', free: true },
    ]
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    docsUrl: 'https://console.groq.com',
    keyPrefix: 'gsk_',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', free: true },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', free: true },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', free: true },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', free: true },
    ]
  },
  nvidia: {
    name: 'NVIDIA NIM',
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    docsUrl: 'https://build.nvidia.com',
    keyPrefix: 'nvapi-',
    defaultModel: 'meta/llama-3.1-70b-instruct',
    models: [
      { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct' },
      { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct' },
      { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'Mixtral 8x7B' },
      { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B' },
    ]
  },
  openai: {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    docsUrl: 'https://platform.openai.com',
    keyPrefix: 'sk-',
    defaultModel: 'gpt-4o-mini',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]
  },
  anthropic: {
    name: 'Anthropic Claude',
    url: 'https://api.anthropic.com/v1/messages',
    docsUrl: 'https://console.anthropic.com',
    keyPrefix: 'sk-ant-',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    ]
  },
  google: {
    name: 'Google AI',
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    docsUrl: 'https://aistudio.google.com',
    keyPrefix: 'AIza',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', free: true },
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', free: true },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', free: true },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', free: true },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ]
  },
  expert: {
    name: 'Expertenmodus',
    url: '', // Verwendet Groq API für beide Modelle
    docsUrl: 'https://console.groq.com',
    keyPrefix: 'gsk_',
    defaultModel: 'llama-3.3-70b-versatile + llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile + llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recherche + Generierung)', free: true },
      { id: 'llama-3.3-70b-versatile + mixtral-8x7b-32768', name: 'Llama 3.3 70B + Mixtral 8x7B', free: true },
      { id: 'mixtral-8x7b-32768 + llama-3.3-70b-versatile', name: 'Mixtral 8x7B + Llama 3.3 70B', free: true },
    ]
  }
};

export type QuestionType = 'text' | 'image';

export interface Question {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  alternativeAnswers?: string[]; // Alternative richtige Antworten
  wikipediaSource?: string;
  sourceType?: 'wikipedia' | 'fandom' | 'other'; // Art der Quelle
  sourceName?: string; // Name des Wikis (z.B. "Pokewiki", "Wikipedia")
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: QuestionType;
  imageUrl?: string; // URL für Bilderfragen
  imageAlt?: string; // Beschreibung des Bildes
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
  alternativeAnswers?: string[]; // Alternative richtige Antworten
  isCorrect: boolean;
  explanation: string;
  wikipediaUrl?: string;
  sourceName?: string; // Name der Quelle (Wikipedia, Pokewiki, etc.)
  manualOverride?: boolean;
  imageUrl?: string; // Für Bilderfragen
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
