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
  totalHearts: 0,
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
      const statusRes = await fetchStatus();
      const streakRes = await getStreak();

      if (statusRes.success) {
        const data = statusRes.data;
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

      if (streakRes.success) {
        setStreak({
          currentStreak: streakRes.data.currentStreak ?? streakRes.data.consecutiveDays ?? 0,
          longestStreak: streakRes.data.longestStreak ?? streakRes.data.consecutiveDays ?? 0,
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
        if (res.achievements) {
          setProgress((prev) => ({
            ...prev,
            achievements: res.achievements!.map((id) => ({
              id,
              unlockedAt: new Date().toISOString(),
            })),
          }));
        }
        if (res.unlockedLetters) {
          setProgress((prev) => ({
            ...prev,
            letters: res.unlockedLetters!.map((id) => ({
              id,
              unlockedAt: new Date().toISOString(),
            })),
          }));
        }
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
        const response = await unlockLetter(letterId);
        setProgress((prev) => ({
          ...prev,
          letters: response.unlockedLetters?.map((id) => ({ id, unlockedAt: new Date().toISOString() })) || prev.letters,
      }));
    } catch (err) {
      console.error('Unlock letter error:', err);
    }
  }, []);

  const doViewSong = useCallback(async (songId: string) => {
    try {
      const response = await viewSong(songId);
      setProgress((prev) => {
        const next = response.viewedSongs
          ? { ...prev, songs: response.viewedSongs.map((id) => ({ id, viewedAt: new Date().toISOString() })) }
          : prev;
        if (response.unlockedAchievements) {
          next.achievements = response.unlockedAchievements.map((id) => ({ id, unlockedAt: new Date().toISOString() }));
        }
        if (response.unlockedLetters) {
          next.letters = response.unlockedLetters.map((id) => ({ id, unlockedAt: new Date().toISOString() }));
        }
        if (response.viewedSongs) return next;
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
        const response = await unlockAchievement(achievementId);
        setProgress((prev) => {
        if (response.unlockedAchievements) {
          return {
            ...prev,
            achievements: response.unlockedAchievements.map((id) => ({ id, unlockedAt: new Date().toISOString() })),
            letters: response.unlockedLetters
              ? response.unlockedLetters.map((id) => ({ id, unlockedAt: new Date().toISOString() }))
              : prev.letters,
          };
        }
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
        const response = await findEasterEgg(easterEggId);
      setProgress((prev) => {
          if (response.foundEasterEggs) {
            return { ...prev, easterEggs: response.foundEasterEggs.map((id) => ({ id, foundAt: new Date().toISOString() })) };
          }
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

  // ── Auto-unlock achievements based on progress ──
  useEffect(() => {
    if (loading) return;

    const checkAutoUnlocks = async () => {
      // Primera Visita
      if (progress.visitCount >= 1 && !isAchievementUnlocked('ach-first-visit')) {
        await doUnlockAchievement('ach-first-visit');
      }

      // Todas las canciones (8 canciones)
      if (progress.songs.length >= 8 && !isAchievementUnlocked('ach-all-songs')) {
        await doUnlockAchievement('ach-all-songs');
      }

      // Leer una carta
      if (progress.letters.length >= 1 && !isAchievementUnlocked('ach-read-letter')) {
        await doUnlockAchievement('ach-read-letter');
      }

      // Encontrar easter egg
      if (progress.easterEggs.length >= 1 && !isAchievementUnlocked('ach-easter-egg')) {
        await doUnlockAchievement('ach-easter-egg');
      }

      // Cambio de tema
      if (progress.theme !== 'theme-default' && !isAchievementUnlocked('ach-theme-change')) {
        await doUnlockAchievement('ach-theme-change');
      }

      // Búho Nocturno (3:00 AM - 3:59 AM)
      const hour = new Date().getHours();
      if (hour === 3 && !isAchievementUnlocked('ach-night-owl')) {
        await doUnlockAchievement('ach-night-owl');
      }

      // Todas las acciones (necesita las 4 primeras)
      if (
        isAchievementUnlocked('ach-first-feed') &&
        isAchievementUnlocked('ach-first-play') &&
        isAchievementUnlocked('ach-first-pet') &&
        isAchievementUnlocked('ach-first-sleep') &&
        !isAchievementUnlocked('ach-all-actions')
      ) {
        await doUnlockAchievement('ach-all-actions');
      }
    };

    checkAutoUnlocks();
  }, [
    loading,
    progress.visitCount,
    progress.songs.length,
    progress.letters.length,
    progress.easterEggs.length,
    progress.theme,
    progress.achievements.length,
    isAchievementUnlocked,
    doUnlockAchievement
  ]);

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
