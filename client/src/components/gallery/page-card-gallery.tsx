"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery';
import { getPages, PageId, PageData } from './page-data';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 400;

function PageCard({ 
  page, 
  index, 
  onClick, 
  isHovered 
}: { 
  page: any; 
  index: number; 
  onClick: () => void; 
  isHovered: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-[#1a0f0a] border border-[#CD7E31]/20 group-hover:border-[#CD7E31]/50 transition-colors">
        <div className="absolute inset-0">
          <img
            src={page.thumbnail}
            alt={page.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810] via-[#2B1810]/20 to-transparent opacity-80" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CD7E31] mb-2">
            {page.category}
          </p>
          <h3 className="text-xl font-bold text-[#F5EFE6] leading-tight mb-2 font-ergon">
            {page.title}
          </h3>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-[#F5EFE6]/70 line-clamp-2 mt-2">
                  {page.subtitle}
                </p>
                <div className="mt-4 pt-3 border-t border-[#CD7E31]/30">
                  <span className="text-[10px] text-[#CD7E31] uppercase tracking-widest">
                    Tap to explore →
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function useIsMobile(breakpointPx: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();

    // Safari fallback for older addListener/removeListener
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
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

  const getCardPosition = (index: number, total: number, hovered: number | null) => {
    const centerIndex = Math.floor(total / 2);
    const offset = index - centerIndex;
    const baseSpacing = CARD_WIDTH + 20;

    let x = offset * baseSpacing;
    let scale = 1;
    let zIndex = total - Math.abs(offset);
    let rotateY = offset * -5;
    let rotateZ = offset * 2;

    if (hovered !== null) {
      if (index === hovered) {
        scale = 1.12;
        zIndex = total + 1;
        rotateY = 0;
        rotateZ = 0;
      } else {
        const distanceFromHovered = index - hovered;
        x += distanceFromHovered * 25;
      }
    }

    return { x, scale, zIndex, rotateY, rotateZ };
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#2B1810]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 md:opacity-50"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/50 md:bg-[#2B1810]/60" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center pt-24 md:pt-32 pb-8 px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon">
            {t('gallery.title', 'Discover Desert Rose')}
          </h2>
          <p className="text-sm md:text-base text-[#F5EFE6]/70 max-w-lg mx-auto hidden md:block">
            {t('gallery.subtitle', 'Explore our world of botanical luxury')}
          </p>
        </motion.div>

        <motion.div
          className="flex-1 relative flex items-center justify-center hidden md:flex"
          style={{ perspective: "1200px" }}
        >
          <motion.div className="relative flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {PAGES.map((page, index) => {
                const { x, scale, zIndex, rotateY, rotateZ } = getCardPosition(index, TOTAL_CARDS, hoveredIndex);
                
                return (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ 
                      opacity: isLoaded ? 1 : 0, 
                      y: isLoaded ? 0 : 50,
                      x, 
                      scale,
                      rotateY,
                      rotateZ,
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    style={{ 
                      zIndex,
                      position: 'absolute',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <PageCard 
                      page={page} 
                      index={index} 
                      onClick={() => onPageSelect(page.id)}
                      isHovered={hoveredIndex === index}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.6 : 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest hidden md:block">
            {t('gallery.hint', 'Hover to preview • Click to explore')}
          </p>
          <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest md:hidden">
            Swipe to explore
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
