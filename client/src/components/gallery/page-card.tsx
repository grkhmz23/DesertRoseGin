"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageData } from './page-data';
import { Clock } from 'lucide-react';

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
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const direction = index % 2 === 0 ? 'left' : 'right';

  useEffect(() => {
    const randomRotation = getRandomRotation(1, 4, direction);
    setRotation(randomRotation);
  }, [direction]);

  return (
    <motion.div
      whileTap={{ scale: 1.1, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === 'left' ? -1 : 1),
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        perspective: 1000,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
      className="relative cursor-pointer"
      onClick={onClick}
      draggable={false}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d',
        }}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ 
          duration: 0.6, 
          type: 'spring', 
          stiffness: 260, 
          damping: 20 
        }}
        onHoverStart={() => setIsFlipped(true)}
        onHoverEnd={() => setIsFlipped(false)}
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
            <p className="text-xs font-normal text-[#F5EFE6] uppercase tracking-wider leading-tight">
              {page.title}
            </p>
          </div>
          {page.comingSoon && (
            <div className="absolute top-2 right-2 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[8px] font-normal uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Soon
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
              className="text-[8px] font-normal uppercase tracking-widest mb-2"
              style={{ color: page.color }}
            >
              {page.category}
            </p>
            <h3 className="text-sm font-normal text-[#F5EFE6] leading-tight mb-2">
              {page.title}
            </h3>
            <p className="text-xs text-[#F5EFE6]/70 leading-tight mb-3 font-light">
              {page.subtitle}
            </p>
            <p className="text-[10px] text-[#F5EFE6]/60 leading-relaxed px-2">
              {page.description}
            </p>
            <div className="mt-4 pt-3 border-t border-[#CD7E31]/30">
              <p className="text-[8px] text-[#CD7E31] uppercase tracking-widest">
                {page.comingSoon ? 'Preview' : 'Click to Explore'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { CARD_WIDTH, CARD_HEIGHT };
