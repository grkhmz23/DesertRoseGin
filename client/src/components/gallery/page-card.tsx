"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
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

// Random rotation helper
function getRandomRotation(min: number, max: number, direction: 'left' | 'right'): number {
  const value = Math.random() * (max - min) + min;
  return direction === 'left' ? -value : value;
}

export function PageCard({ page, index, isHovered, onClick }: PageCardProps) {
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine rotation direction based on index
  const direction = index % 2 === 0 ? 'left' : 'right';

  // Set initial random rotation
  useEffect(() => {
    const randomRotation = getRandomRotation(1, 4, direction);
    setRotation(randomRotation);
  }, [direction]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileTap={{ scale: 1.1, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === 'left' ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
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
      className="relative cursor-grab active:cursor-grabbing"
      onClick={onClick}
      draggable={false}
    >
      {/* 3D Flip Container */}
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
        {/* Front Face - Thumbnail - SHARP CORNERS */}
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

          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2B1810]/80" 
          />

          {/* Title on front */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p className="text-xs font-bold text-[#F5EFE6] uppercase tracking-wider leading-tight">
              {page.title}
            </p>
          </div>

          {/* Coming Soon Badge */}
          {page.comingSoon && (
            <div className="absolute top-2 right-2 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Soon
            </div>
          )}
        </div>

        {/* Back Face - Description - SHARP CORNERS */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl bg-[#2B1810] flex flex-col items-center justify-center p-5"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            {/* Category */}
            <p 
              className="text-[8px] font-bold uppercase tracking-widest mb-2"
              style={{ color: page.color }}
            >
              {page.category}
            </p>

            {/* Title */}
            <h3 className="text-sm font-bold text-[#F5EFE6] leading-tight mb-2">
              {page.title}
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-[#F5EFE6]/70 leading-tight mb-3 font-light">
              {page.subtitle}
            </p>

            {/* Description */}
            <p className="text-[10px] text-[#F5EFE6]/60 leading-relaxed px-2">
              {page.description}
            </p>

            {/* Click Hint */}
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