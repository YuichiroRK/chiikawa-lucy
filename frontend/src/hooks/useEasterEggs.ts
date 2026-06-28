// ═══════════════════════════════════════════════
// 🥚 CHIIKAWA TAMAGOTCHI - Easter Eggs Hook
// Detección de easter eggs
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';

interface EasterEggState {
  foundEasterEggs: string[];
  checkEasterEgg: (id: string) => void;
  registerClick: (elementId: string) => void;
  konamiActivated: boolean;
  secretWordActivated: boolean;
}

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

const SECRET_WORD = 'chiikawa';

export function useEasterEggs(
  onEasterEggFound?: (easterEggId: string) => void
): EasterEggState {
  const [foundEasterEggs, setFoundEasterEggs] = useState<string[]>([]);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [secretWordActivated, setSecretWordActivated] = useState(false);

  const konamiProgress = useRef<string[]>([]);
  const secretWordProgress = useRef('');
  const clickCounts = useRef<Record<string, number>>({});
  const secretWordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markFound = useCallback(
    (id: string) => {
      setFoundEasterEggs((prev) => {
        if (prev.includes(id)) return prev;
        const updated = [...prev, id];
        onEasterEggFound?.(id);
        return updated;
      });
    },
    [onEasterEggFound]
  );

  const checkEasterEgg = useCallback(
    (id: string) => {
      markFound(id);
    },
    [markFound]
  );

  // ── Konami Code Listener ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiProgress.current.push(e.code);

      // Keep only the last N keys
      if (konamiProgress.current.length > KONAMI_CODE.length) {
        konamiProgress.current = konamiProgress.current.slice(-KONAMI_CODE.length);
      }

      // Check match
      if (konamiProgress.current.length === KONAMI_CODE.length) {
        const matches = konamiProgress.current.every(
          (key, i) => key === KONAMI_CODE[i]
        );
        if (matches && !konamiActivated) {
          setKonamiActivated(true);
          markFound('ee-konami');
          konamiProgress.current = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiActivated, markFound]);

  // ── Secret Word Detector ──
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only track letter keys
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        secretWordProgress.current += e.key.toLowerCase();

        // Reset timer
        if (secretWordTimer.current) clearTimeout(secretWordTimer.current);
        secretWordTimer.current = setTimeout(() => {
          secretWordProgress.current = '';
        }, 3000);

        // Check if the word is in the typed string
        if (
          secretWordProgress.current.includes(SECRET_WORD) &&
          !secretWordActivated
        ) {
          setSecretWordActivated(true);
          markFound('ee-secret-word');
          secretWordProgress.current = '';
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (secretWordTimer.current) clearTimeout(secretWordTimer.current);
    };
  }, [secretWordActivated, markFound]);

  // ── Time-Based Checks ──
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 3:33 AM check
      if (hours === 3 && minutes === 33) {
        markFound('ee-witching-hour');
      }

      // Valentine's Day check
      if (now.getMonth() === 1 && now.getDate() === 14) {
        markFound('ee-valentines');
      }
    };

    checkTime(); // Check immediately
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [markFound]);

  // ── Click Counter ──
  const registerClick = useCallback(
    (elementId: string) => {
      clickCounts.current[elementId] = (clickCounts.current[elementId] || 0) + 1;

      if (clickCounts.current[elementId] >= 10) {
        markFound('ee-click-10');
        clickCounts.current[elementId] = 0;
      }
    },
    [markFound]
  );

  return {
    foundEasterEggs,
    checkEasterEgg,
    registerClick,
    konamiActivated,
    secretWordActivated,
  };
}
