"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId, getPageById } from './page-data';
import { X } from 'lucide-react';

interface PageViewerProps {
  pageId: PageId | null;
  isActive: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PageViewer({ pageId, isActive, onClose, children }: PageViewerProps) {
  const page = pageId ? getPageById(pageId) : null;

  // BACK key handler
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onClose]);

  if (!page || !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="absolute inset-0 z-50 bg-[#2B1810]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          {/* Close Button (BACK hint) */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="fixed top-6 right-6 md:top-8 md:right-8 z-[100] flex items-center gap-2 px-4 py-2 bg-[#2B1810]/80 backdrop-blur-sm border border-[#CD7E31]/30 rounded-lg text-[#F5EFE6] hover:bg-[#CD7E31] hover:text-[#2B1810] transition-all duration-300 group"
            data-cursor="button"
            data-cursor-text="Close"
          >
            <X className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wider hidden md:inline">
              BACK
            </span>
          </motion.button>

          {/* Content - The actual scene component */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
