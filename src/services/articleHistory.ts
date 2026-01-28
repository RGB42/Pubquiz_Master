// Service zum Speichern und Abrufen verwendeter Wikipedia-Artikel
// Diese Artikel werden bei zukünftigen Fragen ignoriert, um Wiederholungen zu vermeiden

const STORAGE_KEY = 'pubquiz_used_articles';
const MAX_STORED_ARTICLES = 500; // Maximale Anzahl gespeicherter Artikel

export interface UsedArticle {
  topic: string;
  category: string;
  question: string;
  usedAt: string;
}

export function getUsedArticles(): UsedArticle[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading used articles:', e);
  }
  return [];
}

export function saveUsedArticles(articles: UsedArticle[]): void {
  try {
    // Begrenze die Anzahl der gespeicherten Artikel
    const limitedArticles = articles.slice(-MAX_STORED_ARTICLES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedArticles));
  } catch (e) {
    console.error('Error saving used articles:', e);
  }
}

export function addUsedArticles(newArticles: UsedArticle[]): void {
  const existing = getUsedArticles();
  const combined = [...existing, ...newArticles];
  saveUsedArticles(combined);
}

export function getUsedArticlesForCategory(category: string): string[] {
  const articles = getUsedArticles();
  return articles
    .filter(a => a.category.toLowerCase() === category.toLowerCase())
    .map(a => a.topic);
}

export function getUsedArticlesTopics(): string[] {
  const articles = getUsedArticles();
  return articles.map(a => a.topic);
}

export function clearUsedArticles(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getArticleCount(): number {
  return getUsedArticles().length;
}

// Prüft, ob eine Kategorie eine benutzerdefinierte Kategorie ist
// Bei benutzerdefinierten Kategorien wird die Artikelhistorie ignoriert,
// da diese oft spezifische Themen mit wenigen Artikeln haben
export function shouldIgnoreHistory(category: string, predefinedCategories: string[]): boolean {
  const normalizedCategory = category.toLowerCase().trim();
  const normalizedPredefined = predefinedCategories.map(c => c.toLowerCase().trim());
  return !normalizedPredefined.includes(normalizedCategory);
}
