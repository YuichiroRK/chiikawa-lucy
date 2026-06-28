// ═══════════════════════════════════════════════
// 🔔 CHIIKAWA TAMAGOTCHI - Notifications Hook
// Sistema de notificaciones toast
// ═══════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';

export type NotificationType = 'info' | 'success' | 'achievement' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  emoji: string;
  createdAt: number;
  duration: number;
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, emoji?: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const TYPE_EMOJIS: Record<NotificationType, string> = {
  info: '💬',
  success: '✨',
  achievement: '🏆',
  warning: '⚠️',
};

let notificationCounter = 0;

export function useNotifications(): NotificationsState {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = 'info',
      emoji?: string,
      duration: number = 5000
    ) => {
      const id = `notif-${++notificationCounter}-${Date.now()}`;
      const notification: Notification = {
        id,
        message,
        type,
        emoji: emoji || TYPE_EMOJIS[type],
        createdAt: Date.now(),
        duration,
      };

      setNotifications((prev) => {
        // Limit to 5 notifications
        const updated = [...prev, notification];
        if (updated.length > 5) {
          const removed = updated.shift();
          if (removed && timers.current[removed.id]) {
            clearTimeout(timers.current[removed.id]);
            delete timers.current[removed.id];
          }
        }
        return updated;
      });

      // Auto-dismiss
      timers.current[id] = setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    [removeNotification]
  );

  const clearAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}
