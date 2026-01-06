"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PageData } from './page-data';
import { Clock } from 'lucide-react';

interface PageCardProps {
  page: PageData;
  index: number;
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
  onClick: () => void;
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 210;

export function PageCard({ page, index, target, onClick }: PageCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        zIndex: 100 - index,
      }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180, scale: 1.05 }}
      >
        {/* Front Face - Thumbnail - NO ROUNDED CORNERS, NO BORDER */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden shadow-2xl bg-[#f0e5d1]"
          style={{ 
            backfaceVisibility: "hidden",
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
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2B1810]/80 transition-all group-hover:to-[#2B1810]/60" 
          />

          {/* Title on front */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
            <p className="text-[8px] font-bold text-[#F5EFE6] uppercase tracking-wider leading-tight">
              {page.title}
            </p>
          </div>

          {/* Coming Soon Badge */}
          {page.comingSoon && (
            <div className="absolute top-1 right-1 bg-[#CD7E31] text-[#2B1810] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Clock className="w-2 h-2" />
              Soon
            </div>
          )}
        </div>

        {/* Back Face - Description - NO ROUNDED CORNERS, NO BORDER */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden shadow-2xl bg-[#2B1810] flex flex-col items-center justify-center p-3"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            {/* Category */}
            <p 
              className="text-[6px] font-bold uppercase tracking-widest mb-1"
              style={{ color: page.color }}
            >
              {page.category}
            </p>

            {/* Title */}
            <h3 className="text-[9px] font-bold text-[#F5EFE6] leading-tight mb-1.5">
              {page.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[7px] text-[#F5EFE6]/70 leading-tight mb-1.5 font-light">
              {page.subtitle}
            </p>

            {/* Description */}
            <p className="text-[6px] text-[#F5EFE6]/60 leading-relaxed px-1">
              {page.description}
            </p>

            {/* Click Hint */}
            <div className="mt-2 pt-1.5 border-t border-[#CD7E31]/30">
              <p className="text-[6px] text-[#CD7E31] uppercase tracking-widest">
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