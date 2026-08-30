import Head from 'next/head';
import { useState, useEffect } from 'react';
import { DIALOGUES } from '@/utils/gameData';

export default function Tamagotchi({ gameState, addNotification }: any) {
  const { stats, mood, doAction, actionCooldown, loading } = gameState;
  const [dialogue, setDialogue] = useState({ text: '... 🌸', emoji: '✨' });
  const imageMood = ['happy', 'hungry', 'play', 'love', 'sleep', 'cry', 'wave', 'idle'].includes(mood)
    ? mood
    : 'idle';

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

      <div className="glass-card max-w-sm w-full p-6 flex flex-col items-center animate-slide-up relative">
        
        {/* Diálogo */}
        <div className="bg-white px-4 py-3 rounded-2xl mb-6 border-2 border-pastelPink shadow-sm text-center w-full animate-bounce-soft relative">
           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-pastelPink rotate-45"></div>
           <p className="font-bold text-text-cute text-lg">{dialogue.text}</p>
        </div>

        {/* Personaje */}
        <div className="w-56 h-56 bg-white/40 rounded-full flex items-center justify-center mb-8 shadow-inner relative overflow-hidden transition-all duration-300">
          <img 
             src={`/images/chiikawa-${imageMood}.png`}
             alt="Chiikawa" 
             className={`w-4/5 h-4/5 object-contain ${actionCooldown ? 'animate-wiggle' : 'animate-float'}`}
             onError={(event) => {
               event.currentTarget.src = '/images/chiikawa-idle.png';
             }}
          />
        </div>

        {/* Barras de Estado */}
        <div className="w-full space-y-4 mb-8 bg-white/30 p-4 rounded-2xl">
          <StatBar icon="❤️" label="Felicidad" value={stats.happiness} color="#ff8fa3" />
          <StatBar icon="🍓" label="Hambre" value={stats.hunger} color="#ffcba4" />
          <StatBar icon="😴" label="Sueño" value={stats.sleep} color="#a0d2db" />
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <ActionButton text="Comida" icon="🍓" onClick={() => handleAction('feed')} disabled={actionCooldown} />
          <ActionButton text="Mimos" icon="💖" onClick={() => handleAction('pet')} disabled={actionCooldown} />
          <ActionButton text="Jugar" icon="🎮" onClick={() => handleAction('play')} disabled={actionCooldown} />
          <ActionButton text="Dormir" icon="💤" onClick={() => handleAction('sleep')} disabled={actionCooldown} />
        </div>
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
