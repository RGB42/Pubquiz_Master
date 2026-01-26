import { Question, UserAnswer, EvaluationResult, CATEGORIES } from '../types/quiz';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const WIKIPEDIA_API_URL = 'https://de.wikipedia.org/api/rest_v1/page/summary/';

export async function generateQuestions(
  apiKey: string,
  model: string,
  numCategories: number,
  questionsPerCategory: number,
  existingQuestions: string[] = []
): Promise<Question[]> {
  // Wähle zufällige Kategorien
  const shuffledCategories = [...CATEGORIES].sort(() => Math.random() - 0.5);
  const selectedCategories = shuffledCategories.slice(0, Math.min(numCategories, CATEGORIES.length));
  
  const allQuestions: Question[] = [];
  
  for (const category of selectedCategories) {
    const questions = await generateCategoryQuestions(
      apiKey,
      model,
      category,
      questionsPerCategory,
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
  existingQuestions: string[]
): Promise<Question[]> {
  const existingList = existingQuestions.length > 0 
    ? `\n\nFolgende Fragen wurden bereits gestellt und dürfen NICHT wiederholt werden:\n${existingQuestions.join('\n')}`
    : '';

  const prompt = `Du bist ein deutscher Pubquiz-Master. Erstelle ${count} einzigartige Quizfragen für die Kategorie "${category}".

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
      const errorMessage = errorData.error?.message || `API Fehler: ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON aus der Antwort
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Keine gültige JSON-Antwort erhalten');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    const questions: Question[] = [];
    
    for (const q of parsed.questions || []) {
      // Wikipedia Fact-Check mit deutschem Wikipedia
      const verified = await verifyWithWikipedia(q.wikipediaTopic || q.correctAnswer);
      
      questions.push({
        id: crypto.randomUUID(),
        category,
        question: q.question,
        correctAnswer: q.correctAnswer,
        wikipediaSource: verified.url || `https://de.wikipedia.org/wiki/${encodeURIComponent((q.wikipediaTopic || q.correctAnswer).replace(/ /g, '_'))}`,
        difficulty: q.difficulty || 'medium'
      });
    }
    
    return questions;
  } catch (error) {
    console.error('Fehler bei Fragengenerierung:', error);
    throw error;
  }
}

async function verifyWithWikipedia(topic: string): Promise<{ verified: boolean; url?: string; summary?: string }> {
  try {
    const searchTopic = encodeURIComponent(topic.replace(/ /g, '_'));
    const response = await fetch(`${WIKIPEDIA_API_URL}${searchTopic}`, {
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
    
    // Fallback: Direkter Wikipedia-Link
    return { 
      verified: false,
      url: `https://de.wikipedia.org/wiki/${searchTopic}`
    };
  } catch {
    return { 
      verified: false,
      url: `https://de.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`
    };
  }
}

export async function evaluateAnswers(
  apiKey: string,
  model: string,
  questions: Question[],
  userAnswers: UserAnswer[]
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];
  
  // Batch die Fragen für effizientere API-Aufrufe
  const questionsToEvaluate = questions.map(q => {
    const userAnswer = userAnswers.find(a => a.questionId === q.id);
    return {
      question: q,
      userAnswer: userAnswer?.answer || ''
    };
  });
  
  const prompt = `Du bist ein fairer deutscher Quizmaster. Bewerte die folgenden Antworten.

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
        temperature: 0.1, // Niedrige Temperatur für konsistente Bewertung
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Bewertungs-API Fehler: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Keine gültige Bewertung erhalten');
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
    
    // Falls nicht alle Fragen bewertet wurden, füge sie hinzu
    for (const q of questions) {
      if (!results.find(r => r.questionId === q.id)) {
        const userAnswer = userAnswers.find(a => a.questionId === q.id);
        results.push({
          questionId: q.id,
          question: q.question,
          userAnswer: userAnswer?.answer || '',
          correctAnswer: q.correctAnswer,
          isCorrect: false,
          explanation: 'Konnte nicht automatisch bewertet werden',
          wikipediaUrl: q.wikipediaSource
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Fehler bei der Bewertung:', error);
    
    // Fallback: Einfacher String-Vergleich
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
        explanation: isCorrect ? 'Korrekt!' : 'Leider falsch.',
        wikipediaUrl: q.wikipediaSource
      };
    });
  }
}
