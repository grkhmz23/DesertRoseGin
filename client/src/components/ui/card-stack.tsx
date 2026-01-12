"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Clock } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
  color?: string;
  category?: string;
  comingSoon?: boolean;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  onCardClick?: (item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 280,
  cardHeight = 380,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  onCardClick,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Entrance animation
  React.useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active, len, items, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Autoplay
  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;
    if (isDragging) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next, isDragging]);

  if (!len) return null;

  const handleCardClick = (item: T, index: number) => {
    if (index === active && onCardClick) {
      onCardClick(item);
    } else {
      setActive(index);
    }
  };

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Stage */}
      <div
        className="relative w-full"
        style={{ height: Math.max(420, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Animated background glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hasEntered ? 1 : 0, scale: hasEntered ? 1 : 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-[#CD7E31]/10 blur-3xl"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasEntered ? 0.6 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/30 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center pb-4"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              // Fan geometry - cards spread out from center
              const targetRotateZ = off * stepDeg;
              const targetX = off * cardSpacing;
              const targetY = abs * 12;
              const z = -abs * depthPx;

              const isActive = off === 0;
              const targetScale = isActive ? activeScale : inactiveScale - abs * 0.02;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              // Entrance animation - start from stacked position
              const initialX = 0;
              const initialY = -i * 5;
              const initialRotateZ = (i - len / 2) * 2;
              const initialScale = 0.9 - i * 0.02;

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.15,
                    onDragStart: () => setIsDragging(true),
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      setIsDragging(false);
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(120, cardWidth * 0.2);

                      if (travel > threshold || v > 500) prev();
                      else if (travel < -threshold || v < -500) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute overflow-hidden",
                    "will-change-transform select-none",
                    "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={reduceMotion ? false : {
                    opacity: 0,
                    x: initialX,
                    y: initialY + 100,
                    rotateZ: initialRotateZ,
                    rotateX: 15,
                    scale: initialScale,
                  }}
                  animate={{
                    opacity: hasEntered ? 1 : 0,
                    x: targetX,
                    y: targetY + lift,
                    rotateZ: targetRotateZ,
                    rotateX: rotateX,
                    scale: targetScale,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                    delay: hasEntered ? 0 : i * 0.08,
                  }}
                  whileHover={!isActive ? { 
                    scale: targetScale * 1.05, 
                    y: targetY + lift - 8,
                    transition: { duration: 0.2 }
                  } : undefined}
                  onClick={() => handleCardClick(item, i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation */}
      {showDots && (
        <motion.div 
          className="mt-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <motion.button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 rounded-full transition-colors duration-300",
                    on
                      ? "bg-[#CD7E31]"
                      : "bg-[#F5EFE6]/30 hover:bg-[#F5EFE6]/50",
                  )}
                  animate={{ width: on ? 24 : 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Swipe hint for mobile */}
      <motion.p
        className="text-center mt-3 text-[10px] text-[#F5EFE6]/40 uppercase tracking-widest md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEntered ? 1 : 0 }}
        transition={{ delay: 1 }}
      >
        Swipe to browse
      </motion.p>
    </div>
  );
}

function DefaultFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full bg-[#1a0f0a] overflow-hidden">
      {/* Image with zoom effect */}
      <motion.div 
        className="absolute inset-0"
        animate={{ scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2B1810] text-sm text-[#F5EFE6]/50">
            No image
          </div>
        )}
      </motion.div>

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2B1810] via-[#2B1810]/40 to-transparent" />

      {/* Shine effect on active */}
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      )}

      {/* Coming Soon Badge */}
      {item.comingSoon && (
        <div className="absolute top-3 right-3 bg-[#CD7E31] text-[#2B1810] px-2 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Soon
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        {item.category && (
          <motion.p 
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: item.color || '#CD7E31' }}
            animate={{ opacity: active ? 1 : 0.7 }}
          >
            {item.category}
          </motion.p>
        )}
        <div className="text-lg font-bold text-[#F5EFE6] leading-tight">
          {item.title}
        </div>
        {item.subtitle && (
          <motion.div 
            className="mt-1 line-clamp-2 text-sm text-[#F5EFE6]/70"
            animate={{ opacity: active ? 1 : 0.6 }}
          >
            {item.subtitle}
          </motion.div>
        )}

        {/* CTA hint when active */}
        <AnimatePresence>
          {active && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-[#CD7E31]/30"
            >
              <p className="text-[10px] text-[#CD7E31] uppercase tracking-widest">
                {item.comingSoon ? 'Preview' : 'Tap to explore'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}