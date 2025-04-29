'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-2 p-4 rounded-lg shadow-lg flex items-center ${
                notification.type === 'success'
                  ? 'bg-green-500 text-white'
                  : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <span className="mr-2">
                {notification.type === 'success' ? (
                  <FaCheckCircle />
                ) : notification.type === 'error' ? (
                  <FaExclamationCircle />
                ) : (
                  <FaInfoCircle />
                )}
              </span>
              <p className="mr-4">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-auto text-white hover:text-gray-200"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};