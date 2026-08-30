import Head from 'next/head';
import { useState } from 'react';
import { SONGS } from '@/utils/gameData';

export default function Music({ gameState, addNotification }: any) {
  const { isSongViewed, doViewSong } = gameState;
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlaySong = async (songId: string) => {
    // Si ya está reproduciendo, lo pausa/cierra
    if (playingId === songId) {
      setPlayingId(null);
      return;
    }
    
    setPlayingId(songId);
    if (!isSongViewed(songId)) {
      await doViewSong(songId);
      addNotification("¡Nueva canción escuchada! 🎵", "success");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto pb-24">
      <Head>
        <title>Música 🎵</title>
      </Head>

      <div className="flex items-center justify-center mb-4 text-4xl animate-bounce-soft">🎧</div>
      <div className="text-center mb-8">
        <div className="washi-tape h-8 w-40 mx-auto mb-2 opacity-70" />
        <h1 className="text-4xl font-bold text-gradient-pink mb-2 animate-slide-up">Playlist para Lucy</h1>
        <p className="note-text text-xl text-text-soft animate-slide-up">Música tierna para acompañarte mientras estudias 🌸</p>
      </div>

      <div className="paper-surface sticker-card rounded-3xl p-4 sm:p-6 space-y-4">
        {SONGS.map((song, index) => {
          const viewed = isSongViewed(song.id);
          const isPlaying = playingId === song.id;

          return (
            <div 
              key={song.id}
              className={`glass-card p-4 flex flex-col transition-all duration-300 animate-slide-up ${isPlaying ? 'border-kawaii-pink shadow-glow-pink scale-[1.02]' : 'hover:scale-[1.01]'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-pastel-pink flex items-center justify-center text-2xl shadow-inner ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    💿
                  </div>
                  <div>
                    <h3 className="font-bold text-text-cute">{song.name}</h3>
                    <p className="text-xs text-text-soft mb-1">{song.artist}</p>
                    {viewed && <p className="text-xs text-deep-pink font-semibold italic">{song.message}</p>}
                  </div>
                </div>

                <button 
                  onClick={() => handlePlaySong(song.id)}
                  className={`w-10 h-10 rounded-full ${isPlaying ? 'bg-pastel-pink text-text-cute' : 'bg-[#1db954] hover:bg-[#1ed760] text-white'} flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 flex-shrink-0 ml-2`}
                  title={isPlaying ? "Cerrar" : "Reproducir aquí"}
                >
                  {isPlaying ? '⏹' : '▶'}
                </button>
              </div>

              {/* Reproductor Embebido de Spotify */}
              {isPlaying && (
                <div className="mt-4 w-full animate-fade-in">
                  <iframe 
                    style={{ borderRadius: '12px' }} 
                    src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator`} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
