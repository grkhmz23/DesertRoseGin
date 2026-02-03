"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery';
import { getPages, PageId } from './page-data';

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
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#CD7E31] mb-2">
            {page.category}
          </p>
          <h3 className="text-xl font-light text-[#F5EFE6] mb-1 font-ergon">
            {page.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const { t } = useTranslation('common');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PAGES = getPages();
  const TOTAL_CARDS = PAGES.length;

  const galleryItems: GalleryItem[] = PAGES.map((page) => ({
    image: page.thumbnail,
    text: page.title,
    id: page.id,
  }));

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [isActive]);

  const handleGalleryItemClick = (item: GalleryItem, index: number) => {
    if (item.id) {
      onPageSelect(item.id as PageId);
    }
  };

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

      {/* MOBILE */}
      <div className="md:hidden relative z-10 w-full h-full flex items-center justify-center">
        <div className="w-full h-[70vh]">
          <CircularGallery
            items={galleryItems}
            bend={2}
            borderRadius={0.02}
            scrollSpeed={1.5}
            scrollEase={0.06}
            onItemClick={handleGalleryItemClick}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* DESKTOP */}
      <div
        ref={containerRef}
        className="hidden md:flex relative z-10 w-full h-full items-center justify-center"
      >
        <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
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
                  damping: 15,
                }}
                style={{
                  zIndex,
                  position: "absolute",
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
      </div>
    </motion.div>
  );
}
