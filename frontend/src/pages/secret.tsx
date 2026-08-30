import Head from 'next/head';
import { THEMES } from '@/utils/gameData';

export default function Secret({ gameState, activeTheme, setActiveThemeId, isThemeUnlocked, addNotification }: any) {
  const isSecretUnlocked = gameState.isAchievementUnlocked('ach-secret-zone');

  if (!isSecretUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4 animate-float opacity-50">🔒</div>
        <h1 className="text-2xl font-bold text-text-cute mb-2">Zona Secreta Bloqueada</h1>
        <p className="text-text-soft mb-8">Debes demostrar ser la mejor cuidadora para entrar aquí...</p>
        <div className="glass-card p-6 w-full max-w-sm text-left">
          <h3 className="font-bold text-text-cute mb-4 border-b border-pastel-pink pb-2">Requisitos:</h3>
          <ul className="space-y-2 text-sm text-text-soft">
            <li className="flex items-center">
              <span className="mr-2">{gameState.unlockedAchievementCount >= 5 ? '✅' : '❌'}</span> 5+ Logros obtenidos
            </li>
            <li className="flex items-center">
              <span className="mr-2">{gameState.foundEasterEggCount >= 3 ? '✅' : '❌'}</span> 3+ Secretos (Easter eggs)
            </li>
            <li className="flex items-center">
              <span className="mr-2">{gameState.streak.currentStreak >= 7 ? '✅' : '❌'}</span> 7 Días de racha
            </li>
            <li className="flex items-center">
              <span className="mr-2">{gameState.unlockedLetterCount >= 3 ? '✅' : '❌'}</span> 3 Cartitas leídas
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-surface min-h-screen flex flex-col p-6 max-w-3xl mx-auto pb-24">
      <Head>
        <title>Zona Secreta ✨</title>
      </Head>

      <div className="flex items-center justify-center mb-4 text-4xl animate-pulse-glow w-16 h-16 rounded-full mx-auto bg-white/50">✨</div>
      <div className="washi-tape h-8 w-44 mx-auto mb-2 opacity-70" />
      <h1 className="text-4xl font-bold text-gradient-gold mb-2 text-center animate-slide-up">Rincón Mágico</h1>
      <p className="note-text text-xl text-text-soft mb-8 text-center animate-slide-up">¡Lo lograste Lucy! Este es tu espacio especial 💖</p>

      <div className="sticker-card paper-surface p-6 mb-8 animate-slide-up rounded-3xl">
        <h2 className="text-xl font-bold text-text-cute mb-4 flex items-center">
          <span className="mr-2">🎨</span> Personaliza tu mundo
        </h2>
        <p className="text-sm text-text-soft mb-4">Elige el ambiente que más te guste para hoy:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const unlocked = isThemeUnlocked(theme.id);
            const isActive = activeTheme.id === theme.id;
            
            return (
              <button
                key={theme.id}
                onClick={() => {
                  if (unlocked && !isActive) {
                    setActiveThemeId(theme.id);
                    addNotification(`Tema cambiado a ${theme.name} ${theme.emoji}`, 'success');
                  }
                }}
                className={`
                  p-4 rounded-xl border-2 flex items-center justify-between text-left transition-all
                  ${isActive ? 'border-deep-pink bg-white/60 shadow-md transform scale-105' : 
                    unlocked ? 'border-pastel-pink bg-white/30 hover:bg-white/50' : 
                    'border-gray-200 bg-gray-50/30 opacity-70 cursor-not-allowed'}
                `}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{unlocked ? theme.emoji : '🔒'}</span>
                  <div>
                    <h3 className={`font-bold text-sm ${isActive ? 'text-deep-pink' : 'text-text-cute'}`}>
                      {theme.name}
                    </h3>
                    {!unlocked && <p className="text-[10px] text-text-soft">Bloqueado</p>}
                  </div>
                </div>
                {isActive && <span className="text-deep-pink font-bold text-xl">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-text-cute mb-4">Sorpresa final 🎁</h2>
        <p className="text-text-soft mb-6">Gracias por cuidar tan bien de Chiikawa. Eres una persona maravillosa y te mereces todo lo bonito de este mundo.</p>
        <button 
          onClick={() => {
            addNotification("TE QUIERO MUCHOOOO LUCYYY ❤️✨🌸🎀", "success", "🥺", 8000);
          }}
          className="btn-kawaii w-full text-lg shadow-glow-pink"
        >
          ¡Tocar para recibir amor! 💕
        </button>
      </div>
    </div>
  );
}
