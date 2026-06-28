// ═══════════════════════════════════════════════
// 🌸 CHIIKAWA TAMAGOTCHI - Particle Background
// Partículas flotantes decorativas (CSS-only)
// ═══════════════════════════════════════════════

import React, { useMemo } from 'react';

interface ParticleBackgroundProps {
  particles?: string[];
  count?: number;
}

export default function ParticleBackground({
  particles = ['💕', '🌸', '✨', '💖', '🎀'],
  count = 15,
}: ParticleBackgroundProps) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: particles[i % particles.length],
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      size: `${0.8 + Math.random() * 1}rem`,
    }));
  }, [particles, count]);

  return (
    <div className="particle-container" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="particle"
          style={{
            left: item.left,
            '--particle-duration': item.duration,
            '--particle-delay': item.delay,
            '--particle-size': item.size,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
          } as React.CSSProperties}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
