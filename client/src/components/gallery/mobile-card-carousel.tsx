"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageData } from "./page-data";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 400;

interface MobileCardCarouselProps {
  pages: PageData[];
  onPageSelect: (pageId: string) => void;
}

export function MobileCardCarousel({ pages, onPageSelect }: MobileCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const handleCardClick = () => {
    const page = pages[currentIndex];
    
    onPageSelect(page.id);
  };

  const getCardStyle = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    } else if (diff === -1) {
      return { y: -140, scale: 0.85, opacity: 0.5, zIndex: 4, rotateX: 8 };
    } else if (diff === -2) {
      return { y: -240, scale: 0.72, opacity: 0.25, zIndex: 3, rotateX: 15 };
    } else if (diff === 1) {
      return { y: 140, scale: 0.85, opacity: 0.5, zIndex: 4, rotateX: -8 };
    } else if (diff === 2) {
      return { y: 240, scale: 0.72, opacity: 0.25, zIndex: 3, rotateX: -15 };
    } else {
      return { y: diff > 0 ? 350 : -350, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
    }
  };

  const isVisible = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  const currentPage = pages[currentIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Up Button */}
      <button
        onClick={goPrev}
        className="absolute top-4 z-20 w-12 h-12 flex items-center justify-center bg-[#2B1810]/60 border border-[#CD7E31]/40 text-[#F5EFE6]"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Card Stack */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT + 100,
          perspective: "1200px" 
        }}
      >
        {pages.map((page, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={page.id}
              className="absolute"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: style.zIndex,
              }}
              onClick={isCurrent ? handleCardClick : undefined}
            >
              <div
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                }}
                className="relative"
              >
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden bg-[#f0e5d1]"
                  style={{ 
                    boxShadow: isCurrent
                      ? "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(205,126,49,0.2)"
                      : "0 10px 30px -10px rgba(0,0,0,0.3)",
                  }}
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
                    {isCurrent && (
                      <p className="text-[10px] text-[#F5EFE6]/60 mt-2 uppercase tracking-widest">
                        Tap to explore
                      </p>
                    )}
                  </div>
                  {page.comingSoon && (
                    <div className="absolute top-3 right-3 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Soon
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Down Button */}
      <button
        onClick={goNext}
        className="absolute bottom-4 z-20 w-12 h-12 flex items-center justify-center bg-[#2B1810]/60 border border-[#CD7E31]/40 text-[#F5EFE6]"
      >
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* Page indicator */}
      <div className="absolute bottom-20 text-[#F5EFE6]/60 text-xs">
        {currentIndex + 1} / {pages.length}
      </div>
    </div>
  );
}
