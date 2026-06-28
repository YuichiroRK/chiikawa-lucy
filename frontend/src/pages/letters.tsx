import Head from 'next/head';
import { useState } from 'react';
import { LETTERS } from '@/utils/gameData';

export default function Letters({ gameState, addNotification }: any) {
  const { isLetterUnlocked, doUnlockLetter } = gameState;
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  const handleOpenLetter = async (letter: typeof LETTERS[0]) => {
    if (isLetterUnlocked(letter.id)) {
      setSelectedLetter(letter);
    } else {
      // Try to unlock
      // En una implementación real, aquí verificaríamos si cumple la condición antes de llamar a la API
      // Por simplicidad, intentamos llamar a la API y que el backend valide
      addNotification("Aún no puedes abrir esta cartita 🥺", "warning");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Cartitas 💌</title>
      </Head>

      <h1 className="text-3xl font-bold text-gradient-pink mb-2 text-center animate-slide-up">Tus Cartitas</h1>
      <p className="text-text-soft mb-8 text-center animate-slide-up">Mensajitos de amor escritos solo para ti 🌸</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
