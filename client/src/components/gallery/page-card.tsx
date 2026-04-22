"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageData } from './page-data';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PageCardProps {
  page: PageData;
  index: number;
  isHovered: boolean;
  onClick: () => void;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 315;

function getRandomRotation(min: number, max: number, direction: 'left' | 'right'): number {
  const value = Math.random() * (max - min) + min;
  return direction === 'left' ? -value : value;
}

export function PageCard({ page, index, isHovered, onClick }: PageCardProps) {
  const { t } = useTranslation('common');
  const [rotation, setRotation] = useState(0);
  const [isLocallyHovered, setIsLocallyHovered] = useState(false);

  const direction = index % 2 === 0 ? 'left' : 'right';
  const shouldFlip = isHovered || isLocallyHovered;

  useEffect(() => {
    const randomRotation = getRandomRotation(1, 4, direction);
    setRotation(randomRotation);
  }, [direction]);

  return (
    <motion.div
      whileTap={{ scale: 1.03, zIndex: 9999 }}
      whileHover={{
        scale: 1.04,
        rotate: 0,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, rotation, 0] }}
      transition={{
        duration: 0.9,
        times: [0, 0.45, 1],
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        perspective: 1000,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
      className={`relative ${page.comingSoon ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={onClick}
      onMouseEnter={() => setIsLocallyHovered(true)}
      onMouseLeave={() => setIsLocallyHovered(false)}
      draggable={false}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d',
        }}
        animate={{ 
          rotateY: shouldFlip ? 180 : 0,
        }}
        transition={{ 
          duration: 0.6, 
          type: 'spring', 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl bg-[#f0e5d1]"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
          <img
            src={page.thumbnail}
            alt={page.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2B1810]/80" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p className="font-ergon-light text-xs font-light text-[#F5EFE6] uppercase tracking-[0.18em] leading-tight">
              {page.title}
            </p>
          </div>
          {page.comingSoon && (
            <div className="absolute top-2 right-2 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[8px] font-light uppercase tracking-[0.18em] flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={1.2} />
              {t('ui.navigation.comingSoon')}
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl bg-[#2B1810] flex flex-col items-center justify-center p-5"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <p 
              className="font-ergon-light text-[8px] font-light uppercase tracking-[0.22em] mb-2"
              style={{ color: page.color }}
            >
              {page.category}
            </p>
            <h3 className="font-ergon-light text-sm font-light text-[#F5EFE6] leading-tight mb-2">
              {page.title}
            </h3>
            <p className="font-ergon-light text-[10px] font-light text-[#F5EFE6]/60 leading-relaxed px-2">
              {page.id === 'journey'
                ? "Each stop is a moment, a place, an experience—marking the path of an evolving adventure."
                : page.description}
            </p>
            <div className="mt-4 pt-3 border-t border-[#CD7E31]/15">
              {page.comingSoon ? (
                <p className="font-ergon-light text-[8px] font-light text-[#CD7E31]/60 uppercase tracking-[0.22em]">
                  {t('ui.navigation.comingSoon')}
                </p>
              ) : (
                <p className="font-ergon-light text-[8px] font-light text-[#CD7E31] uppercase tracking-[0.22em]">
                  {t('ui.navigation.clickToExplore', 'Click to Explore')}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { CARD_WIDTH, CARD_HEIGHT };
