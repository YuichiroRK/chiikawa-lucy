// ═══════════════════════════════════════════════
// 🎨 CHIIKAWA TAMAGOTCHI - Theme Hook
// Manejo de temas visuales
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { THEMES, type Theme } from '@/utils/gameData';

interface ThemeState {
  activeTheme: Theme;
  setActiveThemeId: (themeId: string) => void;
  isThemeUnlocked: (themeId: string) => boolean;
  availableThemes: Theme[];
}

export function useTheme(
  currentThemeId: string = 'theme-default',
  unlockedConditions: {
    streakDays: number;
    achievementCount: number;
    hasFoundEasterEgg: boolean;
    hasSecretZone: boolean;
  } = { streakDays: 0, achievementCount: 0, hasFoundEasterEgg: false, hasSecretZone: false }
): ThemeState {
  const [activeTheme, setActiveTheme] = useState<Theme>(
    THEMES.find((t) => t.id === currentThemeId) || THEMES[0]
  );

  // Update when prop changes
  useEffect(() => {
    const theme = THEMES.find((t) => t.id === currentThemeId);
    if (theme) setActiveTheme(theme);
  }, [currentThemeId]);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', activeTheme.colors.primary);
    root.style.setProperty('--theme-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--theme-accent', activeTheme.colors.accent);
    root.style.setProperty('--theme-background', activeTheme.colors.background);
    root.style.setProperty('--theme-surface', activeTheme.colors.secondary);
    root.style.setProperty('--theme-paper-line', `${activeTheme.colors.primary}35`);

    return () => {
      root.style.removeProperty('--theme-primary');
      root.style.removeProperty('--theme-secondary');
      root.style.removeProperty('--theme-accent');
      root.style.removeProperty('--theme-background');
      root.style.removeProperty('--theme-surface');
      root.style.removeProperty('--theme-paper-line');
    };
  }, [activeTheme]);

  const isThemeUnlocked = useCallback(
    (themeId: string): boolean => {
      const theme = THEMES.find((t) => t.id === themeId);
      if (!theme) return false;

      switch (theme.unlockCondition) {
        case 'default':
          return true;
        case 'streak_3':
          return unlockedConditions.streakDays >= 3;
        case 'achievements_3':
          return unlockedConditions.achievementCount >= 3;
        case 'easter_egg_found':
          return unlockedConditions.hasFoundEasterEgg;
        case 'achievements_5':
          return unlockedConditions.achievementCount >= 5;
        case 'secret_zone':
          return unlockedConditions.hasSecretZone;
        default:
          return false;
      }
    },
    [unlockedConditions]
  );

  const setActiveThemeId = useCallback(
    (themeId: string) => {
      if (isThemeUnlocked(themeId)) {
        const theme = THEMES.find((t) => t.id === themeId);
        if (theme) setActiveTheme(theme);
      }
    },
    [isThemeUnlocked]
  );

  return {
    activeTheme,
    setActiveThemeId,
    isThemeUnlocked,
    availableThemes: THEMES,
  };
}
