"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  label?: string;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 120; // Width for Product Cards
const IMG_HEIGHT = 160; // Height for Product Cards

function FlipCard({ src, index, label, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
      >
        {/* Card Content - Brand Styled */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-sm border border-primary/20 bg-card shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Image */}
          <img src={src} alt={`item-${index}`} className="h-full w-full object-cover opacity-90" />

          {/* Shine effect (Luxury Feel) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none" />

          {/* Label Overlay */}
          {label && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-center border-t border-primary/10">
              <span className="text-[10px] font-sans text-primary uppercase tracking-widest">{label}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- BRAND CONTENT DATA ---
// NOTE: Upload your real images to /public/assets/ and update these paths.
const ITEMS = [
  { src: "https://images.unsplash.com/photo-1606758696803-b0ebc5f94982?auto=format&fit=crop&q=80&w=400", label: "Classic Ed." },
  { src: "https://images.unsplash.com/photo-1592319022668-36934c26422e?auto=format&fit=crop&q=80&w=400", label: "Limited Ed." },
  { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400", label: "Negroni" },
  { src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400", label: "Gin Tonic" },
  // CLIENT ASK: "Add a section about events and partnership"
  { src: "https://images.unsplash.com/photo-1575653697948-26275217430d?auto=format&fit=crop&q=80&w=400", label: "Events" }, 
  { src: "https://images.unsplash.com/photo-1560512823-8db965dfc530?auto=format&fit=crop&q=80&w=400", label: "Martini" },
  { src: "https://images.unsplash.com/photo-1536935338788-843bb6303475?auto=format&fit=crop&q=80&w=400", label: "Partnerships" },
  { src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=400", label: "Saharan" },
  { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400", label: "Aperitif" },
  { src: "https://images.unsplash.com/photo-1606758696803-b0ebc5f94982?auto=format&fit=crop&q=80&w=400", label: "Craft" },
];

// Double the items to create a fuller circle
const DISPLAY_ITEMS = [...ITEMS, ...ITEMS]; 
const TOTAL_IMAGES = DISPLAY_ITEMS.length;
const MAX_SCROLL = 4000;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size Logic ---
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setContainerSize({
        width: containerRef.current?.offsetWidth || 0,
        height: containerRef.current?.offsetHeight || 0,
      });
    };
    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // --- Virtual Scroll Logic ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Take control of scroll
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [virtualScroll]);

  // 1. Morph Progress: 0 (Scatter) -> 1 (Arc)
  const morphProgress = useTransform(virtualScroll, [0, 800], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  // 2. Rotation (Carousel)
  const scrollRotate = useTransform(virtualScroll, [800, 4000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Intro Phases ---
  useEffect(() => {
    // Phase 1: Scatter -> Line (0.5s)
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    // Phase 2: Line -> Circle (2.0s)
    const t2 = setTimeout(() => setIntroPhase("circle"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // --- Random Initial Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return DISPLAY_ITEMS.map(() => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1500,
      rotation: (Math.random() - 0.5) * 360,
      scale: 0.5,
      opacity: 0,
    }));
  }, []);

  // --- Animation Loop State ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);

  useEffect(() => {
    const unsubMorph = smoothMorph.on("change", setMorphValue);
    const unsubRotate = smoothScrollRotate.on("change", setRotateValue);
    return () => { unsubMorph(); unsubRotate(); };
  }, [smoothMorph, smoothScrollRotate]);

  // Fade in main titles based on scroll position
  const titleOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const titleY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

        {/* PHASE 1: INTRO TEXT (Fades Out) */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={introPhase === "circle" && morphValue < 0.3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-light text-foreground tracking-widest font-serif"
          >
            DESERT ROSE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === "circle" && morphValue < 0.3 ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-xs font-bold text-primary uppercase tracking-[0.3em]"
          >
            The Spirit of the Dunes
          </motion.p>
        </div>

        {/* PHASE 2: MAIN SCROLL TEXT (Fades In) */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-[15%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight mb-2 font-serif">
            The Collection
          </h2>
          <div className="w-12 h-0.5 bg-primary mb-4 opacity-50" />
          <p className="text-sm md:text-base text-foreground/70 max-w-lg leading-relaxed">
            Scroll to explore our origin, our craft, and upcoming <span className="text-primary">Events & Partnerships</span>.
          </p>
        </motion.div>

        {/* CARDS CONTAINER */}
        <div className="relative flex items-center justify-center w-full h-full">
          {DISPLAY_ITEMS.map((item, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              // Line up horizontally for the "Card Shuffle" effect
              const spacing = 40;
              const totalW = TOTAL_IMAGES * spacing;
              target = { x: (i * spacing) - totalW / 2, y: 0, rotation: 0, scale: 0.8, opacity: 1 };
            } else {
              // CIRCLE / ARC LOGIC
              const isMobile = containerSize.width < 768;
              const minDim = Math.min(containerSize.width, containerSize.height);

              // 1. Initial Circle Position (Before scroll)
              const circleR = Math.min(minDim * 0.3, 300);
              const angle = (i / TOTAL_IMAGES) * 360;
              const rad = (angle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(rad) * circleR,
                y: Math.sin(rad) * circleR,
                rotation: angle + 90
              };

              // 2. Bottom Arc Position (After scroll - The Carousel)
              const arcR = Math.min(containerSize.width, containerSize.height * 1.5) * (isMobile ? 1.2 : 0.9);
              const arcApexY = containerSize.height * 0.4; // Push arc down
              const arcCenterY = arcApexY + arcR;

              const spread = isMobile ? 100 : 140; // How wide the arc is (degrees)
              const startAngle = -90 - (spread / 2);
              const step = spread / (TOTAL_IMAGES - 1);

              // Scroll Rotation Math
              const scrollProg = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRot = spread * 0.9;
              const currentRot = -scrollProg * maxRot;

              const arcAngle = startAngle + (i * step) + currentRot;
              const arcRad = (arcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcR,
                y: Math.sin(arcRad) * arcR + arcCenterY,
                rotation: arcAngle + 90,
                scale: 1.5 // Active cards are larger
              };

              // Linear Interpolation between Circle and Arc based on scroll
              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1
              };
            }

            return (
              <FlipCard
                key={i}
                index={i}
                src={item.src}
                label={item.label}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}