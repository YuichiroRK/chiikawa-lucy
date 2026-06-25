import { useEffect, useState } from 'react';
import { fetchStatus, performAction } from '@/utils/api';
import Head from 'next/head';

export default function Home() {
  const [stats, setStats] = useState({ happiness: 50, hunger: 50, sleep: 50 });
  const [dialogue, setDialogue] = useState('¡Haaai! ✨');
  const [animation, setAnimation] = useState('idle');
  const [loading, setLoading] = useState(true);

  // Cargar estado inicial al entrar
  useEffect(() => {
    fetchStatus()
      .then((res) => {
        if (res.success) {
          setStats({
            happiness: res.data.happiness,
            hunger: res.data.hunger,
            sleep: res.data.sleep,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (actionType: string) => {
    try {
      const res = await performAction(actionType);
      if (res.success) {
        setStats(res.stats);
        setDialogue(res.dialogue);
        setAnimation(res.animation);
        
        // Volver a estado idle después de 3 segundos
        setTimeout(() => {
          setAnimation('idle');
          setDialogue('... 🌸');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-kawaiiPink">Cargando... 🌸</div>;

  return (
    <div className="min-h-screen bg-pastelPink bg-opacity-30 flex flex-col items-center justify-center p-4 font-sans">
      <Head>
        <title>Para ti 🌸 | Chiikawa Tamagotchi</title>
      </Head>

      {/* Contenedor Principal */}
      <div className="bg-softWhite rounded-3xl shadow-xl p-8 max-w-sm w-full border-4 border-kawaiiPink flex flex-col items-center">
        
        {/* Diálogo */}
        <div className="bg-white px-4 py-2 rounded-2xl mb-4 border-2 border-pastelPink shadow-sm text-center w-full">
          <p className="font-bold text-textCute text-lg">{dialogue}</p>
        </div>

       {/* Personaje */}
        <div className="w-48 h-48 bg-pastelPink rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden transition-all duration-300 transform hover:scale-105">
          <img 
            src={`/images/${animation === 'idle' ? 'chiikawa' : animation}.png`} 
            alt="Chiikawa" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Barras de Estado */}
        <div className="w-full space-y-3 mb-8">
          <StatBar icon="❤️" label="Felicidad" value={stats.happiness} color="bg-red-400" />
          <StatBar icon="🍓" label="Hambre" value={stats.hunger} color="bg-orange-400" />
          <StatBar icon="😴" label="Sueño" value={stats.sleep} color="bg-blue-400" />
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <ActionButton text="Comida" icon="🍓" onClick={() => handleAction('feed')} />
          <ActionButton text="Mimos" icon="💖" onClick={() => handleAction('pet')} />
          <ActionButton text="Jugar" icon="🎒" onClick={() => handleAction('play')} />
          <ActionButton text="Dormir" icon="💤" onClick={() => handleAction('sleep')} />
        </div>

      </div>
    </div>
  );
}

// Componentes Auxiliares
const StatBar = ({ icon, label, value, color }: { icon: string, label: string, value: number, color: string }) => (
  <div className="flex items-center text-sm font-bold">
    <span className="mr-2 text-lg">{icon}</span>
    <span className="w-20">{label}</span>
    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden ml-2">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const ActionButton = ({ text, icon, onClick }: { text: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-kawaiiPink hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-sm">{text}</span>
  </button>
);
