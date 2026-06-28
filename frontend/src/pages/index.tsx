import Head from 'next/head';
import Link from 'next/link';

export default function Home({ gameState }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Head>
        <title>Bienvenida Lucy 🌸</title>
      </Head>

      <div className="glass-card-solid max-w-md w-full p-8 flex flex-col items-center text-center animate-slide-up">
        <h1 className="text-4xl font-bold text-gradient-pink mb-2">¡Hola Lucy!</h1>
        <p className="text-text-soft mb-6 text-lg">Tu rinconcito seguro y kawaii ✨</p>
        
        <div className="w-48 h-48 mb-8 relative animate-float">
          <img 
            src="/images/chiikawa-happy.png" 
            alt="Chiikawa Happy" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-white/60 p-4 rounded-2xl mb-8 w-full border border-white/50">
          <p className="text-text-cute font-bold">
            {gameState.progress?.visitCount > 1 
              ? `¡Qué bueno verte de nuevo! Llevas ${gameState.streak?.currentStreak || 0} días seguidos visitándome 🎀`
              : '¡Bienvenida a tu mundo! Este pequeño Chiikawa estaba esperándote. 🌸'}
          </p>
        </div>

        <Link href="/tamagotchi" className="btn-kawaii w-full text-lg shadow-kawaii">
          Ir con Chiikawa 🐾
        </Link>
      </div>
    </div>
  );
}
