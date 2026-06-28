import Head from 'next/head';
import { ACHIEVEMENTS } from '@/utils/gameData';

export default function Achievements({ gameState }: any) {
  const { isAchievementUnlocked } = gameState;
  
  // Agrupar por categoría
  const categories = ['cuidado', 'exploración', 'dedicación', 'secreto'];

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto pb-24">
      <Head>
        <title>Logros 🏆</title>
      </Head>

      <div className="flex items-center justify-center mb-4 text-4xl animate-bounce-soft">🏆</div>
      <h1 className="text-3xl font-bold text-gradient-gold mb-2 text-center animate-slide-up">Tus Logros</h1>
      <p className="text-text-soft mb-8 text-center animate-slide-up">Mira todo lo que has conseguido, Lucy ✨</p>

      {/* Progreso General */}
      <div className="glass-card-solid p-6 mb-8 text-center animate-slide-up">
        <h2 className="text-xl font-bold text-text-cute mb-2">Progreso Total</h2>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
          <div 
            className="h-full transition-all duration-1000 bg-gradient-to-r from-kawaii-pink to-accent-gold"
            style={{ width: `${(gameState.unlockedAchievementCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
        <p className="text-sm font-bold text-text-soft mt-2">
          {gameState.unlockedAchievementCount} de {ACHIEVEMENTS.length} desbloqueados
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat, catIndex) => {
          const catAchievements = ACHIEVEMENTS.filter(a => a.category === cat);
          if (catAchievements.length === 0) return null;

          return (
            <div key={cat} className="animate-slide-up" style={{ animationDelay: `${catIndex * 0.1}s` }}>
              <h2 className="text-xl font-bold text-text-cute mb-4 capitalize border-b-2 border-pastel-pink pb-2 inline-block">
                {cat}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {catAchievements.map((ach) => {
                  const unlocked = isAchievementUnlocked(ach.id);
                  const isSecret = ach.category === 'secreto';
                  
                  return (
                    <div 
                      key={ach.id}
                      className={`glass-card p-4 flex flex-col items-center text-center transition-all ${unlocked ? 'border-accent-gold/30' : 'opacity-60 grayscale'}`}
                    >
                      <div className={`text-3xl mb-2 ${unlocked ? 'animate-pulse-glow rounded-full' : ''}`}>
                        {unlocked ? ach.icon : (isSecret ? '❓' : '🔒')}
                      </div>
                      <h3 className="font-bold text-sm text-text-cute mb-1 leading-tight h-10 flex items-center justify-center">
                        {unlocked ? ach.name : (isSecret ? '???' : ach.name)}
                      </h3>
                      <p className="text-[10px] text-text-soft">
                        {unlocked ? ach.description : ach.condition}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
