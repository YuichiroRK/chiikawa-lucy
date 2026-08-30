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
          <span className="mr-2">🗝️</span> Recompensa exclusiva
        </h2>
        <p className="text-sm text-text-soft mb-4">Los temas normales se pueden elegir desde tu Tamagotchi. Aquí queda el ambiente reservado para quienes descubren este rincón.</p>
        {(() => {
          const christmas = THEMES.find((theme) => theme.id === 'theme-christmas');
          if (!christmas) return null;
          const isActive = activeTheme.id === christmas.id;
          return (
            <button
              onClick={() => {
                if (!isActive) {
                  setActiveThemeId(christmas.id);
                  addNotification(`Tema cambiado a ${christmas.name} ${christmas.emoji}`, 'success');
                }
              }}
              className="sticker-card w-full rounded-2xl bg-[#fff3ec] p-5 flex items-center justify-between text-left hover:translate-y-0.5 transition-transform"
            >
              <span className="flex items-center gap-3"><span className="text-3xl">{christmas.emoji}</span><span><b className="block text-text-cute">{christmas.name}</b><small className="text-text-soft">Tema exclusivo de la zona secreta</small></span></span>
              {isActive && <span className="text-deep-pink font-bold text-xl">✓</span>}
            </button>
          );
        })()}
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
