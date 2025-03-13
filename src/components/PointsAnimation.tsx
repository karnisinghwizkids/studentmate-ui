import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface PointsAnimationProps {
  points: number;
  onComplete?: () => void;
}

export function PointsAnimation({ points, onComplete }: PointsAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            times: [0, 0.3, 0.5, 1],
            ease: "easeOut"
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{
              y: [0, -20],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.5, 1],
              repeat: 2,
            }}
            className="bg-yellow-400 rounded-full p-4 shadow-lg"
          >
            <Star className="w-8 h-8 text-yellow-900" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-20, 0, 0, 20],
            }}
            transition={{
              duration: 2,
              times: [0, 0.3, 0.7, 1],
            }}
            className="text-3xl font-bold text-white mt-4"
          >
            +{points} points!
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}