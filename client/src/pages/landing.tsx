import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, MotionValue, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from '@/components/transition-context';

import bottleClassic from '@assets/bottle-classic.png';
import bottleLimited from '@assets/bottle-limited.png';
import logoImage from '@assets/logo-transparent.png';
import { AcquireButton } from '@/components/ui/acquire-button';

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

// Main Landing Page Component
export default function LandingPage() {
  console.log('🏜️ LandingPage component mounted');
  
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 3;
  
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
        {[0, 1, 2, 3].map(i => (
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
