// ═══════════════════════════════════════════════
// 🔔 CHIIKAWA TAMAGOTCHI - Notification Toast
// Componente de notificaciones toast
// ═══════════════════════════════════════════════

import { type Notification, type NotificationType } from '@/hooks/useNotifications';

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const TYPE_COLORS: Record<NotificationType, { bg: string; border: string; text: string }> = {
  info: {
    bg: 'rgba(160, 210, 219, 0.9)',
    border: 'rgba(126, 200, 227, 0.5)',
    text: '#2d6a7e',
  },
  success: {
    bg: 'rgba(181, 234, 215, 0.9)',
    border: 'rgba(125, 200, 160, 0.5)',
    text: '#2d7e5a',
  },
  achievement: {
    bg: 'rgba(255, 224, 102, 0.9)',
    border: 'rgba(255, 200, 50, 0.5)',
    text: '#7e6a2d',
  },
  warning: {
    bg: 'rgba(255, 183, 197, 0.9)',
    border: 'rgba(255, 143, 163, 0.5)',
    text: '#7e2d4a',
  },
};

export default function NotificationToast({
  notifications,
  onDismiss,
}: NotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        const colors = TYPE_COLORS[notif.type];

        return (
          <div
            key={notif.id}
            className="pointer-events-auto rounded-2xl overflow-hidden shadow-lg"
            style={{
              background: colors.bg,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `2px solid ${colors.border}`,
              animation: 'slideInRight 0.4s ease-out',
            }}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              {/* Emoji */}
              <span className="text-xl flex-shrink-0 mt-0.5 animate-bounce-soft">
                {notif.emoji}
              </span>

              {/* Message */}
              <p
                className="flex-1 text-sm font-semibold leading-snug"
                style={{
                  color: colors.text,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {notif.message}
              </p>

              {/* Close button */}
              <button
                onClick={() => onDismiss(notif.id)}
                className="flex-shrink-0 text-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: colors.text }}
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="h-1 w-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  background: colors.border,
                  animation: `progress-shrink ${notif.duration}ms linear`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
