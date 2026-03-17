import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Language } from '../types/quiz';

interface InfoPageProps {
  language: Language;
}

function InfoPageLayout({ language, title, updatedAt, children }: { language: Language; title: string; updatedAt: string; children: ReactNode }) {
  const homeLabel = language === 'de' ? 'Zur Startseite' : 'Back to Home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-purple-300 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">
          {'\u2190'} {homeLabel}
        </Link>

        <article className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-gray-100">
          <header className="mb-8 pb-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-sm text-purple-200">{language === 'de' ? 'Zuletzt aktualisiert:' : 'Last updated:'} {updatedAt}</p>
          </header>
          <div className="space-y-6 leading-relaxed">{children}</div>
        </article>
      </div>
    </div>
  );
}

export function AboutPage({ language }: InfoPageProps) {
  return (
    <InfoPageLayout language={language} title={language === 'de' ? 'Ueber PubQuiz Master' : 'About PubQuiz Master'} updatedAt="2026-03-17">
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Mission' : 'Mission'}</h2>
        <p>
          {language === 'de'
            ? 'PubQuiz Master verbindet Spielspass mit verifizierbarem Wissen. Unser Ziel ist ein Quiz-Erlebnis, das unterhaelt und gleichzeitig sauber recherchierte Inhalte liefert.'
            : 'PubQuiz Master combines game fun with verifiable knowledge. Our goal is a quiz experience that entertains while delivering properly researched content.'}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Editorial Standards' : 'Editorial Standards'}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>{language === 'de' ? 'Inhalte werden regelmaessig geprueft und aktualisiert.' : 'Content is reviewed and updated regularly.'}</li>
          <li>{language === 'de' ? 'Blogbeitraege enthalten Autor, Datum und Quellenhinweise.' : 'Blog posts include author, date, and source references.'}</li>
          <li>{language === 'de' ? 'Quizinhalte werden mit Wikipedia und Fachquellen gegengeprueft.' : 'Quiz content is cross-checked with Wikipedia and specialist sources.'}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Fuer wen ist die Seite?' : 'Who is this for?'}</h2>
        <p>
          {language === 'de'
            ? 'Fuer Quiz-Teams, Lehrkraefte, Veranstalter und alle, die Allgemeinwissen strukturiert trainieren moechten.'
            : 'For quiz teams, teachers, event hosts, and anyone who wants to train general knowledge in a structured way.'}
        </p>
      </section>
    </InfoPageLayout>
  );
}

export function ContactPage({ language }: InfoPageProps) {
  return (
    <InfoPageLayout language={language} title={language === 'de' ? 'Kontakt' : 'Contact'} updatedAt="2026-03-17">
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Kontaktmoeglichkeiten' : 'Contact Options'}</h2>
        <p>{language === 'de' ? 'Bei Fragen zu Inhalten, Werbung oder Kooperationen erreichst du uns ueber:' : 'For questions about content, advertising, or partnerships, reach us via:'}</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Email: zutoruffy@gmail.com</li>
          <li>{language === 'de' ? 'Antwortzeit in der Regel: 1-3 Werktage' : 'Typical response time: 1-3 business days'}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Presse und Kooperation' : 'Press and Partnerships'}</h2>
        <p>{language === 'de' ? 'Bitte den Betreff PRESSE oder KOOPERATION verwenden, damit wir deine Anfrage schneller zuordnen koennen.' : 'Please use subject line PRESS or PARTNERSHIP so we can route your request quickly.'}</p>
      </section>
    </InfoPageLayout>
  );
}

export function PrivacyPageStatic({ language }: InfoPageProps) {
  return (
    <InfoPageLayout language={language} title={language === 'de' ? 'Datenschutzerklaerung' : 'Privacy Policy'} updatedAt="2026-03-17">
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">1. Verantwortlicher</h2>
        <p>PubQuiz Master Team, contact@pubquiz-master.example</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">2. Verarbeitete Daten</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>{language === 'de' ? 'Lokale Einstellungen (Sprache, Cookie-Praeferenzen)' : 'Local settings (language, cookie preferences)'}</li>
          <li>{language === 'de' ? 'Nutzungsdaten fuer die Quizfunktion ueber Drittanbieter-APIs' : 'Usage data for quiz functionality via third-party APIs'}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">3. Werbung</h2>
        <p>{language === 'de' ? 'Google AdSense wird nur nach Einwilligung aktiviert. Rechtsgrundlage: Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.' : 'Google AdSense is enabled only after consent. Legal basis: consent according to Art. 6(1)(a) GDPR.'}</p>
      </section>
    </InfoPageLayout>
  );
}

export function ImprintPageStatic({ language }: InfoPageProps) {
  return (
    <InfoPageLayout language={language} title={language === 'de' ? 'Impressum' : 'Legal Notice'} updatedAt="2026-03-17">
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Angaben gemaess § 5 TMG' : 'Information according to German TMG'}</h2>
        <p>PubQuiz Master Team</p>
        <p>contact@pubquiz-master.example</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">{language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}</h2>
        <p>{language === 'de' ? 'Trotz sorgfaeltiger Erstellung uebernehmen wir keine Gewaehr fuer Vollstaendigkeit, Korrektheit und Aktualitaet aller Inhalte.' : 'Despite careful preparation, we cannot guarantee completeness, accuracy, and timeliness of all content.'}</p>
      </section>
    </InfoPageLayout>
  );
}
