import Head from 'next/head';
import Link from 'next/link';

export default function Home({ gameState }: any) {
  const streak = gameState.streak?.currentStreak || 0;
  const visitCount = gameState.progress?.visitCount || 0;
  const quickLinks = [
    { href: '/letters', icon: '💌', label: 'Cartitas', detail: `${gameState.unlockedLetterCount} guardadas`, tone: 'bg-[#fff1f5]' },
    { href: '/achievements', icon: '🏆', label: 'Logros', detail: `${gameState.unlockedAchievementCount} conseguidos`, tone: 'bg-[#fff8df]' },
    { href: '/gallery', icon: '🖼️', label: 'Galería', detail: 'Ver recuerdos', tone: 'bg-[#eef8ff]' },
    { href: '/music', icon: '🎵', label: 'Música', detail: 'Escuchar juntas', tone: 'bg-[#f3efff]' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 py-6 sm:py-10 pb-28">
      <Head><title>Tu mundo Chiikawa 🌸</title></Head>
      <main className="w-full max-w-5xl animate-slide-up">
        <header className="flex items-start justify-between gap-4 mb-6 px-1">
          <div>
            <p className="note-text text-2xl text-text-soft">Querida Lucy,</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-gradient-pink leading-tight">Tu mundo Chiikawa</h1>
            <p className="text-text-soft mt-1">Un ratito suave para cuidar y sonreír ✨</p>
          </div>
          <div className="sticker-card rounded-full bg-white px-3 py-2 text-center shrink-0">
            <span className="block text-lg">🔥</span>
            <span className="text-xs font-bold text-text-soft">{streak} días</span>
          </div>
        </header>

        <section className="paper-surface sticker-card rounded-[2rem] p-5 sm:p-8 grid md:grid-cols-[1fr_1.05fr] gap-5 items-center mb-6" aria-labelledby="welcome-title">
          <div className="flex justify-center order-first md:order-last">
            <div className="w-52 h-52 sm:w-64 sm:h-64 relative animate-float">
              <img src="/images/chiikawa-happy.png" alt="Chiikawa feliz" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-deep-pink mb-4">
              <span className="h-2 w-2 rounded-full bg-[#6fcf97]" /> Lista para verte
            </div>
            <h2 id="welcome-title" className="text-2xl sm:text-3xl font-bold text-text-cute mb-3">
              {visitCount > 1 ? '¡Qué bueno verte de nuevo!' : 'Chiikawa te estaba esperando'}
            </h2>
            <p className="text-text-soft leading-relaxed mb-6">
              {visitCount > 1 ? `Llevan ${streak} días compartiendo momentos. ¿Le damos un poco de cariño? 🎀` : 'Cuida de tu pequeña compañera y descubre todo lo que guarda este diario.'}
            </p>
            <Link href="/tamagotchi" className="btn-kawaii inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 text-base shadow-kawaii">
              Cuidar a Chiikawa <span aria-hidden="true">🐾</span>
            </Link>
          </div>
        </section>

        <section aria-label="Resumen de tu mundo" className="grid grid-cols-3 gap-3 mb-8">
          <Stat label="Cartitas" value={gameState.unlockedLetterCount} icon="💌" />
          <Stat label="Logros" value={gameState.unlockedAchievementCount} icon="🏆" />
          <Stat label="Visitas" value={visitCount} icon="🌸" />
        </section>

        <section aria-labelledby="explore-title">
          <div className="flex items-end justify-between mb-3 px-1">
            <div><p className="note-text text-xl text-text-soft">Tu pequeño rincón</p><h2 id="explore-title" className="text-xl font-bold text-text-cute">Explorar</h2></div>
            <span className="text-xs text-text-soft">elige una sección</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`sticker-card ${link.tone} rounded-2xl p-4 min-h-28 flex flex-col justify-between transition-transform hover:-translate-y-1 focus-visible:-translate-y-1`}>
                <span className="text-3xl" aria-hidden="true">{link.icon}</span>
                <span><strong className="block text-sm text-text-cute">{link.label}</strong><span className="text-xs text-text-soft">{link.detail}</span></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return <div className="glass-card rounded-2xl p-3 sm:p-4 text-center"><span className="text-xl" aria-hidden="true">{icon}</span><strong className="block text-xl sm:text-2xl text-deep-pink">{value}</strong><span className="text-[11px] sm:text-xs text-text-soft">{label}</span></div>;
}
