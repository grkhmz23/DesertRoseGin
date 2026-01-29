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
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PAGES = getPages();
  const TOTAL_CARDS = PAGES.length;

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [isActive]);

  // Desktop card positions
  const getCardPosition = (index: number) => {
    const spacing = 225;
    const totalWidth = (TOTAL_CARDS - 1) * spacing;
    const x = (index * spacing) - (totalWidth / 2);
    const yOffsets = [15, 32, 8, 22, 44, 12];
    const y = yOffsets[index % yOffsets.length];
    return { x: `${x}px`, y: `${y}px` };
  };

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

  const cardVariants = {
    hidden: { x: 0, y: 0, scale: 1, opacity: 0 },
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

  // Mobile swipe handlers
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentMobileIndex < TOTAL_CARDS - 1) {
      setCurrentMobileIndex(prev => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentMobileIndex > 0) {
      setCurrentMobileIndex(prev => prev - 1);
    }
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

        {/* DESKTOP Cards Container - Hidden on mobile */}
        <motion.div
          className="hidden md:flex relative items-center justify-center"
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
            <div className="relative h-[315px] w-[200px]">
              {[...PAGES].reverse().map((page, reverseIndex) => {
                const originalIndex = PAGES.length - 1 - reverseIndex;
                const position = getCardPosition(originalIndex);
                const isHovered = hoveredIndex === originalIndex;
                return (
                  <motion.div
                    key={page.id}
                    className="absolute left-0 top-0"
                    style={{ zIndex: isHovered ? 999 : 50 - originalIndex * 10 }}
                    variants={cardVariants}
                    custom={{ x: position.x, y: position.y, order: originalIndex }}
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

        {/* MOBILE Cards Carousel - Hidden on desktop */}
        <div className="md:hidden w-full flex flex-col items-center" style={{ marginTop: '60px' }}>
          <motion.div
            className="relative w-full overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="flex gap-4 pl-[calc(50vw-100px)]"
              drag="x"
              dragConstraints={{ left: -((TOTAL_CARDS - 1) * 220 + 40), right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              animate={{ x: -currentMobileIndex * 220 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ cursor: 'grab', touchAction: 'pan-y' }}
            >
              {PAGES.map((page, index) => (
                <motion.div
                  key={page.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    scale: currentMobileIndex === index ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PageCard
                    page={page}
                    index={index}
                    isHovered={currentMobileIndex === index}
                    onClick={() => onPageSelect(page.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Mobile Page Indicators */}
          <div className="flex gap-2 mt-6">
            {PAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMobileIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentMobileIndex === index 
                    ? 'bg-[#F5EFE6] w-6' 
                    : 'bg-[#F5EFE6]/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hint Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.6 : 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest hidden md:block">
            {t('gallery.hint')}
          </p>
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest md:hidden">
            Swipe to explore
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
