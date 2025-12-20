import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, PanInfo, MotionValue } from 'framer-motion';
import { ChevronDown, ShoppingBag, Download, Wine, Droplets, Martini, Sparkles, Compass, Scale, Utensils, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';
import { useSetWorld } from "@/experience/world/WorldProvider";
import { Footer } from '@/components/layout/footer';
import { AnimatedText, AnimatedParagraph, RevealOnScroll } from '@/components/ui/animated-text';
import { LiveBottle } from '@/components/ui/live-bottle'; 
import { AltimeterNav } from '@/components/ui/AltimeterNav';
import { AgeGate } from "@/components/ui/age-gate";
import { AcquireButton } from '@/components/ui/acquire-button';

// --- ASSETS ---
import bottleClassic from '@assets/bottles/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299128312.webp';
import bottleLimited from '@assets/bottles/bottle-limited.webp';
import logoImage from '@assets/logo.webp';
import backgroundClassic from '@assets/backgrounds/classic-bg.webp';
import backgroundLimited from '@assets/backgrounds/limited-bg.webp';

// Story & Experience Images
const imgCraft = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414898-64867308-544x488x551x827x6x115-section-02-image.jpg";
const imgDesert = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800";
const imgBalance = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414899-64867436-417x460x419x462x1x0-section-04-photo.jpg";
const imgIntrigue = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414901-64888837-559x314x559x317x0x2-section-05-photo-03.png";

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

// --- TYPE DEFINITIONS ---
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

// --- COMPONENTS ---

// FIXED: Card now uses touch-action: pan-y to allow vertical scroll while reserving horizontal for drag
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
      // FIXED: Using pan-y allows vertical scroll, reserves horizontal for our drag handling
      // Removed touch-none which was blocking all touch interactions
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col overflow-hidden bg-[#f0e5d1]",
        "shadow-2xl shadow-black/40 cursor-grab select-none",
        "touch-pan-y" // Allow vertical scroll, we handle horizontal drag via Framer Motion
      )}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f0e5d1]/20 to-[#f0e5d1] pointer-events-none" />
        </div>
      )}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex gap-2 flex-wrap max-w-[calc(100%-3rem)]">
        {cocktail.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 md:px-3 text-[9px] md:text-[10px] uppercase tracking-widest font-hud text-[#2b1810] bg-[#2b1810]/5 border border-[#2b1810]/10">
            {tag}
          </span>
        ))}
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-8 md:p-8 md:pb-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
            <h2 className="text-2xl md:text-4xl font-lux text-[#2b1810] leading-tight flex-1">{cocktail.title}</h2>
            <a 
              href={cocktail.pdf} 
              target="_blank" 
              rel="noopener noreferrer" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 bg-[#2b1810] hover:bg-[#a65d3d] text-[#f0e5d1] text-xs font-hud uppercase tracking-[0.15em] transition-all duration-300 w-full md:w-auto md:flex-shrink-0"
            >
              <span>Download</span>
              <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="flex items-center gap-2 opacity-80 pt-2 border-t border-[#2b1810]/10">
            {getIcon(cocktail.tags || [])}
            <span className="text-xs font-hud uppercase tracking-widest text-[#2b1810]/60">Desert Rose</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- LUXURY STORY BLOCK - Now supports scrollable containers ---
interface LuxuryStoryBlockProps {
  image: string;
  icon: React.ReactNode;
  subtitle: string;
  title: string;
  text: string;
  reverse?: boolean; 
  variants: any;
}

const LuxuryStoryBlock = ({ image, icon, subtitle, title, text, reverse, variants }: LuxuryStoryBlockProps) => {
  return (
    <motion.div 
      variants={variants} 
      className={cn(
        "group relative overflow-hidden flex flex-col border border-[#CD7E31]/10 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-[#CD7E31]/40",
        "min-h-[280px] md:min-h-[38vh]",
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {/* Image */}
      <div className="relative w-full md:w-1/2 h-40 md:h-full overflow-hidden shrink-0">
         <motion.div 
           className="w-full h-full"
           whileHover={{ scale: 1.1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
         >
           <motion.img 
             src={image} 
             alt={title} 
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             draggable={false}
           />
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-black/60 md:via-transparent md:to-transparent" />
      </div>

      {/* Content - full text, no truncation */}
      <div className="p-6 md:p-10 flex flex-col justify-center w-full md:w-1/2 bg-gradient-to-b from-[#1a100a]/80 to-transparent">
        <div className="flex items-center gap-2 mb-2 md:mb-3 text-[#CD7E31]">
          {icon}
          <span className="font-hud text-[9px] md:text-[10px] tracking-[0.25em] uppercase opacity-90">{subtitle}</span>
        </div>
        <h3 className="font-lux text-xl md:text-3xl mb-2 md:mb-4 leading-tight text-[#F5EFE6] drop-shadow-lg">
          {title}
        </h3>
        <div className="w-10 md:w-12 h-[1px] bg-[#CD7E31]/50 mb-3 md:mb-5 group-hover:w-16 md:group-hover:w-20 transition-all duration-500" />
        {/* FIXED: Full text, no line-clamp - container is now scrollable */}
        <p className="text-[11px] md:text-sm text-[#F5EFE6]/80 leading-relaxed font-ergon tracking-wide">
          {text}
        </p>
      </div>
    </motion.div>
  );
};

// --- SCENES ---

const HeroScene = ({ progress, isActive }: { progress: MotionValue<number>; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [isActive]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#050606] scene-locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-hero"
      data-scene-type="locked"
      onClick={() => videoRef.current?.play()}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        src="/video/hero.mp4"
        poster={backgroundLimited} 
        autoPlay
        loop
        muted
        playsInline={true}
        defaultMuted={true}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <motion.div className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} data-testid="scroll-indicator">
        <span className="text-xs md:text-sm font-hud tracking-widest text-white/70">SCROLL TO DISCOVER</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// STORY SCENE - Now scrollable on mobile with bidirectional boundary navigation
interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

const StoryScene = ({ isActive, onScrollPositionChange }: ScrollableSceneProps) => {
  // ALL HOOKS FIRST - before any conditional returns
  const [currentCard, setCurrentCard] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      image: imgCraft,
      icon: <Compass className="w-4 h-4" />,
      subtitle: "Swiss Craftsmanship",
      title: "CRAFTING DISTINCTION",
      text: "The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds."
    },
    {
      image: imgDesert,
      icon: <Sparkles className="w-4 h-4" />,
      subtitle: "Opulent Escape",
      title: "SAHARAN INSPIRED",
      text: "Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process using discerning organic botanicals."
    }
  ];

  // Animation variants for desktop
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 30, filter: "blur(5px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } } };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset on scene change
  useEffect(() => {
    if (isActive) {
      setCurrentCard(0);
      setShowHint(true);
    }
  }, [isActive]);

  // Mobile: Report position based on card index
  useEffect(() => {
    if (isMobile) {
      onScrollPositionChange({ 
        isAtTop: currentCard === 0, 
        isAtBottom: currentCard === stories.length - 1 
      });
    } else {
      // Desktop: always at top and bottom (no scroll)
      onScrollPositionChange({ isAtTop: true, isAtBottom: true });
    }
  }, [currentCard, isMobile, onScrollPositionChange]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentCard > 0) {
        setCurrentCard(currentCard - 1);
        setShowHint(false);
      } else if (info.offset.x < 0 && currentCard < stories.length - 1) {
        setCurrentCard(currentCard + 1);
        setShowHint(false);
      }
    }
  };

  // NOW conditional rendering - after all hooks
  if (isMobile) {
    return (
      <motion.div 
        className="absolute inset-0 bg-[#0A0806] text-[#F5EFE6]"
        initial={{ opacity: 0 }} 
        animate={{ opacity: isActive ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#0A0806] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

        <div className="relative z-10 h-full w-full overflow-hidden flex items-center">
          <div className="relative w-full h-full">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={currentCard}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex items-center justify-center px-6"
              >
                <div className="w-full max-w-md">
                  <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#CD7E31]/20">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img 
                        src={stories[currentCard].image} 
                        alt={stories[currentCard].title} 
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-[#CD7E31]">
                        {stories[currentCard].icon}
                        <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">
                          {stories[currentCard].subtitle}
                        </span>
                      </div>

                      <h3 className="font-lux text-2xl mb-4 leading-tight text-[#F5EFE6]">
                        {stories[currentCard].title}
                      </h3>

                      <div className="w-12 h-[1px] bg-[#CD7E31]/50 mb-4" />

                      <p className="text-sm text-[#F5EFE6]/80 leading-relaxed font-ergon tracking-wide">
                        {stories[currentCard].text}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {currentCard < stories.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-64 pointer-events-none opacity-30">
                <img 
                  src={stories[currentCard + 1].image} 
                  alt="" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
              >
                <p className="text-[#CD7E31] text-xs font-ergon tracking-widest uppercase">
                  ← Swipe to explore →
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            {stories.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentCard 
                    ? 'bg-[#CD7E31] w-6' 
                    : 'bg-[#CD7E31]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // DESKTOP VIEW
  return (
    <motion.div 
      className="absolute inset-0 bg-[#0A0806] text-[#F5EFE6] scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 0.8 }}
      data-scene-type="scrollable"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#0A0806] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

      <div 
        ref={scrollContainerRef}
        className="relative z-10 h-full overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate={isActive ? "show" : "hidden"}
          className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 font-ergon p-4 md:p-8 lg:p-16 pt-24 md:pt-8 pb-8"
        >
          <LuxuryStoryBlock 
            variants={item}
            image={imgCraft}
            icon={<Compass className="w-4 h-4" />}
            subtitle="Swiss Craftsmanship"
            title="CRAFTING DISTINCTION"
            text="The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds."
          />

          <LuxuryStoryBlock 
            variants={item}
            image={imgDesert}
            icon={<Sparkles className="w-4 h-4" />}
            subtitle="Opulent Escape"
            title="SAHARAN INSPIRED"
            text="Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process using discerning organic botanicals."
            reverse={true}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ExperienceScene = ({ isActive, onScrollPositionChange }: ScrollableSceneProps) => {
  // ALL HOOKS FIRST - before any conditional returns
  const [currentCard, setCurrentCard] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const experiences = [
    {
      image: imgBalance,
      icon: <Scale className="w-4 h-4" />,
      subtitle: "Balance & Asymmetry",
      title: "HARMONY & EDGE",
      text: "Like the enchanting mineral in the Saharan desert, our gin beckons you beyond the ordinary. A hypnotic fusion of undulating waves, sharp edges, and the interplay of smoothness and sharpness."
    },
    {
      image: imgIntrigue,
      icon: <Utensils className="w-4 h-4" />,
      subtitle: "Palate Prestige",
      title: "INTRIGUE THE PALATE",
      text: "Set out on a journey of taste. All botanicals are enriched with the precious flavor of seafood and gourmet dishes. From rocks to mixology, our gin adapts to every desire."
    }
  ];

  // Animation variants for desktop
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 30, filter: "blur(5px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } } };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset on scene change
  useEffect(() => {
    if (isActive) {
      setCurrentCard(0);
      setShowHint(true);
    }
  }, [isActive]);

  // Mobile: Report position based on card index
  useEffect(() => {
    if (isMobile) {
      onScrollPositionChange({ 
        isAtTop: currentCard === 0, 
        isAtBottom: currentCard === experiences.length - 1 
      });
    } else {
      // Desktop: always at top and bottom (no scroll)
      onScrollPositionChange({ isAtTop: true, isAtBottom: true });
    }
  }, [currentCard, isMobile, onScrollPositionChange]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentCard > 0) {
        setCurrentCard(currentCard - 1);
        setShowHint(false);
      } else if (info.offset.x < 0 && currentCard < experiences.length - 1) {
        setCurrentCard(currentCard + 1);
        setShowHint(false);
      }
    }
  };

  // NOW conditional rendering - after all hooks
  if (isMobile) {
    return (
      <motion.div 
        className="absolute inset-0 bg-[#0A0806] text-[#F5EFE6]"
        initial={{ opacity: 0 }} 
        animate={{ opacity: isActive ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#0A0806] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

        <div className="relative z-10 h-full w-full overflow-hidden flex items-center">
          {/* Cards Container */}
          <div className="relative w-full h-full">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={currentCard}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex items-center justify-center px-6"
              >
                <div className="w-full max-w-md">
                  {/* Card Content */}
                  <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#CD7E31]/20">
                    {/* Image */}
                    <div className="relative w-full h-64 overflow-hidden">
                      <img 
                        src={experiences[currentCard].image} 
                        alt={experiences[currentCard].title} 
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-[#CD7E31]">
                        {experiences[currentCard].icon}
                        <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">
                          {experiences[currentCard].subtitle}
                        </span>
                      </div>

                      <h3 className="font-lux text-2xl mb-4 leading-tight text-[#F5EFE6]">
                        {experiences[currentCard].title}
                      </h3>

                      <div className="w-12 h-[1px] bg-[#CD7E31]/50 mb-4" />

                      <p className="text-sm text-[#F5EFE6]/80 leading-relaxed font-ergon tracking-wide">
                        {experiences[currentCard].text}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Peek of next card */}
            {currentCard < experiences.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-64 pointer-events-none opacity-30">
                <img 
                  src={experiences[currentCard + 1].image} 
                  alt="" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Swipe Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
              >
                <p className="text-[#CD7E31] text-xs font-ergon tracking-widest uppercase">
                  ← Swipe to explore →
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            {experiences.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentCard 
                    ? 'bg-[#CD7E31] w-6' 
                    : 'bg-[#CD7E31]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // DESKTOP VIEW
  return (
    <motion.div 
      className="absolute inset-0 bg-[#0A0806] text-[#F5EFE6] scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 0.8 }}
      data-scene-type="scrollable"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#0A0806] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

      <div 
        ref={scrollContainerRef}
        className="relative z-10 h-full overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate={isActive ? "show" : "hidden"}
          className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 font-ergon p-4 md:p-8 lg:p-16 pt-24 md:pt-8 pb-8"
        >
          <LuxuryStoryBlock 
            variants={item}
            image={imgBalance}
            icon={<Scale className="w-4 h-4" />}
            subtitle="Balance & Asymmetry"
            title="HARMONY & EDGE"
            text="Like the enchanting mineral in the Saharan desert, our gin beckons you beyond the ordinary. A hypnotic fusion of undulating waves, sharp edges, and the interplay of smoothness and sharpness."
          />

          <LuxuryStoryBlock 
            variants={item}
            image={imgIntrigue}
            icon={<Utensils className="w-4 h-4" />}
            subtitle="Palate Prestige"
            title="INTRIGUE THE PALATE"
            text="Set out on a journey of taste. All botanicals are enriched with the precious flavor of seafood and gourmet dishes. From rocks to mixology, our gin adapts to every desire."
            reverse={true}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface ProductData {
  id: string;
  name: string;
  year: string;
  batch: string;
  abv: string;
  description: string;
  botanicals: string[];
  bottleImage: string;
  technicalSheetUrl: string; 
}

// PRODUCT SCENE - Locked (no scroll needed, content fits viewport)
const ProductScene = ({ data, isActive, direction }: { data: ProductData; isActive: boolean; direction: number }) => {
  const isDark = data.id === 'limited';
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden scene-locked ${isDark ? 'bg-[#050606]' : 'bg-[#E8DCCA]'}`}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: isActive ? '0%' : direction > 0 ? '-100%' : '100%', opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`scene-product-${data.id}`}
      data-scene-type="locked"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div className="absolute inset-0 w-full h-full">
        {isDark ? (
          <img src={backgroundLimited} alt="background" className="w-full h-full object-cover" draggable={false} />
        ) : data.id === 'classic' ? (
          <img src={backgroundClassic} alt="background" className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#dcbca0] opacity-30 skew-y-6 transform origin-bottom-left" />
        )}
      </div>

      {/* Mobile: Stacked layout that fits viewport */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center justify-center pt-20 md:pt-0">

        {/* Info section - compact on mobile */}
        <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className={`font-hud text-[10px] md:text-xs tracking-widest mb-2 md:mb-4 border-l-2 pl-3 md:pl-4 ${isDark ? 'border-[#CD7E31] text-gray-400' : 'border-[#917D37] text-gray-600'}`}>
              BATCH NO. {data.batch} / {data.abv}
            </div>

            {isActive ? (
              <AnimatedText
                text={data.name}
                variant="fade-up"
                className={`text-3xl md:text-7xl font-lux mb-3 md:mb-6 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
                staggerDelay={0.04}
                initialDelay={0.3}
                tag="h2"
              />
            ) : (
              <h2 className={`text-3xl md:text-7xl font-lux mb-3 md:mb-6 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                {data.name}
              </h2>
            )}

            {/* Description - shorter on mobile but readable */}
            <p className={`text-xs md:text-base leading-relaxed mb-4 md:mb-8 font-ergon ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#4E3022]'}`}>
              {data.description}
            </p>

            {/* Botanicals - 2x2 grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8">
              {data.botanicals.map((b, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[color:var(--drg-accent)]' : 'bg-[#917D37]'}`} />
                  <span className={`font-hud text-[10px] md:text-xs uppercase ${isDark ? 'text-[#F5EFE6]/70' : 'text-[#4E3022]/80'}`}>{b}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row items-center gap-3 md:gap-6">
              <AcquireButton label="Acquire" data-testid={`button-acquire-${data.id}`} />
              <a 
                href={data.technicalSheetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group relative z-50 flex items-center gap-2 text-[10px] md:text-xs font-hud tracking-widest uppercase transition-colors py-2 cursor-pointer ${
                  isDark ? 'text-[#F5EFE6] hover:text-[#CD7E31]' : 'text-[#2B1810] hover:text-[#a65d3d]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="relative">
                  Tech Sheet
                  <span className={`absolute left-0 bottom-[-4px] w-full h-[1px] opacity-30 ${isDark ? 'bg-[#CD7E31]' : 'bg-[#2B1810]'} `}></span>
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottle - centered, responsive height */}
        <div className="w-full md:w-1/3 order-1 md:order-2 h-[30vh] md:h-[70vh] flex items-center justify-center relative">
          <motion.div 
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
          >
            <LiveBottle
              src={data.bottleImage}
              alt={data.name}
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {/* Year - desktop only */}
        <div className="hidden md:block w-1/3 order-3 relative h-full">
          <motion.div 
            className="absolute top-1/4 right-16 md:right-24" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: isActive ? 0.2 : 0 }} 
            transition={{ delay: 0.8 }}
          >
            <h3 className={`text-9xl font-lux writing-vertical-rl ${isDark ? 'text-white' : 'text-[#2B1810]'}`}>{data.year}</h3>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// COCKTAILS SCENE - Scroll zone with footer
const FullCocktailsScene = ({ 
  isActive, 
  onDragStateChange,
  onScrollPositionChange 
}: { 
  isActive: boolean; 
  onDragStateChange: (isDragging: boolean) => void;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}) => {
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

  // Track scroll position for bidirectional boundary navigation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtTop = container.scrollTop <= 10;
      // More lenient bottom detection - within 50px of bottom
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 50;
      onScrollPositionChange({ isAtTop, isAtBottom });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Delay initial check to allow layout to settle
    const timer = setTimeout(() => handleScroll(), 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [onScrollPositionChange]);

  // Reset scroll when scene becomes active
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

  // FIXED: Event-driven drag state management
  const onDragEnd = (_event: any, info: PanInfo) => {
    // Always clear drag state when drag ends
    onDragStateChange(false);

    const threshold = 100;
    if (info.offset.x > threshold) handleSwipe(1);
    else if (info.offset.x < -threshold) handleSwipe(-1);
  };

  // FIXED: Proper handlers for all drag termination events
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
      {/* Background - fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-soft-light" />
      </div>

      {/* Scrollable content */}
      <div 
        ref={scrollContainerRef}
        className="relative z-10 flex flex-col flex-grow overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header section */}
        <section className="flex-none pt-24 pb-4 md:pb-6 px-4 md:px-6 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h3 className="text-[#a65d3d] font-hud tracking-[0.3em] uppercase text-[10px] mb-2">The Collection</h3>

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

        {/* Card stack section */}
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

          {/* Swipe hint for mobile */}
          <p className="md:hidden text-[#f0e5d1]/40 text-[10px] font-hud tracking-widest uppercase mt-4">
            ← Swipe cards →
          </p>
        </section>

        {/* Footer - naturally accessible by scrolling */}
        <Footer />
      </div>
    </motion.div>
  );
};

// --- HELPER: Check if touch started on interactive element ---
function isInteractiveElement(element: HTMLElement | null): boolean {
  if (!element) return false;

  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO'];
  const interactiveRoles = ['button', 'link', 'textbox', 'slider'];

  let current: HTMLElement | null = element;
  while (current) {
    if (interactiveTags.includes(current.tagName)) return true;
    if (current.getAttribute('role') && interactiveRoles.includes(current.getAttribute('role')!)) return true;
    if (current.hasAttribute('data-card')) return true; // Card handles its own gestures
    if (current.hasAttribute('data-no-swipe')) return true; // Explicit opt-out
    if (current.getAttribute('data-cursor') === 'button') return true; // Header/cart icons
    current = current.parentElement;
  }
  return false;
}

// --- MAIN LANDING PAGE ---

export default function LandingPage() {
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 6; 

  const smoothScroll = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const { triggerTransition, isTransitioning } = useTransition();

  // Track scroll position for scrollable scenes (for bidirectional navigation)
  const sceneScrollPositionRef = useRef<Record<number, { isAtTop: boolean; isAtBottom: boolean }>>({
    1: { isAtTop: true, isAtBottom: false }, // Story
    2: { isAtTop: true, isAtBottom: false }, // Experience
    5: { isAtTop: true, isAtBottom: false }, // Cocktails
  });

  const handleSceneScrollPosition = useCallback((sceneIndex: number) => (position: { isAtTop: boolean; isAtBottom: boolean }) => {
    sceneScrollPositionRef.current[sceneIndex] = position;
  }, []);

  const gatedNavigate = useCallback((targetScene: number, newDirection: number) => {
    if (isTransitioning) return;
    triggerTransition(() => { setScrollPos(targetScene); setDirection(newDirection); });
  }, [isTransitioning, triggerTransition]);

  // FIXED: Event-driven drag state tracking (no dangerous intervals)
  const cardDragActiveRef = useRef(false);

  const handleCardDragStateChange = useCallback((isDragging: boolean) => {
    cardDragActiveRef.current = isDragging;
  }, []);

  useEffect(() => {
    const preloadImages = [bottleClassic, bottleLimited];
    preloadImages.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  // --- WHEEL HANDLER (Desktop) - FIXED: Only navigate at boundaries for scrollable scenes ---
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;
    const threshold = 50;

    const handleWheel = (e: WheelEvent) => {
      const currentScene = Math.floor(scrollPos);
      const isScrollableScene = [1, 2, 5].includes(currentScene);

      if (isTransitioning) { e.preventDefault(); return; }

      // For scrollable scenes, only navigate at boundaries
      if (isScrollableScene) {
        const position = sceneScrollPositionRef.current[currentScene] ?? { isAtTop: true, isAtBottom: false };

        // Only handle wheel navigation at boundaries
        const isAtTop = position.isAtTop;
        const isAtBottom = position.isAtBottom;

        // Allow scroll up at top to go previous
        if (e.deltaY < 0 && isAtTop && currentScene > 0) {
          e.preventDefault();
          accumulatedDelta += e.deltaY;
        }
        // Allow scroll down at bottom to go next
        else if (e.deltaY > 0 && isAtBottom && currentScene < totalScenes - 1) {
          e.preventDefault();
          accumulatedDelta += e.deltaY;
        }
        // Otherwise, let native scroll handle it
        else {
          return;
        }
      } else {
        // For locked scenes, accumulate all wheel events
        accumulatedDelta += e.deltaY;
      }

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (Math.abs(accumulatedDelta) > threshold) {
          if (accumulatedDelta > 0 && currentScene < totalScenes - 1) {
            gatedNavigate(currentScene + 1, 1);
          } else if (accumulatedDelta < 0 && currentScene > 0) {
            gatedNavigate(currentScene - 1, -1);
          }
        }
        accumulatedDelta = 0;
      }, 150);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => { window.removeEventListener('wheel', handleWheel); if (wheelTimeout) clearTimeout(wheelTimeout); };
  }, [totalScenes, scrollPos, isTransitioning, gatedNavigate]);

  // --- TOUCH HANDLER (Mobile) - FIXED: Bidirectional navigation in scrollable scenes ---
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchStartElement: HTMLElement | null = null;
    let shouldIgnoreGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartElement = e.target as HTMLElement;

      // Ignore if card drag is active
      if (cardDragActiveRef.current) {
        shouldIgnoreGesture = true;
        return;
      }

      // Ignore if touch started on interactive element
      if (isInteractiveElement(touchStartElement)) {
        shouldIgnoreGesture = true;
        return;
      }

      shouldIgnoreGesture = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Skip if we decided to ignore this gesture
      if (shouldIgnoreGesture || cardDragActiveRef.current) {
        shouldIgnoreGesture = false;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = Math.max(Date.now() - touchStartTime, 1); // Prevent division by zero

      // Calculate velocity (pixels per millisecond)
      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      const currentScene = Math.floor(scrollPos);
      const isScrollableScene = [1, 2, 5].includes(currentScene);

      // --- SCROLLABLE SCENES (1, 2, 5) - Bidirectional boundary navigation ---
      if (isScrollableScene) {
        const position = sceneScrollPositionRef.current[currentScene] ?? { isAtTop: true, isAtBottom: false };
        const minVelocity = 0.5;
        const minDistance = 80;

        // Swipe DOWN at TOP → previous scene
        if (deltaY > minDistance && position.isAtTop && velocityY > minVelocity && Math.abs(deltaY) > Math.abs(deltaX) && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
          return;
        }

        // Swipe UP at BOTTOM → next scene
        if (deltaY < -minDistance && position.isAtBottom && velocityY > minVelocity && Math.abs(deltaY) > Math.abs(deltaX) && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
          return;
        }

        // All other gestures in scrollable scenes = let native scroll handle
        return;
      }

      // --- LOCKED SCENES (0, 3, 4) - Full gesture handling ---
      const minVelocity = 0.4;
      const minDistance = 60;

      // Horizontal swipe
      if (Math.abs(deltaX) > minDistance && velocityX > minVelocity && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        } else if (deltaX < 0 && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        }
      }
      // Vertical swipe
      else if (Math.abs(deltaY) > minDistance && velocityY > minVelocity && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < 0 && currentScene < totalScenes - 1) {
          // Swipe up = next scene
          gatedNavigate(currentScene + 1, 1);
        } else if (deltaY > 0 && currentScene > 0) {
          // Swipe down = previous scene
          gatedNavigate(currentScene - 1, -1);
        }
      }
    };

    // Also handle touch cancel to reset state
    const handleTouchCancel = () => {
      shouldIgnoreGesture = false;
      touchStartElement = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => { 
      window.removeEventListener('touchstart', handleTouchStart); 
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [totalScenes, scrollPos, gatedNavigate]);

  // --- KEYBOARD HANDLER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentScene = Math.floor(scrollPos);
        if (currentScene < totalScenes - 1) gatedNavigate(currentScene + 1, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentScene = Math.floor(scrollPos);
        if (currentScene > 0) gatedNavigate(currentScene - 1, -1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalScenes, scrollPos, gatedNavigate]);

  useEffect(() => { smoothScroll.set(scrollPos); }, [scrollPos, smoothScroll]);

  const currentSceneIndex = Math.floor(scrollPos);
  const sceneProgress = useTransform(smoothScroll, value => value % 1);
  const sceneLabels = ['ORIGIN', 'STORY', 'EXPERIENCE', 'CLASSIC', 'NOIR', 'SERVE']; 

  const setWorld = useSetWorld();
  useEffect(() => {
    const unsub = smoothScroll.on("change", (v) => {
      let w = 0;
      if (v < 1) w = 0;
      else if (v < 2) w = 0;
      else if (v < 3) w = 0;
      else if (v < 4) w = v - 3;
      else w = 1;
      setWorld(w);
    });
    return () => unsub();
  }, [smoothScroll, setWorld]);

  return (
    <>
      <AgeGate />
      <div className="noise-overlay" />

      <AltimeterNav
        currentSceneIndex={currentSceneIndex}
        sceneProgress={sceneProgress.get()}
        totalScenes={totalScenes}
        labels={sceneLabels}
        onSelect={(i) => {
          const currentScene = Math.floor(scrollPos);
          if (i !== currentScene) gatedNavigate(i, i > currentScene ? 1 : -1);
        }}
      />

      <main className="relative w-screen h-[100dvh] bg-[#050606] text-[#F5EFE6] overflow-hidden">

        {/* SCENE 0: HERO - Locked */}
        <div className={`absolute inset-0 z-[60] transition-opacity duration-1000 ${currentSceneIndex === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <HeroScene progress={sceneProgress} isActive={currentSceneIndex === 0} />
        </div>

        {/* SCENE 1: STORY - Scrollable */}
        <div className={`absolute inset-0 z-[50] ${currentSceneIndex === 1 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <StoryScene 
            isActive={currentSceneIndex === 1} 
            onScrollPositionChange={handleSceneScrollPosition(1)}
          />
        </div>

        {/* SCENE 2: EXPERIENCE - Scrollable */}
        <div className={`absolute inset-0 z-[40] ${currentSceneIndex === 2 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ExperienceScene 
            isActive={currentSceneIndex === 2}
            onScrollPositionChange={handleSceneScrollPosition(2)}
          />
        </div>

        {/* SCENE 3: CLASSIC PRODUCT - Locked */}
        <div className={`absolute inset-0 z-[30] ${currentSceneIndex === 3 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene data={{ id: 'classic', name: "DESERT ROSE", year: "2024", batch: "042", abv: "43%",
            description: "Small batch handcrafted gin, bottled and handcrafted in Switzerland. Saharan desert inspired with notes of sun-baked citrus, sage, and hidden floral sweetness.",
            botanicals: ["Wild Sage", "Saffron", "Juniper", "Rose Hip"], bottleImage: bottleClassic,
            technicalSheetUrl: "/pdf/classic-sheet.pdf" }} isActive={currentSceneIndex === 3} direction={direction} />
        </div>

        {/* SCENE 4: LIMITED PRODUCT - Locked */}
        <div className={`absolute inset-0 z-[20] ${currentSceneIndex === 4 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene data={{ id: 'limited', name: "LIMITED EDITION", year: "2025", batch: "001", abv: "43%",
            description: "London Dry Gin, bottled and handcrafted in Switzerland. Saharan desert inspired with Date, Darjeeling tea, Lemon & Orange for an intense, warm finish.",
            botanicals: ["Date", "Darjeeling Tea", "Lemon", "Orange"], bottleImage: bottleLimited,
            technicalSheetUrl: "/pdf/limited-sheet.pdf" }} isActive={currentSceneIndex === 4} direction={direction} />
        </div>

        {/* SCENE 5: COCKTAILS - Scrollable with Footer */}
        <div className={`absolute inset-0 z-[10] ${currentSceneIndex === 5 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <FullCocktailsScene 
            isActive={currentSceneIndex === 5} 
            onDragStateChange={handleCardDragStateChange}
            onScrollPositionChange={handleSceneScrollPosition(5)}
          />
        </div>
      </main>

      <header className="fixed top-0 left-0 p-4 md:p-8 z-[70]">
        <img 
          src={logoImage} 
          alt="Desert Rose Gin Logo" 
          className="h-16 md:h-24 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer" 
          data-testid="logo" 
          data-cursor="button" 
          data-cursor-text="Home"
          draggable={false}
          onClick={() => { 
            const currentScene = Math.floor(scrollPos); 
            if (currentScene !== 0) gatedNavigate(0, -1); 
          }} 
        />
      </header>

      <div 
        className="fixed top-0 right-0 p-4 md:p-8 z-[70] text-[color:var(--drg-accent)] cursor-pointer hover:opacity-70 transition-opacity drop-shadow-lg" 
        data-testid="button-cart" 
        data-cursor="button" 
        data-cursor-text="Cart"
      >
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    </>
  );
}