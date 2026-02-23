import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('edgeledger_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(
          parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }))
        );
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('edgeledger_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('edgeledger_notifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
