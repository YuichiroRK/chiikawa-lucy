// ═══════════════════════════════════════════════
// 🏗️ CHIIKAWA TAMAGOTCHI - Layout
// Layout principal con fondo dinámico y navegación
// ═══════════════════════════════════════════════

import { type ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import ParticleBackground from './ParticleBackground';
import NotificationToast from './NotificationToast';
import { type Notification } from '@/hooks/useNotifications';

interface LayoutProps {
  children: ReactNode;
  particles?: string[];
  notifications?: Notification[];
  onDismissNotification?: (id: string) => void;
  showNav?: boolean;
  title?: string;
  backgroundImage?: string;
}

export default function Layout({
  children,
  particles = ['💕', '🌸', '✨', '💖', '🎀'],
  notifications = [],
  onDismissNotification,
  showNav = true,
  title = 'Para ti 🌸 | Chiikawa Tamagotchi',
  backgroundImage,
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Un rinconcito especial para Lucy 🌸💖" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffb7c5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated background */}
      <div
        className="fixed inset-0 bg-kawaii-gradient -z-10"
        style={backgroundImage ? { backgroundImage: `linear-gradient(rgba(255,255,255,.32), rgba(255,255,255,.32)), url(${backgroundImage})` } : undefined}
      />

      <header className="relative z-30 mx-auto flex w-full max-w-[1200px] items-center justify-between border-b-4 border-white bg-white/75 px-5 py-3 shadow-[0_4px_0_rgba(236,64,122,0.1)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="sticker-card flex h-10 w-10 rotate-[-6deg] items-center justify-center rounded-xl bg-white text-xl">🌸</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-soft">Diario de</p>
            <p className="text-lg font-bold leading-none text-deep-pink">Chiikawa</p>
          </div>
        </div>
        <p className="note-text hidden text-xl text-text-soft sm:block">Un rinconcito para Lucy ✨</p>
        <span className="sticker-card rounded-full bg-[#fff3ec] px-3 py-1 text-xs font-bold text-[#904d00]">♡ cuidando juntos</span>
      </header>

      {/* Particles */}
      <ParticleBackground particles={particles} count={12} />

      {/* Notifications */}
      {onDismissNotification && (
        <NotificationToast
          notifications={notifications}
          onDismiss={onDismissNotification}
        />
      )}

      {/* Main content */}
      <main
        className={`
          relative z-10 min-h-screen
          ${showNav ? 'safe-bottom md:ml-20' : ''}
        `}
      >
        {children}
      </main>

      {/* Navigation */}
      {showNav && <Navigation />}
    </>
  );
}
