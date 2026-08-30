import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { useGameState } from "@/hooks/useGameState";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/useTheme";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import { useEffect, useRef } from 'react';
import { ACHIEVEMENTS } from '@/utils/gameData';

export default function App({ Component, pageProps }: AppProps) {
  const gameState = useGameState();
  const { registerClick, inputKonamiKey } = useEasterEggs((easterEggId) => {
    void gameState.doFindEasterEgg(easterEggId);
    if (easterEggId === 'ee-konami') void gameState.doUnlockAchievement('ach-konami');
    if (easterEggId === 'ee-witching-hour') void gameState.doUnlockAchievement('ach-night-owl');
  });
  const { notifications, removeNotification, addNotification } = useNotifications();
  const seenProgress = useRef<{ achievements: string[]; letters: string[] } | null>(null);
  useEffect(() => {
    if (gameState.loading) return;
    const achievements = gameState.progress.achievements.map((item) => item.id);
    const letters = gameState.progress.letters.map((item) => item.id);
    if (!seenProgress.current) {
      seenProgress.current = { achievements, letters };
      return;
    }
    const previous = seenProgress.current;
    achievements.filter((id) => !previous.achievements.includes(id)).forEach((id) => {
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      addNotification(`¡Logro desbloqueado! ${achievement?.name || 'Nuevo logro'}`, 'achievement');
    });
    letters.filter((id) => !previous.letters.includes(id)).forEach(() => {
      addNotification('¡Has recibido una nueva cartita!', 'success', '💌');
    });
    seenProgress.current = { achievements, letters };
  }, [gameState.loading, gameState.progress.achievements, gameState.progress.letters, addNotification]);
  const { activeTheme, isThemeUnlocked, setActiveThemeId } = useTheme(gameState.progress.theme, {
    streakDays: gameState.streak.currentStreak,
    achievementCount: gameState.unlockedAchievementCount,
    hasFoundEasterEgg: gameState.foundEasterEggCount > 0,
    hasSecretZone: gameState.isAchievementUnlocked('ach-secret-zone')
  });
  const handleThemeChange = (themeId: string) => {
    setActiveThemeId(themeId);
    void gameState.doSetTheme(themeId);
  };

  return (
    <Layout 
      notifications={notifications}
      onDismissNotification={removeNotification}
        particles={activeTheme.particles}
        backgroundImage={activeTheme.backgroundImage}
    >
      <Component 
        {...pageProps} 
        gameState={gameState}
        addNotification={addNotification}
        activeTheme={activeTheme}
        setActiveThemeId={handleThemeChange}
        isThemeUnlocked={isThemeUnlocked}
        registerClick={registerClick}
        inputKonamiKey={inputKonamiKey}
      />
    </Layout>
  );
}
