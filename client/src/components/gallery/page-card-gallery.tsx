"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { getPages, PageId, PageData } from './page-data';
import { Clock } from 'lucide-react';

interface PageCardGalleryV2Props {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

// Individual scroll-driven card
function ScrollCard({ 
  page, 
  index, 
  total,
  onSelect 
}: { 
  page: PageData; 
  index: number; 
  total: number;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Scroll-driven transforms
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -5]);
  
  // Alternating horizontal offset for visual interest
  const xOffset = index % 2 === 0 ? -30 : 30;
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [xOffset, 0, -xOffset * 0.5]);

  // Use parallax scale inside the component properly
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  // Smooth spring physics
  const springConfig = { stiffness: 100, damping: 20 };
  const smoothY = useSpring(y, springConfig);
  const smoothScale = useSpring(scale, springConfig);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full max-w-sm mx-auto"
      style={{
        y: smoothY,
        x,
        opacity,
        scale: smoothScale,
        rotateX,
        transformPerspective: 1000,
      }}
    >
      <motion.div
        onClick={onSelect}
        className="relative aspect-[3/4] overflow-hidden cursor-pointer shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-[#1a0f0a]"
        whileHover={{ scale: 1.03, y: -10 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Image with parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{
            scale: imageScale,
          }}
        >
          <img
            src={page.thumbnail}
            alt={page.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810] via-[#2B1810]/30 to-transparent" />

        {/* Coming Soon Badge */}
        {page.comingSoon && (
          <div className="absolute top-4 right-4 bg-[#CD7E31] text-[#2B1810] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.p 
            className="text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: page.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            {page.category}
          </motion.p>
          
          <motion.h3 
            className="text-xl md:text-2xl font-bold text-[#F5EFE6] leading-tight mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.2 }}
          >
            {page.title}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-[#F5EFE6]/70 line-clamp-2 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.3 }}
          >
            {page.subtitle}
          </motion.p>

          <motion.div
            className="pt-3 border-t border-[#CD7E31]/30"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-[10px] text-[#CD7E31] uppercase tracking-widest">
              {page.comingSoon ? 'Preview' : 'Tap to explore →'}
            </p>
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isInView ? { x: "100%", opacity: 1 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Desktop: Horizontal scroll-driven cards
function DesktopScrollGallery({ 
  pages, 
  onPageSelect 
}: { 
  pages: PageData[]; 
  onPageSelect: (pageId: PageId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky header */}
      <motion.div 
        className="sticky top-0 z-10 pt-24 pb-8 text-center bg-gradient-to-b from-[#2B1810] via-[#2B1810]/95 to-transparent"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.8]),
        }}
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon"
          style={{
            y: useTransform(scrollYProgress, [0, 0.3], [0, -30]),
            opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
          }}
        >
          Discover Desert Rose
        </motion.h2>
        <motion.p 
          className="text-sm text-[#F5EFE6]/60"
          style={{
            y: useTransform(scrollYProgress, [0, 0.3], [0, -20]),
            opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
          }}
        >
          Scroll to explore our collection
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#CD7E31] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-6 md:px-12 lg:px-20 pb-32">
        {pages.map((page, index) => (
          <ScrollCard
            key={page.id}
            page={page}
            index={index}
            total={pages.length}
            onSelect={() => onPageSelect(page.id)}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2B1810] to-transparent pointer-events-none z-20" />
    </div>
  );
}

// Mobile: Vertical scroll gallery
function MobileScrollGallery({ 
  pages, 
  onPageSelect 
}: { 
  pages: PageData[]; 
  onPageSelect: (pageId: PageId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Progress dots */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {pages.map((page, idx) => (
          <motion.div
            key={page.id}
            className="w-2 h-2 rounded-full bg-[#F5EFE6]/30"
            style={{
              backgroundColor: useTransform(
                scrollYProgress,
                [idx / pages.length, (idx + 0.5) / pages.length, (idx + 1) / pages.length],
                ["rgba(245,239,230,0.3)", "#CD7E31", "rgba(245,239,230,0.3)"]
              ),
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 pt-20 pb-4 px-4 text-center bg-gradient-to-b from-[#2B1810] to-transparent">
        <h2 className="text-xl font-light text-[#F5EFE6] tracking-tight mb-1 font-ergon">
          Discover Desert Rose
        </h2>
        <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-widest">
          Scroll to explore
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-8 px-4 pb-24">
        {pages.map((page, index) => (
          <ScrollCard
            key={page.id}
            page={page}
            index={index}
            total={pages.length}
            onSelect={() => onPageSelect(page.id)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-[#CD7E31] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryV2Props) {
  const { t } = useTranslation('common');
  const PAGES = getPages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40 overflow-y-auto overflow-x-hidden"
    >
      {/* Background */}
      <div className="fixed inset-0 bg-[#2B1810] -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/70" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <DesktopScrollGallery pages={PAGES} onPageSelect={onPageSelect} />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileScrollGallery pages={PAGES} onPageSelect={onPageSelect} />
      </div>
    </motion.div>
  );
}

export function PageCardGalleryV2({ onPageSelect, isActive }: PageCardGalleryV2Props) {
  const { t } = useTranslation('common');
  const PAGES = getPages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40 overflow-y-auto overflow-x-hidden"
    >
      {/* Background */}
      <div className="fixed inset-0 bg-[#2B1810] -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/70" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <DesktopScrollGallery pages={PAGES} onPageSelect={onPageSelect} />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileScrollGallery pages={PAGES} onPageSelect={onPageSelect} />
      </div>
    </motion.div>
  );
}