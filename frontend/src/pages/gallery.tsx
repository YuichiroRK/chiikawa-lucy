import Head from 'next/head';
import { STICKERS } from '@/utils/gameData';
import { useState } from 'react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Generamos lista de imágenes desbloqueadas (por ahora mostramos todas)
  const images = [
    { src: '/images/chiikawa-happy.png', name: 'Chiikawa Feliz' },
    { src: '/images/chiikawa-sleep.png', name: 'Chiikawa Durmiendo' },
    { src: '/images/chiikawa-love.png', name: 'Chiikawa Amoroso' },
    { src: '/images/chiikawa-play.png', name: 'Chiikawa Jugando' },
    { src: '/images/chiikawa-hungry.png', name: 'Chiikawa Hambriento' },
    { src: '/images/chiikawa-cry.png', name: 'Chiikawa Triste' },
    { src: '/images/chiikawa-wave.png', name: 'Chiikawa Saludando' },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto pb-24">
      <Head>
        <title>Galería 🖼️</title>
      </Head>

      <div className="flex items-center justify-center mb-4 text-4xl animate-float">📸</div>
      <div className="text-center mb-8">
        <div className="washi-tape h-8 w-40 mx-auto mb-2 opacity-70" />
        <h1 className="text-4xl font-bold text-gradient-pink mb-2 animate-slide-up">Galería Kawaii</h1>
        <p className="note-text text-xl text-text-soft animate-slide-up">Recuerdos y stickers para ti 🌸</p>
      </div>

      <h2 className="text-xl font-bold text-text-cute mb-4 border-b-2 border-pastel-pink pb-2 inline-block">Stickers</h2>
      <div className="paper-surface sticker-card rounded-3xl p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
        {STICKERS.map((sticker) => (
          <div 
            key={sticker.id}
            onClick={() => sticker.src && setSelectedImage(sticker.src)}
            className={`glass-card aspect-square p-2 flex items-center justify-center ${sticker.src ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-70'}`}
          >
            {sticker.src ? (
              <img src={sticker.src} alt={sticker.name} className="w-full h-full object-contain filter drop-shadow-sm" />
            ) : (
              <span className="text-4xl md:text-5xl filter drop-shadow-sm" title={sticker.name}>{sticker.emoji}</span>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-text-cute mb-4 border-b-2 border-pastel-pink pb-2 inline-block">Fotos de Chiikawa</h2>
      <div className="paper-surface sticker-card rounded-3xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div 
            key={i}
            onClick={() => setSelectedImage(img.src)}
            className="glass-card aspect-square p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform bg-white/40"
          >
            <img src={img.src} alt={img.name} className="w-full h-full object-contain mb-2" />
            <p className="text-xs font-bold text-text-soft text-center">{img.name}</p>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-dark backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-lg w-full aspect-square bg-white rounded-3xl p-8 flex items-center justify-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-kawaii-pink transition-colors z-10" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Fullscreen view" className="w-full h-full object-contain animate-bounce-soft" />
          </div>
        </div>
      )}
    </div>
  );
}
