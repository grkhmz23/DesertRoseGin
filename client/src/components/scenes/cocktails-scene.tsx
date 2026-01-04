import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Download, Martini, Droplets, Wine } from 'lucide-react';
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
  { id: "cocktail-desert-rose-gin-tonic", title: "Desert Rose Gin Tonic", pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf", tags: ["Signature", "Tonic"], image: cocktailGinTonic },
  { id: "cocktail-desert-rose-collins", title: "Desert Rose Collins", pdf: "/pdf/cocktails/Desert Rose Collins.pdf", tags: ["Signature", "Refreshing"], image: cocktailRoseCollins },
  { id: "cocktail-mediterranean-desert-tonic", title: "Mediterranean Desert Tonic", pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf", tags: ["Herbal", "Refreshing"], image: cocktailMediterraneanTonic },
  { id: "cocktail-desert-on-the-rock", title: "Desert On the Rock", pdf: "/pdf/cocktails/Desert On the Rock.pdf", tags: ["Pure", "Strong"], image: cocktailDesertOnRock },
  { id: "cocktail-desert-rose-negroni", title: "Desert Rose Negroni", pdf: "/pdf/cocktails/Desert Rose Negroni.pdf", tags: ["Negroni", "Bitter"], image: cocktailRoseNegroni },
  { id: "chili-passion-desert", title: "Chili Passion Desert", pdf: "/pdf/cocktails/Chili Passion Desert.pdf", tags: ["Spicy", "Exotic"], image: cocktailChiliPassion },
  { id: "desert-aviation", title: "Desert Aviation", pdf: "/pdf/cocktails/Desert Aviation.pdf", tags: ["Floral", "Classic"], image: cocktailDesertAviation },
  { id: "desert-tangerine-french-75", title: "Desert Tangerine French 75", pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf", tags: ["Sparkling", "Citrus"], image: cocktailTangerineFrench75 },
  { id: "desert-orange-spritz", title: "Desert Orange Spritz", pdf: "/pdf/cocktails/Desert Orange Spritz.pdf", tags: ["Spritz", "Summer"], image: cocktailOrangeSpritz },
  { id: "desert-rose-beer", title: "Desert Rose Beer", pdf: "/pdf/cocktails/Desert Rose Beer.pdf", tags: ["Fusion", "Highball"], image: cocktailRoseBeer },
  { id: "desert-aperitif", title: "Desert Aperitif", pdf: "/pdf/cocktails/Desert Aperitif.pdf", tags: ["Aperitif", "Light"], image: cocktailDesertAperitif },
  { id: "white-desert-negroni", title: "White Desert Negroni", pdf: "/pdf/cocktails/White Desert Negroni.pdf", tags: ["Negroni", "Modern"], image: cocktailWhiteNegroni },
  { id: "the-red-desert", title: "The Red Desert", pdf: "/pdf/cocktails/The Red Desert.pdf", tags: ["Fruity", "Bold"], image: cocktailRedDesert },
  { id: "spanish-rose-gin-tonic", title: "Spanish Rose Gin Tonic", pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf", tags: ["Tonic", "Copa"], image: cocktailSpanishRoseTonic },
  { id: "desert-spring-negroni", title: "Desert Spring Negroni", pdf: "/pdf/cocktails/Desert Spring Negroni.pdf", tags: ["Seasonal", "Fresh"], image: cocktailSpringNegroni },
  { id: "desert-sunset", title: "Desert Sunset", pdf: "/pdf/cocktails/Desert Sunset.pdf", tags: ["Sweet", "Visual"], image: cocktailSunset },
  { id: "desert-pineapple-bullet", title: "Desert Pineapple Bullet", pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf", tags: ["Tropical", "Punch"], image: cocktailPineappleBullet },
  { id: "desert-rose-martini", title: "Desert Rose Martini", pdf: "/pdf/cocktails/Desert Rose Martini.pdf", tags: ["Martini", "Elegant"], image: cocktailRoseMartini },
  { id: "desert-rose-paradise", title: "Desert Rose Paradise", pdf: "/pdf/cocktails/Desert Rose Paradise.pdf", tags: ["Fruity", "Sweet"], image: cocktailRoseParadise },
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

const CocktailCard = ({ cocktail, index, dragConstraints, onDragEnd, style, drag, onDragStart, onPointerCancel }: CocktailCardProps) => {
  const getIcon = (tags: string[]) => {
    if (tags.includes("Martini")) return <Martini className="w-4 h-4 text-[#a65d3d]" />;
    if (tags.includes("Spritz")) return <Droplets className="w-4 h-4 text-orange-400" />;
    return <Wine className="w-4 h-4 text-[#2b1810]/70" />;
  };

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
        "flex flex-col overflow-hidden bg-[#f0e5d1]",
        "shadow-2xl shadow-black/40 cursor-grab select-none",
        "touch-pan-y" 
      )}
    >
      <div className="absolute inset-0 bg-[url('/textures/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f0e5d1]/20 to-[#f0e5d1] pointer-events-none" />
        </div>
      )}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex gap-2 flex-wrap max-w-[calc(100%-3rem)]">
        {cocktail.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 md:px-3 text-[9px] md:text-[10px] uppercase tracking-widest font-ergon text-[#2b1810] bg-[#2b1810]/5 border border-[#2b1810]/10">
            {tag}
          </span>
        ))}
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-8 md:p-8 md:pb-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
            <h2 className="text-2xl md:text-4xl font-lux text-[#2b1810] leading-tight flex-1">
              {cocktail.title}
            </h2>

            {cocktail.pdf ? (
              <a
                href={cocktail.pdf}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 bg-[#2b1810] hover:bg-[#a65d3d] text-[#f0e5d1] text-xs font-ergon uppercase tracking-[0.15em] transition-all duration-300 w-full md:w-auto md:flex-shrink-0"
              >
                <span>Download</span>
                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
            ) : null}
          </div>

          <div className="flex items-center gap-2 opacity-80 pt-2 border-t border-[#2b1810]/10">
            {getIcon(cocktail.tags || [])}
            <span className="text-xs font-ergon uppercase tracking-widest text-[#2b1810]/60">Desert Rose</span>
          </div>
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

export function FullCocktailsScene({ 
  isActive, 
  onDragStateChange,
  onScrollPositionChange 
}: FullCocktailsSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleSwipe = (direction: number) => {
    const currentDragX = x.get();
    setSwipeStartX(currentDragX);
    setSwipedCard(cocktails[index1]);
    setExitX(direction * 400);
    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
    x.set(0);
    setTimeout(() => { setExitX(null); setSwipedCard(null); setSwipeStartX(0); }, 600);
  };

  const onDragEnd = (_event: any, info: PanInfo) => {
    onDragStateChange(false);
    const threshold = 100;
    if (info.offset.x > threshold) handleSwipe(1);
    else if (info.offset.x < -threshold) handleSwipe(-1);
  };

  const handleDragCancel = useCallback(() => {
    onDragStateChange(false);
  }, [onDragStateChange]);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#2b1810] flex flex-col scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 1 }} 
      data-testid="scene-cocktails-full"
      data-scene-type="scrollable"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/textures/stardust.png')] opacity-20 mix-blend-soft-light" />
      </div>

      <div 
        ref={scrollContainerRef}
        className="relative z-10 flex flex-col flex-grow overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <section className="flex-none pt-24 pb-4 md:pb-6 px-4 md:px-6 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h3 className="text-[#a65d3d] font-ergon tracking-[0.3em] uppercase text-[10px] mb-2">The Collection</h3>
            {isActive ? (
              <div className="mb-3">
                <AnimatedText text="Bespoke " variant="fade-up" className="text-2xl md:text-5xl font-lux text-[#f0e5d1] inline tracking-tight" staggerDelay={0.04} tag="span" />
                <AnimatedText text="Beverages" variant="blur-in" className="text-2xl md:text-5xl italic font-body text-[#a65d3d] inline" staggerDelay={0.04} initialDelay={0.4} tag="span" />
              </div>
            ) : (
              <h1 className="text-2xl md:text-5xl font-lux text-[#f0e5d1] mb-3 tracking-tight">
                Bespoke <span className="italic font-body text-[#a65d3d]">Beverages</span>
              </h1>
            )}
            <p className="font-body text-[#f0e5d1]/70 text-[11px] md:text-sm leading-relaxed max-w-xl mx-auto">
              Unforgettable cocktails tailored for every preference.
            </p>
          </motion.div>
        </section>

        <section className="flex-1 flex flex-col items-center justify-center relative w-full px-4 py-4 md:py-8 min-h-[420px] md:min-h-[500px]">
          <div className="relative w-full max-w-sm md:max-w-md h-[380px] md:h-[500px]">
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
            <CocktailCard 
              key={"card-" + index1} 
              cocktail={cocktails[index1]} 
              index={0} 
              drag="x" 
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd} 
              onDragStart={() => onDragStateChange(true)} 
              onPointerCancel={handleDragCancel}
              style={{ x, rotate, opacity }} 
            />
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
          <p className="md:hidden text-[#f0e5d1]/40 text-[10px] font-ergon tracking-widest uppercase mt-4">
            ← Swipe cards →
          </p>
        </section>

        <Footer />
      </div>
    </motion.div>
  );
}