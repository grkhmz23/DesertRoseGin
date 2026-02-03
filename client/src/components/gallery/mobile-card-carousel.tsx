"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageData } from "./page-data";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 400;

interface MobileCardCarouselProps {
  pages: PageData[];
  onPageSelect: (pageId: string) => void;
}

function MobileCard({ 
  page, 
  onSelect,
}: { 
  page: PageData; 
  onSelect: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    if (isFlipped) {
      // Card is flipped, navigate to page
      onSelect();
    } else {
      // Flip the card
      setIsFlipped(true);
    }
  };

  const handleFlipBack = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        perspective: 1200,
      }}
      className="relative cursor-pointer touch-manipulation"
      onClick={handleCardTap}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl bg-[#f0e5d1]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={page.thumbnail}
            alt={page.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2B1810]/90" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
            <p className="text-sm font-bold text-[#F5EFE6] uppercase tracking-wider leading-tight">
              {page.title}
            </p>
            <p className="text-[10px] text-[#F5EFE6]/60 mt-1 uppercase tracking-widest">
              Tap to flip
            </p>
          </div>
          {page.comingSoon && (
            <div className="absolute top-3 right-3 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Soon
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl bg-[#2B1810] flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center flex flex-col h-full justify-between py-4">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: page.color || "#CD7E31" }}
              >
                {page.category}
              </p>
              <h3 className="text-lg font-bold text-[#F5EFE6] leading-tight mb-3">
                {page.title}
              </h3>
              <p className="text-sm text-[#F5EFE6]/70 leading-tight mb-4 font-light">
                {page.subtitle}
              </p>
              <p className="text-xs text-[#F5EFE6]/60 leading-relaxed px-2">
                {page.description}
              </p>
            </div>
            <div className="space-y-3">
              <div className="pt-4 border-t border-[#CD7E31]/30">
                <p className="text-[10px] text-[#CD7E31] uppercase tracking-widest font-bold">
                  {page.comingSoon ? "Coming Soon" : "Tap to Explore →"}
                </p>
              </div>
              <button
                onClick={handleFlipBack}
                className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-widest py-2"
              >
                ← Flip back
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function MobileCardCarousel({ pages, onPageSelect }: MobileCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const numPages = pages.length;

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % numPages);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + numPages) % numPages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
    
    // Only consider it a swipe if horizontal movement is greater than vertical
    if (diffX > 20 && diffX > diffY) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) {
      // It was a tap, not a swipe - let the card handle it
      return;
    }

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
  };

  const handlePageSelect = (pageId: string) => {
    console.log("Navigating to page:", pageId);
    onPageSelect(pageId);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
    }),
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center px-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card Container */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
          >
            <MobileCard
              page={pages[currentIndex]}
              onSelect={() => handlePageSelect(pages[currentIndex].id)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <button
          onClick={goToPrev}
          className="w-12 h-12 flex items-center justify-center border border-[#CD7E31]/40 text-[#F5EFE6]/70 active:bg-[#CD7E31]/20 transition-colors"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-[#F5EFE6]/60 text-sm font-light min-w-[60px] text-center">
          {currentIndex + 1} / {numPages}
        </div>
        
        <button
          onClick={goToNext}
          className="w-12 h-12 flex items-center justify-center border border-[#CD7E31]/40 text-[#F5EFE6]/70 active:bg-[#CD7E31]/20 transition-colors"
          aria-label="Next card"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Swipe hint */}
      <p className="text-[10px] text-[#F5EFE6]/40 uppercase tracking-widest mt-4">
        Swipe or use arrows
      </p>
    </div>
  );
}
