import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { useGameState } from "@/hooks/useGameState";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/useTheme";

export default function App({ Component, pageProps }: AppProps) {
  const gameState = useGameState();
  const { notifications, removeNotification, addNotification } = useNotifications();
  const { activeTheme, isThemeUnlocked, setActiveThemeId } = useTheme(gameState.progress.theme, {
    streakDays: gameState.streak.currentStreak,
    achievementCount: gameState.unlockedAchievementCount,
    hasFoundEasterEgg: gameState.foundEasterEggCount > 0,
    hasSecretZone: gameState.isAchievementUnlocked('ach-secret-zone')
  });

  return (
    <Layout 
      notifications={notifications}
      onDismissNotification={removeNotification}
      particles={activeTheme.particles}
    >
      <Component 
        {...pageProps} 
        gameState={gameState}
        addNotification={addNotification}
        activeTheme={activeTheme}
        setActiveThemeId={setActiveThemeId}
        isThemeUnlocked={isThemeUnlocked}
      />
    </Layout>
  );
}
