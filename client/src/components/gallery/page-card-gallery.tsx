"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { PageCard } from './page-card';
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery';
import { getPages, PageId } from './page-data';


function useIsMobile(breakpointPx: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();

    // Safari fallback for older addListener/removeListener
    // @ts-expect-error legacy API
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    // @ts-expect-error legacy API
    else mq.addListener(onChange);

    return () => {
      // @ts-expect-error legacy API
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      // @ts-expect-error legacy API
      else mq.removeListener(onChange);
    };
  }, [breakpointPx]);

  return isMobile;
}

function pickCover(page: any): string | undefined {
  return (
    page?.image ||
    page?.cover ||
    page?.coverImage ||
    page?.thumbnail ||
    page?.img ||
    page?.src
  );
}

function MobileSwipeGallery({
  pages,
  onSelect,
}: {
  pages: any[];
  onSelect: (id: any) => void;
}) {
  return (
    <section className="md:hidden w-full h-full flex flex-col">
      <div className="px-4 pt-12 pb-2">
        <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">
          Explore
        </div>
        <div className="text-sm opacity-80 mt-1">
          Swipe to browse. Tap a card to open.
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 flex items-center justify-start">
        <div
          className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4"
          style={{ WebkitOverflowScrolling: "touch" as any }}
          aria-label="Mobile gallery"
        >
          {pages.map((page, idx) => {
            const cover = pickCover(page);
            return (
              <button
                key={page.id ?? idx}
                type="button"
                onClick={() => onSelect(page.id)}
                className="snap-start shrink-0 w-[88%] max-w-[360px] rounded-2xl bg-white/6 p-3 text-left active:scale-[0.99] transition-transform"
                aria-label={`Open ${page.title ?? "page"}`}
              >
                <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black/20">
                  {cover ? (
                    <img
                      src={cover}
                      alt={page.title ?? "Cover"}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/0" />
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-base font-ergon-medium">
                    {page.title ?? page.id}
                  </div>
                  {page.short ? (
                    <div className="text-sm opacity-75 mt-1 line-clamp-2 min-h-[40px]">
                      {page.short}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const isMobile = useIsMobile();

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

        {/* MOBILE - Circular Gallery */}
        <div className="md:hidden w-full h-[480px]" style={{ marginTop: '60px' }}>
          {isMobile ? (
  <MobileSwipeGallery pages={PAGES as any[]} onSelect={onPageSelect as any} />
) : (
  <CircularGallery
            items={PAGES.map(page => ({
              image: page.thumbnail,
              text: page.title,
              id: page.id,
            })) as GalleryItem[]}
            bend={2}
            borderRadius={0.02}
            scrollSpeed={3}
            scrollEase={0.05}
            onItemClick={(item, index) => {
  const pageFromIndex = PAGES[index];
  const pageId = pageFromIndex?.id ?? (item as any).id ?? PAGES.find(p => p.title === item.text)?.id;
  if (pageId) onPageSelect(pageId as PageId);
}}
          />
)}
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
