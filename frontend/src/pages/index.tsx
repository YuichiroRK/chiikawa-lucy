import Head from 'next/head';
import Link from 'next/link';

export default function Home({ gameState }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-10">
      <Head>
        <title>Bienvenida Lucy 🌸</title>
      </Head>

      <div className="paper-surface sticker-card max-w-xl w-full p-6 sm:p-10 flex flex-col items-center text-center animate-slide-up rounded-[2rem]">
        <div className="washi-tape h-8 w-40 mb-3 opacity-70" />
        <p className="note-text text-2xl text-text-soft">Querida Lucy,</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient-pink mb-2">Tu mundo Chiikawa</h1>
        <p className="text-text-soft mb-6 text-lg">Un diario pequeño para cuidar, descubrir y sonreír ✨</p>
        
        <div className="w-48 h-48 mb-8 relative animate-float">
          <img 
            src="/images/chiikawa-happy.png" 
            alt="Chiikawa Happy" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-white/70 p-5 rounded-2xl mb-6 w-full border-2 border-dashed border-pastel-pink">
          <p className="text-text-cute font-bold">
            {gameState.progress?.visitCount > 1 
              ? `¡Qué bueno verte de nuevo! Llevas ${gameState.streak?.currentStreak || 0} días seguidos visitándome 🎀`
              : '¡Bienvenida a tu mundo! Este pequeño Chiikawa estaba esperándote. 🌸'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mb-8 text-xs text-text-soft">
          <div className="rounded-xl bg-white/70 p-3"><b className="block text-lg text-deep-pink">{gameState.unlockedLetterCount}</b>cartas</div>
          <div className="rounded-xl bg-white/70 p-3"><b className="block text-lg text-[#904d00]">{gameState.unlockedAchievementCount}</b>logros</div>
          <div className="rounded-xl bg-white/70 p-3"><b className="block text-lg text-deep-pink">{gameState.streak?.currentStreak || 0}</b>días</div>
        </div>

        <Link href="/tamagotchi" className="btn-kawaii w-full text-lg shadow-kawaii">
          Ir con Chiikawa 🐾
        </Link>
      </div>
    </div>
  );
}
