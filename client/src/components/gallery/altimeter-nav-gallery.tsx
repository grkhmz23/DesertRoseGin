"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, PageId } from './page-data';

interface AltimeterNavProps {
  viewMode: ViewMode;
  selectedPage: PageId | null;
  onSelectPage?: (pageId: PageId) => void;
}

const PAGE_LABELS: Record<PageId, string> = {
  limited: 'LIMITED',
  classic: 'CLASSIC',
  cocktails: 'COCKTAILS',
  story: 'STORY',
  experience: 'EXPERIENCE',
};

export function AltimeterNavGallery({ viewMode, selectedPage, onSelectPage }: AltimeterNavProps) {
  if (viewMode !== 'page') return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-[80] flex-col items-end gap-4"
    >
      <div className="flex flex-col items-end gap-2">
        {/* Page Mode */}
        {viewMode === 'page' && selectedPage && (
          <>
            {(Object.keys(PAGE_LABELS) as PageId[]).map((pageId, index) => {
              const isActive = pageId === selectedPage;

              return (
                <motion.button
                  key={pageId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  onClick={() => onSelectPage?.(pageId)}
                  className="flex items-center gap-2 hover:opacity-90 transition-all duration-300"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#F5EFE6]' : 'bg-[#F5EFE6]/25'}`} />
                  <span className={`text-[10px] md:text-[11px] font-ergon-light uppercase tracking-[0.18em] ${isActive ? 'text-[#F5EFE6]' : 'text-[#F5EFE6]/50 hover:text-[#F5EFE6]/85'}`}>
                    {PAGE_LABELS[pageId]}
                  </span>
                </motion.button>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
}
