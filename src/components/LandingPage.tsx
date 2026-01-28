import { useState } from 'react';
import { Language } from '../types/quiz';

interface LandingPageProps {
  language: Language;
  onStartQuiz: () => void;
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
    howItWorks: {
      title: 'So funktioniert\'s',
      steps: [
        {
          icon: '⚙️',
          title: 'Konfigurieren',
          description: 'Wähle deine Lieblingskategorien und lege fest, wie viele Fragen du beantworten möchtest.'
        },
        {
          icon: '🧠',
          title: 'KI generiert Fragen',
          description: 'Unsere KI erstellt einzigartige Quizfragen speziell für dich – jedes Mal anders!'
        },
        {
          icon: '✍️',
          title: 'Antworten eingeben',
          description: 'Beantworte die Fragen in deinem eigenen Tempo. Locke jede Antwort ein, bevor es weitergeht.'
        },
        {
          icon: '🏆',
          title: 'Ergebnisse sehen',
          description: 'Die KI bewertet deine Antworten fair und zeigt dir detaillierte Erklärungen zu jeder Frage.'
        }
      ]
    },
    features: {
      title: 'Unsere Features',
      items: [
        {
          icon: '🎯',
          title: 'Dynamische Fragen',
          description: 'Jede Frage wird live von einer KI generiert. Keine Wiederholungen, keine Langeweile!'
        },
        {
          icon: '📚',
          title: 'Wikipedia-Verifiziert',
          description: 'Alle Antworten werden mit Wikipedia abgeglichen, damit du immer korrekte Fakten erhältst.'
        },
        {
          icon: '🌍',
          title: 'Mehrsprachig',
          description: 'Spiele auf Deutsch oder Englisch – wechsle jederzeit die Sprache.'
        },
        {
          icon: '📊',
          title: 'Faire Bewertung',
          description: 'Die KI akzeptiert auch Tippfehler und alternative Schreibweisen.'
        },
        {
          icon: '🎨',
          title: '12+ Kategorien',
          description: 'Von Geschichte über Sport bis Popkultur – für jeden Geschmack ist etwas dabei.'
        },
        {
          icon: '✏️',
          title: 'Eigene Kategorien',
          description: 'Erstelle eigene Kategorien für spezialisierte Quiz-Themen.'
        }
      ]
    },
    tips: {
      title: 'Quiz-Tipps für Anfänger',
      items: [
        {
          title: 'Nimm dir Zeit',
          content: 'Es gibt kein Zeitlimit. Lies jede Frage sorgfältig durch, bevor du antwortest.'
        },
        {
          title: 'Kurzformen sind OK',
          content: 'Bei Namen kannst du oft den Nachnamen verwenden (z.B. "Einstein" statt "Albert Einstein").'
        },
        {
          title: 'Keine Angst vor Tippfehlern',
          content: 'Die KI ist großzügig bei kleinen Schreibfehlern und akzeptiert verschiedene Schreibweisen.'
        },
        {
          title: 'Nutze dein Bauchgefühl',
          content: 'Wenn du unsicher bist, gib trotzdem eine Antwort. Eine Vermutung ist besser als gar keine Antwort!'
        },
        {
          title: 'Lerne aus den Erklärungen',
          content: 'Nach dem Quiz erhältst du zu jeder Frage eine Erklärung mit Wikipedia-Link zum Nachlesen.'
        },
        {
          title: 'Starte mit wenigen Fragen',
          content: 'Für den Anfang empfehlen wir 2-3 Kategorien mit je 3 Fragen. So kannst du das System kennenlernen.'
        }
      ]
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      items: [
        {
          q: 'Ist PubQuiz Master kostenlos?',
          a: 'Ja, PubQuiz Master ist komplett kostenlos nutzbar. Du benötigst lediglich einen kostenlosen API-Key von OpenRouter.'
        },
        {
          q: 'Woher kommen die Quizfragen?',
          a: 'Die Fragen werden live von einer KI generiert. Das bedeutet, dass jedes Quiz einzigartig ist und keine Frage doppelt vorkommt.'
        },
        {
          q: 'Sind die Antworten zuverlässig?',
          a: 'Ja! Jede Frage wird mit Wikipedia abgeglichen. Zusätzlich kannst du nach dem Quiz jeden Fakt über den Wikipedia-Link selbst überprüfen.'
        },
        {
          q: 'Welche Kategorien gibt es?',
          a: 'Es gibt 12 vordefinierte Kategorien: Geschichte, Geografie, Wissenschaft, Kunst & Kultur, Sport, Musik, Film & Fernsehen, Literatur, Natur & Tiere, Technologie, Politik und Essen & Trinken. Du kannst auch eigene Kategorien erstellen!'
        },
        {
          q: 'Wie bekomme ich einen API-Key?',
          a: 'Gehe zu openrouter.ai, erstelle einen kostenlosen Account und generiere einen API-Key. Der ganze Prozess dauert nur 2 Minuten.'
        },
        {
          q: 'Kann ich mit Freunden spielen?',
          a: 'PubQuiz Master eignet sich perfekt für Gruppenspiele! Einer liest die Fragen vor, alle schreiben ihre Antworten auf, und am Ende wird gemeinsam aufgelöst.'
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
    cta: {
      title: 'Bereit für die Herausforderung?',
      subtitle: 'Starte jetzt dein erstes Quiz und teste dein Wissen!',
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
    howItWorks: {
      title: 'How It Works',
      steps: [
        {
          icon: '⚙️',
          title: 'Configure',
          description: 'Choose your favorite categories and set how many questions you want to answer.'
        },
        {
          icon: '🧠',
          title: 'AI Generates Questions',
          description: 'Our AI creates unique quiz questions just for you – different every time!'
        },
        {
          icon: '✍️',
          title: 'Enter Answers',
          description: 'Answer the questions at your own pace. Lock in each answer before moving on.'
        },
        {
          icon: '🏆',
          title: 'See Results',
          description: 'The AI evaluates your answers fairly and shows you detailed explanations for each question.'
        }
      ]
    },
    features: {
      title: 'Our Features',
      items: [
        {
          icon: '🎯',
          title: 'Dynamic Questions',
          description: 'Each question is generated live by AI. No repetitions, no boredom!'
        },
        {
          icon: '📚',
          title: 'Wikipedia-Verified',
          description: 'All answers are cross-checked with Wikipedia so you always get correct facts.'
        },
        {
          icon: '🌍',
          title: 'Multilingual',
          description: 'Play in German or English – switch languages anytime.'
        },
        {
          icon: '📊',
          title: 'Fair Evaluation',
          description: 'The AI also accepts typos and alternative spellings.'
        },
        {
          icon: '🎨',
          title: '12+ Categories',
          description: 'From history to sports to pop culture – something for everyone.'
        },
        {
          icon: '✏️',
          title: 'Custom Categories',
          description: 'Create your own categories for specialized quiz topics.'
        }
      ]
    },
    tips: {
      title: 'Quiz Tips for Beginners',
      items: [
        {
          title: 'Take Your Time',
          content: 'There\'s no time limit. Read each question carefully before answering.'
        },
        {
          title: 'Short Forms are OK',
          content: 'For names, you can often use just the last name (e.g., "Einstein" instead of "Albert Einstein").'
        },
        {
          title: 'Don\'t Fear Typos',
          content: 'The AI is lenient with small spelling mistakes and accepts different spellings.'
        },
        {
          title: 'Trust Your Gut',
          content: 'If you\'re unsure, give an answer anyway. A guess is better than no answer!'
        },
        {
          title: 'Learn from Explanations',
          content: 'After the quiz, you\'ll get an explanation for each question with a Wikipedia link to read more.'
        },
        {
          title: 'Start Small',
          content: 'For beginners, we recommend 2-3 categories with 3 questions each. This way you can get to know the system.'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is PubQuiz Master free?',
          a: 'Yes, PubQuiz Master is completely free to use. You only need a free API key from OpenRouter.'
        },
        {
          q: 'Where do the quiz questions come from?',
          a: 'Questions are generated live by an AI. This means every quiz is unique and no question ever repeats.'
        },
        {
          q: 'Are the answers reliable?',
          a: 'Yes! Each question is cross-referenced with Wikipedia. Additionally, you can verify any fact yourself via the Wikipedia link after the quiz.'
        },
        {
          q: 'What categories are available?',
          a: 'There are 12 predefined categories: History, Geography, Science, Art & Culture, Sports, Music, Film & Television, Literature, Nature & Animals, Technology, Politics, and Food & Drinks. You can also create custom categories!'
        },
        {
          q: 'How do I get an API key?',
          a: 'Go to openrouter.ai, create a free account, and generate an API key. The whole process takes only 2 minutes.'
        },
        {
          q: 'Can I play with friends?',
          a: 'PubQuiz Master is perfect for group games! One person reads the questions, everyone writes down their answers, and at the end you solve together.'
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
    cta: {
      title: 'Ready for the Challenge?',
      subtitle: 'Start your first quiz now and test your knowledge!',
      button: '🎯 Start Quiz'
    }
  }
};

export function LandingPage({ language, onStartQuiz }: LandingPageProps) {
  const t = CONTENT[language];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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

      {/* Features Grid */}
      <section className="py-16 px-4">
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
      <section className="py-16 px-4 bg-black/10">
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

      {/* FAQ Section */}
      <section className="py-16 px-4">
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
    </div>
  );
}
