"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, PageId } from './page-data';

interface AltimeterNavProps {
  viewMode: ViewMode;
  selectedPage: PageId | null;
  onReturnToGallery?: () => void;
}

const PAGE_LABELS: Record<PageId, string> = {
  story: 'STORY',
  experience: 'EXPERIENCE',
  classic: 'CLASSIC',
  limited: 'LIMITED',
  cocktails: 'COCKTAILS',
  events: 'EVENTS',
};

export function AltimeterNavGallery({ viewMode, selectedPage, onReturnToGallery }: AltimeterNavProps) {
  if (viewMode === 'hero') return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-end gap-4"
    >
      <div className="flex flex-col items-end gap-2">
        {/* Gallery Mode - Simple text with dot */}
        {viewMode === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-[#F5EFE6] rounded-full" />
            <span className="text-xs font-medium text-[#F5EFE6] uppercase tracking-wider">
              Journey
            </span>
          </motion.div>
        )}
        
        {/* Page Mode */}
        {viewMode === 'page' && selectedPage && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#F5EFE6] rounded-full" />
              <span className="text-xs font-medium text-[#F5EFE6] uppercase tracking-wider">
                {PAGE_LABELS[selectedPage]}
              </span>
            </motion.div>
            
            {/* Return to Journey Button */}
            {onReturnToGallery && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onReturnToGallery}
                className="flex items-center gap-2 hover:opacity-70 transition-all duration-300"
              >
                <span className="w-2 h-2 bg-[#F5EFE6]/50 rounded-full" />
                <span className="text-xs font-medium text-[#F5EFE6]/50 uppercase tracking-wider hover:text-[#F5EFE6]">
                  Journey
                </span>
              </motion.button>
            )}
          </>
        )}
      </div>
      
      {/* Hint Text */}
      {viewMode === 'page' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[9px] text-[#F5EFE6]/50 uppercase tracking-widest writing-vertical-rl"
        >
          Press BACK
        </motion.p>
      )}
    </motion.div>
  );
}
