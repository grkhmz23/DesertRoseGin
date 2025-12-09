import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, MotionValue, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, ShoppingBag, Download, Wine, Droplets, Martini } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';

import bottleClassic from '@assets/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299330812.png';
import bottleLimited from '@assets/bottle-limited.png';
import logoImage from '@assets/logo-transparent.png';
import backgroundClassic from '@assets/background_shadow_1765311365870.png';
import backgroundLimited from '@assets/background2_1765312687425.webp';
import { AcquireButton } from '@/components/ui/acquire-button';

// Cocktail Images
import cocktailChiliPassion from '@assets/Chili_Passion_Desert_Martini_LR_RGB_1765314255791.jpg';
import cocktailDesertAperitif from '@assets/Desert_Aperitif_LR_RGB_1765314255792.jpg';
import cocktailDesertAviation from '@assets/Desert_Aviation_LR_RGB_1765314255793.jpg';
import cocktailDesertOnRock from '@assets/Desert_On_the_Rock_LR_RGB_1765314255793.jpg';
import cocktailOrangeSpritz from '@assets/Desert_Orange_Spritz_LR_RGB_1765314255794.jpg';
import cocktailPineappleBullet from '@assets/Desert_Pineapple_Bullet_LR_RGB_1765314255794.jpg';
import cocktailRoseBeer from '@assets/Desert_Rose_Beer_LR_RGB_1765314255795.jpg';
import cocktailGinTonic from '@assets/Desert_Rose_Gin_Tonic_LR_RGB_1765314255796.jpg';
import cocktailRoseMartini from '@assets/Desert_Rose_Martini_LR_RGB_1765314255797.jpg';
import cocktailRoseNegroni from '@assets/Desert_Rose_Negroni_LR_RGB_1765314255798.jpg';
import cocktailRoseParadise from '@assets/Desert_Rose_Paradise_LR_RGB_1765314255798.jpg';
import cocktailSpringNegroni from '@assets/Desert_Spring_Negroni_LR_RGB_1765314255799.jpg';
import cocktailSunset from '@assets/Desert_Sunset_LR_RGB_1765314255799.jpg';
import cocktailTangerineFrench75 from '@assets/Desert_Tangerine_French_75_LR_RGB_1765314255800.jpg';
import cocktailMediterraneanTonic from '@assets/Mediterranean_Desert_Tonic_LR_RGB_1765314255800.jpg';
import cocktailSpanishRoseTonic from '@assets/Spanish_Rose_Gin_Tonic_LR_RGB_1765314255801.jpg';
import cocktailRedDesert from '@assets/The_Red_Desert_LR_RGB_1765314255801.jpg';
import cocktailWhiteNegroni from '@assets/White_Desert_Negroni_LR_RGB_1765314255801.jpg';

// --- Cocktails Data ---
const cocktails = [
  {
    id: "bespoke-beverages",
    title: "Bespoke Beverages",
    pdf: "/pdf/cocktails/bespoke-beverages.pdf",
    tags: ["Menu", "Collection"],
    highlight: true,
  },
  {
    id: "cocktail-desert-rose-gin-tonic",
    title: "Desert Rose Gin Tonic",
    pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf",
    tags: ["Signature", "Tonic"],
    image: cocktailGinTonic,
  },
  {
    id: "cocktail-mediterranean-desert-tonic",
    title: "Mediterranean Desert Tonic",
    pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf",
    tags: ["Herbal", "Refreshing"],
    image: cocktailMediterraneanTonic,
  },
  {
    id: "cocktail-desert-on-the-rock",
    title: "Desert On the Rock",
    pdf: "/pdf/cocktails/Desert On the Rock.pdf",
    tags: ["Pure", "Strong"],
    image: cocktailDesertOnRock,
  },
  {
    id: "cocktail-desert-rose-negroni",
    title: "Desert Rose Negroni",
    pdf: "/pdf/cocktails/Desert Rose Negroni.pdf",
    tags: ["Negroni", "Bitter"],
    image: cocktailRoseNegroni,
  },
  {
    id: "chili-passion-desert",
    title: "Chili Passion Desert",
    pdf: "/pdf/cocktails/Chili Passion Desert.pdf",
    tags: ["Spicy", "Exotic"],
    image: cocktailChiliPassion,
  },
  {
    id: "desert-aviation",
    title: "Desert Aviation",
    pdf: "/pdf/cocktails/Desert Aviation.pdf",
    tags: ["Floral", "Classic"],
    image: cocktailDesertAviation,
  },
  {
    id: "desert-tangerine-french-75",
    title: "Desert Tangerine French 75",
    pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf",
    tags: ["Sparkling", "Citrus"],
    image: cocktailTangerineFrench75,
  },
  {
    id: "desert-orange-spritz",
    title: "Desert Orange Spritz",
    pdf: "/pdf/cocktails/Desert Orange Spritz.pdf",
    tags: ["Spritz", "Summer"],
    image: cocktailOrangeSpritz,
  },
  {
    id: "desert-rose-beer",
    title: "Desert Rose Beer",
    pdf: "/pdf/cocktails/Desert Rose Beer.pdf",
    tags: ["Fusion", "Highball"],
    image: cocktailRoseBeer,
  },
  {
    id: "desert-aperitif",
    title: "Desert Aperitif",
    pdf: "/pdf/cocktails/Desert Aperitif.pdf",
    tags: ["Aperitif", "Light"],
    image: cocktailDesertAperitif,
  },
  {
    id: "white-desert-negroni",
    title: "White Desert Negroni",
    pdf: "/pdf/cocktails/White Desert Negroni.pdf",
    tags: ["Negroni", "Modern"],
    image: cocktailWhiteNegroni,
  },
  {
    id: "the-red-desert",
    title: "The Red Desert",
    pdf: "/pdf/cocktails/The Red Desert.pdf",
    tags: ["Fruity", "Bold"],
    image: cocktailRedDesert,
  },
  {
    id: "spanish-rose-gin-tonic",
    title: "Spanish Rose Gin Tonic",
    pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf",
    tags: ["Tonic", "Copa"],
    image: cocktailSpanishRoseTonic,
  },
  {
    id: "desert-spring-negroni",
    title: "Desert Spring Negroni",
    pdf: "/pdf/cocktails/Desert Spring Negroni.pdf",
    tags: ["Seasonal", "Fresh"],
    image: cocktailSpringNegroni,
  },
  {
    id: "desert-sunset",
    title: "Desert Sunset",
    pdf: "/pdf/cocktails/Desert Sunset.pdf",
    tags: ["Sweet", "Visual"],
    image: cocktailSunset,
  },
  {
    id: "desert-pineapple-bullet",
    title: "Desert Pineapple Bullet",
    pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf",
    tags: ["Tropical", "Punch"],
    image: cocktailPineappleBullet,
  },
  {
    id: "desert-rose-martini",
    title: "Desert Rose Martini",
    pdf: "/pdf/cocktails/Desert Rose Martini.pdf",
    tags: ["Martini", "Elegant"],
    image: cocktailRoseMartini,
  },
  {
    id: "desert-rose-paradise",
    title: "Desert Rose Paradise",
    pdf: "/pdf/cocktails/Desert Rose Paradise.pdf",
    tags: ["Fruity", "Sweet"],
    image: cocktailRoseParadise,
  },
];

type Cocktail = (typeof cocktails)[0];

interface CocktailCardProps {
  cocktail: Cocktail;
  index: number;
  dragConstraints?: any;
  onDragEnd?: (e: any, info: PanInfo) => void;
  style?: any;
  drag?: boolean | "x" | "y";
  onDragStart?: () => void;
  onPointerUp?: () => void;
}

const CocktailCard = ({
  cocktail,
  index,
  dragConstraints,
  onDragEnd,
  style,
  drag,
  onDragStart,
  onPointerUp,
}: CocktailCardProps) => {
  const getIcon = (tags: string[]) => {
    if (tags.includes("Martini")) {
      return <Martini className="w-4 h-4 text-[#a65d3d]" />;
    }
    if (tags.includes("Spritz")) {
      return <Droplets className="w-4 h-4 text-orange-400" />;
    }
    return <Wine className="w-4 h-4 text-[#2b1810]/70" />;
  };

  return (
    <motion.div
      style={{
        ...style,
        zIndex: 100 - index,
      }}
      drag={drag}
      dragConstraints={dragConstraints}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onPointerUp={onPointerUp}
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col overflow-hidden",
        "bg-[#f0e5d1]",
        "shadow-2xl shadow-black/40",
        "cursor-grab touch-none select-none"
      )}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />

      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={cocktail.image} 
            alt={cocktail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f0e5d1]/20 to-[#f0e5d1] pointer-events-none" />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        <div className="flex gap-2 mb-4 flex-wrap">
          {cocktail.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] uppercase tracking-widest font-hud text-[#2b1810] bg-[#2b1810]/5 border border-[#2b1810]/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-lux text-[#2b1810] mb-6 leading-tight">
          {cocktail.title}
        </h2>

        <div className="flex items-center justify-between pt-4 border-t border-[#2b1810]/10">
          <div className="flex items-center gap-2 opacity-80">
            {getIcon(cocktail.tags || [])}
            <span className="text-xs font-hud uppercase tracking-widest text-[#2b1810]/60">
              Desert Rose
            </span>
          </div>

          <a
            href={cocktail.pdf}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-[#2b1810] hover:bg-[#a65d3d] text-[#f0e5d1] text-xs font-hud uppercase tracking-[0.15em] transition-all duration-300"
          >
            <span>Download</span>
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Hero Scene with Video Background
const HeroScene = ({ progress, isActive }: { progress: MotionValue<number>; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const opacity = useTransform(progress, [0, 0.8, 1], [1, 1, 0]);
  const textY = useTransform(progress, [0, 1], [0, 200]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silently handle autoplay block - no UI needed
      });
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 16) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-[#050606]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-hero"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={false}
        controls={false}
        poster="/video/poster.png"
        onTimeUpdate={handleTimeUpdate}
        data-testid="hero-video"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        data-testid="scroll-indicator"
      >
        <span className="text-xs md:text-sm font-hud tracking-widest text-white/70">SCROLL TO DISCOVER</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Product Data Interface
interface ProductData {
  id: string;
  name: string;
  year: string;
  batch: string;
  abv: string;
  description: string;
  botanicals: string[];
  bottleImage: string;
}

// Product Scene
const ProductScene = ({ data, isActive, direction }: { data: ProductData; isActive: boolean; direction: number }) => {
  const isDark = data.id === 'limited';
  
  return (
    <motion.div 
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${isDark ? 'bg-[#050606]' : 'bg-[#E8DCCA]'}`}
      initial={{ y: '100%' }}
      animate={{ y: isActive ? '0%' : direction > 0 ? '-100%' : '100%' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`scene-product-${data.id}`}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {isDark ? (
           <img src={backgroundLimited} alt="background" className="w-full h-full object-cover" />
        ) : data.id === 'classic' ? (
           <img src={backgroundClassic} alt="background" className="w-full h-full object-cover" />
        ) : (
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#dcbca0] opacity-30 skew-y-6 transform origin-bottom-left" />
        )}
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center">
        
        {/* Left Column: Info */}
        <div className="w-full md:w-1/3 order-2 md:order-1 mt-8 md:mt-0 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className={`font-hud text-xs tracking-widest mb-4 border-l-2 pl-4 ${isDark ? 'border-[#CD7E31] text-gray-400' : 'border-[#917D37] text-gray-600'}`}>
              BATCH NO. {data.batch} / {data.abv}
            </div>
            <h2 className={`text-5xl md:text-7xl font-lux mb-6 ${isDark ? 'text-[#F9F5F0]' : 'text-[#050606]'}`} data-testid={`text-product-name-${data.id}`}>
              {data.name}
            </h2>
            <p className={`text-sm md:text-base leading-relaxed mb-8 font-light ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              {data.description}
            </p>
            
            {/* Ingredients HUD */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {data.botanicals.map((b, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#CD7E31]' : 'bg-[#917D37]'}`} />
                  <span className={`font-hud text-xs uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{b}</span>
                </div>
              ))}
            </div>

            <AcquireButton 
              label="Acquire"
              data-testid={`button-acquire-${data.id}`}
            />
          </motion.div>
        </div>

        {/* Center: Bottle */}
        <div className="w-full md:w-1/3 order-1 md:order-2 h-[50vh] md:h-[70vh] flex items-center justify-center relative">
            <motion.div
              className="h-full relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8, rotate: isActive ? 0 : 5 }}
              transition={{ delay: 0.2, duration: 1, type: "spring" }}
            >
              {/* Floating Animation Wrapper */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full flex items-center justify-center"
              >
                 <img 
                   src={data.bottleImage} 
                   alt={data.name}
                   className="h-[85%] w-auto object-contain drop-shadow-2xl"
                   data-testid={`img-bottle-${data.id}`}
                 />
              </motion.div>
            </motion.div>
        </div>

        {/* Right: Abstract Details */}
        <div className="hidden md:block w-1/3 order-3 relative h-full">
           <motion.div 
             className="absolute top-1/4 right-0"
             initial={{ opacity: 0 }}
             animate={{ opacity: isActive ? 0.2 : 0 }}
             transition={{ delay: 0.8 }}
           >
             <h3 className={`text-9xl font-lux writing-vertical-rl ${isDark ? 'text-white' : 'text-black'}`}>
               {data.year}
             </h3>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Full Cocktails Scene
const FullCocktailsScene = ({ isActive, onDragStateChange }: { isActive: boolean; onDragStateChange: (isDragging: boolean) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  const [swipedCard, setSwipedCard] = useState<Cocktail | null>(null);
  const [swipeStartX, setSwipeStartX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.5, 1, 1, 1, 0.5]
  );

  const index1 = currentIndex % cocktails.length;
  const index2 = (currentIndex + 1) % cocktails.length;
  const index3 = (currentIndex + 2) % cocktails.length;

  const handleSwipe = (direction: number) => {
    const currentDragX = x.get();
    setSwipeStartX(currentDragX);
    setSwipedCard(cocktails[index1]);
    setExitX(direction * 400);

    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
    x.set(0);

    setTimeout(() => {
      setExitX(null);
      setSwipedCard(null);
      setSwipeStartX(0);
    }, 600);
  };

  const onDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe(1);
    } else if (info.offset.x < -threshold) {
      handleSwipe(-1);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-[#2b1810] overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-cocktails-full"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero */}
        <section className="flex-none pt-12 pb-6 px-6 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-[#a65d3d] font-hud tracking-[0.3em] uppercase text-[10px] mb-2">
              The Collection
            </h3>
            <h1 className="text-3xl md:text-5xl font-lux text-[#f0e5d1] mb-3 tracking-tight drop-shadow-sm">
              Bespoke{" "}
              <span className="italic font-body text-[#a65d3d]">
                Beverages
              </span>
            </h1>
            <p className="font-body text-[#f0e5d1]/70 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
              These libations offer an unforgettable escape to an oasis of
              cocktail excellence, tailored for a variety of preferences,
              from the refreshing zest of Mediterranean twists to the allure
              of desert-inspired concoctions.
            </p>
          </motion.div>
        </section>

        {/* Card Stack */}
        <section className="flex-grow flex flex-col items-center justify-center relative w-full px-4 overflow-hidden py-8">
          <div className="relative w-full max-w-md h-[550px] md:h-[600px]">
            {/* Back Card */}
            <motion.div
              key={"card-" + index3}
              className="absolute inset-0"
              initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0 }}
              animate={{
                scale: 0.9,
                y: 30,
                x: 24,
                rotate: 6,
                opacity: 0.4,
                zIndex: 10,
              }}
              transition={{ duration: 0.4 }}
            >
              <CocktailCard cocktail={cocktails[index3]} index={2} />
            </motion.div>

            {/* Middle Card */}
            <motion.div
              key={"card-" + index2}
              className="absolute inset-0"
              initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0.4 }}
              animate={{
                scale: 0.95,
                y: 15,
                x: 12,
                rotate: 3,
                opacity: 0.7,
                zIndex: 20,
              }}
              transition={{ duration: 0.4 }}
            >
              <CocktailCard cocktail={cocktails[index2]} index={1} />
            </motion.div>

            {/* Front Card */}
            <CocktailCard
              key={"card-" + index1}
              cocktail={cocktails[index1]}
              index={0}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              onDragStart={() => onDragStateChange(true)}
              onPointerUp={() => onDragStateChange(false)}
              style={{ x, rotate, opacity }}
            />

            {/* Exit animation proxy */}
            <AnimatePresence>
              {exitX !== null && swipedCard && (
                <motion.div
                  key="exit-card"
                  className="absolute inset-0 pointer-events-none"
                  initial={{
                    x: swipeStartX,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    zIndex: 110,
                  }}
                  animate={{
                    x: [swipeStartX, exitX, 0],
                    y: [0, 0, 30],
                    scale: [1, 1, 0.9],
                    rotate: [
                      (swipeStartX / 200) * 15,
                      exitX > 0 ? 20 : -20,
                      6,
                    ],
                    zIndex: [110, 110, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.4, 1],
                    ease: "easeInOut",
                  }}
                >
                  <CocktailCard cocktail={swipedCard} index={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Counter + Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-hud tracking-[0.3em] text-[#f0e5d1]/60">
                COLLECTION {String(index1 + 1).padStart(2, "0")} /{" "}
                {cocktails.length}
              </span>
              <div className="w-32 h-0.5 bg-[#f0e5d1]/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#a65d3d]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((index1 + 1) / cocktails.length) * 100}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              </div>
            </div>
          </motion.div>

          <p className="mt-6 text-[10px] font-hud text-[#f0e5d1]/30 uppercase tracking-[0.2em] animate-pulse">
            Swipe Stack to Explore
          </p>
        </section>

      </div>
    </motion.div>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  console.log('🏜️ LandingPage component mounted');
  
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 4;
  
  const smoothScroll = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  
  // Desert wind transition hook
  const { triggerTransition, isTransitioning } = useTransition();
  
  console.log('🏜️ LandingPage state - scrollPos:', scrollPos, 'isTransitioning:', isTransitioning);
  
  // Gated navigation - wraps scene change in transition
  const gatedNavigate = useCallback(
    (targetScene: number, newDirection: number) => {
      if (isTransitioning) {
        console.log("[gatedNavigate] blocked: already transitioning");
        return;
      }
      console.log("[gatedNavigate] go to", targetScene, "dir", newDirection);
      triggerTransition(() => {
        setScrollPos(targetScene);
        setDirection(newDirection);
      });
    },
    [isTransitioning, triggerTransition]
  );
  
  // Ref to track when a cocktail card is being dragged
  const cardDragActiveRef = useRef(false);
  
  const handleCardDragStateChange = (isDragging: boolean) => {
    if (isDragging) {
      cardDragActiveRef.current = true;
    } else {
      // Delay reset to ensure global touch handlers see the active state
      setTimeout(() => {
        cardDragActiveRef.current = false;
      }, 100);
    }
  };

  // Preload product bottle images on mount
  useEffect(() => {
    const preloadImages = [bottleClassic, bottleLimited];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle Wheel Event with sandstorm transition
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;
    const threshold = 50; // Minimum scroll distance to trigger scene change

    const handleWheel = (e: WheelEvent) => {
      // Prevent default only if not already transitioning
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      accumulatedDelta += e.deltaY;

      // Clear existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      // Wait for scroll to settle, then trigger transition if threshold met
      wheelTimeout = setTimeout(() => {
        const currentScene = Math.floor(scrollPos);
        
        if (Math.abs(accumulatedDelta) > threshold) {
          if (accumulatedDelta > 0 && currentScene < totalScenes - 1) {
            // Scrolling down - go to next scene
            gatedNavigate(currentScene + 1, 1);
          } else if (accumulatedDelta < 0 && currentScene > 0) {
            // Scrolling up - go to previous scene
            gatedNavigate(currentScene - 1, -1);
          }
        }
        
        accumulatedDelta = 0;
      }, 150);
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [totalScenes, scrollPos, isTransitioning, gatedNavigate]);

  // Handle Touch/Swipe Events (excludes cocktail card area using ref)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let cardWasActiveAtStart = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Check if card drag is active via ref (set by pointer events on the card container)
      cardWasActiveAtStart = cardDragActiveRef.current;
      
      if (cardWasActiveAtStart) {
        // Let the card handle this touch
        return;
      }
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // If card was active when touch started, or is currently active, skip scene navigation
      if (cardWasActiveAtStart || cardDragActiveRef.current) {
        cardWasActiveAtStart = false;
        return;
      }
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      const minHorizontalSwipeDistance = 50;
      const minVerticalSwipeDistance = 120; // Higher threshold for vertical to avoid interfering with normal scrolling
      const currentScene = Math.floor(scrollPos);
      
      // Process horizontal swipes (left/right)
      if (Math.abs(deltaX) > minHorizontalSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        console.log('[touch handler] Horizontal swipe detected, deltaX:', deltaX);
        // Swipe left (negative deltaX) = next scene, Swipe right (positive deltaX) = prev scene
        if (deltaX > 0 && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        } else if (deltaX < 0 && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        }
      }
      // Process vertical swipes (up/down) - primary navigation method for mobile
      else if (Math.abs(deltaY) > minVerticalSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
        console.log('[touch handler] Vertical swipe detected, deltaY:', deltaY);
        // Swipe up (negative deltaY) = next scene, Swipe down (positive deltaY) = prev scene
        if (deltaY < 0 && currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        } else if (deltaY > 0 && currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [totalScenes, scrollPos, gatedNavigate]);

  // Handle Keyboard Navigation with gated transition
  useEffect(() => {
    console.log('⌨️ Setting up keyboard event handler');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('⌨️ KEY PRESSED:', e.key);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        console.log('[keyboard handler] Arrow key pressed:', e.key);
        e.preventDefault();
        const currentScene = Math.floor(scrollPos);
        if (currentScene < totalScenes - 1) {
          gatedNavigate(currentScene + 1, 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        console.log('[keyboard handler] Arrow key pressed:', e.key);
        e.preventDefault();
        const currentScene = Math.floor(scrollPos);
        if (currentScene > 0) {
          gatedNavigate(currentScene - 1, -1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    console.log('⌨️ Keyboard event handler attached');
    
    return () => {
      console.log('⌨️ Removing keyboard event handler');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalScenes, scrollPos, gatedNavigate]);

  // Sync spring with state
  useEffect(() => {
    smoothScroll.set(scrollPos);
  }, [scrollPos, smoothScroll]);

  const currentSceneIndex = Math.floor(scrollPos);
  const sceneProgress = useTransform(smoothScroll, value => value % 1);


  const sceneLabels = ['ORIGIN', 'CLASSIC', 'NOIR', 'SERVE'];

  return (
    <>
      <div className="noise-overlay" />
      
      {/* Navigation / Progress Sidebar */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="relative flex items-center justify-end group cursor-pointer" 
            onClick={() => {
              console.log('[nav dots] Clicked dot', i);
              const currentScene = Math.floor(scrollPos);
              if (i !== currentScene) {
                gatedNavigate(i, i > currentScene ? 1 : -1);
              }
            }}
            data-testid={`nav-scene-${i}`}
          >
            <span className={`hidden md:inline font-hud text-[10px] mr-3 transition-all duration-300 ${currentSceneIndex === i ? 'opacity-100 text-[#CD7E31]' : 'opacity-0 -translate-x-2'}`}>
              {sceneLabels[i]}
            </span>
            <div 
              className={`w-1 transition-all duration-500 ${currentSceneIndex === i ? 'h-8 bg-[#CD7E31]' : 'h-1 bg-gray-400 opacity-30'}`} 
            />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative w-screen h-screen bg-[#050606] text-[#F5EFE6] overflow-hidden">

        {/* Scene 0: Hero */}
        <div className={`absolute inset-0 z-40 transition-opacity duration-1000 ${currentSceneIndex === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
           <HeroScene progress={sceneProgress} isActive={currentSceneIndex === 0} />
        </div>

        {/* Scene 1: Product Classic */}
        <div className={`absolute inset-0 z-30 ${currentSceneIndex === 1 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene 
            data={{
              id: 'classic',
              name: "DESERT ROSE",
              year: "2024",
              batch: "042",
              abv: "43%",
              description: "Small batch handcrafted gin, bottled and handcrafted in Switzerland. Saharan desert inspired with notes of sun-baked citrus, sage, and hidden floral sweetness.",
              botanicals: ["Wild Sage", "Saffron", "Juniper", "Rose Hip"],
              bottleImage: bottleClassic
            }} 
            isActive={currentSceneIndex === 1}
            direction={direction}
          />
        </div>

        {/* Scene 2: Product Limited */}
        <div className={`absolute inset-0 z-20 ${currentSceneIndex === 2 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene 
             data={{
              id: 'limited',
              name: "LIMITED EDITION",
              year: "LTD",
              batch: "001",
              abv: "43%",
              description: "London Dry Gin, bottled and handcrafted in Switzerland. Saharan desert inspired with Date, Darjeeling tea, Lemon & Orange for an intense, warm finish.",
              botanicals: ["Date", "Darjeeling Tea", "Lemon", "Orange"],
              bottleImage: bottleLimited
            }} 
            isActive={currentSceneIndex === 2}
            direction={direction}
          />
        </div>

        {/* Scene 3: Full Cocktails Menu */}
        <div className={`absolute inset-0 z-10 ${currentSceneIndex === 3 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <FullCocktailsScene isActive={currentSceneIndex === 3} onDragStateChange={handleCardDragStateChange} />
        </div>

        
      </main>

      {/* Persistent Logo (Top Left) */}
      <header className="fixed top-0 left-0 p-4 md:p-8 z-50">
        <img 
          src={logoImage} 
          alt="Desert Rose Gin Logo" 
          className="h-20 md:h-24 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
          data-testid="logo"
          onClick={() => {
            console.log('[logo click] Clicked logo');
            const currentScene = Math.floor(scrollPos);
            if (currentScene !== 0) {
              gatedNavigate(0, -1);
            }
          }}
        />
      </header>
      
      {/* Persistent Cart (Top Right) */}
      <div 
        className="fixed top-0 right-0 p-8 z-50 text-[#CD7E31] cursor-pointer hover:opacity-70 transition-opacity drop-shadow-lg"
        data-testid="button-cart"
      >
        <ShoppingBag className="w-6 h-6" />
      </div>
    </>
  );
}
