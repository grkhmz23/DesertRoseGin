import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Download, ChevronLeft, ChevronRight, List, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedText } from '@/components/ui/animated-text';
import { Footer } from '@/components/layout/footer';

// Cocktails Imports
import cocktailChiliPassion from '@assets/cocktails/Chili_Passion_Desert_Martini_LR_RGB_1765314255791.webp';
import cocktailDesertAperitif from '@assets/cocktails/Desert_Aperitif_LR_RGB_1765314255792.webp';
import cocktailDesertAviation from '@assets/cocktails/Desert_Aviation_LR_RGB_1765314255793.webp';
import cocktailDesertOnRock from '@assets/cocktails/Desert_On_the_Rock_LR_RGB_1765314255793.webp';
import cocktailOrangeSpritz from '@assets/cocktails/Desert_Orange_Spritz_LR_RGB_1765314255794.webp';
import cocktailPineappleBullet from '@assets/cocktails/Desert_Pineapple_Bullet_LR_RGB_1765314255794.webp';
import cocktailRoseBeer from '@assets/cocktails/Desert_Rose_Beer_LR_RGB_1765314255795.webp';
import cocktailGinTonic from '@assets/cocktails/Desert_Rose_Gin_Tonic_LR_RGB_1765314255796.webp';
import cocktailRoseCollins from '@assets/cocktails/Desert_Rose_Collins_LR_RGB_1765314255796.webp';
import cocktailRoseMartini from '@assets/cocktails/Desert_Rose_Martini_LR_RGB_1765314255797.webp';
import cocktailRoseNegroni from '@assets/cocktails/Desert_Rose_Negroni_LR_RGB_1765314255798.webp';
import cocktailRoseParadise from '@assets/cocktails/Desert_Rose_Paradise_LR_RGB_1765314255798.webp';
import cocktailSpringNegroni from '@assets/cocktails/Desert_Spring_Negroni_LR_RGB_1765314255799.webp';
import cocktailSunset from '@assets/cocktails/Desert_Sunset_LR_RGB_1765314255799.webp';
import cocktailTangerineFrench75 from '@assets/cocktails/Desert_Tangerine_French_75_LR_RGB_1765314255800.webp';
import cocktailMediterraneanTonic from '@assets/cocktails/Mediterranean_Desert_Tonic_LR_RGB_1765314255800.webp';
import cocktailSpanishRoseTonic from '@assets/cocktails/Spanish_Rose_Gin_Tonic_LR_RGB_1765314255801.webp';
import cocktailRedDesert from '@assets/cocktails/The_Red_Desert_LR_RGB_1765314255801.webp';
import cocktailWhiteNegroni from '@assets/cocktails/White_Desert_Negroni_LR_RGB_1765314255801.webp';

const cocktails = [
  { id: "cocktail-desert-rose-gin-tonic", title: "Desert Rose Gin Tonic", pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf", image: cocktailGinTonic },
  { id: "cocktail-desert-rose-collins", title: "Desert Rose Collins", pdf: "/pdf/cocktails/Desert Rose Collins.pdf", image: cocktailRoseCollins },
  { id: "cocktail-mediterranean-desert-tonic", title: "Mediterranean Desert Tonic", pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf", image: cocktailMediterraneanTonic },
  { id: "cocktail-desert-on-the-rock", title: "Desert On the Rock", pdf: "/pdf/cocktails/Desert On the Rock.pdf", image: cocktailDesertOnRock },
  { id: "cocktail-desert-rose-negroni", title: "Desert Rose Negroni", pdf: "/pdf/cocktails/Desert Rose Negroni.pdf", image: cocktailRoseNegroni },
  { id: "chili-passion-desert", title: "Chili Passion Desert", pdf: "/pdf/cocktails/Chili Passion Desert.pdf", image: cocktailChiliPassion },
  { id: "desert-aviation", title: "Desert Aviation", pdf: "/pdf/cocktails/Desert Aviation.pdf", image: cocktailDesertAviation },
  { id: "desert-tangerine-french-75", title: "Desert Tangerine French 75", pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf", image: cocktailTangerineFrench75 },
  { id: "desert-orange-spritz", title: "Desert Orange Spritz", pdf: "/pdf/cocktails/Desert Orange Spritz.pdf", image: cocktailOrangeSpritz },
  { id: "desert-rose-beer", title: "Desert Rose Beer", pdf: "/pdf/cocktails/Desert Rose Beer.pdf", image: cocktailRoseBeer },
  { id: "desert-aperitif", title: "Desert Aperitif", pdf: "/pdf/cocktails/Desert Aperitif.pdf", image: cocktailDesertAperitif },
  { id: "white-desert-negroni", title: "White Desert Negroni", pdf: "/pdf/cocktails/White Desert Negroni.pdf", image: cocktailWhiteNegroni },
  { id: "the-red-desert", title: "The Red Desert", pdf: "/pdf/cocktails/The Red Desert.pdf", image: cocktailRedDesert },
  { id: "spanish-rose-gin-tonic", title: "Spanish Rose Gin Tonic", pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf", image: cocktailSpanishRoseTonic },
  { id: "desert-spring-negroni", title: "Desert Spring Negroni", pdf: "/pdf/cocktails/Desert Spring Negroni.pdf", image: cocktailSpringNegroni },
  { id: "desert-sunset", title: "Desert Sunset", pdf: "/pdf/cocktails/Desert Sunset.pdf", image: cocktailSunset },
  { id: "desert-pineapple-bullet", title: "Desert Pineapple Bullet", pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf", image: cocktailPineappleBullet },
  { id: "desert-rose-martini", title: "Desert Rose Martini", pdf: "/pdf/cocktails/Desert Rose Martini.pdf", image: cocktailRoseMartini },
  { id: "desert-rose-paradise", title: "Desert Rose Paradise", pdf: "/pdf/cocktails/Desert Rose Paradise.pdf", image: cocktailRoseParadise },
];

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
          <h2 className="text-2xl md:text-4xl font-lux text-white leading-tight">
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSwipe = useCallback((direction: number) => {
    const currentDragX = x.get();
    setSwipeStartX(currentDragX);
    setSwipedCard(cocktails[index1]);
    setExitX(direction * 400);
    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
    x.set(0);
    setTimeout(() => { setExitX(null); setSwipedCard(null); setSwipeStartX(0); }, 600);
  }, [x, index1]);

  const onDragEnd = useCallback((_event: any, info: PanInfo) => {
    onDragStateChange(false);
    const threshold = 80;
    const velocityThreshold = 300;

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      handleSwipe(info.offset.x > 0 ? 1 : -1);
    } else {
      x.set(0);
    }
  }, [handleSwipe, onDragStateChange, x]);

  const handleDragCancel = useCallback(() => {
    onDragStateChange(false);
    x.set(0);
  }, [onDragStateChange, x]);

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
            className={`p-2 rounded transition-all ${!listView ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setListView(true)}
            className={`p-2 rounded transition-all ${listView ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}
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
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ x, rotate, opacity, zIndex: 100 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={() => onDragStateChange(true)}
              onDragEnd={onDragEnd}
              onPointerCancel={handleDragCancel}
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
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => { setCurrentIndex(idx); setListView(false); }}
                >
                  <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium">{cocktail.title}</h3>
                  </div>
                  <a href={cocktail.pdf} download onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4 text-white" />
                  </a>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>
    </motion.div>
  );
}