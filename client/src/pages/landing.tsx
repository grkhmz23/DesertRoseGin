import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, MotionValue, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, ShoppingBag, Download, Wine, Droplets, Martini } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';
import { Footer } from '@/components/layout/footer';
import { AnimatedText, AnimatedParagraph, RevealOnScroll, CountUp } from '@/components/ui/animated-text';
import { ParallaxBottle } from '@/components/ui/parallax-bottle';

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
import cocktailRoseCollins from '@assets/Desert_Rose_Collins_LR_RGB_1765314255796.jpg';
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
  dragConstraints?: any;
  onDragEnd?: (e: any, info: PanInfo) => void;
  style?: any;
  drag?: boolean | "x" | "y";
  onDragStart?: () => void;
  onPointerUp?: () => void;
}

const CocktailCard = ({ cocktail, index, dragConstraints, onDragEnd, style, drag, onDragStart, onPointerUp }: CocktailCardProps) => {
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
      onPointerUp={onPointerUp}
      whileTap={{ cursor: "grabbing" }}
      data-card
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col overflow-hidden bg-[#f0e5d1]",
        "shadow-2xl shadow-black/40 cursor-grab touch-none select-none"
      )}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
      {cocktail.image && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={cocktail.image} alt={cocktail.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f0e5d1]/20 to-[#f0e5d1] pointer-events-none" />
        </div>
      )}
      <div className="absolute top-8 left-8 z-20 flex gap-2 flex-wrap max-w-[calc(100%-4rem)]">
        {cocktail.tags?.map((tag) => (
          <span key={tag} className="px-3 py-1 text-[10px] uppercase tracking-widest font-hud text-[#2b1810] bg-[#2b1810]/5 border border-[#2b1810]/10">
            {tag}
          </span>
        ))}
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-lux text-[#2b1810] leading-tight flex-1">{cocktail.title}</h2>
            <a href={cocktail.pdf} target="_blank" rel="noopener noreferrer" onPointerDown={(e) => e.stopPropagation()}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-[#2b1810] hover:bg-[#a65d3d] text-[#f0e5d1] text-xs font-hud uppercase tracking-[0.15em] transition-all duration-300 flex-shrink-0">
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

// Hero Scene with Video Background
const HeroScene = ({ progress, isActive }: { progress: MotionValue<number>; isActive: boolean }) => {
  const videoRefMobile = useRef<HTMLVideoElement>(null);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isActive) {
      if (isMobile && videoRefMobile.current) {
        videoRefMobile.current.play().catch(() => {});
      } else if (!isMobile && videoRefDesktop.current) {
        videoRefDesktop.current.play().catch(() => {});
      }
    }
  }, [isActive, isMobile]);

  const handleMobileTimeUpdate = () => {
    if (videoRefMobile.current && videoRefMobile.current.currentTime >= videoRefMobile.current.duration - 0.5) {
      videoRefMobile.current.pause();
    }
  };

  const handleDesktopTimeUpdate = () => {
    if (videoRefDesktop.current && videoRefDesktop.current.currentTime >= videoRefDesktop.current.duration - 0.5) {
      videoRefDesktop.current.pause();
    }
  };

  const handleVideoClick = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
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
      {isMobile && (
        <video ref={videoRefMobile} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover cursor-pointer"
          autoPlay playsInline preload="auto" loop={false} controls={false} poster="/video/poster.png"
          onTimeUpdate={handleMobileTimeUpdate} onClick={() => handleVideoClick(videoRefMobile)} data-testid="hero-video">
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
      {!isMobile && (
        <video ref={videoRefDesktop} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover cursor-pointer"
          autoPlay muted playsInline preload="auto" loop={false} controls={false} poster="/video/poster.png"
          onTimeUpdate={handleDesktopTimeUpdate} onClick={() => handleVideoClick(videoRefDesktop)} data-testid="hero-video">
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
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

// Product Scene with Animated Typography
const ProductScene = ({ data, isActive, direction }: { data: ProductData; isActive: boolean; direction: number }) => {
  const isDark = data.id === 'limited';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <motion.div 
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${isDark ? 'bg-[#050606]' : 'bg-[#E8DCCA]'}`}
      initial={{ y: '100%' }}
      animate={{ y: isActive ? '0%' : direction > 0 ? '-100%' : '100%' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`scene-product-${data.id}`}
    >
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
        <div className="w-full md:w-1/3 order-2 md:order-1 mt-8 md:mt-0 relative">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className={`font-hud text-xs tracking-widest mb-4 border-l-2 pl-4 ${isDark ? 'border-[#CD7E31] text-gray-400' : 'border-[#917D37] text-gray-600'}`}>
              BATCH NO. {data.batch} / {data.abv}
            </div>
            
            {/* Animated Product Name */}
            {isActive && (
              <AnimatedText
                text={data.name}
                variant="fade-up"
                className={`text-5xl md:text-7xl font-lux mb-6 ${isDark ? 'text-[#F9F5F0]' : 'text-[#050606]'}`}
                staggerDelay={0.04}
                initialDelay={0.3}
                tag="h2"
              />
            )}
            
            {/* Animated Description */}
            {isActive && (
              <AnimatedParagraph
                text={data.description}
                variant="fade-up"
                className={`text-sm md:text-base leading-relaxed mb-8 font-light ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
                staggerDelay={0.05}
                initialDelay={0.6}
              />
            )}
            
            <RevealOnScroll variant="fade-up" delay={0.8}>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {data.botanicals.map((b, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#CD7E31]' : 'bg-[#917D37]'}`} />
                    <span className={`font-hud text-xs uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{b}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="fade-up" delay={1}>
              <AcquireButton label="Acquire" data-testid={`button-acquire-${data.id}`} />
            </RevealOnScroll>
          </motion.div>
        </div>

