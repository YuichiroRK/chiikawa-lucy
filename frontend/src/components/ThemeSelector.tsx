// ═══════════════════════════════════════════════
// 🎨 CHIIKAWA TAMAGOTCHI - Theme Selector
// Selector de temas visuales
// ═══════════════════════════════════════════════

import { THEMES, type Theme } from '@/utils/gameData';

interface ThemeSelectorProps {
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
  isThemeUnlocked: (themeId: string) => boolean;
  className?: string;
}

export default function ThemeSelector({
  activeThemeId,
  onSelectTheme,
  isThemeUnlocked,
  className = '',
}: ThemeSelectorProps) {
  return (
    <div className={`${className}`}>
      <h3
        className="text-sm font-bold text-text-cute mb-3 text-center"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        🎨 Elige un Tema
      </h3>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {THEMES.map((theme) => {
          const unlocked = isThemeUnlocked(theme.id);
          const active = theme.id === activeThemeId;

          return (
            <button
              key={theme.id}
              onClick={() => unlocked && onSelectTheme(theme.id)}
              disabled={!unlocked}
              className={`
                relative rounded-xl p-2 transition-all duration-300 cursor-pointer
                flex flex-col items-center gap-1
                ${active ? 'ring-2 ring-deep-pink scale-105 shadow-lg' : ''}
                ${!unlocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'}
              `}
              style={{
                background: unlocked
                  ? `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}60)`
                  : 'rgba(200, 200, 200, 0.3)',
                border: active
                  ? '2px solid var(--color-deep-pink)'
                  : '1px solid rgba(255,255,255,0.5)',
              }}
              title={unlocked ? theme.name : `🔒 ${theme.unlockCondition}`}
            >
              {/* Theme preview circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: unlocked
                    ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                    : '#ccc',
                }}
              >
                {unlocked ? theme.emoji : '🔒'}
              </div>

              {/* Theme name */}
              <span
                className="text-[10px] font-bold text-text-cute truncate w-full text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {theme.name}
              </span>

              {/* Active indicator */}
              {active && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-deep-pink text-white text-[8px] flex items-center justify-center font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
