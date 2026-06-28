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
}

export default function Layout({
  children,
  particles = ['💕', '🌸', '✨', '💖', '🎀'],
  notifications = [],
  onDismissNotification,
  showNav = true,
  title = 'Para ti 🌸 | Chiikawa Tamagotchi',
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
      <div className="fixed inset-0 bg-kawaii-gradient -z-10" />

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
