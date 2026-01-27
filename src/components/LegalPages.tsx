import { Language } from '../types/quiz';

interface LegalPageProps {
  language: Language;
  onClose: () => void;
}

const PRIVACY_DE = `
# Datenschutzerklärung

**Stand: Januar 2025**

## 1. Verantwortlicher

[Ihr Name / Ihre Firma]
[Ihre Adresse]
[Ihre E-Mail-Adresse]

## 2. Allgemeine Hinweise

Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website PubQuiz Master.

## 3. Hosting und Content Delivery Networks (CDN)

Diese Website wird bei Render (Render Services, Inc., USA) gehostet. Details zur Datenverarbeitung finden Sie in deren Datenschutzerklärung: https://render.com/privacy

## 4. Erhebung und Speicherung personenbezogener Daten

### 4.1 Lokale Speicherung (LocalStorage)
Wir speichern folgende Daten lokal in Ihrem Browser:
- API-Key (für die Verbindung zu OpenRouter)
- Spracheinstellungen
- Ausgewählte Kategorien
- Modelleinstellungen
- Cookie-Präferenzen

Diese Daten werden **nicht** an unsere Server übertragen.

### 4.2 API-Kommunikation
Bei der Nutzung des Quiz werden Anfragen an folgende Dienste gesendet:
- **OpenRouter API**: Zur Generierung und Auswertung von Quizfragen
- **Wikipedia API**: Zur Verifizierung von Fakten

## 5. Cookies und Tracking

### 5.1 Notwendige Cookies
Wir verwenden technisch notwendige Cookies für:
- Speicherung Ihrer Cookie-Präferenzen

### 5.2 Google AdSense (Werbung)
Sofern Sie zugestimmt haben, nutzen wir Google AdSense zur Anzeige von Werbung.

**Google Ireland Limited**
Gordon House, Barrow Street
Dublin 4, Irland

Google AdSense verwendet Cookies, um Ihnen personalisierte Werbung anzuzeigen. Weitere Informationen:
- Google Datenschutzerklärung: https://policies.google.com/privacy
- Personalisierte Werbung deaktivieren: https://www.google.com/settings/ads

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)

## 6. Ihre Rechte

Sie haben das Recht auf:
- Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)
- Berichtigung unrichtiger Daten (Art. 16 DSGVO)
- Löschung Ihrer Daten (Art. 17 DSGVO)
- Einschränkung der Verarbeitung (Art. 18 DSGVO)
- Datenübertragbarkeit (Art. 20 DSGVO)
- Widerspruch (Art. 21 DSGVO)
- Widerruf Ihrer Einwilligung (Art. 7 Abs. 3 DSGVO)

## 7. Widerruf Ihrer Einwilligung

Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie Ihre Browser-Cookies löschen und die Seite neu laden.

## 8. Beschwerderecht

Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.

## 9. Änderungen

Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen anzupassen.
`;

const PRIVACY_EN = `
# Privacy Policy

**Last updated: January 2025**

## 1. Data Controller

[Your Name / Company]
[Your Address]
[Your Email Address]

## 2. General Information

This privacy policy informs you about the nature, scope and purpose of processing personal data on our website PubQuiz Master.

## 3. Hosting and Content Delivery Networks (CDN)

This website is hosted by Render (Render Services, Inc., USA). Details on data processing can be found in their privacy policy: https://render.com/privacy

## 4. Collection and Storage of Personal Data

### 4.1 Local Storage
We store the following data locally in your browser:
- API Key (for connection to OpenRouter)
- Language settings
- Selected categories
- Model settings
- Cookie preferences

This data is **not** transmitted to our servers.

### 4.2 API Communication
When using the quiz, requests are sent to:
- **OpenRouter API**: For generating and evaluating quiz questions
- **Wikipedia API**: For fact verification

## 5. Cookies and Tracking

### 5.1 Necessary Cookies
We use technically necessary cookies for:
- Storing your cookie preferences

### 5.2 Google AdSense (Advertising)
If you have consented, we use Google AdSense to display advertisements.

**Google Ireland Limited**
Gordon House, Barrow Street
Dublin 4, Ireland

Google AdSense uses cookies to show you personalized advertising. More information:
- Google Privacy Policy: https://policies.google.com/privacy
- Disable personalized ads: https://www.google.com/settings/ads

**Legal basis:** Art. 6(1)(a) GDPR (Consent)

## 6. Your Rights

You have the right to:
- Access your stored data (Art. 15 GDPR)
- Rectification of incorrect data (Art. 16 GDPR)
- Erasure of your data (Art. 17 GDPR)
- Restriction of processing (Art. 18 GDPR)
- Data portability (Art. 20 GDPR)
- Object (Art. 21 GDPR)
- Withdraw your consent (Art. 7(3) GDPR)

## 7. Withdrawal of Consent

You can change your cookie settings at any time by deleting your browser cookies and reloading the page.

## 8. Right to Complain

You have the right to lodge a complaint with a data protection supervisory authority.

## 9. Changes

We reserve the right to adapt this privacy policy to adapt it to changed legal situations.
`;

const IMPRINT_DE = `
# Impressum

**Angaben gemäß § 5 TMG**

[Ihr vollständiger Name]
[Straße und Hausnummer]
[PLZ und Ort]
[Land]

**Kontakt:**
E-Mail: [Ihre E-Mail-Adresse]

**Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:**
[Ihr Name]
[Adresse wie oben]

## Haftungsausschluss

### Haftung für Inhalte
Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.

### Haftung für Links
Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.

### Urheberrecht
Die Inhalte dieser Website sind urheberrechtlich geschützt. Die Vervielfältigung oder Verwendung bedarf der vorherigen Zustimmung.

## EU-Streitschlichtung

Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr
`;

const IMPRINT_EN = `
# Legal Notice (Imprint)

**Information according to § 5 TMG (German Telemedia Act)**

[Your Full Name]
[Street and House Number]
[Postal Code and City]
[Country]

**Contact:**
Email: [Your Email Address]

**Responsible for content according to § 55 Abs. 2 RStV:**
[Your Name]
[Address as above]

## Disclaimer

### Liability for Content
The contents of our pages have been created with the utmost care. However, we cannot guarantee the accuracy, completeness and timeliness of the content.

### Liability for Links
Our website contains links to external websites of third parties, over whose content we have no influence. The respective provider is always responsible for the content of the linked pages.

### Copyright
The contents of this website are protected by copyright. Reproduction or use requires prior consent.

## EU Dispute Resolution

The European Commission provides a platform for online dispute resolution (OS): https://ec.europa.eu/consumers/odr
`;

export function PrivacyPage({ language, onClose }: LegalPageProps) {
  const content = language === 'de' ? PRIVACY_DE : PRIVACY_EN;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'de' ? '📜 Datenschutzerklärung' : '📜 Privacy Policy'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-6 mb-2">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-4 mb-1">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {language === 'de' ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImprintPage({ language, onClose }: LegalPageProps) {
  const content = language === 'de' ? IMPRINT_DE : IMPRINT_EN;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'de' ? '📋 Impressum' : '📋 Legal Notice'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-6 mb-2">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-4 mb-1">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {language === 'de' ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
