import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import api from '../../api/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
  read: boolean;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout>();

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up polling for notifications
    pollingInterval.current = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/dismiss`);
      // Update notifications immediately after successful dismissal
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-l-4 border-green-500';
      case 'warning':
        return 'bg-yellow-500/20 border-l-4 border-yellow-500';
      default:
        return 'bg-primary-blue/20 border-l-4 border-primary-blue';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-primary-blue/10 transition-colors"
      >
        <Bell className="w-6 h-6 text-primary-pink" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-primary-orange/90 backdrop-blur-sm rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center text-white/70">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-200">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-white/70">No notifications</div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 ${getNotificationStyles(notification.type)} ${
                    !notification.read ? 'bg-opacity-30' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-white/90 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/70 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}