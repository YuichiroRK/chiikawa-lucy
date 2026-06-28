// ═══════════════════════════════════════════════
// 📊 CHIIKAWA TAMAGOTCHI - Stat Bar
// Barra de estado con gradiente y animaciones
// ═══════════════════════════════════════════════

interface StatBarProps {
  icon: string;
  label: string;
  value: number;
  color?: 'pink' | 'orange' | 'blue' | 'green' | 'purple';
  maxValue?: number;
}

const COLOR_GRADIENTS: Record<string, string> = {
  pink: 'linear-gradient(90deg, #ffb7c5, #ff8fa3)',
  orange: 'linear-gradient(90deg, #ffcba4, #ff9a5c)',
  blue: 'linear-gradient(90deg, #a0d2db, #7ec8e3)',
  green: 'linear-gradient(90deg, #b5ead7, #7dc8a0)',
  purple: 'linear-gradient(90deg, #c9b1ff, #a78bfa)',
};

const COLOR_BG: Record<string, string> = {
  pink: 'rgba(255, 183, 197, 0.2)',
  orange: 'rgba(255, 203, 164, 0.2)',
  blue: 'rgba(160, 210, 219, 0.2)',
  green: 'rgba(181, 234, 215, 0.2)',
  purple: 'rgba(201, 177, 255, 0.2)',
};

export default function StatBar({
  icon,
  label,
  value,
  color = 'pink',
  maxValue = 100,
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const isLow = percentage < 20;
  const isHigh = percentage > 80;

  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <span
        className={`text-xl flex-shrink-0 ${isLow ? 'animate-bounce' : ''}`}
        role="img"
        aria-label={label}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        className="text-xs font-bold text-text-cute w-16 flex-shrink-0"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {label}
      </span>

      {/* Bar */}
      <div className="flex-1 relative">
        <div
          className="h-5 rounded-full overflow-hidden relative"
          style={{
            background: COLOR_BG[color],
            boxShadow: isLow
              ? '0 0 10px rgba(255, 107, 157, 0.4)'
              : 'inset 0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{
              width: `${percentage}%`,
              background: COLOR_GRADIENTS[color],
              minWidth: percentage > 0 ? '0.5rem' : '0',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
              }}
            />

            {/* Pulse glow when high */}
            {isHigh && (
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
            )}
          </div>

          {/* Value text */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{
              color: percentage > 50 ? 'white' : 'var(--color-text-cute)',
              textShadow:
                percentage > 50
                  ? '0 1px 2px rgba(0,0,0,0.2)'
                  : 'none',
            }}
          >
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Low warning pulse */}
        {isLow && (
          <div
            className="absolute -inset-1 rounded-full animate-pulse opacity-30 pointer-events-none"
            style={{
              background: COLOR_GRADIENTS[color],
              filter: 'blur(4px)',
            }}
          />
        )}
      </div>
    </div>
  );
}
