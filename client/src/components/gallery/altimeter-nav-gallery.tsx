"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, PageId } from './page-data';
import { Circle, Grid3x3 } from 'lucide-react';

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
  // Don't show nav in hero mode
  if (viewMode === 'hero') return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-end gap-4"
    >
      {/* View Mode Indicator */}
      <div className="flex flex-col items-end gap-2">

        {/* Gallery Mode */}
        {viewMode === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 bg-[#2B1810]/80 backdrop-blur-sm border border-[#CD7E31]/30 rounded-lg"
          >
            <Grid3x3 className="w-4 h-4 text-[#CD7E31]" />
            <span className="text-xs font-medium text-[#F5EFE6] uppercase tracking-wider hidden md:inline">
              Gallery
            </span>
          </motion.div>
        )}

        {/* Page Mode */}
        {viewMode === 'page' && selectedPage && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-[#CD7E31] border border-[#CD7E31] rounded-lg"
            >
              <Circle className="w-3 h-3 text-[#2B1810] fill-current" />
              <span className="text-xs font-bold text-[#2B1810] uppercase tracking-wider">
                {PAGE_LABELS[selectedPage]}
              </span>
            </motion.div>

            {/* Return to Gallery Button */}
            {onReturnToGallery && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onReturnToGallery}
                className="flex items-center gap-2 px-3 py-2 bg-[#2B1810]/60 backdrop-blur-sm border border-[#CD7E31]/20 rounded-lg hover:bg-[#CD7E31] hover:border-[#CD7E31] transition-all duration-300 group"
              >
                <Grid3x3 className="w-3 h-3 text-[#CD7E31] group-hover:text-[#2B1810]" />
                <span className="text-xs font-medium text-[#F5EFE6] group-hover:text-[#2B1810] uppercase tracking-wider hidden md:inline">
                  Gallery
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
          Press ESC
        </motion.p>
      )}
    </motion.div>
  );
}