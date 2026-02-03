"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageCard, CARD_WIDTH, CARD_HEIGHT } from "./page-card";
import { getPages, PageId, PageData } from "./page-data";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const { t } = useTranslation("common");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PAGES = getPages();
  const TOTAL_CARDS = PAGES.length;

  // Convert PAGES to GalleryItem format for CircularGallery
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

  // Handle item click from CircularGallery
  const handleGalleryItemClick = (item: GalleryItem, index: number) => {
    if (item.id) {
      onPageSelect(item.id as PageId);
    }
  };

  // Desktop card positioning calculations - fan spread effect
  const getCardPosition = (index: number, total: number, hovered: number | null) => {
    const centerIndex = Math.floor(total / 2);
    const offset = index - centerIndex;
    const baseSpacing = CARD_WIDTH + 20; // Card width + gap

    let x = offset * baseSpacing;
    let scale = 1;
    let zIndex = total - Math.abs(offset);
    let rotateY = offset * -5;
    let rotateZ = offset * 2; // Slight fan rotation

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
      {/* Background Video */}
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

      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="md:hidden relative z-10 w-full h-full flex items-center justify-center">
        {/* Circular Gallery - Centered vertically and horizontally */}
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

      {/* ==================== DESKTOP LAYOUT ==================== */}
      <div
        ref={containerRef}
        className="hidden md:flex relative z-10 w-full h-full items-center justify-center"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-20"
        >
          <h2 className="text-4xl lg:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon">
            {t("gallery.title", "Discover Desert Rose")}
          </h2>
          <p className="text-sm lg:text-base text-[#F5EFE6]/70 max-w-lg mx-auto">
            {t("gallery.subtitle", "Explore our world of botanical luxury")}
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
          {PAGES.map((page, index) => {
            const { x, scale, zIndex, rotateY, rotateZ } = getCardPosition(
              index,
              TOTAL_CARDS,
              hoveredIndex
            );

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