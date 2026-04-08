"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { PageCard, CARD_WIDTH, CARD_HEIGHT } from './page-card';
import { MobileCardCarousel } from './mobile-card-carousel';
import { getPages, PageId } from './page-data';
import { BrandFooter } from '@/components/layout/brand-footer';

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
  initialPageId?: PageId | null;
  embeddedOnHero?: boolean;
}

export function PageCardGallery({
  onPageSelect,
  isActive,
  initialPageId = null,
  embeddedOnHero = false,
}: PageCardGalleryProps) {
  const { t } = useTranslation('common');
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Desktop card positions - horizontal spread with slight Y offsets
  const getCardPosition = (index: number) => {
    const spacing = 225;
    const totalWidth = (TOTAL_CARDS - 1) * spacing;
    const x = (index * spacing) - (totalWidth / 2);
    const y = 20;
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

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40 overflow-y-auto"
    >
      {!embeddedOnHero && (
        <div className="sticky top-0 h-[100dvh] -mb-[100dvh] w-full z-0 bg-[#2B1810]">
          <img
            src="/video/gallery-bg-poster.webp"
            alt=""
            className="lg:hidden absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden lg:block absolute inset-0 w-full h-full object-cover opacity-50"
            poster="/video/gallery-bg-poster.webp"
          >
            <source src="/video/gallery-bg.webm" type="video/webm" />
            <source src="/video/gallery-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#2B1810]/60" />
        </div>
      )}

      {/* Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center"
      >
        {/* Title - Desktop only */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-[8%] z-10 hidden lg:flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <p className="text-xs lg:text-sm font-light uppercase tracking-widest text-[#F5EFE6]/60 mb-2">
            {t('gallery.subtitle', 'Explore our world')}
          </p>
          <h2 className="text-3xl lg:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon">
            {t('gallery.title', 'Discover Desert Rose')}
          </h2>
        </motion.div>

        {/* DESKTOP Cards Container */}
        <motion.div
          className="hidden lg:flex relative items-center justify-center"
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
            <div className="relative" style={{ height: CARD_HEIGHT, width: CARD_WIDTH }}>
              {[...PAGES].reverse().map((page, reverseIndex) => {
                const originalIndex = PAGES.length - 1 - reverseIndex;
                const position = getCardPosition(originalIndex);
                return (
                  <motion.div
                    key={page.id}
                    className="absolute left-0 top-0"
                    style={{ zIndex: 50 - originalIndex * 10 }}
                    variants={cardVariants}
                    custom={{ x: position.x, y: position.y, order: originalIndex }}
                  >
                    <PageCard
                      page={page}
                      index={originalIndex}
                      isHovered={false}
                      onClick={() => onPageSelect(page.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* MOBILE + TABLET - Carousel */}
        <div className="lg:hidden w-full h-full">
          <MobileCardCarousel
            pages={PAGES}
            initialPageId={initialPageId}
            onPageSelect={(id) => onPageSelect(id as PageId)}
          />
        </div>

        {/* Hint Text - Desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.6 : 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center hidden lg:block"
        >
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest">
            {t('gallery.hint', 'Hover to preview • Click to explore')}
          </p>
        </motion.div>
      </div>

      {/* Footer — visible when user scrolls below the card view */}
      <div className="relative z-10">
        <BrandFooter />
      </div>
    </motion.div>
  );
}
