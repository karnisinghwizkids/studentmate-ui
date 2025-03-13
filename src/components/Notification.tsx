import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Trophy, X } from 'lucide-react';

interface NotificationProps {
  type: 'points' | 'badge' | 'achievement';
  title: string;
  message: string;
  onClose: () => void;
}

export function Notification({ type, title, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    points: <Star className="w-6 h-6 text-yellow-400" />,
    badge: <Award className="w-6 h-6 text-blue-400" />,
    achievement: <Trophy className="w-6 h-6 text-purple-400" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full z-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}