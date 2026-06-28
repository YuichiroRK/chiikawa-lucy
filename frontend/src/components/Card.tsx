// ═══════════════════════════════════════════════
// 🃏 CHIIKAWA TAMAGOTCHI - Card Component
// Tarjeta reutilizable con glassmorphism
// ═══════════════════════════════════════════════

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  locked?: boolean;
  className?: string;
  hoverEffect?: boolean;
  glowOnHover?: boolean;
}

export default function Card({
  children,
  onClick,
  locked = false,
  className = '',
  hoverEffect = true,
  glowOnHover = false,
}: CardProps) {
  return (
    <div
      onClick={locked ? undefined : onClick}
      className={`
        relative overflow-hidden rounded-3xl
        transition-all duration-300 ease-out
        ${locked ? 'cursor-default' : onClick ? 'cursor-pointer' : ''}
        ${hoverEffect && !locked ? 'hover:-translate-y-1 hover:shadow-kawaii-lg' : ''}
        ${glowOnHover && !locked ? 'hover:shadow-glow-pink' : ''}
        ${className}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 4px 20px rgba(255, 183, 197, 0.2)',
      }}
      role={onClick && !locked ? 'button' : undefined}
      tabIndex={onClick && !locked ? 0 : undefined}
      onKeyDown={
        onClick && !locked
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}

      {/* Locked overlay */}
      {locked && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            background: 'rgba(255, 245, 247, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div className="text-center">
            <span className="text-3xl block mb-1 animate-bounce-soft">🔒</span>
            <span
              className="text-xs font-bold text-text-soft"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Bloqueado
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
