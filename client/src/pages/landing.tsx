import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import { ChevronDown, ShoppingBag, ArrowRight } from 'lucide-react';

import bottleClassic from '@assets/bottle-classic.png';
import bottleLimited from '@assets/bottle-limited.png';
import logoImage from '@assets/logo.png';

// Sand Particle System
const SandDisintegration = ({ trigger }: { trigger: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    }

    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 100 : 400;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#CD7E31' : '#E8DCCA',
        life: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = false;

      particles.forEach(p => {
        if (p.life > 0) {
          activeParticles = true;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (activeParticles) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    // Cleanup: Cancel animation frame on unmount or trigger change
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [trigger]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-50 pointer-events-none" />;
};

// Hero Scene with Video Background
const HeroScene = ({ progress, isActive }: { progress: MotionValue<number>; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  
  const opacity = useTransform(progress, [0, 0.8, 1], [1, 1, 0]);
  const textY = useTransform(progress, [0, 1], [0, 200]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Video autoplay failed, but no fallback UI
      });
    }
  }, [isActive]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
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
        onEnded={handleVideoEnd}
        data-testid="hero-video"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Logo Display When Video Ends */}
      {videoEnded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          data-testid="hero-logo-end"
        >
          <motion.img
            src={logoImage}
            alt="Desert Rose Gin"
            className="w-64 h-64 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            data-testid="img-logo-video-end"
          />
        </motion.div>
      )}
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

            <button 
              className={`group flex items-center gap-4 px-8 py-4 ${isDark ? 'bg-[#CD7E31] text-white' : 'bg-[#050606] text-[#F9F5F0]'} transition-all hover:scale-105`}
              data-testid={`button-acquire-${data.id}`}
            >
              <span className="font-hud uppercase tracking-widest text-sm">Acquire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
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

// Cocktails Scene
const CocktailScene = ({ isActive }: { isActive: boolean }) => {
  const cocktails = [
    { name: "The Mirage", type: "Signature", color: "bg-orange-100" },
    { name: "Dune Walker", type: "Strong", color: "bg-yellow-100" },
    { name: "Oasis Highball", type: "Refresh", color: "bg-green-100" }
  ];

  return (
    <motion.div 
      className="absolute inset-0 bg-[#F5EFE6] flex flex-col items-center justify-center"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: isActive ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
      transition={{ duration: 1.5, ease: "circInOut" }}
      data-testid="scene-cocktails"
    >
      <div className="container mx-auto px-6 z-10">
        <motion.h2 
          className="text-4xl md:text-6xl font-lux text-center mb-16 text-[#050606]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          data-testid="text-cocktails-title"
        >
          THE SERVE
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cocktails.map((c, i) => (
            <motion.div
              key={i}
              className="relative aspect-[3/4] bg-white shadow-xl overflow-hidden group cursor-pointer"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: isActive ? 0 : 100, opacity: isActive ? 1 : 0 }}
              transition={{ delay: 0.7 + (i * 0.2), duration: 0.8 }}
              data-testid={`card-cocktail-${i}`}
            >
              <div className={`absolute inset-0 ${c.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="font-hud text-[#917D37] border border-[#917D37] w-fit px-2 py-1 text-xs">
                  0{i + 1}
                </div>
                <div>
                   <h3 className="text-3xl font-lux mb-2 text-[#050606]">{c.name}</h3>
                   <span className="font-hud text-xs text-gray-500 uppercase tracking-widest">{c.type}</span>
                </div>
              </div>
              {/* Decorative gradient */}
              <div className="pointer-events-none absolute bottom-[-20%] right-[-20%] w-64 h-64 rounded-full bg-gradient-to-br from-[#CD7E31] to-transparent opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="font-hud text-gray-400 text-xs">KEEP SCROLLING TO RETURN TO THE DESERT</p>
          <div className="w-px h-12 bg-gray-300 mx-auto mt-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const [scrollPos, setScrollPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalScenes = 4;
  
  const smoothScroll = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });

  // Preload product bottle images on mount
  useEffect(() => {
    const preloadImages = [bottleClassic, bottleLimited];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle Wheel Event (Virtual Scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY * 0.001;
      
      setScrollPos(prev => {
        let next = prev + delta;
        
        // Clamp to valid range [0, totalScenes - 0.01]
        if (next < 0) next = 0;
        if (next >= totalScenes) next = totalScenes - 0.01;
        
        setDirection(delta > 0 ? 1 : -1);
        return next;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [totalScenes]);

  // Handle Touch/Swipe Events
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only process horizontal swipes with significant distance
      // Ignore if vertical swipe is larger (prevents interference with vertical scrolling)
      const minSwipeDistance = 50;
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        setScrollPos(prev => {
          // Swipe left (negative deltaX) = next scene, Swipe right (positive deltaX) = prev scene
          let next = deltaX > 0 ? prev - 1 : prev + 1;
          
          // Clamp to valid range [0, totalScenes - 0.01]
          if (next < 0) next = 0;
          if (next >= totalScenes) next = totalScenes - 0.01;
          
          setDirection(deltaX > 0 ? -1 : 1);
          return next;
        });
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [totalScenes]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setScrollPos(prev => {
          let next = prev + 1;
          // Clamp to valid range [0, totalScenes - 0.01]
          if (next >= totalScenes) next = totalScenes - 0.01;
          setDirection(1);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setScrollPos(prev => {
          let next = prev - 1;
          // Clamp to valid range [0, totalScenes - 0.01]
          if (next < 0) next = 0;
          setDirection(-1);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalScenes]);

  // Sync spring with state
  useEffect(() => {
    smoothScroll.set(scrollPos);
  }, [scrollPos, smoothScroll]);

  const currentSceneIndex = Math.floor(scrollPos);
  const sceneProgress = useTransform(smoothScroll, value => value % 1);

  // Trigger sand effect when transitioning from Hero (0) to Product (1)
  const [showSand, setShowSand] = useState(false);
  useEffect(() => {
    if (Math.floor(scrollPos) === 1 && direction > 0 && Math.abs(scrollPos - 1) < 0.1) {
      setShowSand(true);
      setTimeout(() => setShowSand(false), 2000);
    }
  }, [scrollPos, direction]);

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
            onClick={() => setScrollPos(i)}
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
        
        <SandDisintegration trigger={showSand} />

        {/* Scene 0: Hero */}
        <div className={`absolute inset-0 z-40 transition-opacity duration-1000 ${currentSceneIndex === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
           <HeroScene progress={sceneProgress} isActive={currentSceneIndex === 0} />
        </div>

        {/* Scene 1: Product Classic */}
        <div className="absolute inset-0 z-30">
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
        <div className="absolute inset-0 z-20">
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

        {/* Scene 3: Cocktails */}
        <div className="absolute inset-0 z-10">
          <CocktailScene isActive={currentSceneIndex === 3} />
        </div>
        
      </main>

      {/* Persistent Logo (Top Left) */}
      <header className="fixed top-0 left-0 p-4 md:p-8 z-50">
        <img 
          src={logoImage} 
          alt="Desert Rose Gin Logo" 
          className="h-12 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
          data-testid="logo"
          onClick={() => setScrollPos(0)}
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
