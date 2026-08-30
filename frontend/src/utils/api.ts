// ═══════════════════════════════════════════════
// 🌸 CHIIKAWA TAMAGOTCHI - API Client
// Todas las llamadas al backend
// ═══════════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const TAMAGOTCHI_URL = `${API_BASE}/tamagotchi`;
const PROGRESS_URL = `${API_BASE}/progress`;

// ─── Types ───

export interface TamagotchiStats {
  happiness: number;
  hunger: number;
  sleep: number;
}

export interface TamagotchiState {
  stats: TamagotchiStats;
  mood: string;
  lastFed: string | null;
  lastPlayed: string | null;
  lastSlept: string | null;
  lastPetted: string | null;
}

export interface ProgressState {
  letters: { id: string; unlockedAt: string }[];
  songs: { id: string; viewedAt: string }[];
  achievements: { id: string; unlockedAt: string }[];
  easterEggs: { id: string; foundAt: string }[];
  theme: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  totalHearts: number;
}

export interface StatusResponse {
  success: boolean;
  data: {
    happiness: number;
    hunger: number;
    sleep: number;
    mood: string;
    lastFed: string | null;
    lastPlayed: string | null;
    lastSlept: string | null;
    lastPetted: string | null;
    progress: ProgressState;
  };
}

export interface ActionResponse {
  success: boolean;
  stats: TamagotchiStats;
  dialogue: string;
  animation: string;
  mood: string;
  achievements?: string[];
  unlockedLetters?: string[];
}

export interface StreakResponse {
  success: boolean;
  data: {
    currentStreak: number;
    longestStreak: number;
    lastVisit: string;
    consecutiveDays?: number;
    totalHearts?: number;
  };
}

export interface SecretResponse {
  success: boolean;
  data: {
    unlocked: boolean;
    unlockedAt: string | null;
  };
}

export interface GenericResponse {
  success: boolean;
  message?: string;
  unlockedLetters?: string[];
  unlockedAchievements?: string[];
  foundEasterEggs?: string[];
  viewedSongs?: string[];
  alreadyUnlocked?: boolean;
}

// ─── Helper ───

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
}

// ─── Tamagotchi Endpoints ───

export async function fetchStatus(): Promise<StatusResponse> {
  return apiRequest<StatusResponse>(`${TAMAGOTCHI_URL}/status`);
}

export async function performAction(action: 'feed' | 'play' | 'sleep' | 'pet'): Promise<ActionResponse> {
  return apiRequest<ActionResponse>(`${TAMAGOTCHI_URL}/action`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}

// ─── Progress Endpoints ───

export async function unlockLetter(letterId: string): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/letters/unlock`, {
    method: 'POST',
    body: JSON.stringify({ letterId }),
  });
}

export async function viewSong(songId: string): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/songs/view`, {
    method: 'POST',
    body: JSON.stringify({ songId }),
  });
}

export async function unlockAchievement(achievementId: string): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/achievements/unlock`, {
    method: 'POST',
    body: JSON.stringify({ achievementId }),
  });
}

export async function findEasterEgg(easterEggId: string): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/easter-eggs/find`, {
    method: 'POST',
    body: JSON.stringify({ easterEggId }),
  });
}

export async function setTheme(theme: string): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/theme`, {
    method: 'POST',
    body: JSON.stringify({ theme }),
  });
}

export async function getStreak(): Promise<StreakResponse> {
  return apiRequest<StreakResponse>(`${PROGRESS_URL}/streak`);
}

export async function checkSecret(): Promise<SecretResponse> {
  return apiRequest<SecretResponse>(`${PROGRESS_URL}/secret`);
}

export async function unlockSecret(): Promise<GenericResponse> {
  return apiRequest<GenericResponse>(`${PROGRESS_URL}/secret/unlock`, {
    method: 'POST',
  });
}
