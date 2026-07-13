'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  className = '',
}: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-50 w-max max-w-xs ${positionClasses[position]}`}
          >
            <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-lg dark:bg-black dark:ring-1 dark:ring-white/10">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}