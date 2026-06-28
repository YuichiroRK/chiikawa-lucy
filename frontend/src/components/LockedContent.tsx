// ═══════════════════════════════════════════════
// 🔒 CHIIKAWA TAMAGOTCHI - Locked Content Overlay
// Overlay para contenido bloqueado
// ═══════════════════════════════════════════════

interface LockedContentProps {
  requirements: string;
  icon?: string;
  className?: string;
}

export default function LockedContent({
  requirements,
  icon = '🔒',
  className = '',
}: LockedContentProps) {
  return (
    <div
      className={`
        absolute inset-0 z-10 flex flex-col items-center justify-center
        rounded-3xl overflow-hidden
        ${className}
      `}
      style={{
        background: 'rgba(255, 245, 247, 0.8)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer-effect pointer-events-none" />

      {/* Lock icon */}
      <div className="relative mb-3">
        <span className="text-4xl block animate-bounce-soft">{icon}</span>
        <div
          className="absolute -inset-3 rounded-full animate-pulse-glow pointer-events-none"
          style={{ opacity: 0.3 }}
        />
      </div>

      {/* Requirements text */}
      <p
        className="text-xs font-bold text-text-soft text-center px-4 max-w-[200px] leading-relaxed"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {requirements}
      </p>
    </div>
  );
}
