import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Download, List, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedText } from '@/components/ui/animated-text';
import { cocktailAssets } from '@/lib/cocktails';

const cocktails = cocktailAssets;

type Cocktail = (typeof cocktails)[0];

interface CocktailCardProps {
  cocktail: Cocktail;
  index: number;
  dragConstraints?: { left: number; right: number };
  onDragEnd?: (event: any, info: PanInfo) => void;
  onDragStart?: () => void;
  onPointerCancel?: () => void;
  style?: any;
  drag?: "x" | "y" | boolean;
}

// UPDATED: White text, no labels, darker card bg
const CocktailCard = ({ cocktail, index, dragConstraints, onDragEnd, style, drag, onDragStart, onPointerCancel }: CocktailCardProps) => {
  return (
    <motion.div
      style={{ ...style, zIndex: 100 - index }}
      drag={drag}
      dragConstraints={dragConstraints}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onPointerCancel={onPointerCancel}
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col overflow-hidden bg-[#3a2820]",
        "shadow-2xl shadow-black/40 cursor-grab select-none",
        "touch-pan-y" 
      )}
    >
      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover opacity-90" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3a2820]/40 to-[#3a2820] pointer-events-none" />
        </div>
      )}

      {/* NO TAGS - REMOVED */}

      {/* Only name and download button */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-8 md:p-8 md:pb-10">
        <div className="flex flex-col gap-4">
          {/* WHITE TEXT */}
          <h2 className="text-2xl md:text-4xl font-ergon-light text-white leading-tight">
            {cocktail.title}
          </h2>

          {cocktail.pdf && (
            <a
              href={cocktail.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 border border-white/40 hover:bg-white/10 text-white text-xs font-ergon uppercase tracking-[0.15em] transition-all duration-300 w-full md:w-auto"
            >
              <span>Download</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          )}

          {/* NO ICON/DESERT ROSE FOOTER - REMOVED */}
        </div>
      </div>
    </motion.div>
  );
};

interface FullCocktailsSceneProps {
  isActive: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

export function FullCocktailsScene({ isActive, onDragStateChange, onScrollPositionChange }: FullCocktailsSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listView, setListView] = useState(false);
  const [exitX, setExitX] = useState<number | null>(null);
  const [swipedCard, setSwipedCard] = useState<Cocktail | null>(null);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragMovedRef = useRef(false);
  const swipeResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const index1 = currentIndex % cocktails.length;
  const index2 = (currentIndex + 1) % cocktails.length;
  const index3 = (currentIndex + 2) % cocktails.length;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isAtTop = container.scrollTop <= 10;
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 50;
      onScrollPositionChange({ isAtTop, isAtBottom });
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(() => handleScroll(), 100);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [onScrollPositionChange]);

  useEffect(() => {
    if (isActive && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isActive]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncIsDesktop = () => setIsDesktop(mediaQuery.matches);

    syncIsDesktop();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener('change', syncIsDesktop);
      return () => {
        mediaQuery.removeEventListener('change', syncIsDesktop);
      };
    }
    mediaQuery.addListener(syncIsDesktop);
    return () => {
      mediaQuery.removeListener(syncIsDesktop);
    };
  }, []);

  const handleSwipe = useCallback((direction: number) => {
    const currentDragX = x.get();
    setSwipeStartX(currentDragX);
    setSwipedCard(cocktails[index1]);
    setExitX(direction * 400);
    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
    x.set(0);

    if (swipeResetTimeoutRef.current) {
      clearTimeout(swipeResetTimeoutRef.current);
    }

    swipeResetTimeoutRef.current = setTimeout(() => {
      setExitX(null);
      setSwipedCard(null);
      setSwipeStartX(0);
      swipeResetTimeoutRef.current = null;
    }, 600);
  }, [x, index1]);

  useEffect(() => {
    return () => {
      if (swipeResetTimeoutRef.current) {
        clearTimeout(swipeResetTimeoutRef.current);
      }
    };
  }, []);

  const onDragEnd = useCallback((_event: any, info: PanInfo) => {
    onDragStateChange(false);
    const threshold = 80;
    const velocityThreshold = 300;
    dragMovedRef.current = Math.abs(info.offset.x) > 6;

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      handleSwipe(info.offset.x > 0 ? 1 : -1);
    } else {
      x.set(0);
    }
  }, [handleSwipe, onDragStateChange, x]);

  const handleDragCancel = useCallback(() => {
    onDragStateChange(false);
    dragMovedRef.current = false;
    x.set(0);
  }, [onDragStateChange, x]);

  const handleCardClick = useCallback(() => {
    if (!isDesktop || dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }

    handleSwipe(-1);
  }, [handleSwipe, isDesktop]);

  return (
    <motion.div 
      // LIGHTER BACKGROUND
      className="absolute inset-0 bg-[#4a3228] flex flex-col scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 1 }} 
      data-testid="scene-cocktails-full"
      data-scene-type="scrollable"
    >
      {/* LIGHTER GRADIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a3228] via-[#5a3a2e] to-[#4a3228]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#CD7E31]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#CD7E31]/15 blur-[100px]" />
      </div>

      <div 
        ref={scrollContainerRef}
        className="relative z-10 flex flex-col flex-grow overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* HEADER - WHITE TEXT */}
        <section className="flex-none pt-24 pb-4 md:pb-6 px-4 md:px-6 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h3 className="text-white/80 font-ergon tracking-[0.3em] uppercase text-[10px] mb-2">The Collection</h3>
            {isActive ? (
              <div className="mb-3">
                <AnimatedText text="Bespoke " variant="fade-up" className="text-2xl md:text-5xl font-lux text-white inline tracking-tight" staggerDelay={0.04} tag="span" />
                <AnimatedText text="Beverages" variant="blur-in" className="text-2xl md:text-5xl italic font-body text-white/80 inline" staggerDelay={0.04} initialDelay={0.4} tag="span" />
              </div>
            ) : (
              <h1 className="text-2xl md:text-5xl font-lux text-white mb-3 tracking-tight">
                Bespoke <span className="italic font-body text-white/80">Beverages</span>
              </h1>
            )}
            <p className="font-body text-white/70 text-[11px] md:text-sm leading-relaxed max-w-xl mx-auto">
              Unforgettable cocktails tailored for every preference.
            </p>
          </motion.div>
        </section>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 py-2">
          <button
            onClick={() => setListView(false)}
            className={`p-2 transition-all ${!listView ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setListView(true)}
            className={`p-2 transition-all ${listView ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {!listView && (
        <section className="flex-1 flex flex-col items-center justify-center relative w-full px-4 py-4 md:py-8 min-h-[525px] md:min-h-[625px]">
          <div className="relative w-full max-w-[280px] md:max-w-md h-[420px] md:h-[625px]">
            <motion.div key={"card-" + index3} className="absolute inset-0"
              initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0 }}
              animate={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0.4, zIndex: 10 }}
              transition={{ duration: 0.4 }}>
              <CocktailCard cocktail={cocktails[index3]} index={2} />
            </motion.div>
            <motion.div key={"card-" + index2} className="absolute inset-0"
              initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0.4 }}
              animate={{ scale: 0.95, y: 15, x: 12, rotate: 3, opacity: 0.7, zIndex: 20 }}
              transition={{ duration: 0.4 }}>
              <CocktailCard cocktail={cocktails[index2]} index={1} />
            </motion.div>

            {/* FIXED SWIPE - Better drag handling */}
            <motion.div
              key={"card-active-" + index1}
              className={cn(
                "absolute inset-0 active:cursor-grabbing",
                isDesktop ? "cursor-pointer md:cursor-grab" : "cursor-grab",
              )}
              style={{ x, rotate, opacity, zIndex: 100 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={() => {
                dragMovedRef.current = false;
                onDragStateChange(true);
              }}
              onDragEnd={onDragEnd}
              onPointerCancel={handleDragCancel}
              onClick={handleCardClick}
              whileTap={{ cursor: "grabbing" }}
            >
              <CocktailCard cocktail={cocktails[index1]} index={0} />
            </motion.div>

            <AnimatePresence>
              {exitX !== null && swipedCard && (
                <motion.div key="exit-card" className="absolute inset-0 pointer-events-none"
                  initial={{ x: swipeStartX, y: 0, scale: 1, opacity: 1, zIndex: 110 }}
                  animate={{ x: [swipeStartX, exitX, 0], y: [0, 0, 30], scale: [1, 1, 0.9], rotate: [(swipeStartX / 200) * 15, exitX > 0 ? 20 : -20, 6], zIndex: [110, 110, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" }}>
                  <CocktailCard cocktail={swipedCard} index={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-white/40 text-[10px] font-ergon tracking-widest uppercase mt-4">
            {currentIndex + 1} / {cocktails.length} • Tap arrows or swipe
          </p>
        </section>
        )}

        {/* LIST VIEW */}
        {listView && (
          <section className="flex-1 w-full px-4 py-4 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto pb-20">
              {cocktails.map((cocktail, idx) => (
                <motion.div
                  key={cocktail.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
                  onClick={() => { setCurrentIndex(idx); setListView(false); }}
                >
                  <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium">{cocktail.title}</h3>
                  </div>
                  <a href={cocktail.pdf} download onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 p-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4 text-white" />
                  </a>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
