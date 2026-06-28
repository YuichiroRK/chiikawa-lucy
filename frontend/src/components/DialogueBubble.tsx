// ═══════════════════════════════════════════════
// 💬 CHIIKAWA TAMAGOTCHI - Dialogue Bubble
// Burbuja de diálogo con efecto de escritura
// ═══════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';

interface DialogueBubbleProps {
  text: string;
  emoji?: string;
  typing?: boolean;
  className?: string;
}

export default function DialogueBubble({
  text,
  emoji = '🌸',
  typing = true,
  className = '',
}: DialogueBubbleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!typing) {
      setDisplayText(text);
      return;
    }

    setIsTyping(true);
    setDisplayText('');
    let charIndex = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, typing]);

  return (
    <div className={`relative ${className}`}>
      {/* Bubble */}
      <div
        className="glass-card-solid px-5 py-3 text-center relative"
        style={{ borderRadius: '1.5rem' }}
      >
        <p
          className="font-semibold text-text-cute leading-relaxed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="mr-1">{emoji}</span>
          {displayText}
          {isTyping && (
            <span className="inline-block animate-pulse ml-1 text-kawaii-pink">
              |
            </span>
          )}
        </p>
      </div>

      {/* Tail (pointing down) */}
      <div className="flex justify-center">
        <div
          className="w-4 h-4 rotate-45 -mt-2"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(255, 183, 197, 0.3)',
            borderTop: 'none',
            borderLeft: 'none',
          }}
        />
      </div>
    </div>
  );
}
