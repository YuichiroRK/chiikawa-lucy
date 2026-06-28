// ═══════════════════════════════════════════════
// 🌸 CHIIKAWA TAMAGOTCHI - Main Game State Hook
// Manejo central de estado del juego
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchStatus,
  performAction,
  unlockLetter,
  viewSong,
  unlockAchievement,
  findEasterEgg,
  setTheme as setThemeApi,
  getStreak,
  type StatusResponse,
  type TamagotchiStats,
  type ProgressState,
} from '@/utils/api';

// ─── Types ───

export interface GameState {
  stats: TamagotchiStats;
  mood: string;
  progress: ProgressState;
  streak: { currentStreak: number; longestStreak: number };
  loading: boolean;
  error: string | null;
  lastAction: string | null;
  actionCooldown: boolean;
}

interface GameActions {
  doAction: (action: 'feed' | 'play' | 'sleep' | 'pet') => Promise<void>;
  doUnlockLetter: (letterId: string) => Promise<void>;
  doViewSong: (songId: string) => Promise<void>;
  doUnlockAchievement: (achievementId: string) => Promise<void>;
  doFindEasterEgg: (easterEggId: string) => Promise<void>;
  doSetTheme: (themeId: string) => Promise<void>;
  refreshState: () => Promise<void>;
  isLetterUnlocked: (letterId: string) => boolean;
  isSongViewed: (songId: string) => boolean;
  isAchievementUnlocked: (achievementId: string) => boolean;
  isEasterEggFound: (easterEggId: string) => boolean;
  unlockedLetterCount: number;
  viewedSongCount: number;
  unlockedAchievementCount: number;
  foundEasterEggCount: number;
}

const DEFAULT_STATS: TamagotchiStats = { happiness: 50, hunger: 50, sleep: 50 };

const DEFAULT_PROGRESS: ProgressState = {
  letters: [],
  songs: [],
  achievements: [],
  easterEggs: [],
  theme: 'theme-default',
  visitCount: 1,
  firstVisit: new Date().toISOString(),
  lastVisit: new Date().toISOString(),
};

// ─── Hook ───

export function useGameState(): GameState & GameActions {
  const [stats, setStats] = useState<TamagotchiStats>(DEFAULT_STATS);
  const [mood, setMood] = useState('neutral');
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [actionCooldown, setActionCooldown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initial fetch ──
  const refreshState = useCallback(async () => {
    try {
      setError(null);
      const [statusRes, streakRes] = await Promise.allSettled([
        fetchStatus(),
        getStreak(),
      ]);

      if (statusRes.status === 'fulfilled' && statusRes.value.success) {
        const data = statusRes.value.data;
        setStats({
          happiness: data.happiness,
          hunger: data.hunger,
          sleep: data.sleep,
        });
        setMood(data.mood || 'neutral');
        if (data.progress) {
          setProgress(data.progress);
        }
      }

      if (streakRes.status === 'fulfilled' && streakRes.value.success) {
        setStreak({
          currentStreak: streakRes.value.data.currentStreak,
          longestStreak: streakRes.value.data.longestStreak,
        });
      }
    } catch (err) {
      console.error('Error refreshing state:', err);
      setError('No se pudo conectar con el servidor 😢');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // ── Auto-refresh on window focus ──
  useEffect(() => {
    const handleFocus = () => {
      refreshState();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshState]);

  // ── Perform action with cooldown ──
  const doAction = useCallback(async (action: 'feed' | 'play' | 'sleep' | 'pet') => {
    if (actionCooldown) return;

    setActionCooldown(true);
    setLastAction(action);

    // Optimistic update
    setStats((prev) => {
      const updated = { ...prev };
      switch (action) {
        case 'feed':
          updated.hunger = Math.min(100, prev.hunger + 15);
          break;
        case 'play':
          updated.happiness = Math.min(100, prev.happiness + 15);
          break;
        case 'sleep':
          updated.sleep = Math.min(100, prev.sleep + 15);
          break;
        case 'pet':
          updated.happiness = Math.min(100, prev.happiness + 10);
          break;
      }
      return updated;
    });

    try {
      const res = await performAction(action);
      if (res.success) {
        setStats(res.stats);
        setMood(res.animation || 'happy');
      }
    } catch (err) {
      console.error('Action error:', err);
      // Revert on error
      refreshState();
    }

    // 3 second cooldown
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      setActionCooldown(false);
      setLastAction(null);
    }, 3000);
  }, [actionCooldown, refreshState]);

  // ── Progress actions ──
  const doUnlockLetter = useCallback(async (letterId: string) => {
    try {
      await unlockLetter(letterId);
      setProgress((prev) => ({
        ...prev,
        letters: [...prev.letters, { id: letterId, unlockedAt: new Date().toISOString() }],
      }));
    } catch (err) {
      console.error('Unlock letter error:', err);
    }
  }, []);

  const doViewSong = useCallback(async (songId: string) => {
    try {
      await viewSong(songId);
      setProgress((prev) => {
        if (prev.songs.some((s) => s.id === songId)) return prev;
        return {
          ...prev,
          songs: [...prev.songs, { id: songId, viewedAt: new Date().toISOString() }],
        };
      });
    } catch (err) {
      console.error('View song error:', err);
    }
  }, []);

  const doUnlockAchievement = useCallback(async (achievementId: string) => {
    try {
      await unlockAchievement(achievementId);
      setProgress((prev) => {
        if (prev.achievements.some((a) => a.id === achievementId)) return prev;
        return {
          ...prev,
          achievements: [...prev.achievements, { id: achievementId, unlockedAt: new Date().toISOString() }],
        };
      });
    } catch (err) {
      console.error('Unlock achievement error:', err);
    }
  }, []);

  const doFindEasterEgg = useCallback(async (easterEggId: string) => {
    try {
      await findEasterEgg(easterEggId);
      setProgress((prev) => {
        if (prev.easterEggs.some((e) => e.id === easterEggId)) return prev;
        return {
          ...prev,
          easterEggs: [...prev.easterEggs, { id: easterEggId, foundAt: new Date().toISOString() }],
        };
      });
    } catch (err) {
      console.error('Find easter egg error:', err);
    }
  }, []);

  const doSetTheme = useCallback(async (themeId: string) => {
    try {
      await setThemeApi(themeId);
      setProgress((prev) => ({ ...prev, theme: themeId }));
    } catch (err) {
      console.error('Set theme error:', err);
    }
  }, []);

  // ── Derived state helpers ──
  const isLetterUnlocked = useCallback(
    (letterId: string) => progress.letters.some((l) => l.id === letterId),
    [progress.letters]
  );

  const isSongViewed = useCallback(
    (songId: string) => progress.songs.some((s) => s.id === songId),
    [progress.songs]
  );

  const isAchievementUnlocked = useCallback(
    (achievementId: string) => progress.achievements.some((a) => a.id === achievementId),
    [progress.achievements]
  );

  const isEasterEggFound = useCallback(
    (easterEggId: string) => progress.easterEggs.some((e) => e.id === easterEggId),
    [progress.easterEggs]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  return {
    stats,
    mood,
    progress,
    streak,
    loading,
    error,
    lastAction,
    actionCooldown,
    doAction,
    doUnlockLetter,
    doViewSong,
    doUnlockAchievement,
    doFindEasterEgg,
    doSetTheme,
    refreshState,
    isLetterUnlocked,
    isSongViewed,
    isAchievementUnlocked,
    isEasterEggFound,
    unlockedLetterCount: progress.letters.length,
    viewedSongCount: progress.songs.length,
    unlockedAchievementCount: progress.achievements.length,
    foundEasterEggCount: progress.easterEggs.length,
  };
}
