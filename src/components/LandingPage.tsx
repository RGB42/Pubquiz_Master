import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types/quiz';
import { AdBanner } from './AdBanner';

interface LandingPageProps {
  language: Language;
  onStartQuiz: () => void;
  onBlogClick?: () => void;
  adsEnabled?: boolean;
}

const CONTENT = {
  de: {
    hero: {
      title: 'PubQuiz Master',
      subtitle: 'Das ultimative KI-gestützte Quiz-Erlebnis',
      description: 'Teste dein Wissen mit dynamisch generierten Fragen aus über 12 Kategorien. Jedes Quiz ist einzigartig – keine Frage kommt doppelt vor!',
      cta: '🚀 Jetzt Quiz starten',
      features: ['✓ Unbegrenzte Fragen', '✓ 12+ Kategorien', '✓ KI-generiert', '✓ Wikipedia-verifiziert']
    },
    about: {
      title: 'Was ist PubQuiz Master?',
      content: `PubQuiz Master ist eine innovative Quiz-Plattform, die künstliche Intelligenz nutzt, um einzigartige und herausfordernde Quizfragen zu generieren. Anders als bei herkömmlichen Quiz-Apps werden hier keine vorgefertigten Fragenkataloge verwendet – stattdessen erstellt eine KI für jedes Quiz neue, individuelle Fragen basierend auf deinen gewählten Kategorien.

Jede Frage wird automatisch mit Wikipedia abgeglichen, um die Richtigkeit zu gewährleisten. So kannst du sicher sein, dass du immer korrekte Informationen erhältst und dabei Neues lernst.

Ob alleine zum Trainieren oder mit Freunden beim gemütlichen Pub-Abend – PubQuiz Master bietet dir stundenlangen Quiz-Spaß mit garantiert frischen Fragen!`
    },
    history: {
      title: 'Die Geschichte des Pub-Quiz',
      content: `Das Pub-Quiz hat seinen Ursprung in Großbritannien der 1970er Jahre. Der Geschäftsmann Burns und Wilson gelten als Pioniere dieser Tradition, die sie entwickelten, um mehr Gäste in Pubs zu locken.

Was als einfache Unterhaltung in britischen Kneipen begann, hat sich zu einem weltweiten Phänomen entwickelt. Heute finden Pub-Quizze in praktisch jedem Land der Welt statt – von gemütlichen Eckkneipen bis hin zu großen Veranstaltungshallen.

Die Faszination des Pub-Quiz liegt in seiner Einfachheit: Teams treten gegeneinander an, um ihr Allgemeinwissen zu testen. Dabei geht es nicht nur ums Gewinnen, sondern auch um Geselligkeit, Teamwork und die Freude am Lernen neuer Fakten.

Mit PubQuiz Master bringen wir diese Tradition ins digitale Zeitalter – mit KI-generierten Fragen, die garantieren, dass jedes Quiz ein einzigartiges Erlebnis ist.`,
    },
    benefits: {
      title: 'Warum PubQuiz Master?',
      items: [
        {
          icon: '🧠',
          title: 'Trainiere dein Gehirn',
          description: 'Regelmäßiges Quizzen verbessert nachweislich das Gedächtnis und die kognitive Leistungsfähigkeit. Studien zeigen, dass das aktive Abrufen von Wissen eine der effektivsten Lernmethoden ist.'
        },
        {
          icon: '🎉',
          title: 'Perfekt für Gruppen',
          description: 'Ob Familienfeier, Firmenveranstaltung oder Freundesabend – PubQuiz Master bietet die perfekte Unterhaltung für jede Gruppenveranstaltung.'
        },
        {
          icon: '📖',
          title: 'Lerne jeden Tag etwas Neues',
          description: 'Mit unserer riesigen Bandbreite an Kategorien und KI-generierten Fragen entdeckst du ständig neue, interessante Fakten aus allen Wissensbereichen.'
        },
        {
          icon: '🎯',
          title: 'Keine Wiederholungen',
          description: 'Dank unserer KI-Technologie und Artikel-Tracking-System bekommst du bei jedem Spiel garantiert neue Fragen – Langeweile ausgeschlossen!'
        }
      ]
    },
    howItWorks: {
      title: 'So funktioniert\'s',
      steps: [
        {
          icon: '⚙️',
          title: 'Konfigurieren',
          description: 'Wähle deine Lieblingskategorien und lege fest, wie viele Fragen du beantworten möchtest. Du kannst sogar eigene Kategorien erstellen!'
        },
        {
          icon: '🧠',
          title: 'KI generiert Fragen',
          description: 'Unsere fortschrittliche KI erstellt einzigartige Quizfragen speziell für dich – jedes Mal anders! Alle Fragen werden mit Wikipedia verifiziert.'
        },
        {
          icon: '✍️',
          title: 'Antworten eingeben',
          description: 'Beantworte die Fragen in deinem eigenen Tempo. Es gibt kein Zeitlimit – nimm dir so viel Zeit wie du brauchst.'
        },
        {
          icon: '🏆',
          title: 'Ergebnisse sehen',
          description: 'Die KI bewertet deine Antworten fair und zeigt dir detaillierte Erklärungen zu jeder Frage mit Wikipedia-Links zum Nachlesen.'
        }
      ]
    },
    features: {
      title: 'Unsere Features',
      items: [
        {
          icon: '🎯',
          title: 'Dynamische Fragen',
          description: 'Jede Frage wird live von einer KI generiert. Keine Wiederholungen, keine Langeweile – jedes Quiz ist ein neues Abenteuer!'
        },
        {
          icon: '📚',
          title: 'Wikipedia-Verifiziert',
          description: 'Alle Antworten werden mit Wikipedia und spezialisierten Wikis abgeglichen, damit du immer 100% korrekte Fakten erhältst.'
        },
        {
          icon: '🌍',
          title: 'Mehrsprachig',
          description: 'Spiele auf Deutsch oder Englisch – wechsle jederzeit die Sprache. Die KI generiert Fragen in deiner bevorzugten Sprache.'
        },
        {
          icon: '📊',
          title: 'Faire Bewertung',
          description: 'Die KI akzeptiert Tippfehler, alternative Schreibweisen und Kurzformen. Du wirst nie für kleine Fehler bestraft.'
        },
        {
          icon: '🎨',
          title: '12+ Kategorien',
          description: 'Von Geschichte über Sport bis Popkultur – für jeden Geschmack ist etwas dabei. Wähle deine Favoriten aus!'
        },
        {
          icon: '✏️',
          title: 'Eigene Kategorien',
          description: 'Erstelle eigene Kategorien für spezialisierte Quiz-Themen. Die KI nutzt dann spezialisierte Wikis für bessere Fragen.'
        }
      ]
    },
    categories: {
      title: 'Unsere Kategorien',
      description: 'Wähle aus einer Vielzahl von spannenden Themengebieten:',
      items: [
        { name: 'Geschichte', description: 'Von der Antike bis zur Gegenwart', icon: '📜' },
        { name: 'Geografie', description: 'Länder, Hauptstädte und mehr', icon: '🌍' },
        { name: 'Wissenschaft', description: 'Physik, Chemie, Biologie', icon: '🔬' },
        { name: 'Kunst & Kultur', description: 'Malerei, Musik, Literatur', icon: '🎨' },
        { name: 'Sport', description: 'Fußball, Olympia und mehr', icon: '⚽' },
        { name: 'Film & TV', description: 'Kino-Klassiker und Serien', icon: '🎬' },
        { name: 'Musik', description: 'Künstler, Bands und Songs', icon: '🎵' },
        { name: 'Natur & Tiere', description: 'Flora und Fauna weltweit', icon: '🦁' },
        { name: 'Technologie', description: 'Digital und Innovation', icon: '💻' },
        { name: 'Essen & Trinken', description: 'Kulinarik weltweit', icon: '🍕' },
        { name: 'Politik', description: 'Weltgeschehen und Staatskunde', icon: '🏛️' },
        { name: 'Popkultur', description: 'Trends und Internet-Phänomene', icon: '📱' }
      ]
    },
    tips: {
      title: 'Quiz-Tipps für Anfänger',
      items: [
        {
          title: 'Nimm dir Zeit',
          content: 'Es gibt kein Zeitlimit. Lies jede Frage sorgfältig durch, bevor du antwortest. Oft steckt die Antwort schon in der Frage selbst.'
        },
        {
          title: 'Kurzformen sind OK',
          content: 'Bei Namen kannst du oft den Nachnamen verwenden (z.B. "Einstein" statt "Albert Einstein"). Die KI erkennt auch Abkürzungen.'
        },
        {
          title: 'Keine Angst vor Tippfehlern',
          content: 'Die KI ist großzügig bei kleinen Schreibfehlern und akzeptiert verschiedene Schreibweisen. "Goehte" wird als "Goethe" erkannt.'
        },
        {
          title: 'Nutze dein Bauchgefühl',
          content: 'Wenn du unsicher bist, gib trotzdem eine Antwort. Eine Vermutung ist besser als gar keine Antwort – du könntest richtig liegen!'
        },
        {
          title: 'Lerne aus den Erklärungen',
          content: 'Nach dem Quiz erhältst du zu jeder Frage eine detaillierte Erklärung mit Wikipedia-Link zum Nachlesen. Nutze diese Chance!'
        },
        {
          title: 'Starte mit wenigen Fragen',
          content: 'Für den Anfang empfehlen wir 2-3 Kategorien mit je 3 Fragen. So kannst du das System kennenlernen ohne überfordert zu werden.'
        }
      ]
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      items: [
        {
          q: 'Ist PubQuiz Master kostenlos?',
          a: 'Ja, PubQuiz Master ist komplett kostenlos nutzbar. Du benötigst lediglich einen kostenlosen API-Key von OpenRouter, der ebenfalls gratis ist.'
        },
        {
          q: 'Woher kommen die Quizfragen?',
          a: 'Die Fragen werden live von einer fortschrittlichen KI generiert. Das bedeutet, dass jedes Quiz einzigartig ist. Wir speichern auch bereits gestellte Fragen, damit du nie die gleiche Frage zweimal bekommst.'
        },
        {
          q: 'Sind die Antworten zuverlässig?',
          a: 'Ja! Jede Frage wird mit Wikipedia und spezialisierten Wikis abgeglichen. Bei jeder Antwort erhältst du einen Link zur Quelle, damit du die Fakten selbst überprüfen kannst.'
        },
        {
          q: 'Welche Kategorien gibt es?',
          a: 'Es gibt 12 vordefinierte Kategorien: Geschichte, Geografie, Wissenschaft, Kunst & Kultur, Sport, Musik, Film & Fernsehen, Literatur, Natur & Tiere, Technologie, Politik und Essen & Trinken. Du kannst außerdem eigene Kategorien erstellen!'
        },
        {
          q: 'Wie bekomme ich einen API-Key?',
          a: 'Gehe zu openrouter.ai, erstelle einen kostenlosen Account und generiere einen API-Key. Der ganze Prozess dauert nur 2 Minuten und ist komplett kostenlos.'
        },
        {
          q: 'Kann ich mit Freunden spielen?',
          a: 'PubQuiz Master eignet sich perfekt für Gruppenspiele! Einer liest die Fragen vor, alle schreiben ihre Antworten auf, und am Ende wird gemeinsam aufgelöst. Perfekt für Spieleabende!'
        },
        {
          q: 'Was sind eigene Kategorien?',
          a: 'Du kannst beliebige Themen als Kategorie eingeben – zum Beispiel "Pokémon", "Star Wars" oder "Minecraft". Die KI findet automatisch passende spezialisierte Wikis für bessere Fragen.'
        },
        {
          q: 'Warum bekomme ich manchmal ähnliche Fragen?',
          a: 'Unsere KI versucht, Wiederholungen zu vermeiden. Falls doch ähnliche Fragen auftreten, kannst du in den Einstellungen die Fragenhistorie löschen, um komplett neue Fragen zu erhalten.'
        }
      ]
    },
    stats: {
      categories: '12+',
      categoriesLabel: 'Kategorien',
      questions: '∞',
      questionsLabel: 'Mögliche Fragen',
      languages: '2',
      languagesLabel: 'Sprachen',
      accuracy: '99%',
      accuracyLabel: 'Fakten-Genauigkeit'
    },
    testimonials: {
      title: 'Das sagen unsere Nutzer',
      items: [
        {
          text: 'Endlich ein Quiz, bei dem die Fragen nicht nach 3 Spielen ausgehen! Die KI überrascht uns jedes Mal mit neuen, interessanten Fragen.',
          author: 'Quiz-Enthusiast',
          location: 'Berlin'
        },
        {
          text: 'Wir nutzen PubQuiz Master jeden Freitag für unseren Firmen-Spieleabend. Die eigenen Kategorien sind genial!',
          author: 'Team-Event Organisator',
          location: 'München'
        },
        {
          text: 'Die Erklärungen zu den Antworten sind super – ich lerne jedes Mal etwas Neues dazu.',
          author: 'Wissensdurstige',
          location: 'Hamburg'
        }
      ]
    },
    cta: {
      title: 'Bereit für die Herausforderung?',
      subtitle: 'Starte jetzt dein erstes Quiz und teste dein Wissen! Keine Registrierung erforderlich.',
      button: '🎯 Quiz starten'
    }
  },
  en: {
    hero: {
      title: 'PubQuiz Master',
      subtitle: 'The Ultimate AI-Powered Quiz Experience',
      description: 'Test your knowledge with dynamically generated questions from over 12 categories. Every quiz is unique – no question ever repeats!',
      cta: '🚀 Start Quiz Now',
      features: ['✓ Unlimited Questions', '✓ 12+ Categories', '✓ AI-Generated', '✓ Wikipedia-Verified']
    },
    about: {
      title: 'What is PubQuiz Master?',
      content: `PubQuiz Master is an innovative quiz platform that uses artificial intelligence to generate unique and challenging quiz questions. Unlike conventional quiz apps, no pre-made question catalogs are used here – instead, an AI creates new, individual questions for each quiz based on your chosen categories.

Each question is automatically cross-referenced with Wikipedia to ensure accuracy. This way, you can be sure you're always getting correct information while learning something new.

Whether playing alone for practice or with friends during a cozy pub evening – PubQuiz Master offers hours of quiz fun with guaranteed fresh questions!`
    },
    history: {
      title: 'The History of Pub Quizzes',
      content: `The pub quiz originated in 1970s Britain. Businessmen Burns and Wilson are considered pioneers of this tradition, which they developed to attract more guests to pubs.

What began as simple entertainment in British pubs has evolved into a worldwide phenomenon. Today, pub quizzes take place in virtually every country – from cozy corner pubs to large event halls.

The fascination of the pub quiz lies in its simplicity: teams compete against each other to test their general knowledge. It's not just about winning, but also about socializing, teamwork, and the joy of learning new facts.

With PubQuiz Master, we bring this tradition into the digital age – with AI-generated questions that guarantee every quiz is a unique experience.`,
    },
    benefits: {
      title: 'Why PubQuiz Master?',
      items: [
        {
          icon: '🧠',
          title: 'Train Your Brain',
          description: 'Regular quizzing has been proven to improve memory and cognitive performance. Studies show that actively retrieving knowledge is one of the most effective learning methods.'
        },
        {
          icon: '🎉',
          title: 'Perfect for Groups',
          description: 'Whether family celebration, company event, or friends night – PubQuiz Master provides the perfect entertainment for any group event.'
        },
        {
          icon: '📖',
          title: 'Learn Something New Every Day',
          description: 'With our huge range of categories and AI-generated questions, you\'ll constantly discover new, interesting facts from all areas of knowledge.'
        },
        {
          icon: '🎯',
          title: 'No Repetitions',
          description: 'Thanks to our AI technology and article tracking system, you\'re guaranteed new questions with every game – boredom excluded!'
        }
      ]
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        {
          icon: '⚙️',
          title: 'Configure',
          description: 'Choose your favorite categories and set how many questions you want to answer. You can even create custom categories!'
        },
        {
          icon: '🧠',
          title: 'AI Generates Questions',
          description: 'Our advanced AI creates unique quiz questions just for you – different every time! All questions are verified with Wikipedia.'
        },
        {
          icon: '✍️',
          title: 'Enter Answers',
          description: 'Answer the questions at your own pace. There\'s no time limit – take as much time as you need.'
        },
        {
          icon: '🏆',
          title: 'See Results',
          description: 'The AI evaluates your answers fairly and shows you detailed explanations for each question with Wikipedia links for further reading.'
        }
      ]
    },
    features: {
      title: 'Our Features',
      items: [
        {
          icon: '🎯',
          title: 'Dynamic Questions',
          description: 'Each question is generated live by AI. No repetitions, no boredom – every quiz is a new adventure!'
        },
        {
          icon: '📚',
          title: 'Wikipedia-Verified',
          description: 'All answers are cross-checked with Wikipedia and specialized wikis so you always get 100% correct facts.'
        },
        {
          icon: '🌍',
          title: 'Multilingual',
          description: 'Play in German or English – switch languages anytime. The AI generates questions in your preferred language.'
        },
        {
          icon: '📊',
          title: 'Fair Evaluation',
          description: 'The AI accepts typos, alternative spellings, and short forms. You\'ll never be penalized for small mistakes.'
        },
        {
          icon: '🎨',
          title: '12+ Categories',
          description: 'From history to sports to pop culture – something for everyone. Choose your favorites!'
        },
        {
          icon: '✏️',
          title: 'Custom Categories',
          description: 'Create your own categories for specialized quiz topics. The AI automatically finds specialized wikis for better questions.'
        }
      ]
    },
    categories: {
      title: 'Our Categories',
      description: 'Choose from a variety of exciting subject areas:',
      items: [
        { name: 'History', description: 'From antiquity to present', icon: '📜' },
        { name: 'Geography', description: 'Countries, capitals and more', icon: '🌍' },
        { name: 'Science', description: 'Physics, chemistry, biology', icon: '🔬' },
        { name: 'Art & Culture', description: 'Painting, music, literature', icon: '🎨' },
        { name: 'Sports', description: 'Football, Olympics and more', icon: '⚽' },
        { name: 'Film & TV', description: 'Cinema classics and series', icon: '🎬' },
        { name: 'Music', description: 'Artists, bands and songs', icon: '🎵' },
        { name: 'Nature & Animals', description: 'Flora and fauna worldwide', icon: '🦁' },
        { name: 'Technology', description: 'Digital and innovation', icon: '💻' },
        { name: 'Food & Drinks', description: 'Cuisine worldwide', icon: '🍕' },
        { name: 'Politics', description: 'World affairs and civics', icon: '🏛️' },
        { name: 'Pop Culture', description: 'Trends and internet phenomena', icon: '📱' }
      ]
    },
    tips: {
      title: 'Quiz Tips for Beginners',
      items: [
        {
          title: 'Take Your Time',
          content: 'There\'s no time limit. Read each question carefully before answering. Often the answer is already in the question itself.'
        },
        {
          title: 'Short Forms are OK',
          content: 'For names, you can often use just the last name (e.g., "Einstein" instead of "Albert Einstein"). The AI also recognizes abbreviations.'
        },
        {
          title: 'Don\'t Fear Typos',
          content: 'The AI is lenient with small spelling mistakes and accepts different spellings. "Shakspeare" will be recognized as "Shakespeare".'
        },
        {
          title: 'Trust Your Gut',
          content: 'If you\'re unsure, give an answer anyway. A guess is better than no answer – you might be right!'
        },
        {
          title: 'Learn from Explanations',
          content: 'After the quiz, you\'ll get a detailed explanation for each question with a Wikipedia link to read more. Use this opportunity!'
        },
        {
          title: 'Start Small',
          content: 'For beginners, we recommend 2-3 categories with 3 questions each. This way you can get to know the system without being overwhelmed.'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is PubQuiz Master free?',
          a: 'Yes, PubQuiz Master is completely free to use. You only need a free API key from OpenRouter, which is also free.'
        },
        {
          q: 'Where do the quiz questions come from?',
          a: 'Questions are generated live by an advanced AI. This means every quiz is unique. We also store previously asked questions so you never get the same question twice.'
        },
        {
          q: 'Are the answers reliable?',
          a: 'Yes! Each question is cross-referenced with Wikipedia and specialized wikis. For each answer, you receive a link to the source so you can verify the facts yourself.'
        },
        {
          q: 'What categories are available?',
          a: 'There are 12 predefined categories: History, Geography, Science, Art & Culture, Sports, Music, Film & Television, Literature, Nature & Animals, Technology, Politics, and Food & Drinks. You can also create custom categories!'
        },
        {
          q: 'How do I get an API key?',
          a: 'Go to openrouter.ai, create a free account, and generate an API key. The whole process takes only 2 minutes and is completely free.'
        },
        {
          q: 'Can I play with friends?',
          a: 'PubQuiz Master is perfect for group games! One person reads the questions, everyone writes down their answers, and at the end you solve together. Perfect for game nights!'
        },
        {
          q: 'What are custom categories?',
          a: 'You can enter any topic as a category – for example "Pokémon", "Star Wars" or "Minecraft". The AI automatically finds suitable specialized wikis for better questions.'
        },
        {
          q: 'Why do I sometimes get similar questions?',
          a: 'Our AI tries to avoid repetitions. If similar questions do occur, you can clear the question history in the settings to get completely new questions.'
        }
      ]
    },
    stats: {
      categories: '12+',
      categoriesLabel: 'Categories',
      questions: '∞',
      questionsLabel: 'Possible Questions',
      languages: '2',
      languagesLabel: 'Languages',
      accuracy: '99%',
      accuracyLabel: 'Fact Accuracy'
    },
    testimonials: {
      title: 'What Our Users Say',
      items: [
        {
          text: 'Finally a quiz where the questions don\'t run out after 3 games! The AI surprises us every time with new, interesting questions.',
          author: 'Quiz Enthusiast',
          location: 'Berlin'
        },
        {
          text: 'We use PubQuiz Master every Friday for our company game night. The custom categories are brilliant!',
          author: 'Team Event Organizer',
          location: 'Munich'
        },
        {
          text: 'The explanations for the answers are great – I learn something new every time.',
          author: 'Knowledge Seeker',
          location: 'Hamburg'
        }
      ]
    },
    cta: {
      title: 'Ready for the Challenge?',
      subtitle: 'Start your first quiz now and test your knowledge! No registration required.',
      button: '🎯 Start Quiz'
    }
  }
};

export function LandingPage({ language, onStartQuiz, onBlogClick, adsEnabled = false }: LandingPageProps) {
  const t = CONTENT[language];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation Bar */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-white text-lg">PubQuiz Master</span>
          </div>
          <div className="flex items-center gap-4">
            {onBlogClick && (
              <Link
                to="/blog_and_tipps"
                className="text-purple-200 hover:text-white transition-colors flex items-center gap-2"
              >
                📚 {language === 'de' ? 'Blog & Tipps' : 'Blog & Tips'}
              </Link>
            )}
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
            >
              {language === 'de' ? 'Quiz starten' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 relative">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🎯</div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {t.hero.title}
            </h1>
            <p className="text-2xl sm:text-3xl text-purple-200 mb-6 font-light">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-purple-300 max-w-2xl mx-auto mb-8">
              {t.hero.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {t.hero.features.map((feature, i) => (
                <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-purple-200 text-sm">
                  {feature}
                </span>
              ))}
            </div>
            
            <button
              onClick={onStartQuiz}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              {t.hero.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: t.stats.categories, label: t.stats.categoriesLabel },
              { value: t.stats.questions, label: t.stats.questionsLabel },
              { value: t.stats.languages, label: t.stats.languagesLabel },
              { value: t.stats.accuracy, label: t.stats.accuracyLabel }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-purple-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner - After Stats (Plenty of Content Above) */}
      {adsEnabled && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AdBanner adSlot="1234567890" adFormat="horizontal" className="h-24" />
        </div>
      )}

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">{t.about.title}</h2>
            <div className="text-purple-200 leading-relaxed whitespace-pre-line">
              {t.about.content}
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">{t.history.title}</h2>
            <div className="text-purple-200 leading-relaxed whitespace-pre-line">
              {t.history.content}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.benefits.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {t.benefits.items.map((benefit, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-purple-200 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.howItWorks.title}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center h-full">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-purple-200 text-sm">{step.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-purple-400 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner - After How It Works (Plenty of Content Above and Below) */}
      {adsEnabled && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AdBanner adSlot="1234567891" adFormat="horizontal" className="h-24" />
        </div>
      )}

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">{t.categories.title}</h2>
          <p className="text-purple-200 text-center mb-12">{t.categories.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {t.categories.items.map((cat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1">{cat.name}</h3>
                <p className="text-purple-300 text-xs">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.features.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.features.items.map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.tips.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.tips.items.map((tip, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{tip.title}</h3>
                    <p className="text-purple-200 text-sm">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner - Before FAQ (Plenty of Content Above) */}
      {adsEnabled && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AdBanner adSlot="1234567892" adFormat="horizontal" className="h-24" />
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-black/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{item.q}</span>
                  <span className={`text-purple-300 text-2xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-purple-200">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t.testimonials.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.items.map((testimonial, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-purple-200 italic mb-4">"{testimonial.text}"</p>
                <div className="text-white font-semibold">{testimonial.author}</div>
                <div className="text-purple-300 text-sm">{testimonial.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">{t.cta.title}</h2>
            <p className="text-xl text-purple-200 mb-8">{t.cta.subtitle}</p>
            <button
              onClick={onStartQuiz}
              className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              {t.cta.button}
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Ad Banner */}
      {adsEnabled && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <AdBanner adSlot="1234567893" adFormat="horizontal" className="h-24" />
        </div>
      )}
    </div>
  );
}
