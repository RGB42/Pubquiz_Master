/**
 * Pre-render script for static HTML generation.
 *
 * This script runs after the Vite build to inject server-rendered HTML into
 * the built index.html template. It generates:
 *   dist/client/index.html            - Landing page with pre-rendered content
 *   dist/client/blog_and_tipps/index.html - Blog page with pre-rendered content
 *
 * Pre-rendered content makes the site readable by crawlers (e.g. Google AdSense)
 * without requiring JavaScript execution.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const routes = [
  {
    url: '/',
    outDir: 'dist/client',
    title: 'PubQuiz Master - KI-gestütztes Quiz',
    description: 'PubQuiz Master - Erstelle und spiele dynamisch generierte Quizfragen mit KI. Kategorien auswählen, Fragen beantworten, Ergebnisse erhalten.',
  },
  {
    url: '/blog_and_tipps',
    outDir: 'dist/client/blog_and_tipps',
    title: 'Quiz-Wissen & Tipps - PubQuiz Master Blog',
    description: 'Artikel, Guides und Expertenwissen rund ums Quizzen. Geschichte des Pub-Quiz, Tipps für Quiz-Meister, KI im Quiz und mehr.',
  },
  {
    url: '/blog_and_tipps/geschichte-pub-quiz',
    outDir: 'dist/client/blog_and_tipps/geschichte-pub-quiz',
    title: 'Die Geschichte des Pub-Quiz - PubQuiz Master',
    description: 'Historie des Pub-Quiz von britischen Pubs bis zur digitalen Quizkultur mit aktuellen Fakten und Einordnung.',
  },
  {
    url: '/blog_and_tipps/tipps-quiz-meister',
    outDir: 'dist/client/blog_and_tipps/tipps-quiz-meister',
    title: '10 Tipps fuer Quiz-Meister - PubQuiz Master',
    description: 'Praktische Strategien fuer Quiz-Teams: Vorbereitung, Zeitmanagement, Kategorien und Lernmethoden fuer bessere Ergebnisse.',
  },
  {
    url: '/blog_and_tipps/beste-quiz-kategorien',
    outDir: 'dist/client/blog_and_tipps/beste-quiz-kategorien',
    title: 'Die besten Quiz-Kategorien - PubQuiz Master',
    description: 'Analyse erfolgreicher Quiz-Kategorien von Geschichte bis Popkultur mit Beispielen und konkreten Empfehlungen.',
  },
  {
    url: '/blog_and_tipps/ki-quiz-revolution',
    outDir: 'dist/client/blog_and_tipps/ki-quiz-revolution',
    title: 'Wie KI Quiz verbessert - PubQuiz Master',
    description: 'Wie KI Fragenerstellung, Faktenpruefung und Bewertung in modernen Quizformaten verbessert.',
  },
  {
    url: '/blog_and_tipps/quiz-bildung-lernen',
    outDir: 'dist/client/blog_and_tipps/quiz-bildung-lernen',
    title: 'Quiz fuer Bildung und Lernen - PubQuiz Master',
    description: 'Warum quizbasiertes Lernen effektiv ist: Testing-Effekt, Feedback-Loops und alltagstaugliche Lernroutinen.',
  },
  {
    url: '/about',
    outDir: 'dist/client/about',
    title: 'Ueber uns - PubQuiz Master',
    description: 'Mission, Standards und Qualitaetsanspruch von PubQuiz Master fuer verifizierbare Quiz- und Wissensinhalte.',
  },
  {
    url: '/contact',
    outDir: 'dist/client/contact',
    title: 'Kontakt - PubQuiz Master',
    description: 'Kontaktseite fuer Fragen zu Inhalten, Kooperationen und Werbeanfragen rund um PubQuiz Master.',
  },
  {
    url: '/privacy',
    outDir: 'dist/client/privacy',
    title: 'Datenschutz - PubQuiz Master',
    description: 'Datenschutzhinweise zu Cookies, Werbung, lokalen Speicherdaten und Drittanbieter-APIs bei PubQuiz Master.',
  },
  {
    url: '/imprint',
    outDir: 'dist/client/imprint',
    title: 'Impressum - PubQuiz Master',
    description: 'Rechtliche Anbieterkennzeichnung und Haftungshinweise fuer PubQuiz Master.',
  },
];

// Read the client-built HTML template
const templatePath = path.join(root, 'dist/client/index.html');
if (!fs.existsSync(templatePath)) {
  console.error('ERROR: dist/client/index.html not found. Run "npm run build:client" first.');
  process.exit(1);
}
const template = fs.readFileSync(templatePath, 'utf-8');

// Import the server entry (compiled by "build:server")
const serverEntryPath = path.join(root, 'dist/server/entry-server.js');
if (!fs.existsSync(serverEntryPath)) {
  console.error('ERROR: dist/server/entry-server.js not found. Run "npm run build:server" first.');
  process.exit(1);
}

const serverEntryUrl = pathToFileURL(serverEntryPath).href;
const { render } = await import(serverEntryUrl);

for (const { url, outDir, title, description } of routes) {
  const appHtml = render(url);
  let html = template;

  if (html.includes('<!--app-html-->')) {
    html = html.replace('<!--app-html-->', appHtml);
  } else {
    // Fallback if an external HTML minifier removed the marker comment.
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>/,
      `<div id="root">${appHtml}</div>`
    );
  }

  // Inject route-specific meta tags
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  );

  const fullOutDir = path.join(root, outDir);
  fs.mkdirSync(fullOutDir, { recursive: true });

  const outFile = path.join(fullOutDir, 'index.html');
  fs.writeFileSync(outFile, html);
  console.log(`Pre-rendered: ${url} → ${path.relative(root, outFile)}`);
}

console.log('Pre-rendering complete.');
