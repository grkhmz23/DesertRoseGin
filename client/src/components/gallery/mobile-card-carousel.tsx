"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageData } from "./page-data";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 0.35;

type CardDimensions = { width: number; height: number; step: number; dragLimit: number };

function getCardDimensions(viewportWidth: number): CardDimensions {
  if (viewportWidth >= 1024) {
    return { width: 380, height: 580, step: 195, dragLimit: 195 * 1.15 };
  }
  if (viewportWidth >= 768) {
    return { width: 320, height: 490, step: 170, dragLimit: 170 * 1.15 };
  }
  if (viewportWidth >= 480) {
    return { width: 260, height: 400, step: 140, dragLimit: 140 * 1.15 };
  }
  if (viewportWidth >= 360) {
    return { width: 220, height: 340, step: 120, dragLimit: 120 * 1.15 };
  }
  // 320px and below
  return { width: 190, height: 295, step: 105, dragLimit: 105 * 1.15 };
}

type CardStyle = {
  y: number;
  scale: number;
  opacity: number;
  rotateX: number;
  zIndex: number;
};

function getStyleAnchors(step: number): Array<{ diff: number; style: CardStyle }> {
  return [
    { diff: -3, style: { y: -Math.round(step * 2.5), scale: 0.6, opacity: 0, rotateX: 20, zIndex: 0 } },
    { diff: -2, style: { y: -Math.round(step * 1.714), scale: 0.72, opacity: 0.25, rotateX: 15, zIndex: 3 } },
    { diff: -1, style: { y: -step, scale: 0.85, opacity: 0.5, rotateX: 8, zIndex: 4 } },
    { diff: 0, style: { y: 0, scale: 1, opacity: 1, rotateX: 0, zIndex: 5 } },
    { diff: 1, style: { y: step, scale: 0.85, opacity: 0.5, rotateX: -8, zIndex: 4 } },
    { diff: 2, style: { y: Math.round(step * 1.714), scale: 0.72, opacity: 0.25, rotateX: -15, zIndex: 3 } },
    { diff: 3, style: { y: Math.round(step * 2.5), scale: 0.6, opacity: 0, rotateX: -20, zIndex: 0 } },
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function interpolateStyle(diff: number, anchors: Array<{ diff: number; style: CardStyle }>): CardStyle {
  const clampedDiff = clamp(diff, -3, 3);

  for (let i = 0; i < anchors.length - 1; i += 1) {
    const current = anchors[i];
    const next = anchors[i + 1];

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

  return anchors[anchors.length - 1].style;
}

interface MobileCardCarouselProps {
  pages: PageData[];
  initialPageId?: string | null;
  onPageSelect: (pageId: string) => void;
}

export function MobileCardCarousel({ pages, initialPageId = null, onPageSelect }: MobileCardCarouselProps) {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dims, setDims] = useState<CardDimensions>(() =>
    getCardDimensions(typeof window !== "undefined" ? window.innerWidth : 375)
  );
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const touchMoved = useRef(false);

  useEffect(() => {
    const update = () => setDims(getCardDimensions(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

    const resistedOffset = clamp(deltaY * 0.82, -dims.dragLimit, dims.dragLimit);
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

  const styleAnchors = getStyleAnchors(dims.step);

  const getCardStyle = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const dragProgress = dragOffsetY / dims.step;
    return interpolateStyle(diff + dragProgress, styleAnchors);
  };

  const isVisible = (index: number) => {
    const total = pages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const dragProgress = dragOffsetY / dims.step;
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
          width: dims.width,
          height: dims.height + 100,
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
                  width: dims.width,
                  height: dims.height,
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
                    <p className="text-sm md:text-base font-normal text-[#F5EFE6] uppercase tracking-wider leading-tight">
                      {page.title}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] md:text-xs text-[#F5EFE6]/60 mt-2 uppercase tracking-widest">
                        {t('ui.navigation.tapToExplore')}
                      </p>
                    )}
                  </div>
                  {page.comingSoon && (
                    <div className="absolute top-3 right-3 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[9px] md:text-[10px] font-normal uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.2} />
                      {t('ui.navigation.comingSoon')}
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
