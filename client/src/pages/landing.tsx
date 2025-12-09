import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, MotionValue, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, ShoppingBag, Download, Wine, Droplets, Martini } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';

import bottleClassic from '@assets/bottle-classic.png';
import bottleLimited from '@assets/bottle-limited.png';
import logoImage from '@assets/logo-transparent.png';
import { AcquireButton } from '@/components/ui/acquire-button';

// Cocktails Data
const cocktails = [
  {
    id: "bespoke-beverages",
    title: "Bespoke Beverages",
    description:
      "The complete curated collection of all Desert Rose signature cocktails in one exclusive menu.",
    pdf: "/pdf/cocktails/bespoke-beverages.pdf",
    tags: ["Menu", "Collection"],
    highlight: true,
  },
  {
    id: "cocktail-desert-rose-gin-tonic",
    title: "Desert Rose Gin Tonic",
    description:
      "A bright, floral G&T highlighting our signature desert botanicals with a crisp finish.",
    pdf: "/pdf/cocktails/cocktail-desert-rose-gin-tonic.pdf",
    tags: ["Signature", "Tonic"],
  },
  {
    id: "cocktail-mediterranean-desert-tonic",
    title: "Mediterranean Desert Tonic",
    description:
      "An herbal twist on the classic, fusing desert heat with coastal Mediterranean breezes.",
    pdf: "/pdf/cocktails/cocktail-mediterranean-desert-tonic.pdf",
    tags: ["Herbal", "Refreshing"],
  },
  {
    id: "cocktail-desert-on-the-rock",
    title: "Desert On the Rock",
    description:
      "Pure and unapologetic. Ideally served over a single large ice sphere.",
    pdf: "/pdf/cocktails/cocktail-desert-on-the-rock.pdf",
    tags: ["Pure", "Strong"],
  },
  {
    id: "cocktail-desert-rose-negroni",
    title: "Desert Rose Negroni",
    description:
      "A bitter-sweet symphony where rose petals meet the classic Italian aperitivo.",
    pdf: "/pdf/cocktails/cocktail-desert-rose-negroni.pdf",
    tags: ["Negroni", "Bitter"],
  },
  {
    id: "chili-passion-desert",
    title: "Chili Passion Desert",
    description:
      "A fiery mix of passion fruit sweetness and a subtle kick of chili spice.",
    pdf: "/pdf/cocktails/chili-passion-desert.pdf",
    tags: ["Spicy", "Exotic"],
  },
  {
    id: "desert-aviation",
    title: "Desert Aviation",
    description:
      "A violet-hued sky in a glass, featuring maraschino nuances and lemon zest.",
    pdf: "/pdf/cocktails/desert-aviation.pdf",
    tags: ["Floral", "Classic"],
  },
  {
    id: "desert-tangerine-french-75",
    title: "Desert Tangerine French 75",
    description:
      "Sparkling elegance. Gin and champagne elevated by the bright citrus of tangerine.",
    pdf: "/pdf/cocktails/desert-tangerine-french-75.pdf",
    tags: ["Sparkling", "Citrus"],
  },
  {
    id: "desert-orange-spritz",
    title: "Desert Orange Spritz",
    description:
      "The golden hour in liquid form. Refreshing, bubbly, and undeniably zestful.",
    pdf: "/pdf/cocktails/desert-orange-spritz.pdf",
    tags: ["Spritz", "Summer"],
  },
  {
    id: "desert-rose-beer",
    title: "Desert Rose Beer",
    description:
      "An unexpected fusion of botanical gin complexity with the crispness of premium lager.",
    pdf: "/pdf/cocktails/desert-rose-beer.pdf",
    tags: ["Fusion", "Highball"],
  },
  {
    id: "desert-aperitif",
    title: "Desert Aperitif",
    description:
      "The perfect starter to the evening. Light, aromatic, and palate-awakening.",
    pdf: "/pdf/cocktails/desert-aperitif.pdf",
    tags: ["Aperitif", "Light"],
  },
  {
    id: "white-desert-negroni",
    title: "White Desert Negroni",
    description:
      "A clearer, gentler take on the classic. Floral notes shine through the white vermouth.",
    pdf: "/pdf/cocktails/white-desert-negroni.pdf",
    tags: ["Negroni", "Modern"],
  },
  {
    id: "the-red-desert",
    title: "The Red Desert",
    description:
      "Bold and crimson. A rich berry profile balanced against dry gin notes.",
    pdf: "/pdf/cocktails/the-red-desert.pdf",
    tags: ["Fruity", "Bold"],
  },
  {
    id: "spanish-rose-gin-tonic",
    title: "Spanish Rose Gin Tonic",
    description:
      "Served Copa-style with abundant garnish to enhance the aromatic bouquet.",
    pdf: "/pdf/cocktails/spanish-rose-gin-tonic.pdf",
    tags: ["Tonic", "Copa"],
  },
  {
    id: "desert-spring-negroni",
    title: "Desert Spring Negroni",
    description:
      "Lighter and greener, capturing the fleeting essence of a desert bloom.",
    pdf: "/pdf/cocktails/desert-spring-negroni.pdf",
    tags: ["Seasonal", "Fresh"],
  },
  {
    id: "desert-sunset",
    title: "Desert Sunset",
    description:
      "Layers of color and flavor that mimic the fading light over the sand dunes.",
    pdf: "/pdf/cocktails/desert-sunset.pdf",
    tags: ["Sweet", "Visual"],
  },
  {
    id: "desert-pineapple-bullet",
    title: "Desert Pineapple Bullet",
    description:
      "Tropical heat meets desert dry. Roasted pineapple notes with a sharp finish.",
    pdf: "/pdf/cocktails/desert-pineapple-bullet.pdf",
    tags: ["Tropical", "Punch"],
  },
  {
    id: "desert-rose-martini",
    title: "Desert Rose Martini",
    description:
      "Sophistication in a glass. Dry, cold, and finished with a single rose petal.",
    pdf: "/pdf/cocktails/desert-rose-martini.pdf",
    tags: ["Martini", "Elegant"],
  },
  {
    id: "desert-rose-paradise",
    title: "Desert Rose Paradise",
    description:
      "A lush, fruity escape that transports you straight to the oasis.",
    pdf: "/pdf/cocktails/desert-rose-paradise.pdf",
    tags: ["Fruity", "Sweet"],
  },
];

type Cocktail = (typeof cocktails)[0];

// Cocktail Card Component
const CocktailCard = ({ cocktail }: { cocktail: Cocktail }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col overflow-hidden",
        "bg-[#f0e5d1] rounded-lg",
        "shadow-lg shadow-black/20",
        "hover-elevate"
      )}
      data-testid={`card-cocktail-${cocktail.id}`}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none rounded-lg" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 gap-4">
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {cocktail.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[9px] uppercase tracking-widest font-hud text-[#2b1810] bg-[#2b1810]/5 border border-[#2b1810]/10 rounded"
              data-testid={`badge-tag-${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-lux text-[#2b1810]">
          {cocktail.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-body text-[#2b1810]/70 line-clamp-2 flex-grow">
          {cocktail.description}
        </p>

        {/* Action Bar */}
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
            className="group relative inline-flex items-center gap-1 px-4 py-2 bg-[#2b1810] hover:bg-[#a65d3d] text-[#f0e5d1] text-xs font-hud uppercase tracking-[0.1em] transition-all duration-300 rounded"
            data-testid={`button-download-${cocktail.id}`}
          >
            <span>Download</span>
            <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
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
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#050606] opacity-90" />
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

// Cocktails Grid Scene
const CocktailsGridScene = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#2b1810] flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
      data-testid="scene-cocktails-grid"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="flex-none pt-12 pb-8 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h3 className="text-[#a65d3d] font-hud tracking-[0.3em] uppercase text-xs mb-4">
              The Collection
            </h3>
            <h2 className="text-4xl md:text-5xl font-lux text-[#f0e5d1] mb-4 tracking-tight">
              Bespoke <span className="italic font-body text-[#a65d3d]">Beverages</span>
            </h2>
            <p className="font-body text-[#f0e5d1]/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Explore our curated collection of 19 signature cocktails, each crafted to capture the essence of the desert rose.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="flex-grow px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {cocktails.map((cocktail) => (
              <CocktailCard key={cocktail.id} cocktail={cocktail} />
            ))}
          </div>
        </div>
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


  const sceneLabels = ['ORIGIN', 'CLASSIC', 'NOIR', 'COCKTAILS'];

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

        {/* Scene 3: Cocktails Grid */}
        <div className={`absolute inset-0 z-10 ${currentSceneIndex === 3 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <CocktailsGridScene isActive={currentSceneIndex === 3} />
        </div>

        
      </main>

      {/* Persistent Logo (Top Left) */}
      <header className="fixed top-0 left-0 p-4 md:p-8 z-50">
        <img 
          src={logoImage} 
          alt="Desert Rose Gin Logo" 
          className="h-12 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
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
