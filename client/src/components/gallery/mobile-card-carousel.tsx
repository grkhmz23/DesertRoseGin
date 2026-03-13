"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageData } from "./page-data";
import { Clock } from "lucide-react";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 400;
const CARD_STEP = 140;
const DRAG_LIMIT = CARD_STEP * 1.15;
const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 0.35;

type CardStyle = {
  y: number;
  scale: number;
  opacity: number;
  rotateX: number;
  zIndex: number;
};

const STYLE_ANCHORS: Array<{ diff: number; style: CardStyle }> = [
  { diff: -3, style: { y: -350, scale: 0.6, opacity: 0, rotateX: 20, zIndex: 0 } },
  { diff: -2, style: { y: -240, scale: 0.72, opacity: 0.25, rotateX: 15, zIndex: 3 } },
  { diff: -1, style: { y: -140, scale: 0.85, opacity: 0.5, rotateX: 8, zIndex: 4 } },
  { diff: 0, style: { y: 0, scale: 1, opacity: 1, rotateX: 0, zIndex: 5 } },
  { diff: 1, style: { y: 140, scale: 0.85, opacity: 0.5, rotateX: -8, zIndex: 4 } },
  { diff: 2, style: { y: 240, scale: 0.72, opacity: 0.25, rotateX: -15, zIndex: 3 } },
  { diff: 3, style: { y: 350, scale: 0.6, opacity: 0, rotateX: -20, zIndex: 0 } },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function interpolateStyle(diff: number): CardStyle {
  const clampedDiff = clamp(diff, -3, 3);

  for (let i = 0; i < STYLE_ANCHORS.length - 1; i += 1) {
    const current = STYLE_ANCHORS[i];
    const next = STYLE_ANCHORS[i + 1];

    if (clampedDiff >= current.diff && clampedDiff <= next.diff) {
      const progress = (clampedDiff - current.diff) / (next.diff - current.diff);

      return {
        y: lerp(current.style.y, next.style.y, progress),
        scale: lerp(current.style.scale, next.style.scale, progress),
        opacity: lerp(current.style.opacity, next.style.opacity, progress),
        rotateX: lerp(current.style.rotateX, next.style.rotateX, progress),
        zIndex: Math.round(lerp(current.style.zIndex, next.style.zIndex, progress)),
      };
    }
  }

  return STYLE_ANCHORS[STYLE_ANCHORS.length - 1].style;
}

interface MobileCardCarouselProps {
  pages: PageData[];
  initialPageId?: string | null;
  onPageSelect: (pageId: string) => void;
}

export function MobileCardCarousel({ pages, initialPageId = null, onPageSelect }: MobileCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const touchMoved = useRef(false);

  useEffect(() => {
    if (!initialPageId) return;

    const nextIndex = pages.findIndex((page) => page.id === initialPageId);
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  }, [initialPageId, pages]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const handleCardClick = () => {
    // Only navigate if we didn't just swipe
    if (!touchMoved.current) {
      const page = pages[currentIndex];
      onPageSelect(page.id);
    }
    touchMoved.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    touchMoved.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 6) {
      touchMoved.current = true;
    }

    const resistedOffset = clamp(deltaY * 0.82, -DRAG_LIMIT, DRAG_LIMIT);
    setDragOffsetY(resistedOffset);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const totalDeltaY = endY - touchStartY.current;
    const elapsed = Math.max(Date.now() - touchStartTime.current, 1);
    const velocityY = totalDeltaY / elapsed;
    const hasSwipeDistance = Math.abs(totalDeltaY) > SWIPE_DISTANCE_THRESHOLD;
    const hasSwipeVelocity = Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD;

    if (hasSwipeDistance || hasSwipeVelocity) {
      touchMoved.current = true;

      if (totalDeltaY < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    setDragOffsetY(0);
    setIsDragging(false);
  };

  const getCardStyle = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const dragProgress = dragOffsetY / CARD_STEP;
    return interpolateStyle(diff + dragProgress);
  };

  const isVisible = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const dragProgress = dragOffsetY / CARD_STEP;
    return Math.abs(diff + dragProgress) <= 2.6;
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
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
              transition={
                isDragging
                  ? { duration: 0.06, ease: "linear" }
                  : {
                      type: "spring",
                      stiffness: 180,
                      damping: 26,
                      mass: 0.9,
                    }
              }
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
                      ? "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(205,126,49,0.12)"
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
                    <p className="text-sm font-normal text-[#F5EFE6] uppercase tracking-wider leading-tight">
                      {page.title}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] text-[#F5EFE6]/60 mt-2 uppercase tracking-widest">
                        Tap to explore
                      </p>
                    )}
                  </div>
                  {page.comingSoon && (
                    <div className="absolute top-3 right-3 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[9px] font-normal uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.2} />
                      Soon
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
