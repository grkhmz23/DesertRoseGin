"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId, getPageById } from './page-data';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface PageViewerProps {
  pageId: PageId | null;
  isActive: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PageViewer({ pageId, isActive, onClose, children }: PageViewerProps) {
  const { t } = useTranslation('common');
  const page = pageId ? getPageById(pageId) : null;
  const [isCocktailDetailOpen, setIsCocktailDetailOpen] = useState(false);
  const scrollHidden = useScrollDirection(pageId);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCocktailDetailVisibility = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen?: boolean }>;
      setIsCocktailDetailOpen(!!customEvent.detail?.isOpen);
    };

    window.addEventListener('drg:cocktail-detail-visibility', handleCocktailDetailVisibility as EventListener);

    return () => {
      window.removeEventListener('drg:cocktail-detail-visibility', handleCocktailDetailVisibility as EventListener);
    };
  }, []);

  if (!page || !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="absolute inset-0 z-50 bg-[#2B1810]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.45,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          {/* Close Button (BACK hint) */}
          {!(pageId === 'cocktails' && isCocktailDetailOpen) && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: scrollHidden ? 0 : 1, x: scrollHidden ? 20 : 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: scrollHidden ? 0 : 0.3, duration: 0.3 }}
              onClick={onClose}
              className="fixed top-5 right-5 md:top-6 md:right-6 lg:top-8 lg:right-8 z-[100] flex items-center gap-2 px-3 py-2 md:px-4 bg-[#2B1810]/80 backdrop-blur-sm border border-[#F5EFE6]/15 text-[#F5EFE6] hover:bg-[#F5EFE6]/20 hover:text-[#F5EFE6] transition-all duration-300 group"
              data-cursor="button"
              data-cursor-text={t('ui.navigation.close')}
            >
              <X className="w-4 h-4" strokeWidth={1.2} />
              <span className="hidden text-[10px] md:text-[11px] font-light uppercase tracking-[0.18em] text-[#F5EFE6]/85 md:inline">
                {t('ui.navigation.back')}
              </span>
            </motion.button>
          )}

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
