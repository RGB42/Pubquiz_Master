import { Question, UserAnswer, EvaluationResult, Language } from '../types/quiz';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

function getWikipediaUrl(language: Language): string {
  return language === 'de' 
    ? 'https://de.wikipedia.org/api/rest_v1/page/summary/'
    : 'https://en.wikipedia.org/api/rest_v1/page/summary/';
}

function getWikipediaBaseUrl(language: Language): string {
  return language === 'de' 
    ? 'https://de.wikipedia.org/wiki/'
    : 'https://en.wikipedia.org/wiki/';
}

export async function generateQuestions(
  apiKey: string,
  model: string,
  selectedCategories: string[],
  questionsPerCategory: number,
  language: Language,
  existingQuestions: string[] = []
): Promise<Question[]> {
  const allQuestions: Question[] = [];
  
  for (const category of selectedCategories) {
    const questions = await generateCategoryQuestions(
      apiKey,
      model,
      category,
      questionsPerCategory,
      language,
      existingQuestions
    );
    allQuestions.push(...questions);
  }
  
  return allQuestions;
}

async function generateCategoryQuestions(
  apiKey: string,
  model: string,
  category: string,
  count: number,
  language: Language,
  existingQuestions: string[]
): Promise<Question[]> {
  const existingList = existingQuestions.length > 0 
    ? language === 'de'
      ? `\n\nFolgende Fragen wurden bereits gestellt und dürfen NICHT wiederholt werden:\n${existingQuestions.join('\n')}`
      : `\n\nThe following questions have already been asked and must NOT be repeated:\n${existingQuestions.join('\n')}`
    : '';

  const prompt = language === 'de' 
    ? `Du bist ein deutscher Pubquiz-Master. Erstelle ${count} einzigartige Quizfragen für die Kategorie "${category}".

WICHTIGE REGELN:
- ALLE Fragen und Antworten MÜSSEN auf DEUTSCH sein!
- Jede Frage muss eine eindeutige, faktisch korrekte Antwort haben
- Die Antworten müssen auf der deutschen Wikipedia (de.wikipedia.org) verifizierbar sein
- Fragen sollen interessant und abwechslungsreich sein
- Mische verschiedene Schwierigkeitsgrade (easy, medium, hard)
- Bei Personen, Orten, Begriffen verwende die deutsche Schreibweise
- Der wikipediaTopic muss der exakte deutsche Wikipedia-Artikelname sein (z.B. "Albert_Einstein", "Berlin", "Zweiter_Weltkrieg")
- Antworte NUR mit validem JSON, kein anderer Text${existingList}

Antworte im folgenden JSON-Format:
{
  "questions": [
    {
      "question": "Die Frage auf Deutsch",
      "correctAnswer": "Die korrekte Antwort auf Deutsch",
      "difficulty": "medium",
      "wikipediaTopic": "Exakter_Wikipedia_Artikelname"
    }
  ]
}`
    : `You are a pub quiz master. Create ${count} unique quiz questions for the category "${category}".

IMPORTANT RULES:
- ALL questions and answers MUST be in ENGLISH!
- Each question must have a unique, factually correct answer
- Answers must be verifiable on English Wikipedia (en.wikipedia.org)
- Questions should be interesting and varied
- Mix different difficulty levels (easy, medium, hard)
- The wikipediaTopic must be the exact English Wikipedia article name (e.g. "Albert_Einstein", "Berlin", "World_War_II")
- Respond ONLY with valid JSON, no other text${existingList}

Respond in the following JSON format:
{
  "questions": [
    {
      "question": "The question in English",
      "correctAnswer": "The correct answer in English",
      "difficulty": "medium",
      "wikipediaTopic": "Exact_Wikipedia_Article_Name"
    }
  ]
}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PubQuiz Master'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(language === 'de' ? 'Keine gültige JSON-Antwort erhalten' : 'No valid JSON response received');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    const questions: Question[] = [];
    
    for (const q of parsed.questions || []) {
      // Wikipedia Fact-Check
      const verified = await verifyWithWikipedia(q.wikipediaTopic || q.correctAnswer, language);
      
      questions.push({
        id: crypto.randomUUID(),
        category,
        question: q.question,
        correctAnswer: q.correctAnswer,
        wikipediaSource: verified.url || `${getWikipediaBaseUrl(language)}${encodeURIComponent((q.wikipediaTopic || q.correctAnswer).replace(/ /g, '_'))}`,
        difficulty: q.difficulty || 'medium'
      });
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

async function verifyWithWikipedia(topic: string, language: Language): Promise<{ verified: boolean; url?: string; summary?: string }> {
  try {
    const searchTopic = encodeURIComponent(topic.replace(/ /g, '_'));
    const response = await fetch(`${getWikipediaUrl(language)}${searchTopic}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        verified: true,
        url: data.content_urls?.desktop?.page,
        summary: data.extract
      };
    }
    
    // Fallback: Direct Wikipedia link
    return { 
      verified: false,
      url: `${getWikipediaBaseUrl(language)}${searchTopic}`
    };
  } catch {
    return { 
      verified: false,
      url: `${getWikipediaBaseUrl(language)}${encodeURIComponent(topic.replace(/ /g, '_'))}`
    };
  }
}

export async function evaluateAnswers(
  apiKey: string,
  model: string,
  questions: Question[],
  userAnswers: UserAnswer[],
  language: Language
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];
  
  // Batch questions for more efficient API calls
  const questionsToEvaluate = questions.map(q => {
    const userAnswer = userAnswers.find(a => a.questionId === q.id);
    return {
      question: q,
      userAnswer: userAnswer?.answer || ''
    };
  });
  
  const prompt = language === 'de'
    ? `Du bist ein fairer deutscher Quizmaster. Bewerte die folgenden Antworten.

WICHTIGE REGELN:
- Sei großzügig bei Tippfehlern oder leicht abweichenden Schreibweisen
- Akzeptiere deutsche UND internationale Schreibweisen (z.B. "München" und "Munich")
- Die Antwort muss inhaltlich korrekt sein, nicht wörtlich identisch
- Bei Namen akzeptiere auch Kurzformen (z.B. "Einstein" statt "Albert Einstein")
- Bei Zahlen akzeptiere verschiedene Formate (z.B. "1989" und "neunzehnhundertneunundachtzig")

Bewerte jede Antwort und antworte NUR mit validem JSON:

${questionsToEvaluate.map((item, i) => `
Frage ${i + 1}: ${item.question.question}
Korrekte Antwort: ${item.question.correctAnswer}
Antwort des Spielers: ${item.userAnswer || '(keine Antwort)'}
`).join('\n')}

Antworte im Format:
{
  "evaluations": [
    {
      "questionIndex": 0,
      "isCorrect": true,
      "explanation": "Kurze Begründung auf Deutsch"
    }
  ]
}`
    : `You are a fair quiz master. Evaluate the following answers.

IMPORTANT RULES:
- Be lenient with typos or slightly different spellings
- Accept both local AND international spellings
- The answer must be factually correct, not word-for-word identical
- For names, also accept short forms (e.g. "Einstein" instead of "Albert Einstein")
- For numbers, accept different formats (e.g. "1989" and "nineteen eighty-nine")

Evaluate each answer and respond ONLY with valid JSON:

${questionsToEvaluate.map((item, i) => `
Question ${i + 1}: ${item.question.question}
Correct Answer: ${item.question.correctAnswer}
Player's Answer: ${item.userAnswer || '(no answer)'}
`).join('\n')}

Respond in the format:
{
  "evaluations": [
    {
      "questionIndex": 0,
      "isCorrect": true,
      "explanation": "Brief explanation in English"
    }
  ]
}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PubQuiz Master'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent evaluation
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Evaluation API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(language === 'de' ? 'Keine gültige Bewertung erhalten' : 'No valid evaluation received');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    for (const evaluation of parsed.evaluations || []) {
      const question = questions[evaluation.questionIndex];
      const userAnswer = userAnswers.find(a => a.questionId === question?.id);
      
      if (question) {
        results.push({
          questionId: question.id,
          question: question.question,
          userAnswer: userAnswer?.answer || '',
          correctAnswer: question.correctAnswer,
          isCorrect: evaluation.isCorrect,
          explanation: evaluation.explanation,
          wikipediaUrl: question.wikipediaSource
        });
      }
    }
    
    // Add any unevaluated questions
    for (const q of questions) {
      if (!results.find(r => r.questionId === q.id)) {
        const userAnswer = userAnswers.find(a => a.questionId === q.id);
        results.push({
          questionId: q.id,
          question: q.question,
          userAnswer: userAnswer?.answer || '',
          correctAnswer: q.correctAnswer,
          isCorrect: false,
          explanation: language === 'de' ? 'Konnte nicht automatisch bewertet werden' : 'Could not be automatically evaluated',
          wikipediaUrl: q.wikipediaSource
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error during evaluation:', error);
    
    // Fallback: Simple string comparison
    return questions.map(q => {
      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      const userText = (userAnswer?.answer || '').toLowerCase().trim();
      const correctText = q.correctAnswer.toLowerCase().trim();
      const isCorrect = userText === correctText || correctText.includes(userText) || userText.includes(correctText);
      
      return {
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswer?.answer || '',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: isCorrect 
          ? (language === 'de' ? 'Korrekt!' : 'Correct!') 
          : (language === 'de' ? 'Leider falsch.' : 'Unfortunately incorrect.'),
        wikipediaUrl: q.wikipediaSource
      };
    });
  }
}
