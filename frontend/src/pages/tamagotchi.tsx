import Head from 'next/head';
import { useState, useEffect } from 'react';
import { DIALOGUES } from '@/utils/gameData';
import ThemeSelector from '@/components/ThemeSelector';

export default function Tamagotchi({ gameState, addNotification, registerClick, inputKonamiKey, activeTheme, setActiveThemeId, isThemeUnlocked }: any) {
  const { stats, mood, doAction, actionCooldown, loading } = gameState;
  const [dialogue, setDialogue] = useState({ text: '... 🌸', emoji: '✨' });
  const imageMood = ['happy', 'hungry', 'play', 'love', 'sleep', 'cry', 'wave', 'idle'].includes(mood)
    ? mood
    : 'idle';
  const actionEmojis: Record<string, string[]> = {
    'theme-default': ['🍓', '💖', '🎮', '💤'],
    'theme-sakura': ['🍡', '🌸', '🎨', '🌙'],
    'theme-halloween': ['🍬', '🖤', '🎃', '🦇'],
    'theme-winter': ['🍲', '🧣', '⛄', '❄️'],
    'theme-summer': ['🍉', '☀️', '🏖️', '🕶️'],
    'theme-christmas': ['🍪', '🎁', '🎄', '🧦'],
  }[activeTheme?.id || 'theme-default'] || ['🍓', '💖', '🎮', '💤'];

  // Update dialogue based on mood randomly
  useEffect(() => {
    if (!mood || !DIALOGUES[mood]) return;
    const moodDialogues = DIALOGUES[mood];
    const random = moodDialogues[Math.floor(Math.random() * moodDialogues.length)];
    setDialogue(random);
  }, [mood, stats]); // update when stats change too

  const handleAction = async (action: 'feed' | 'play' | 'sleep' | 'pet') => {
    if (actionCooldown) return;
    
    // Set immediate action dialogue
    const actionDialogues = DIALOGUES[`action_${action}`];
    if (actionDialogues) {
      setDialogue(actionDialogues[Math.floor(Math.random() * actionDialogues.length)]);
    }

    await doAction(action);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando... 🌸</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Head>
        <title>Chiikawa 🐾</title>
      </Head>

      <div className="glass-card paper-surface max-w-lg w-full p-5 sm:p-7 flex flex-col items-center animate-slide-up relative">
        <div className="washi-tape absolute -top-3 left-1/2 h-7 w-44 -translate-x-1/2 opacity-80" />
        
        {/* Diálogo */}
        <div className="bg-white px-4 py-3 rounded-2xl mb-6 border-2 border-pastelPink shadow-sm text-center w-full animate-bounce-soft relative">
           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-pastelPink rotate-45"></div>
           <p className="font-bold text-text-cute text-lg">{dialogue.text}</p>
        </div>

        {/* Personaje */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 bg-white/60 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden transition-all duration-300 border-4 border-white">
          <img
             onClick={() => registerClick?.('chiikawa')}
             src={`/images/chiikawa-${imageMood}.png`}
             alt="Chiikawa" 
             className={`w-4/5 h-4/5 object-contain ${actionCooldown ? '' : 'animate-gentle-float'}`}
             onError={(event) => {
               event.currentTarget.src = '/images/chiikawa-idle.png';
             }}
          />
        </div>

        <div className="flex w-full justify-between gap-2 mb-4 text-xs font-bold text-text-soft">
          <span className="sticker-card rounded-full bg-[#fdf2f8] px-3 py-2">♡ cariño {stats.happiness}%</span>
          <span className="sticker-card rounded-full bg-[#fff3ec] px-3 py-2">🍓 energía {stats.hunger}%</span>
          <span className="sticker-card rounded-full bg-[#eef8ff] px-3 py-2">☾ sueño {stats.sleep}%</span>
        </div>

        <ThemeSelector
          activeThemeId={activeTheme.id}
          onSelectTheme={setActiveThemeId}
          isThemeUnlocked={isThemeUnlocked}
          className="w-full mb-6"
        />

        {/* Barras de Estado */}
        <div className="w-full space-y-4 mb-8 bg-white/30 p-4 rounded-2xl">
          <StatBar icon="❤️" label="Felicidad" value={stats.happiness} color="#ff8fa3" />
          <StatBar icon="🍓" label="Hambre" value={stats.hunger} color="#ffcba4" />
          <StatBar icon="😴" label="Sueño" value={stats.sleep} color="#a0d2db" />
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <ActionButton text="Comida" icon={actionEmojis[0]} onClick={() => handleAction('feed')} disabled={actionCooldown} />
          <ActionButton text="Mimos" icon={actionEmojis[1]} onClick={() => handleAction('pet')} disabled={actionCooldown} />
          <ActionButton text="Jugar" icon={actionEmojis[2]} onClick={() => handleAction('play')} disabled={actionCooldown} />
          <ActionButton text="Dormir" icon={actionEmojis[3]} onClick={() => handleAction('sleep')} disabled={actionCooldown} />
        </div>

        <details className="mt-5 w-full text-center">
          <summary className="cursor-pointer text-xs font-semibold text-text-soft hover:text-deep-pink">
            ¿Tienes un código secreto? ✨
          </summary>
          <div className="mt-3 grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              ['↑', 'ArrowUp'], ['↓', 'ArrowDown'], ['←', 'ArrowLeft'], ['→', 'ArrowRight'],
              ['B', 'KeyB'], ['A', 'KeyA'],
            ].map(([label, key]) => (
              <button
                key={key}
                type="button"
                onClick={() => inputKonamiKey?.(key)}
                className="rounded-xl bg-white/70 border border-pastel-pink py-2 font-bold text-text-cute active:scale-95"
                aria-label={`Código ${label}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-text-soft">↑ ↑ ↓ ↓ ← → ← → B A</p>
        </details>
      </div>
    </div>
  );
}

const StatBar = ({ icon, label, value, color }: { icon: string, label: string, value: number, color: string }) => (
  <div className="flex items-center text-sm font-bold text-text-cute">
    <span className="mr-2 text-xl">{icon}</span>
    <span className="w-20">{label}</span>
    <div className="flex-1 h-5 bg-white/50 rounded-full overflow-hidden ml-2 shadow-inner border border-white">
      <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${value}%`, background: color }}></div>
    </div>
  </div>
);

const ActionButton = ({ text, icon, onClick, disabled }: { text: string, icon: string, onClick: () => void, disabled: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`btn-kawaii flex flex-col items-center justify-center py-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span className="text-3xl mb-1">{icon}</span>
    <span className="text-sm">{text}</span>
  </button>
);
