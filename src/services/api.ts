import { Question, UserAnswer, EvaluationResult, Language, Difficulty, CATEGORIES_DE, CATEGORIES_EN } from '../types/quiz';
import { getUsedArticlesForCategory, addUsedArticles, shouldIgnoreHistory, UsedArticle } from './articleHistory';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Bekannte Fandom-Wikis für populäre Themen
const KNOWN_WIKIS: Record<string, { name: string; url: string; language: 'de' | 'en' | 'both' }> = {
  // Games
  'pokemon': { name: 'PokéWiki', url: 'https://pokewiki.de', language: 'de' },
  'pokémon': { name: 'PokéWiki', url: 'https://pokewiki.de', language: 'de' },
  'zelda': { name: 'Zeldapedia', url: 'https://zelda.fandom.com/de', language: 'de' },
  'mario': { name: 'MarioWiki', url: 'https://mariowiki.net', language: 'de' },
  'minecraft': { name: 'Minecraft Wiki', url: 'https://minecraft.wiki/w', language: 'both' },
  'fortnite': { name: 'Fortnite Wiki', url: 'https://fortnite.fandom.com', language: 'both' },
  'league of legends': { name: 'LoL Wiki', url: 'https://leagueoflegends.fandom.com/de', language: 'de' },
  'lol': { name: 'LoL Wiki', url: 'https://leagueoflegends.fandom.com/de', language: 'de' },
  'world of warcraft': { name: 'WoWpedia', url: 'https://wowpedia.fandom.com', language: 'both' },
  'wow': { name: 'WoWpedia', url: 'https://wowpedia.fandom.com', language: 'both' },
  'genshin impact': { name: 'Genshin Impact Wiki', url: 'https://genshin-impact.fandom.com/de', language: 'de' },
  'genshin': { name: 'Genshin Impact Wiki', url: 'https://genshin-impact.fandom.com/de', language: 'de' },
  
  // Anime/Manga
  'naruto': { name: 'Narutopedia', url: 'https://naruto.fandom.com/de', language: 'de' },
  'one piece': { name: 'One Piece Wiki', url: 'https://onepiece.fandom.com/de', language: 'de' },
  'dragon ball': { name: 'Dragon Ball Wiki', url: 'https://dragonball.fandom.com/de', language: 'de' },
  'attack on titan': { name: 'Attack on Titan Wiki', url: 'https://attackontitan.fandom.com', language: 'both' },
  'demon slayer': { name: 'Kimetsu no Yaiba Wiki', url: 'https://kimetsu-no-yaiba.fandom.com', language: 'both' },
  'jojo': { name: 'JoJo Wiki', url: 'https://jojo.fandom.com', language: 'both' },
  'my hero academia': { name: 'My Hero Academia Wiki', url: 'https://myheroacademia.fandom.com/de', language: 'de' },
  
  // Movies/TV
  'star wars': { name: 'Jedipedia', url: 'https://jedipedia.fandom.com/de', language: 'de' },
  'harry potter': { name: 'Harry Potter Wiki', url: 'https://harry-potter.fandom.com/de', language: 'de' },
  'marvel': { name: 'Marvel Wiki', url: 'https://marvel.fandom.com/de', language: 'de' },
  'mcu': { name: 'Marvel Wiki', url: 'https://marvel.fandom.com/de', language: 'de' },
  'dc': { name: 'DC Wiki', url: 'https://dc.fandom.com/de', language: 'de' },
  'batman': { name: 'DC Wiki', url: 'https://dc.fandom.com/de', language: 'de' },
  'game of thrones': { name: 'Game of Thrones Wiki', url: 'https://gameofthrones.fandom.com/de', language: 'de' },
  'herr der ringe': { name: 'Ardapedia', url: 'https://ardapedia.herr-der-ringe-film.de', language: 'de' },
  'lord of the rings': { name: 'Tolkien Gateway', url: 'https://tolkiengateway.net', language: 'en' },
  'stranger things': { name: 'Stranger Things Wiki', url: 'https://strangerthings.fandom.com/de', language: 'de' },
  'breaking bad': { name: 'Breaking Bad Wiki', url: 'https://breakingbad.fandom.com/de', language: 'de' },
  'simpsons': { name: 'Simpsons Wiki', url: 'https://simpsons.fandom.com/de', language: 'de' },
  
  // Other
  'disney': { name: 'Disney Wiki', url: 'https://disney.fandom.com/de', language: 'de' },
  'pixar': { name: 'Disney Wiki', url: 'https://disney.fandom.com/de', language: 'de' },
};

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
  difficulty: Difficulty = 'mixed',
  existingQuestions: string[] = []
): Promise<Question[]> {
  const allQuestions: Question[] = [];
  const newUsedArticles: UsedArticle[] = [];
  
  // Vordefinierte Kategorien für die Sprache
  const predefinedCategories = language === 'de' ? CATEGORIES_DE : CATEGORIES_EN;
  
  for (const category of selectedCategories) {
    // Prüfe, ob die Historie für diese Kategorie ignoriert werden soll
    // (bei benutzerdefinierten Kategorien wird die Historie ignoriert)
    const ignoreHistory = shouldIgnoreHistory(category, predefinedCategories);
    
    // Hole bereits verwendete Artikel für diese Kategorie
    const usedArticles = ignoreHistory ? [] : getUsedArticlesForCategory(category);
    
    const questions = await generateCategoryQuestions(
      apiKey,
      model,
      category,
      questionsPerCategory,
      language,
      difficulty,
      existingQuestions,
      usedArticles,
      ignoreHistory
    );
    
    // Sammle verwendete Artikel für das Speichern
    for (const q of questions) {
      if (!ignoreHistory) {
        // Extrahiere den Wikipedia-Topic aus der URL oder verwende die Antwort
        const topic = q.wikipediaSource 
          ? decodeURIComponent(q.wikipediaSource.split('/wiki/').pop() || q.correctAnswer)
          : q.correctAnswer;
        
        newUsedArticles.push({
          topic,
          category,
          question: q.question,
          usedAt: new Date().toISOString()
        });
      }
    }
    
    allQuestions.push(...questions);
  }
  
  // Speichere die neuen verwendeten Artikel
  if (newUsedArticles.length > 0) {
    addUsedArticles(newUsedArticles);
  }
  
  return allQuestions;
}

// Finde ein passendes Wiki für eine benutzerdefinierte Kategorie
function findSpecializedWiki(category: string): { name: string; url: string } | null {
  const lowerCategory = category.toLowerCase().trim();
  
  for (const [key, wiki] of Object.entries(KNOWN_WIKIS)) {
    if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
      return { name: wiki.name, url: wiki.url };
    }
  }
  
  return null;
}

async function generateCategoryQuestions(
  apiKey: string,
  model: string,
  category: string,
  count: number,
  language: Language,
  difficulty: Difficulty,
  existingQuestions: string[],
  usedArticles: string[],
  isCustomCategory: boolean
): Promise<Question[]> {
  // Kombiniere existierende Fragen und verwendete Artikel
  let exclusionList = '';
  
  if (existingQuestions.length > 0) {
    exclusionList += language === 'de'
      ? `\n\nFolgende Fragen wurden bereits in dieser Session gestellt und dürfen NICHT wiederholt werden:\n${existingQuestions.join('\n')}`
      : `\n\nThe following questions have already been asked in this session and must NOT be repeated:\n${existingQuestions.join('\n')}`;
  }
  
  if (usedArticles.length > 0 && !isCustomCategory) {
    exclusionList += language === 'de'
      ? `\n\n⚠️ WICHTIG - BEREITS VERWENDETE THEMEN/ARTIKEL (NICHT VERWENDEN!):\nDie folgenden Wikipedia-Artikel wurden bereits in früheren Quiz-Runden verwendet. Erstelle Fragen zu ANDEREN Themen:\n- ${usedArticles.slice(-50).join('\n- ')}`
      : `\n\n⚠️ IMPORTANT - PREVIOUSLY USED TOPICS/ARTICLES (DO NOT USE!):\nThe following Wikipedia articles have been used in previous quiz rounds. Create questions about DIFFERENT topics:\n- ${usedArticles.slice(-50).join('\n- ')}`;
  }

  // Schwierigkeitsgrad-Anweisungen
  const difficultyInstructions = {
    de: {
      easy: 'Erstelle NUR LEICHTE Fragen. Diese sollten allgemein bekannte Fakten abfragen, die die meisten Menschen wissen sollten. Grundlegendes Allgemeinwissen.',
      medium: 'Erstelle NUR MITTELSCHWERE Fragen. Diese sollten etwas spezifischer sein und erfordern solides Allgemeinwissen. Nicht zu einfach, aber auch nicht zu schwer.',
      hard: 'Erstelle NUR SCHWERE Fragen. Diese sollten tiefgehendes Fachwissen erfordern und auch für Experten eine Herausforderung sein. Detailfragen und weniger bekannte Fakten.',
      mixed: 'Erstelle einen Mix aus verschiedenen Schwierigkeitsgraden (leicht, mittel, schwer). Verteile sie gleichmäßig.'
    },
    en: {
      easy: 'Create ONLY EASY questions. These should ask about commonly known facts that most people should know. Basic general knowledge.',
      medium: 'Create ONLY MEDIUM difficulty questions. These should be more specific and require solid general knowledge. Not too easy, but not too hard either.',
      hard: 'Create ONLY HARD questions. These should require deep expertise and be challenging even for experts. Detail questions and lesser-known facts.',
      mixed: 'Create a mix of different difficulty levels (easy, medium, hard). Distribute them evenly.'
    }
  };

  const difficultyText = difficultyInstructions[language][difficulty];
  const targetDifficulty = difficulty === 'mixed' ? 'mixed (easy/medium/hard)' : difficulty;

  // Prüfe, ob es ein spezialisiertes Wiki für diese Kategorie gibt
  const specializedWiki = isCustomCategory ? findSpecializedWiki(category) : null;
  
  // Zusätzlicher Hinweis für benutzerdefinierte Kategorien
  let customCategoryNote = '';
  
  if (isCustomCategory && specializedWiki) {
    customCategoryNote = language === 'de'
      ? `\n\n🎯 SPEZIELLE QUELLE FÜR DIESE KATEGORIE:
Für die Kategorie "${category}" verwende das spezialisierte Wiki "${specializedWiki.name}" (${specializedWiki.url}) als Hauptquelle.
- Nutze das Fachwissen aus diesem Wiki für präzise und korrekte Fragen
- Die Antworten müssen auf Informationen basieren, die in diesem Wiki verifizierbar sind
- Gib als "sourceUrl" einen Link zum relevanten Artikel im ${specializedWiki.name} an (Format: ${specializedWiki.url}/wiki/Artikelname oder ähnlich)
- NICHT Wikipedia verwenden, sondern ${specializedWiki.name}!`
      : `\n\n🎯 SPECIALIZED SOURCE FOR THIS CATEGORY:
For the category "${category}" use the specialized wiki "${specializedWiki.name}" (${specializedWiki.url}) as main source.
- Use the expert knowledge from this wiki for precise and correct questions
- Answers must be based on information verifiable in this wiki
- Provide as "sourceUrl" a link to the relevant article in ${specializedWiki.name} (Format: ${specializedWiki.url}/wiki/ArticleName or similar)
- Do NOT use Wikipedia, use ${specializedWiki.name}!`;
  } else if (isCustomCategory) {
    customCategoryNote = language === 'de'
      ? `\n\n🎯 BENUTZERDEFINIERTE KATEGORIE "${category}":
- Suche nach dem besten verfügbaren Wiki oder Nachschlagewerk für dieses Thema
- Wenn es ein Fandom-Wiki, spezialisiertes Wiki oder andere zuverlässige Quelle gibt, nutze diese
- Gib als "sourceUrl" einen Link zur Quelle an, wo die Antwort verifiziert werden kann
- Als "sourceName" gib den Namen des verwendeten Wikis/Quelle an (z.B. "Pokewiki", "Narutopedia", "Wikipedia")
- Stelle ABSOLUT SICHER, dass Frage und Antwort KORREKT und konsistent sind
- Auch wenn Themen sich wiederholen könnten, stelle sicher, dass die FRAGEN unterschiedlich formuliert sind`
      : `\n\n🎯 CUSTOM CATEGORY "${category}":
- Search for the best available wiki or reference for this topic
- If there's a Fandom wiki, specialized wiki, or other reliable source, use it
- Provide as "sourceUrl" a link to the source where the answer can be verified
- As "sourceName" provide the name of the wiki/source used (e.g. "Pokewiki", "Narutopedia", "Wikipedia")
- Make ABSOLUTELY SURE that question and answer are CORRECT and consistent
- Even if topics might repeat, ensure the QUESTIONS are formulated differently`;
  }

  const prompt = language === 'de' 
    ? `Du bist ein deutscher Pubquiz-Master. Erstelle ${count} einzigartige Quizfragen für die Kategorie "${category}".

⚠️ KRITISCH - KONSISTENZ ZWISCHEN FRAGE UND ANTWORT:
Die Antwort MUSS EXAKT das sein, wonach die Frage fragt!

SELBST-CHECK für jede Frage: "Wenn ich frage 'Welcher Film...', muss die Antwort ein FILMNAME sein!"

FALSCHE Beispiele (SO NICHT MACHEN!):
❌ Frage: "Welcher japanische Horrorfilm..." → Antwort: "Videokassette" (FALSCH! Gefragt war FILM!)
❌ Frage: "Wer erfand die Glühbirne?" → Antwort: "1879" (FALSCH! Gefragt war WER!)
❌ Frage: "In welcher Stadt steht...?" → Antwort: "Deutschland" (FALSCH! Gefragt war STADT!)

RICHTIGE Beispiele:
✅ Frage: "Welcher japanische Horrorfilm von 1998 handelt von einem verfluchten Video?" → Antwort: "Ringu"
✅ Frage: "Wer erfand die Glühbirne?" → Antwort: "Thomas Edison"
✅ Frage: "In welcher Stadt steht der Eiffelturm?" → Antwort: "Paris"

SCHWIERIGKEITSGRAD: ${difficultyText}

WICHTIGE REGELN:
- ALLE Fragen und Antworten MÜSSEN auf DEUTSCH sein!
- Jede Frage muss eine eindeutige, faktisch korrekte Antwort haben
- Die Antworten müssen auf der deutschen Wikipedia (de.wikipedia.org) verifizierbar sein
- Fragen sollen interessant und abwechslungsreich sein
- ALLE Fragen müssen dem angegebenen Schwierigkeitsgrad entsprechen: ${targetDifficulty}
- Bei Personen, Orten, Begriffen verwende die deutsche Schreibweise
- Der wikipediaTopic muss der exakte deutsche Wikipedia-Artikelname sein (z.B. "Albert_Einstein", "Berlin", "Zweiter_Weltkrieg")
- VERMEIDE Fragen zu den unten aufgelisteten bereits verwendeten Themen!
- Antworte NUR mit validem JSON, kein anderer Text${exclusionList}${customCategoryNote}

Antworte im folgenden JSON-Format:
{
  "questions": [
    {
      "question": "Die Frage auf Deutsch",
      "correctAnswer": "Die korrekte Antwort auf Deutsch",
      "difficulty": "medium",
      "wikipediaTopic": "Exakter_Wikipedia_Artikelname",
      "sourceUrl": "https://de.wikipedia.org/wiki/Artikel ODER https://pokewiki.de/Artikel falls spezialisiertes Wiki",
      "sourceName": "Wikipedia ODER Name des spezialisierten Wikis"
    }
  ]
}`
    : `You are a pub quiz master. Create ${count} unique quiz questions for the category "${category}".

⚠️ CRITICAL - CONSISTENCY BETWEEN QUESTION AND ANSWER:
The answer MUST BE EXACTLY what the question asks for!

SELF-CHECK for each question: "If I ask 'Which movie...', the answer MUST be a MOVIE NAME!"

WRONG examples (DO NOT DO THIS!):
❌ Question: "Which Japanese horror film..." → Answer: "Videotape" (WRONG! Asked for FILM!)
❌ Question: "Who invented the light bulb?" → Answer: "1879" (WRONG! Asked for WHO!)
❌ Question: "In which city is...?" → Answer: "Germany" (WRONG! Asked for CITY!)

CORRECT examples:
✅ Question: "Which Japanese horror film from 1998 is about a cursed video?" → Answer: "Ringu"
✅ Question: "Who invented the light bulb?" → Answer: "Thomas Edison"
✅ Question: "In which city is the Eiffel Tower?" → Answer: "Paris"

DIFFICULTY LEVEL: ${difficultyText}

IMPORTANT RULES:
- ALL questions and answers MUST be in ENGLISH!
- Each question must have a unique, factually correct answer
- Answers must be verifiable on English Wikipedia (en.wikipedia.org)
- Questions should be interesting and varied
- ALL questions must match the specified difficulty level: ${targetDifficulty}
- The wikipediaTopic must be the exact English Wikipedia article name (e.g. "Albert_Einstein", "Berlin", "World_War_II")
- AVOID questions about the already used topics listed below!
- Respond ONLY with valid JSON, no other text${exclusionList}${customCategoryNote}

Respond in the following JSON format:
{
  "questions": [
    {
      "question": "The question in English",
      "correctAnswer": "The correct answer in English",
      "difficulty": "medium",
      "wikipediaTopic": "Exact_Wikipedia_Article_Name",
      "sourceUrl": "https://en.wikipedia.org/wiki/Article OR https://specializedwiki.com/Article if specialized wiki",
      "sourceName": "Wikipedia OR name of the specialized wiki"
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
        temperature: 0.8, // Etwas höher für mehr Varianz
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
      const error = new Error(language === 'de' ? 'Keine gültige JSON-Antwort erhalten' : 'No valid JSON response received');
      (error as any).rawResponse = content;
      throw error;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      const error = new Error(language === 'de' ? 'JSON-Parsing fehlgeschlagen' : 'JSON parsing failed');
      (error as any).rawResponse = content;
      throw error;
    }
    const questions: Question[] = [];
    
    for (const q of parsed.questions || []) {
      // Wenn ein spezifischer Schwierigkeitsgrad gewählt wurde, diesen verwenden
      const questionDifficulty = difficulty === 'mixed' 
        ? (q.difficulty || 'medium') 
        : difficulty;
      
      // Bestimme die Quelle - spezialisiertes Wiki oder Wikipedia
      let sourceUrl = q.sourceUrl;
      let sourceName = q.sourceName || 'Wikipedia';
      let sourceType: 'wikipedia' | 'fandom' | 'other' = 'wikipedia';
      
      if (isCustomCategory && (q.sourceUrl || specializedWiki)) {
        // Für benutzerdefinierte Kategorien: Verwende die angegebene Quelle
        if (q.sourceUrl && !q.sourceUrl.includes('wikipedia.org')) {
          sourceUrl = q.sourceUrl;
          sourceName = q.sourceName || specializedWiki?.name || 'Spezialisiertes Wiki';
          sourceType = q.sourceUrl.includes('fandom.com') ? 'fandom' : 'other';
        } else if (specializedWiki && !q.sourceUrl) {
          // Fallback auf bekanntes spezialisiertes Wiki
          const articleName = encodeURIComponent((q.wikipediaTopic || q.correctAnswer).replace(/ /g, '_'));
          sourceUrl = `${specializedWiki.url}/${articleName}`;
          sourceName = specializedWiki.name;
          sourceType = 'fandom';
        }
      }
      
      // Falls keine spezielle Quelle, nutze Wikipedia
      if (!sourceUrl) {
        const verified = await verifyWithWikipedia(q.wikipediaTopic || q.correctAnswer, language);
        sourceUrl = verified.url || `${getWikipediaBaseUrl(language)}${encodeURIComponent((q.wikipediaTopic || q.correctAnswer).replace(/ /g, '_'))}`;
        sourceName = 'Wikipedia';
        sourceType = 'wikipedia';
      }
      
      questions.push({
        id: crypto.randomUUID(),
        category,
        question: q.question,
        correctAnswer: q.correctAnswer,
        wikipediaSource: sourceUrl,
        sourceType,
        sourceName,
        difficulty: questionDifficulty as 'easy' | 'medium' | 'hard'
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
    ? `Du bist ein fairer und lehrreicher deutscher Quizmaster. Bewerte die folgenden Antworten und gib DETAILLIERTE, INFORMATIVE Erklärungen.

WICHTIGE REGELN FÜR DIE BEWERTUNG:
- Sei großzügig bei Tippfehlern oder leicht abweichenden Schreibweisen
- Akzeptiere deutsche UND internationale Schreibweisen (z.B. "München" und "Munich")
- Die Antwort muss inhaltlich korrekt sein, nicht wörtlich identisch
- Bei Namen akzeptiere auch Kurzformen (z.B. "Einstein" statt "Albert Einstein")
- Bei Zahlen akzeptiere verschiedene Formate (z.B. "1989" und "neunzehnhundertneunundachtzig")

WICHTIGE REGELN FÜR DIE ERKLÄRUNG:
- Schreibe NIEMALS nur "Richtig!" oder "Falsch, die Antwort ist X"
- Gib IMMER einen interessanten Fakt oder Kontext zur richtigen Antwort
- Die Erklärung soll dem Spieler etwas NEUES beibringen
- Bei richtigen Antworten: Ergänze einen zusätzlichen interessanten Fakt
- Bei falschen Antworten: Erkläre WARUM die richtige Antwort korrekt ist und gib Hintergrundwissen

BEISPIELE FÜR GUTE ERKLÄRUNGEN:
- SCHLECHT: "Falsch, die richtige Antwort ist Berlin."
- GUT: "Berlin wurde 1237 erstmals urkundlich erwähnt und ist seit 1990 wieder die Hauptstadt des vereinten Deutschlands. Mit über 3,6 Millionen Einwohnern ist sie die bevölkerungsreichste Stadt der EU."
- SCHLECHT: "Richtig!"
- GUT: "Genau! Albert Einstein erhielt den Nobelpreis 1921 allerdings nicht für die Relativitätstheorie, sondern für seine Erklärung des photoelektrischen Effekts."

Bewerte jede Antwort und antworte NUR mit validem JSON:

${questionsToEvaluate.map((item, i) => `
Frage ${i + 1}: ${item.question.question}
Korrekte Antwort: ${item.question.correctAnswer}
Antwort des Spielers: ${item.userAnswer || '(keine Antwort)'}
Wikipedia-Artikel: ${item.question.wikipediaSource || 'nicht verfügbar'}
`).join('\n')}

Antworte im Format:
{
  "evaluations": [
    {
      "questionIndex": 0,
      "isCorrect": true,
      "explanation": "Ausführliche, informative Erklärung mit interessanten Fakten (2-3 Sätze)"
    }
  ]
}`
    : `You are a fair and educational quiz master. Evaluate the following answers and provide DETAILED, INFORMATIVE explanations.

IMPORTANT RULES FOR EVALUATION:
- Be lenient with typos or slightly different spellings
- Accept both local AND international spellings
- The answer must be factually correct, not word-for-word identical
- For names, also accept short forms (e.g. "Einstein" instead of "Albert Einstein")
- For numbers, accept different formats (e.g. "1989" and "nineteen eighty-nine")

IMPORTANT RULES FOR EXPLANATIONS:
- NEVER just write "Correct!" or "Wrong, the answer is X"
- ALWAYS provide an interesting fact or context about the correct answer
- The explanation should TEACH the player something NEW
- For correct answers: Add an additional interesting fact
- For wrong answers: Explain WHY the correct answer is right and provide background knowledge

EXAMPLES OF GOOD EXPLANATIONS:
- BAD: "Wrong, the correct answer is Berlin."
- GOOD: "Berlin was first documented in 1237 and has been the capital of reunified Germany since 1990. With over 3.6 million inhabitants, it's the most populous city in the EU."
- BAD: "Correct!"
- GOOD: "Exactly! Interestingly, Albert Einstein received the Nobel Prize in 1921 not for the theory of relativity, but for his explanation of the photoelectric effect."

Evaluate each answer and respond ONLY with valid JSON:

${questionsToEvaluate.map((item, i) => `
Question ${i + 1}: ${item.question.question}
Correct Answer: ${item.question.correctAnswer}
Player's Answer: ${item.userAnswer || '(no answer)'}
Wikipedia Article: ${item.question.wikipediaSource || 'not available'}
`).join('\n')}

Respond in the format:
{
  "evaluations": [
    {
      "questionIndex": 0,
      "isCorrect": true,
      "explanation": "Detailed, informative explanation with interesting facts (2-3 sentences)"
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
      const error = new Error(language === 'de' ? 'Keine gültige Bewertung erhalten' : 'No valid evaluation received');
      (error as any).rawResponse = content;
      throw error;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      const error = new Error(language === 'de' ? 'JSON-Parsing der Bewertung fehlgeschlagen' : 'JSON parsing of evaluation failed');
      (error as any).rawResponse = content;
      throw error;
    }
    
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
          wikipediaUrl: question.wikipediaSource,
          sourceName: question.sourceName || 'Wikipedia'
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
        wikipediaUrl: q.wikipediaSource,
        sourceName: q.sourceName || 'Wikipedia'
      };
    });
  }
}
