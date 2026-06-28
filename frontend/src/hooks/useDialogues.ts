// ═══════════════════════════════════════════════
// 💬 CHIIKAWA TAMAGOTCHI - Dialogues Hook
// Selección de diálogos basada en estado
// ═══════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';
import { DIALOGUES, type Dialogue } from '@/utils/gameData';

interface DialogueState {
  currentDialogue: Dialogue;
  refreshDialogue: () => void;
  setActionDialogue: (action: string) => void;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMoodFromStats(happiness: number, hunger: number, sleep: number): string {
  if (hunger < 30) return 'hungry';
  if (sleep < 30) return 'sleepy';
  if (happiness < 30) return 'sad';
  if (happiness > 70) return 'happy';
  return 'neutral';
}

function isSpecialDate(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Valentine's Day
  if (month === 1 && day === 14) return true;
  // Christmas
  if (month === 11 && (day === 24 || day === 25)) return true;
  // New Year
  if (month === 0 && day === 1) return true;

  return false;
}

export function useDialogues(
  happiness: number = 50,
  hunger: number = 50,
  sleep: number = 50
): DialogueState {
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue>(
    DIALOGUES.neutral[0]
  );

  const refreshDialogue = useCallback(() => {
    // Check for special date first
    if (isSpecialDate() && DIALOGUES.special.length > 0) {
      setCurrentDialogue(getRandomItem(DIALOGUES.special));
      return;
    }

    const mood = getMoodFromStats(happiness, hunger, sleep);
    const dialogues = DIALOGUES[mood] || DIALOGUES.neutral;
    setCurrentDialogue(getRandomItem(dialogues));
  }, [happiness, hunger, sleep]);

  const setActionDialogue = useCallback((action: string) => {
    const key = `action_${action}`;
    const dialogues = DIALOGUES[key];
    if (dialogues && dialogues.length > 0) {
      setCurrentDialogue(getRandomItem(dialogues));
    }
  }, []);

  // Refresh dialogue when stats change significantly
  useEffect(() => {
    refreshDialogue();
  }, [
    Math.floor(happiness / 20),
    Math.floor(hunger / 20),
    Math.floor(sleep / 20),
    refreshDialogue,
  ]);

  return {
    currentDialogue,
    refreshDialogue,
    setActionDialogue,
  };
}
