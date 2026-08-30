// ═══════════════════════════════════════════════
// 🎀 CHIIKAWA TAMAGOTCHI - Action Button
// Botones de acción kawaii con animaciones
// ═══════════════════════════════════════════════

import { useState, useCallback } from 'react';

interface ActionButtonProps {
  text: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  cooldown?: boolean;
  className?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const SPARKLE_EMOJIS = ['✨', '💖', '⭐', '🌟', '💕'];

export default function ActionButton({
  text,
  icon,
  onClick,
  disabled = false,
  cooldown = false,
  className = '',
}: ActionButtonProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [pressed, setPressed] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled || cooldown) return;

    setPressed(true);
    setTimeout(() => setPressed(false), 300);

    // Create sparkle particles
    const newSparkles: Sparkle[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
      y: -(Math.random() * 60 + 20),
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 800);

    onClick();
  }, [disabled, cooldown, onClick]);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled || cooldown}
        className={`
          relative w-full py-3 px-4 rounded-2xl
          font-bold text-white
          flex flex-col items-center justify-center gap-1
          transition-all duration-300
          ${
            disabled || cooldown
              ? 'opacity-50 cursor-not-allowed grayscale'
              : 'cursor-pointer hover:scale-105 active:scale-95'
          }
          ${pressed ? 'scale-90' : ''}
          ${className}
        `}
        style={{
          background: disabled || cooldown
            ? 'linear-gradient(135deg, #ccc, #aaa)'
            : 'linear-gradient(135deg, var(--color-kawaii-pink), var(--color-deep-pink))',
          boxShadow: disabled || cooldown
            ? 'none'
            : '0 4px 15px rgba(255, 183, 197, 0.4)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {/* Icon */}
        <span className="text-2xl">
          {icon}
        </span>

        {/* Text */}
        <span className="text-xs tracking-wide">{text}</span>

        {/* Cooldown overlay */}
        {cooldown && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-white/20"
              style={{
                height: '100%',
                animation: 'progress-shrink 3s linear forwards',
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              ⏳
            </span>
          </div>
        )}

        {/* Hover glow */}
        {!disabled && !cooldown && (
          <div
            className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)',
            }}
          />
        )}
      </button>

      {/* Sparkle particles */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute left-1/2 top-1/2 pointer-events-none text-sm"
          style={{
            transform: `translate(${sparkle.x}px, ${sparkle.y}px) scale(0)`,
            animation: 'sparkle-fly 0.7s ease-out forwards',
            zIndex: 10,
          }}
        >
          {sparkle.emoji}
        </span>
      ))}

      <style jsx>{`
        @keyframes sparkle-fly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 20px), var(--ty, -40px)) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
