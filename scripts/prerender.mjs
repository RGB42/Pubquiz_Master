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

const { render } = await import(serverEntryPath);

for (const { url, outDir, title, description } of routes) {
  const appHtml = render(url);
  let html = template.replace('<!--app-html-->', appHtml);

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
