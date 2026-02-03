"use client";

import { useState, useCallback, useRef } from "react";
import { motion, type PanInfo } from "framer-motion";
import { PageData } from "./page-data";
import { Clock } from "lucide-react";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 400;

interface MobileCardCarouselProps {
  pages: PageData[];
  onPageSelect: (pageId: string) => void;
}

function MobileCard({ 
  page, 
  isCurrent,
  onTap,
}: { 
  page: PageData; 
  isCurrent: boolean;
  onTap: () => void;
}) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }}
      className="relative"
      onClick={onTap}
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
  );
}

export function MobileCardCarousel({ pages, onPageSelect }: MobileCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400;
  const wasDragging = useRef(false);

  const navigate = useCallback((newDirection: number) => {
    const now = Date.now();
    if (now - lastNavigationTime.current < navigationCooldown) return;
    lastNavigationTime.current = now;

    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === pages.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? pages.length - 1 : prev - 1;
    });
  }, [pages.length]);

  const handleDragStart = () => {
    wasDragging.current = false;
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 10) {
      wasDragging.current = true;
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.y) > threshold) {
      wasDragging.current = true;
      if (info.offset.y < -threshold) {
        navigate(1);
      } else {
        navigate(-1);
      }
    }
    // Reset after a short delay to allow tap to work
    setTimeout(() => {
      wasDragging.current = false;
    }, 100);
  };

  const handleCardTap = (index: number, pageId: string) => {
    console.log("Card tap:", { index, pageId, currentIndex, wasDragging: wasDragging.current });
    if (wasDragging.current) {
      console.log("Ignoring tap - was dragging");
      return;
    }
    if (index === currentIndex) {
      console.log("Navigating to:", pageId);
      onPageSelect(pageId);
    }
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

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
                zIndex: style.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{
                transformStyle: "preserve-3d",
                zIndex: style.zIndex,
              }}
            >
              <MobileCard
                page={page}
                isCurrent={isCurrent}
                onTap={() => handleCardTap(index, page.id)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
