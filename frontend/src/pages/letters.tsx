import Head from 'next/head';
import { useState } from 'react';
import { LETTERS } from '@/utils/gameData';

export default function Letters({ gameState, addNotification }: any) {
  const { isLetterUnlocked, doUnlockLetter, doUnlockAchievement } = gameState;
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  const handleOpenLetter = async (letter: typeof LETTERS[0]) => {
    if (isLetterUnlocked(letter.id)) {
      setSelectedLetter(letter);
      await doUnlockAchievement('ach-read-letter');
    } else {
      // Try to unlock
      // En una implementación real, aquí verificaríamos si cumple la condición antes de llamar a la API
      // Por simplicidad, intentamos llamar a la API y que el backend valide
      addNotification("Aún no puedes abrir esta cartita 🥺", "warning");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto pb-24">
      <Head>
        <title>Cartitas 💌</title>
      </Head>

      <div className="relative mb-8 text-center">
        <div className="washi-tape absolute left-1/2 top-2 h-10 w-56 -translate-x-1/2 opacity-70" />
        <h1 className="relative text-4xl font-bold text-gradient-pink mb-2 animate-slide-up">Tus Cartitas</h1>
        <p className="relative note-text text-xl text-text-soft animate-slide-up">Mensajitos guardados solo para ti 🌸</p>
      </div>

      <div className="sticker-card paper-surface rounded-2xl p-4 mb-8 max-w-md w-full mx-auto">
        <div className="flex justify-between text-sm font-bold text-text-soft mb-2">
          <span>Álbum de recuerdos</span>
          <span>{gameState.unlockedLetterCount} / {LETTERS.length}</span>
        </div>
        <div className="h-3 rounded-full bg-white border border-pastel-pink overflow-hidden">
          <div className="h-full bg-kawaii-pink rounded-full transition-all" style={{ width: `${(gameState.unlockedLetterCount / LETTERS.length) * 100}%` }} />
        </div>
      </div>

      <div className="paper-surface sticker-card rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LETTERS.map((letter, index) => {
          const unlocked = isLetterUnlocked(letter.id);
          
          return (
            <div 
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className={`glass-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 ${!unlocked ? 'opacity-70' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{unlocked ? (letter.isSecret ? '🥺' : '💌') : '🔒'}</div>
              <h3 className="font-bold text-lg text-text-cute mb-2">{unlocked ? letter.title : 'Carta Bloqueada'}</h3>
              <p className="text-xs text-text-soft">{unlocked ? 'Toca para leer ✨' : letter.unlockDescription}</p>
            </div>
          );
        })}
      </div>

      {/* Modal de Carta */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-dark backdrop-blur-sm animate-fade-in" onClick={() => setSelectedLetter(null)}>
          <div className="bg-warm-cream p-8 rounded-3xl max-w-md w-full shadow-kawaii-lg relative border-4 border-white" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-2xl text-text-soft hover:text-kawaii-pink" onClick={() => setSelectedLetter(null)}>✕</button>
            <div className="text-center mb-6 text-5xl animate-bounce-soft">{selectedLetter.icon}</div>
            <h2 className="text-2xl font-bold text-gradient-pink text-center mb-6" style={{ fontFamily: 'var(--font-heading)' }}>{selectedLetter.title}</h2>
            <div className="bg-white/60 p-6 rounded-2xl">
              <p className="text-text-cute leading-relaxed text-lg whitespace-pre-line" style={{ fontFamily: "'Kalam', cursive, var(--font-body)" }}>
                {selectedLetter.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
