import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, PanInfo, MotionValue } from 'framer-motion';
import { ChevronDown, ShoppingBag, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';
import { useSetWorld } from "@/experience/world/WorldProvider";
import { Footer } from '@/components/layout/footer';
import { AnimatedText, AnimatedParagraph, RevealOnScroll } from '@/components/ui/animated-text';
import { LiveBottle } from '@/components/ui/live-bottle'; 
import { AltimeterNav } from '@/components/ui/AltimeterNav';
import { AcquireButton } from '@/components/ui/acquire-button';

// --- ASSETS ---
// Using public folder paths for compressed images
const bottleClassic = '/assets/bottles/bottle-classic.jpg';
const bottleClassic200 = '/assets/bottles/bottle-200ml.jpg';
const bottleBox = '/assets/box/box_6_bottiglie_550x825.webp';
const bottleLimited = '/assets/bottles/bottle-limited.jpg';
import logoImage from '@assets/logo.webp';
const backgroundClassic = '/backgrounds/classic-bg.webp';
const backgroundLimited = '/backgrounds/limited-bg.webp';

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

// UPDATED: Cocktail card - white text, no labels, only name + download, 25% taller
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
        "shadow-2xl shadow-black/40 cursor-grab select-none"
      )}
    >
      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover opacity-90" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3a2820]/40 to-[#3a2820] pointer-events-none" />
        </div>
      )}
      
      {/* Content - only name and download */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-8 md:p-8 md:pb-10">
        <div className="flex flex-col gap-4">
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 border border-white/40 hover:bg-white/10 text-white text-xs font-hud uppercase tracking-[0.15em] transition-all duration-300 w-full md:w-auto"
            >
              <span>Download</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- LUXURY STORY BLOCK ---
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
        "group relative overflow-hidden flex flex-col border border-[#CD7E31]/10 bg-[#2b1810]/40 backdrop-blur-sm transition-all duration-500 hover:border-[#CD7E31]/40",
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
         <div className="absolute inset-0 bg-gradient-to-t from-[#2b1810]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-[#2b1810]/60 md:via-transparent md:to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-10 flex flex-col justify-center w-full md:w-1/2 bg-gradient-to-b from-[#1a100a]/80 to-transparent">
        <div className="flex items-center gap-2 mb-2 md:mb-3 text-[#CD7E31]">
          {icon}
          <span className="font-hud text-[9px] md:text-[10px] tracking-[0.25em] uppercase opacity-90">{subtitle}</span>
        </div>
        <h3 className="font-lux text-xl md:text-3xl mb-2 md:mb-4 leading-tight text-[#F5EFE6] drop-shadow-lg">
          {title}
        </h3>
        <div className="w-10 md:w-12 h-[1px] bg-[#CD7E31]/50 mb-3 md:mb-5 group-hover:w-16 md:group-hover:w-20 transition-all duration-500" />
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
      className="absolute inset-0 overflow-hidden bg-[#2B1810] scene-locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-hero"
      data-scene-type="locked"
      onClick={() => videoRef.current?.play()}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/video/hero.mp4"
        poster={backgroundLimited} 
        autoPlay
        loop
        muted
        playsInline={true}
        defaultMuted={true}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/30 via-transparent to-[#2B1810]/60" />

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

// STORY SCENE
interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

const StoryScene = ({ isActive, onScrollPositionChange }: ScrollableSceneProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      image: imgCraft,
      icon: <span className="w-4 h-4">◇</span>,
      subtitle: "Swiss Craftsmanship",
      title: "CRAFTING DISTINCTION",
      text: "The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds."
    },
    {
      image: imgDesert,
      icon: <span className="w-4 h-4">✦</span>,
      subtitle: "Opulent Escape",
      title: "SAHARAN INSPIRED",
      text: "Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process using discerning organic botanicals."
    }
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 30, filter: "blur(5px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } } };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isActive) {
      setCurrentCard(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (isMobile) {
      onScrollPositionChange({ 
        isAtTop: currentCard === 0, 
        isAtBottom: currentCard === stories.length - 1 
      });
    } else {
      onScrollPositionChange({ isAtTop: true, isAtBottom: true });
    }
  }, [currentCard, isMobile, onScrollPositionChange]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentCard > 0) {
        setCurrentCard(currentCard - 1);
      } else if (info.offset.x < 0 && currentCard < stories.length - 1) {
        setCurrentCard(currentCard + 1);
      }
    }
  };

  if (isMobile) {
    return (
      <motion.div 
        className="absolute inset-0 bg-[#2B1810] text-[#F5EFE6]"
        initial={{ opacity: 0 }} 
        animate={{ opacity: isActive ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#2B1810] z-0 pointer-events-none" />

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
                  <div className="relative overflow-hidden bg-[#2B1810]/40 backdrop-blur-sm border border-[#CD7E31]/20">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img 
                        src={stories[currentCard].image} 
                        alt={stories[currentCard].title} 
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/80 via-transparent to-transparent" />
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
          </div>
        </div>
        
        {/* Mobile swipe indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {stories.map((_, i) => (
            <div key={i} className={cn("w-2 h-2 transition-all", i === currentCard ? "bg-[#CD7E31]" : "bg-white/30")} />
          ))}
        </div>
      </motion.div>
    );
  }

  // DESKTOP VIEW
  return (
    <motion.div 
      className="absolute inset-0 bg-[#2B1810] text-[#F5EFE6] scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 0.8 }}
      data-scene-type="scrollable"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#2B1810] z-0 pointer-events-none" />

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
            icon={<span className="w-4 h-4">◇</span>}
            subtitle="Swiss Craftsmanship"
            title="CRAFTING DISTINCTION"
            text="The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds."
          />
          <LuxuryStoryBlock 
            variants={item}
            image={imgDesert}
            icon={<span className="w-4 h-4">✦</span>}
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
  const [currentCard, setCurrentCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const experiences = [
    {
      image: imgBalance,
      icon: <span className="w-4 h-4">⚖</span>,
      subtitle: "Balance & Asymmetry",
      title: "HARMONY & EDGE",
      text: "Like the enchanting mineral in the Saharan desert, our gin beckons you beyond the ordinary. A hypnotic fusion of undulating waves, sharp edges, and the interplay of smoothness and sharpness."
    },
    {
      image: imgIntrigue,
      icon: <span className="w-4 h-4">🍴</span>,
      subtitle: "Palate Prestige",
      title: "INTRIGUE THE PALATE",
      text: "Set out on a journey of taste. All botanicals are enriched with the precious flavor of seafood and gourmet dishes. From rocks to mixology, our gin adapts to every desire."
    }
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 30, filter: "blur(5px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } } };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isActive) {
      setCurrentCard(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (isMobile) {
      onScrollPositionChange({ 
        isAtTop: currentCard === 0, 
        isAtBottom: currentCard === experiences.length - 1 
      });
    } else {
      onScrollPositionChange({ isAtTop: true, isAtBottom: true });
    }
  }, [currentCard, isMobile, onScrollPositionChange]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentCard > 0) {
        setCurrentCard(currentCard - 1);
      } else if (info.offset.x < 0 && currentCard < experiences.length - 1) {
        setCurrentCard(currentCard + 1);
      }
    }
  };

  if (isMobile) {
    return (
      <motion.div 
        className="absolute inset-0 bg-[#2B1810] text-[#F5EFE6]"
        initial={{ opacity: 0 }} 
        animate={{ opacity: isActive ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#2B1810] z-0 pointer-events-none" />

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
                  <div className="relative overflow-hidden bg-[#2B1810]/40 backdrop-blur-sm border border-[#CD7E31]/20">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img 
                        src={experiences[currentCard].image} 
                        alt={experiences[currentCard].title} 
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/80 via-transparent to-transparent" />
                    </div>

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
          </div>
        </div>
        
        {/* Mobile swipe indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {experiences.map((_, i) => (
            <div key={i} className={cn("w-2 h-2 transition-all", i === currentCard ? "bg-[#CD7E31]" : "bg-white/30")} />
          ))}
        </div>
      </motion.div>
    );
  }

  // DESKTOP VIEW
  return (
    <motion.div 
      className="absolute inset-0 bg-[#2B1810] text-[#F5EFE6] scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 0.8 }}
      data-scene-type="scrollable"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#2B1810] z-0 pointer-events-none" />

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
            icon={<span className="w-4 h-4">⚖</span>}
            subtitle="Balance & Asymmetry"
            title="HARMONY & EDGE"
            text="Like the enchanting mineral in the Saharan desert, our gin beckons you beyond the ordinary. A hypnotic fusion of undulating waves, sharp edges, and the interplay of smoothness and sharpness."
          />
          <LuxuryStoryBlock 
            variants={item}
            image={imgIntrigue}
            icon={<span className="w-4 h-4">🍴</span>}
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

// UPDATED PRODUCT DATA INTERFACE
interface ProductOption {
  size: string;
  price: string;
  image: string;
}

interface ProductOption {
  size: string;
  price: string;
  image: string;
}

interface ProductData {
  id: string;
  name: string;
  batch: string;
  abv: string;
  description: string;
  options: ProductOption[];
}

// UPDATED PRODUCT SCENE - Multiple options, no year, no botanicals, brighter text
const ProductScene = ({ data, isActive, direction }: { data: ProductData; isActive: boolean; direction: number }) => {
  const isDark = data.id === 'limited';
  const [selectedOption, setSelectedOption] = useState(0);
  
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden scene-locked ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
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

      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center justify-center pt-20 md:pt-0">
        {/* Info section - UPDATED: Brighter text, no year, no botanicals */}
        <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }} transition={{ delay: 0.5, duration: 0.8 }}>
            {/* Batch info - brighter */}
            <div className={`font-hud text-[10px] md:text-xs tracking-widest mb-2 md:mb-4 border-l-2 pl-3 md:pl-4 ${isDark ? 'border-[#F5EFE6]/60 text-[#F5EFE6]/80' : 'border-[#2B1810]/60 text-[#2B1810]/80'}`}>
              BATCH NO. {data.batch} / {data.abv}
            </div>

            {isActive ? (
              <AnimatedText
                text={data.name}
                variant="fade-up"
                className={`text-3xl md:text-5xl lg:text-6xl font-lux mb-3 md:mb-6 leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
                staggerDelay={0.04}
                initialDelay={0.3}
                tag="h2"
              />
            ) : (
              <h2 className={`text-3xl md:text-5xl lg:text-6xl font-lux mb-3 md:mb-6 leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                {data.name}
              </h2>
            )}

            {/* Description - brighter */}
            <p className={`text-xs md:text-base leading-relaxed mb-4 md:mb-6 font-ergon ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]/90'}`}>
              {data.description}
            </p>

            {/* Product Options */}
            <div className="flex flex-col gap-2 mb-6">
              {data.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 border transition-all duration-300",
                    selectedOption === i 
                      ? isDark ? "border-[#F5EFE6] bg-[#F5EFE6]/10" : "border-[#2B1810] bg-[#2B1810]/10"
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-row items-center gap-3 md:gap-6">
              <AcquireButton label="Order" variant={isDark ? "dark" : "light"} data-testid={`button-acquire-${data.id}`} />
            </div>
          </motion.div>
        </div>

        {/* Bottle */}
        <div className="w-full md:w-1/3 order-1 md:order-2 h-[30vh] md:h-[70vh] flex items-center justify-center relative">
          <motion.div 
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
          >
            <LiveBottle
              src={data.options[selectedOption].image}
              alt={data.name}
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {/* Empty right column (removed year) */}
        <div className="hidden md:block w-1/3 order-3 relative h-full" />
      </div>
    </motion.div>
  );
};

// UPDATED COCKTAILS SCENE - Lighter background, white text, 25% taller cards, fixed swipe
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
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(false);
    onDragStateChange(false);
    const threshold = 80;
    const velocityThreshold = 300;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      handleSwipe(info.offset.x > 0 ? 1 : -1);
    } else {
      x.set(0);
    }
  }, [handleSwipe, onDragStateChange, x]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    onDragStateChange(true);
  }, [onDragStateChange]);

  const handleDragCancel = useCallback(() => {
    setIsDragging(false);
    onDragStateChange(false);
    x.set(0);
  }, [onDragStateChange, x]);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#4a3228] flex flex-col scene-scrollable"
      initial={{ opacity: 0 }} 
      animate={{ opacity: isActive ? 1 : 0 }} 
      transition={{ duration: 1 }} 
      data-testid="scene-cocktails-full"
      data-scene-type="scrollable"
    >
      {/* Lighter background */}
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
        {/* Header - white text */}
        <section className="flex-none pt-24 pb-4 md:pb-6 px-4 md:px-6 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h3 className="text-white/80 font-hud tracking-[0.3em] uppercase text-[10px] mb-2">The Collection</h3>
            <h1 className="text-2xl md:text-5xl font-lux text-white mb-3 tracking-tight">
              Bespoke <span className="italic font-body text-white/80">Beverages</span>
            </h1>
            <p className="font-body text-white/70 text-[11px] md:text-sm leading-relaxed max-w-xl mx-auto">
              Unforgettable cocktails tailored for every preference.
            </p>
          </motion.div>
        </section>

        {/* Cards section - 25% taller */}
        <section className="flex-1 flex flex-col items-center justify-center relative w-full px-4 py-4 md:py-8 min-h-[520px] md:min-h-[625px]">
          <div className="relative w-full max-w-sm md:max-w-md h-[475px] md:h-[625px]">
            {/* Background cards */}
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
            
            {/* Active draggable card */}
            <motion.div
              key={"card-active-" + index1}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ x, rotate, opacity, zIndex: 100 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={handleDragStart}
              onDragEnd={onDragEnd}
              onPointerCancel={handleDragCancel}
              whileTap={{ cursor: "grabbing" }}
            >
              <CocktailCard cocktail={cocktails[index1]} index={0} />
            </motion.div>
            
            {/* Exit animation */}
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
          
          <p className="text-white/40 text-[10px] font-hud tracking-widest uppercase mt-4">
            ← Swipe cards →
          </p>
        </section>

        <Footer />
      </div>
    </motion.div>
  );
};

// --- HELPER ---
function isInteractiveElement(element: HTMLElement | null): boolean {
  if (!element) return false;
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO'];
  const interactiveRoles = ['button', 'link', 'textbox', 'slider'];
  let current: HTMLElement | null = element;
  while (current) {
    if (interactiveTags.includes(current.tagName)) return true;
    if (current.getAttribute('role') && interactiveRoles.includes(current.getAttribute('role')!)) return true;
    if (current.hasAttribute('data-card')) return true; 
    if (current.hasAttribute('data-no-swipe')) return true; 
    if (current.getAttribute('data-cursor') === 'button') return true; 
    current = current.parentElement;
  }
  return false;
}

// --- ZOOM WRAPPER ---
const ZoomWrapper = ({ 
  children, 
  isActive, 
  index, 
  currentIndex, 
  direction 
}: { 
  children: React.ReactNode; 
  isActive: boolean; 
  index: number; 
  currentIndex: number;
  direction: number;
}) => {
  const isPast = index < currentIndex;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#2B1810]"
      initial={false}
      animate={{
        scale: isActive ? 1 : isPast ? 0.9 : 1.1,
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 50 : isPast ? 40 : 60,
      }}
      variants={{
        enter: (dir: number) => ({
          scale: 1.1,
          opacity: 0,
          zIndex: 60, 
        }),
        center: {
          scale: 1,
          opacity: 1,
          zIndex: 50,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        },
        exit: (dir: number) => ({
          scale: 0.9,
          opacity: 0,
          zIndex: 40,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        })
      }}
      custom={direction}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ 
        pointerEvents: isActive ? 'auto' : 'none' 
      }}
    >
      {children}
    </motion.div>
  );
};

// --- MAIN LANDING PAGE ---
export default function LandingPage() {
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 6; 

  const smoothScroll = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const { triggerTransition, isTransitioning } = useTransition();

  const sceneScrollPositionRef = useRef<Record<number, { isAtTop: boolean; isAtBottom: boolean }>>({
    1: { isAtTop: true, isAtBottom: false }, 
    2: { isAtTop: true, isAtBottom: false }, 
    5: { isAtTop: true, isAtBottom: false }, 
  });

  const handleSceneScrollPosition = useCallback((sceneIndex: number) => (position: { isAtTop: boolean; isAtBottom: boolean }) => {
    sceneScrollPositionRef.current[sceneIndex] = position;
  }, []);

  const gatedNavigate = useCallback((targetScene: number, newDirection: number) => {
    if (isTransitioning) return;
    triggerTransition(() => { setDirection(newDirection); setScrollPos(targetScene); });
  }, [isTransitioning, triggerTransition]);

  const cardDragActiveRef = useRef(false);

  const handleCardDragStateChange = useCallback((isDragging: boolean) => {
    cardDragActiveRef.current = isDragging;
  }, []);

  useEffect(() => {
    const preloadImages = [bottleClassic, bottleLimited, bottleClassic200];
    preloadImages.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;
    const threshold = 50;

    const handleWheel = (e: WheelEvent) => {
      const currentScene = Math.floor(scrollPos);
      const scrollPos_scene = sceneScrollPositionRef.current[currentScene];

      if (scrollPos_scene) {
        if (e.deltaY < 0 && !scrollPos_scene.isAtTop) return;
        if (e.deltaY > 0 && !scrollPos_scene.isAtBottom) return;
      }

      e.preventDefault();
      accumulatedDelta += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 150);

      if (Math.abs(accumulatedDelta) > threshold) {
        if (accumulatedDelta > 0 && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        } else if (accumulatedDelta < 0 && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        }
        accumulatedDelta = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [totalScenes, scrollPos, gatedNavigate]);

  // Touch handling for mobile swipe between scenes
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchMoved = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (cardDragActiveRef.current) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchMoved = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (cardDragActiveRef.current) return;
      touchMoved = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cardDragActiveRef.current || !touchMoved) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;

      // Only trigger if vertical swipe is dominant
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        const currentScene = Math.floor(scrollPos);
        const scrollPos_scene = sceneScrollPositionRef.current[currentScene];
        
        if (scrollPos_scene) {
          if (deltaY < 0 && !scrollPos_scene.isAtTop) return;
          if (deltaY > 0 && !scrollPos_scene.isAtBottom) return;
        }

        if (deltaY > 0 && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        } else if (deltaY < 0 && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        }
      }
    };

    const handleTouchCancel = () => {
      touchMoved = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [totalScenes, scrollPos, gatedNavigate]);

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
  // UPDATED: Changed navigation labels - GALLERY → JOURNEY
  const sceneLabels = ['SAHARAN', 'STORY', 'EXPERIENCE', 'CLASSIC', 'LIMITED', 'SERVE']; 

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

  // UPDATED PRODUCT DATA - Multiple options with pricing, no botanicals
  const classicProductData: ProductData = {
    id: 'classic',
    name: "DESERT ROSE CLASSIC EDITION",
    batch: "042",
    abv: "43%",
    description: "Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.",
    options: [
      { size: "500ml Bottle", price: "62 CHF (IVA incl.)", image: bottleClassic },
      { size: "200ml Bottle", price: "37 CHF (IVA incl.)", image: bottleClassic200 },
      { size: "Gift Box Set", price: "62 CHF (IVA incl.)", image: bottleBox },
    ]
  };

  const limitedProductData: ProductData = {
    id: 'limited',
    name: "DESERT ROSE LIMITED EDITION",
    batch: "001",
    abv: "43%",
    description: "Organic high-quality distillate created from a fusion of Saharan and Asian botanicals. The delicate, floral taste of Darjeeling tea combines with the sweetness of date fruit, creating a complex aroma, soft on the nose and refreshing on the palate.",
    options: [
      { size: "500ml Bottle", price: "72 CHF (IVA incl.)", image: bottleLimited },
      { size: "Gift Box Set", price: "72 CHF (IVA incl.)", image: bottleBox },
    ]
  };

  return (
    <>
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

      <main className="relative w-screen h-[100dvh] bg-[#2B1810] text-[#F5EFE6] overflow-hidden">

        <AnimatePresence initial={false} custom={direction} mode="popLayout">

          {currentSceneIndex === 0 && (
            <ZoomWrapper key="scene-0" isActive={true} index={0} currentIndex={currentSceneIndex} direction={direction}>
              <HeroScene progress={sceneProgress} isActive={true} />
            </ZoomWrapper>
          )}

          {currentSceneIndex === 1 && (
            <ZoomWrapper key="scene-1" isActive={true} index={1} currentIndex={currentSceneIndex} direction={direction}>
              <StoryScene isActive={true} onScrollPositionChange={handleSceneScrollPosition(1)} />
            </ZoomWrapper>
          )}

          {currentSceneIndex === 2 && (
            <ZoomWrapper key="scene-2" isActive={true} index={2} currentIndex={currentSceneIndex} direction={direction}>
              <ExperienceScene isActive={true} onScrollPositionChange={handleSceneScrollPosition(2)} />
            </ZoomWrapper>
          )}

          {currentSceneIndex === 3 && (
            <ZoomWrapper key="scene-3" isActive={true} index={3} currentIndex={currentSceneIndex} direction={direction}>
              <ProductScene data={classicProductData} isActive={true} direction={direction} />
            </ZoomWrapper>
          )}

          {currentSceneIndex === 4 && (
            <ZoomWrapper key="scene-4" isActive={true} index={4} currentIndex={currentSceneIndex} direction={direction}>
              <ProductScene data={limitedProductData} isActive={true} direction={direction} />
            </ZoomWrapper>
          )}

          {currentSceneIndex === 5 && (
            <ZoomWrapper key="scene-5" isActive={true} index={5} currentIndex={currentSceneIndex} direction={direction}>
              <FullCocktailsScene 
                isActive={true} 
                onDragStateChange={handleCardDragStateChange}
                onScrollPositionChange={handleSceneScrollPosition(5)}
              />
            </ZoomWrapper>
          )}

        </AnimatePresence>

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
        className="fixed top-0 right-0 p-4 md:p-8 z-[70] text-[#F5EFE6] cursor-pointer hover:opacity-70 transition-opacity drop-shadow-lg" 
        data-testid="button-cart" 
        data-cursor="button" 
        data-cursor-text="Cart"
      >
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    </>
  );
}
