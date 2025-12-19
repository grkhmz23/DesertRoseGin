import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
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

// Story Images (Updated from your links)
const imgCraft = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414898-64867308-544x488x551x827x6x115-section-02-image.jpg";
const imgBalance = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414899-64867436-417x460x419x462x1x0-section-04-photo.jpg";
const imgPalate = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414900-64867602-621x318-section-05-photo-01.jpg";
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

// --- SCENES ---

const HeroScene = ({ progress, isActive }: { progress: MotionValue<number>; isActive: boolean }) => {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#050606]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-hero"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        src="/video/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
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

const StoryScene = ({ isActive }: { isActive: boolean }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="absolute inset-0 bg-[#0A0806] text-[#F5EFE6] flex items-center justify-center p-4 md:p-8 lg:p-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      data-testid="scene-story"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a100a] to-[#0A0806] z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
        className="relative z-10 w-full max-w-7xl h-full grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 md:gap-6 font-ergon"
      >
        {/* Block 1: CRAFTING + SAHARAN */}
        <motion.div variants={item} className="group relative overflow-hidden rounded-sm border border-[#CD7E31]/20 bg-[#16120e] flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
             <img src={imgCraft} alt="Crafting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
             <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 text-[#CD7E31]">
              <Compass className="w-4 h-4" />
              <span className="font-hud text-[9px] tracking-[0.2em] uppercase">Our Story</span>
            </div>
            <h3 className="font-lux text-xl md:text-2xl mb-2 leading-tight text-[#F5EFE6]">CRAFTING DISTINCTION</h3>
            <p className="text-xs text-[#F5EFE6]/70 leading-relaxed font-ergon mb-4">
              The Desert Rose Gin Co. is a venture born from the vision of two brothers and friends. Committed to crafting high-quality gin, blending Swiss precision with atypical botanicals inspired by distant worlds.
            </p>
            
            <div className="w-8 h-[1px] bg-[#CD7E31]/40 mb-4" />
            
            <h4 className="font-lux text-lg text-[#F5EFE6] mb-1">SAHARAN INSPIRED</h4>
            <p className="text-xs text-[#F5EFE6]/70 leading-relaxed font-ergon">
              Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process, ensuring unparalleled quality.
            </p>
          </div>
        </motion.div>

        {/* Block 2: BALANCE & ASYMMETRY */}
        <motion.div variants={item} className="group relative overflow-hidden rounded-sm border border-[#CD7E31]/20 bg-[#16120e] flex flex-col md:flex-row-reverse">
          <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
             <img src={imgBalance} alt="Balance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
             <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2 text-right md:text-left">
             <div className="flex items-center justify-end md:justify-start gap-2 mb-3 text-[#CD7E31]">
              <Sparkles className="w-4 h-4" />
              <span className="font-hud text-[9px] tracking-[0.2em] uppercase">The Experience</span>
            </div>
            <h3 className="font-lux text-xl md:text-2xl mb-3 leading-tight text-[#F5EFE6]">BALANCE & ASYMMETRY</h3>
            <p className="text-xs md:text-sm text-[#F5EFE6]/70 leading-relaxed font-ergon mb-3">
              Like the enchanting mineral in the Saharan desert, our gin beckons you to go beyond the ordinary.
            </p>
            <p className="text-xs md:text-sm text-[#F5EFE6]/70 leading-relaxed font-ergon">
              The graceful equilibrium of balance and asymmetry, the interplay of smoothness and sharpness, and the hypnotic fusion of undulating waves and sharp edges.
            </p>
          </div>
        </motion.div>

        {/* Block 3: PALATE PRESTIGE */}
        <motion.div variants={item} className="group relative overflow-hidden rounded-sm border border-[#CD7E31]/20 bg-[#16120e] flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
             <img src={imgPalate} alt="Palate" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
             <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2">
             <div className="flex items-center gap-2 mb-3 text-[#CD7E31]">
              <Scale className="w-4 h-4" />
              <span className="font-hud text-[9px] tracking-[0.2em] uppercase">Taste</span>
            </div>
            <h3 className="font-lux text-xl md:text-2xl mb-3 leading-tight text-[#F5EFE6]">PALATE PRESTIGE</h3>
            <p className="text-xs md:text-sm text-[#F5EFE6]/70 leading-relaxed font-ergon">
              Set out on a journey of taste that invites you to indulge in a world of unparalleled flavors and inspiration.
            </p>
          </div>
        </motion.div>

        {/* Block 4: INTRIGUE & VERSATILITY */}
        <motion.div variants={item} className="group relative overflow-hidden rounded-sm border border-[#CD7E31]/20 bg-[#16120e] flex flex-col md:flex-row-reverse">
          <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
             <img src={imgIntrigue} alt="Intrigue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
             <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2 text-right md:text-left">
             <div className="flex items-center justify-end md:justify-start gap-2 mb-3 text-[#CD7E31]">
              <Utensils className="w-4 h-4" />
              <span className="font-hud text-[9px] tracking-[0.2em] uppercase">Versatility</span>
            </div>
            <h3 className="font-lux text-xl md:text-2xl mb-2 leading-tight text-[#F5EFE6]">INTRIGUE THE PALATE</h3>
            <p className="text-xs text-[#F5EFE6]/70 leading-relaxed font-ergon mb-4">
              All botanicals are enriched with the precious flavor of seafood and gourmet dishes.
            </p>
            <h4 className="font-lux text-lg text-[#F5EFE6] mb-1">REDEFINE VERSATILITY</h4>
            <p className="text-xs text-[#F5EFE6]/70 leading-relaxed font-ergon">
              From rocks to mixology, you can explore various dimensions. Our gin adapts to every desire.
            </p>
          </div>
        </motion.div>
      </motion.div>
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
            
            {isActive ? (
              <AnimatedText
                text={data.name}
                variant="fade-up"
                className={`text-5xl md:text-7xl font-lux mb-6 whitespace-nowrap ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
                staggerDelay={0.04}
                initialDelay={0.3}
                tag="h2"
              />
            ) : (
              <h2 className={`text-5xl md:text-7xl font-lux mb-6 whitespace-nowrap ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                {data.name}
              </h2>
            )}
            
            {isActive ? (
              <AnimatedParagraph
                text={data.description}
                variant="fade-up"
                className={`text-sm md:text-base leading-relaxed mb-8 font-ergon ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#4E3022]'}`}
                staggerDelay={0.05}
                initialDelay={0.6}
              />
            ) : (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-ergon ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#4E3022]'}`}>
                {data.description}
              </p>
            )}
            
            <RevealOnScroll variant="fade-up" delay={0.8}>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {data.botanicals.map((b, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[color:var(--drg-accent)]' : 'bg-[#917D37]'}`} />
                    <span className={`font-hud text-xs uppercase ${isDark ? 'text-[#F5EFE6]/70' : 'text-[#4E3022]/80'}`}>{b}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="fade-up" delay={1}>
              <div className="flex items-center gap-6">
                <AcquireButton label="Acquire" data-testid={`button-acquire-${data.id}`} />
                <a 
                  href={data.technicalSheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-2 text-xs font-hud tracking-widest uppercase transition-colors ${
                    isDark ? 'text-[#F5EFE6]/60 hover:text-[#CD7E31]' : 'text-[#2B1810]/60 hover:text-[#2B1810]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="relative">
                    Technical Sheet
                    <span className={`absolute left-0 bottom-[-4px] w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isDark ? 'bg-[#CD7E31]' : 'bg-[#2B1810]'} `}></span>
                  </span>
                </a>
              </div>
            </RevealOnScroll>
          </motion.div>
        </div>

        <div className="w-full md:w-1/3 order-1 md:order-2 h-[50vh] md:h-[70vh] flex items-center justify-center relative">
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

const FullCocktailsScene = ({ isActive, onDragStateChange }: { isActive: boolean; onDragStateChange: (isDragging: boolean) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  const [swipedCard, setSwipedCard] = useState<Cocktail | null>(null);
  const [swipeStartX, setSwipeStartX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

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
    setTimeout(() => { setExitX(null); setSwipedCard(null); setSwipeStartX(0); }, 600);
  };

  const onDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) handleSwipe(1);
    else if (info.offset.x < -threshold) handleSwipe(-1);
  };

  return (
    <motion.div className="absolute inset-0 bg-[#2b1810] overflow-y-auto flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 1 }} data-testid="scene-cocktails-full">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="relative z-10 flex flex-col">
        <section className="flex-none pt-12 pb-6 px-6 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h3 className="text-[#a65d3d] font-hud tracking-[0.3em] uppercase text-[10px] mb-2">The Collection</h3>
            
            {isActive ? (
              <div className="mb-3">
                <AnimatedText text="Bespoke " variant="fade-up" className="text-3xl md:text-5xl font-lux text-[#f0e5d1] inline tracking-tight" staggerDelay={0.04} tag="span" />
                <AnimatedText text="Beverages" variant="blur-in" className="text-3xl md:text-5xl italic font-body text-[#a65d3d] inline" staggerDelay={0.04} initialDelay={0.4} tag="span" />
              </div>
            ) : (
              <h1 className="text-3xl md:text-5xl font-lux text-[#f0e5d1] mb-3 tracking-tight">
                Bespoke <span className="italic font-body text-[#a65d3d]">Beverages</span>
              </h1>
            )}
            
            <AnimatedParagraph
              text="These libations offer an unforgettable escape to an oasis of cocktail excellence, tailored for a variety of preferences."
              variant="fade-up"
              className="font-body text-[#f0e5d1]/70 text-xs md:text-sm leading-relaxed max-w-xl mx-auto"
              staggerDelay={0.03}
              initialDelay={0.6}
            />
          </motion.div>
        </section>

        <section className="flex-none flex flex-col items-center justify-center relative w-full px-4 overflow-hidden py-8 min-h-screen">
          <div className="relative w-full max-w-md h-[550px] md:h-[600px]">
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
            <CocktailCard key={"card-" + index1} cocktail={cocktails[index1]} index={0} drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd} onDragStart={() => onDragStateChange(true)} onPointerUp={() => onDragStateChange(false)} style={{ x, rotate, opacity }} />
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
        </section>
        <Footer />
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 5; 
  
  const smoothScroll = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const { triggerTransition, isTransitioning } = useTransition();
  
  const gatedNavigate = useCallback((targetScene: number, newDirection: number) => {
    if (isTransitioning) return;
    triggerTransition(() => { setScrollPos(targetScene); setDirection(newDirection); });
  }, [isTransitioning, triggerTransition]);
  
  const cardDragActiveRef = useRef(false);
  const handleCardDragStateChange = (isDragging: boolean) => {
    if (isDragging) cardDragActiveRef.current = true;
    else setTimeout(() => { cardDragActiveRef.current = false; }, 100);
  };

  useEffect(() => {
    const preloadImages = [bottleClassic, bottleLimited];
    preloadImages.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;
    const threshold = 50;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) { e.preventDefault(); return; }
      accumulatedDelta += e.deltaY;
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        const currentScene = Math.floor(scrollPos);
        if (Math.abs(accumulatedDelta) > threshold) {
          if (accumulatedDelta > 0 && currentScene < totalScenes - 1) gatedNavigate(currentScene + 1, 1);
          else if (accumulatedDelta < 0 && currentScene > 0) gatedNavigate(currentScene - 1, -1);
        }
        accumulatedDelta = 0;
      }, 150);
    };

    window.addEventListener('wheel', handleWheel);
    return () => { window.removeEventListener('wheel', handleWheel); if (wheelTimeout) clearTimeout(wheelTimeout); };
  }, [totalScenes, scrollPos, isTransitioning, gatedNavigate]);

  useEffect(() => {
    let touchStartX = 0, touchStartY = 0;
    let cardWasActiveAtStart = false;

    const handleTouchStart = (e: TouchEvent) => {
      cardWasActiveAtStart = cardDragActiveRef.current;
      if (cardWasActiveAtStart) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cardWasActiveAtStart || cardDragActiveRef.current) { cardWasActiveAtStart = false; return; }
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minHorizontalSwipeDistance = 50;
      const minVerticalSwipeDistance = 120;
      const currentScene = Math.floor(scrollPos);
      
      if (Math.abs(deltaX) > minHorizontalSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && currentScene > 0) gatedNavigate(currentScene - 1, -1);
        else if (deltaX < 0 && currentScene < totalScenes - 1) gatedNavigate(currentScene + 1, 1);
      } else if (Math.abs(deltaY) > minVerticalSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < 0 && currentScene < totalScenes - 1) gatedNavigate(currentScene + 1, 1);
        else if (deltaY > 0 && currentScene > 0) gatedNavigate(currentScene - 1, -1);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', handleTouchStart); window.removeEventListener('touchend', handleTouchEnd); };
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
  const sceneLabels = ['ORIGIN', 'STORY', 'CLASSIC', 'NOIR', 'SERVE']; 

  const setWorld = useSetWorld();
  useEffect(() => {
    const unsub = smoothScroll.on("change", (v) => {
      let w = 0;
      if (v < 1) w = 0; // Hero
      else if (v < 2) w = 0; // Story 
      else if (v < 3) w = v - 2; // Classic 
      else w = 1; // Noir & Cocktails 
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

      <main className="relative w-screen h-screen bg-[#050606] text-[#F5EFE6] overflow-hidden">
        
        {/* SCENE 0: HERO */}
        <div className={`absolute inset-0 z-50 transition-opacity duration-1000 ${currentSceneIndex === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <HeroScene progress={sceneProgress} isActive={currentSceneIndex === 0} />
        </div>

        {/* SCENE 1: OUR STORY (NEW) */}
        <div className={`absolute inset-0 z-40 ${currentSceneIndex === 1 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <StoryScene isActive={currentSceneIndex === 1} />
        </div>

        {/* SCENE 2: CLASSIC PRODUCT */}
        <div className={`absolute inset-0 z-30 ${currentSceneIndex === 2 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene data={{ id: 'classic', name: "DESERT ROSE", year: "2024", batch: "042", abv: "43%",
            description: "Small batch handcrafted gin, bottled and handcrafted in Switzerland. Saharan desert inspired with notes of sun-baked citrus, sage, and hidden floral sweetness.",
            botanicals: ["Wild Sage", "Saffron", "Juniper", "Rose Hip"], bottleImage: bottleClassic,
            technicalSheetUrl: "/pdf/classic-sheet.pdf" }} isActive={currentSceneIndex === 2} direction={direction} />
        </div>

        {/* SCENE 3: LIMITED PRODUCT */}
        <div className={`absolute inset-0 z-20 ${currentSceneIndex === 3 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <ProductScene data={{ id: 'limited', name: "LIMITED EDITION", year: "2025", batch: "001", abv: "43%",
            description: "London Dry Gin, bottled and handcrafted in Switzerland. Saharan desert inspired with Date, Darjeeling tea, Lemon & Orange for an intense, warm finish.",
            botanicals: ["Date", "Darjeeling Tea", "Lemon", "Orange"], bottleImage: bottleLimited,
            technicalSheetUrl: "/pdf/limited-sheet.pdf" }} isActive={currentSceneIndex === 3} direction={direction} />
        </div>

        {/* SCENE 4: COCKTAILS */}
        <div className={`absolute inset-0 z-10 ${currentSceneIndex === 4 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <FullCocktailsScene isActive={currentSceneIndex === 4} onDragStateChange={handleCardDragStateChange} />
        </div>
      </main>

      <header className="fixed top-0 left-0 p-4 md:p-8 z-50">
        <img src={logoImage} alt="Desert Rose Gin Logo" className="h-20 md:h-24 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer" data-testid="logo" data-cursor="button" data-cursor-text="Home"
          onClick={() => { const currentScene = Math.floor(scrollPos); if (currentScene !== 0) gatedNavigate(0, -1); }} />
      </header>
      
      <div className="fixed top-0 right-0 p-8 z-50 text-[color:var(--drg-accent)] cursor-pointer hover:opacity-70 transition-opacity drop-shadow-lg" data-testid="button-cart" data-cursor="button" data-cursor-text="Cart">
        <ShoppingBag className="w-6 h-6" />
      </div>
    </>
  );
}
