"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { PageCard } from './page-card';
import { getPages, PageId } from './page-data';

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const { t } = useTranslation('common');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get pages dynamically to support language changes
  const PAGES = getPages();
  const TOTAL_CARDS = PAGES.length;

  // Animation delay after component mounts
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [isActive]);

  // Calculate card positions - horizontal spread from center
  const getCardPosition = (index: number) => {
    const spacing = 225; // Space between card centers
    const totalWidth = (TOTAL_CARDS - 1) * spacing;
    const x = (index * spacing) - (totalWidth / 2);

    // Slight random y offset for organic feel
    const yOffsets = [15, 32, 8, 22, 44, 12];
    const y = yOffsets[index % yOffsets.length];

    return { x: `${x}px`, y: `${y}px` };
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation variants - spread from center
  const cardVariants = {
    hidden: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0,
    },
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40 overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 bg-[#2B1810]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/60" />
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <p className="text-xs md:text-sm font-light uppercase tracking-widest text-[#F5EFE6]/60 mb-2">
            {t('gallery.subtitle')}
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon">
            {t('gallery.title')}
          </h2>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ marginTop: '40px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative flex justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {/* Base container for stacking */}
            <div className="relative h-[315px] w-[200px]">
              {/* Render cards - reversed for z-index stacking */}
              {[...PAGES].reverse().map((page, reverseIndex) => {
                const originalIndex = PAGES.length - 1 - reverseIndex;
                const position = getCardPosition(originalIndex);
                const isHovered = hoveredIndex === originalIndex;

                return (
                  <motion.div
                    key={page.id}
                    className="absolute left-0 top-0"
                    style={{ 
                      zIndex: isHovered ? 999 : 50 - originalIndex * 10,
                    }}
                    variants={cardVariants}
                    custom={{
                      x: position.x,
                      y: position.y,
                      order: originalIndex,
                    }}
                    onMouseEnter={() => setHoveredIndex(originalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <PageCard
                      page={page}
                      index={originalIndex}
                      isHovered={isHovered}
                      onClick={() => onPageSelect(page.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Hint Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.6 : 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest">
            {t('gallery.hint')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}