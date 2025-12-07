import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, MotionValue, useMotionValue, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, Download, Wine, Droplets, Martini } from 'lucide-react';
import { cn } from '@/lib/utils';

import bottleClassic from '@assets/bottle-classic.png';
import bottleLimited from '@assets/bottle-limited.png';
import logoImage from '@assets/logo.png';
import { AcquireButton } from '@/components/ui/acquire-button';

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
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        data-testid="hero-video"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Scroll Indicator - appears when video stops */}
      {videoEnded && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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

// Cocktails Data - 19 Premium Cocktails
const cocktailsData = [
  {
    id: "bespoke-beverages",
    title: "Bespoke Beverages",
    description: "The complete curated collection of all Desert Rose signature cocktails in one exclusive menu.",
    pdf: "/pdf/cocktails/bespoke-beverages.pdf",
    tags: ["Menu", "Collection"],
    highlight: true,
  },
  {
    id: "cocktail-desert-rose-gin-tonic",
    title: "Desert Rose Gin Tonic",
    description: "A bright, floral G&T highlighting our signature desert botanicals with a crisp finish.",
    pdf: "/pdf/cocktails/cocktail-desert-rose-gin-tonic.pdf",
    tags: ["Signature", "Tonic"],
  },
  {
    id: "cocktail-mediterranean-desert-tonic",
    title: "Mediterranean Desert Tonic",
    description: "An herbal twist on the classic, fusing desert heat with coastal Mediterranean breezes.",
    pdf: "/pdf/cocktails/cocktail-mediterranean-desert-tonic.pdf",
    tags: ["Herbal", "Refreshing"],
  },
  {
    id: "cocktail-desert-on-the-rock",
    title: "Desert On the Rock",
    description: "Pure and unapologetic. Ideally served over a single large ice sphere.",
    pdf: "/pdf/cocktails/cocktail-desert-on-the-rock.pdf",
    tags: ["Pure", "Strong"],
  },
  {
    id: "cocktail-desert-rose-negroni",
    title: "Desert Rose Negroni",
    description: "A bitter-sweet symphony where rose petals meet the classic Italian aperitivo.",
    pdf: "/pdf/cocktails/cocktail-desert-rose-negroni.pdf",
    tags: ["Negroni", "Bitter"],
  },
  {
    id: "chili-passion-desert",
    title: "Chili Passion Desert",
    description: "A fiery mix of passion fruit sweetness and a subtle kick of chili spice.",
    pdf: "/pdf/cocktails/chili-passion-desert.pdf",
    tags: ["Spicy", "Exotic"],
  },
  {
    id: "desert-aviation",
    title: "Desert Aviation",
    description: "A violet-hued sky in a glass, featuring maraschino nuances and lemon zest.",
    pdf: "/pdf/cocktails/desert-aviation.pdf",
    tags: ["Floral", "Classic"],
  },
  {
    id: "desert-tangerine-french-75",
    title: "Desert Tangerine French 75",
    description: "Sparkling elegance. Gin and champagne elevated by the bright citrus of tangerine.",
    pdf: "/pdf/cocktails/desert-tangerine-french-75.pdf",
    tags: ["Sparkling", "Citrus"],
  },
  {
    id: "desert-orange-spritz",
    title: "Desert Orange Spritz",
    description: "The golden hour in liquid form. Refreshing, bubbly, and undeniably zestful.",
    pdf: "/pdf/cocktails/desert-orange-spritz.pdf",
    tags: ["Spritz", "Summer"],
  },
  {
    id: "desert-rose-beer",
    title: "Desert Rose Beer",
    description: "An unexpected fusion of botanical gin complexity with the crispness of premium lager.",
    pdf: "/pdf/cocktails/desert-rose-beer.pdf",
    tags: ["Fusion", "Highball"],
  },
  {
    id: "desert-aperitif",
    title: "Desert Aperitif",
    description: "The perfect starter to the evening. Light, aromatic, and palate-awakening.",
    pdf: "/pdf/cocktails/desert-aperitif.pdf",
    tags: ["Aperitif", "Light"],
  },
  {
    id: "white-desert-negroni",
    title: "White Desert Negroni",
    description: "A clearer, gentler take on the classic. Floral notes shine through the white vermouth.",
    pdf: "/pdf/cocktails/white-desert-negroni.pdf",
    tags: ["Negroni", "Modern"],
  },
  {
    id: "the-red-desert",
    title: "The Red Desert",
    description: "Bold and crimson. A rich berry profile balanced against dry gin notes.",
    pdf: "/pdf/cocktails/the-red-desert.pdf",
    tags: ["Fruity", "Bold"],
  },
  {
    id: "spanish-rose-gin-tonic",
    title: "Spanish Rose Gin Tonic",
    description: "Served Copa-style with abundant garnish to enhance the aromatic bouquet.",
    pdf: "/pdf/cocktails/spanish-rose-gin-tonic.pdf",
    tags: ["Tonic", "Copa"],
  },
  {
    id: "desert-spring-negroni",
    title: "Desert Spring Negroni",
    description: "Lighter and greener, capturing the fleeting essence of a desert bloom.",
    pdf: "/pdf/cocktails/desert-spring-negroni.pdf",
    tags: ["Seasonal", "Fresh"],
  },
  {
    id: "desert-sunset",
    title: "Desert Sunset",
    description: "Layers of color and flavor that mimic the fading light over the sand dunes.",
    pdf: "/pdf/cocktails/desert-sunset.pdf",
    tags: ["Sweet", "Visual"],
  },
  {
    id: "desert-pineapple-bullet",
    title: "Desert Pineapple Bullet",
    description: "Tropical heat meets desert dry. Roasted pineapple notes with a sharp finish.",
    pdf: "/pdf/cocktails/desert-pineapple-bullet.pdf",
    tags: ["Tropical", "Punch"],
  },
  {
    id: "desert-rose-martini",
    title: "Desert Rose Martini",
    description: "Sophistication in a glass. Dry, cold, and finished with a single rose petal.",
    pdf: "/pdf/cocktails/desert-rose-martini.pdf",
    tags: ["Martini", "Elegant"],
  },
  {
    id: "desert-rose-paradise",
    title: "Desert Rose Paradise",
    description: "A lush, fruity escape that transports you straight to the oasis.",
    pdf: "/pdf/cocktails/desert-rose-paradise.pdf",
    tags: ["Fruity", "Sweet"],
  },
];

// Cocktail Card Component for Swipeable Stack
const CocktailCard = ({
  cocktail,
  index,
  onDragEnd,
  style,
  drag,
}: {
  cocktail: (typeof cocktailsData)[0];
  index: number;
  onDragEnd?: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  style?: object;
  drag?: boolean | "x" | "y";
}) => {
  const getIcon = (tags: string[]) => {
    if (tags.includes("Martini")) return <Martini className="w-4 h-4 text-rose-300" />;
    if (tags.includes("Spritz")) return <Droplets className="w-4 h-4 text-orange-300" />;
    return <Wine className="w-4 h-4 text-rose-200" />;
  };

  return (
    <motion.div
      style={{
        ...style,
        zIndex: 100 - index,
      }}
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col rounded-3xl overflow-hidden",
        "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl",
        "border border-white/10 shadow-2xl shadow-black/50",
        "cursor-grab touch-none select-none"
      )}
      data-testid={`card-cocktail-${cocktail.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        <div className="flex gap-2 mb-4 flex-wrap">
          {cocktail.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-rose-100 bg-rose-950/40 rounded-full border border-rose-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-lux text-white mb-3 leading-tight drop-shadow-lg">
          {cocktail.title}
        </h2>

        <p className="text-sm md:text-base text-gray-300 mb-8 line-clamp-3 leading-relaxed max-w-[90%]">
          {cocktail.description}
        </p>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 flex-wrap">
          <div className="flex items-center gap-2 opacity-60">
            {getIcon(cocktail.tags || [])}
            <span className="text-xs uppercase tracking-widest text-white">Desert Rose</span>
          </div>

          <a
            href={cocktail.pdf}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-50 text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 border border-rose-500/30 hover:border-rose-400"
            data-testid={`link-download-${cocktail.id}`}
          >
            <span>Download</span>
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Cocktails Scene with Swipeable Card Stack
const CocktailScene = ({ isActive }: { isActive: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const index1 = currentIndex % cocktailsData.length;
  const index2 = (currentIndex + 1) % cocktailsData.length;
  const index3 = (currentIndex + 2) % cocktailsData.length;

  const handleSwipe = (direction: number) => {
    setExitX(direction * 300);
    setTimeout(() => {
      setExitX(null);
      x.set(0);
      setCurrentIndex((prev) => {
        if (direction > 0) {
          return (prev + 1) % cocktailsData.length;
        } else {
          return (prev - 1 + cocktailsData.length) % cocktailsData.length;
        }
      });
    }, 200);
  };

  const handlePrev = () => {
    handleSwipe(-1);
  };

  const handleNext = () => {
    handleSwipe(1);
  };

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe(1);
    } else if (info.offset.x < -threshold) {
      handleSwipe(-1);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: isActive ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
      transition={{ duration: 1.5, ease: "circInOut" }}
      data-testid="scene-cocktails"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full h-full py-8 md:py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center px-6 mb-6 md:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h3 className="text-rose-400 font-bold tracking-[0.3em] uppercase text-xs mb-3" data-testid="text-cocktails-subtitle">
            The Collection
          </h3>
          <h2 className="text-4xl md:text-6xl font-lux text-white mb-4 tracking-tight" data-testid="text-cocktails-title">
            Bespoke <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-100">Beverages</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-light">
            An unforgettable escape to an oasis of cocktail excellence.
          </p>
        </motion.div>

        {/* Card Stack Section */}
        <motion.div 
          className="flex-grow flex flex-col items-center justify-center relative w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative flex items-center justify-center gap-4 w-full">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
              data-testid="button-cocktail-prev"
              aria-label="Previous cocktail"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-md h-[400px] md:h-[480px]">
            <AnimatePresence>
              {/* Back Card */}
              <motion.div
                key={"card-" + index3}
                className="absolute inset-0"
                initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0 }}
                animate={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0.4, zIndex: 10 }}
                transition={{ duration: 0.4 }}
              >
                <CocktailCard cocktail={cocktailsData[index3]} index={2} />
              </motion.div>

              {/* Middle Card */}
              <motion.div
                key={"card-" + index2}
                className="absolute inset-0"
                initial={{ scale: 0.9, y: 30, x: 24, rotate: 6, opacity: 0.4 }}
                animate={{ scale: 0.95, y: 15, x: 12, rotate: 3, opacity: 0.7, zIndex: 20 }}
                transition={{ duration: 0.4 }}
              >
                <CocktailCard cocktail={cocktailsData[index2]} index={1} />
              </motion.div>

              {/* Front Card - Draggable */}
              <CocktailCard
                key={"card-" + index1}
                cocktail={cocktailsData[index1]}
                index={0}
                drag="x"
                onDragEnd={onDragEnd}
                style={{ x, rotate, opacity }}
              />
            </AnimatePresence>

            {/* Exit Animation */}
            <AnimatePresence>
              {exitX !== null && (
                <motion.div
                  key="exit-card"
                  className="absolute inset-0 z-50 pointer-events-none"
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: exitX, opacity: 0, rotate: exitX > 0 ? 20 : -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CocktailCard cocktail={cocktailsData[index1]} index={0} />
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
              data-testid="button-cocktail-next"
              aria-label="Next cocktail"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <motion.div 
            className="mt-8 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] font-hud text-rose-300/80">
              COLLECTION {String(index1 + 1).padStart(2, '0')} / {cocktailsData.length}
            </span>
            <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-rose-500"
                initial={{ width: 0 }}
                animate={{ width: `${((index1 + 1) / cocktailsData.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse mt-2">
              Swipe to Explore
            </p>
          </motion.div>
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
        <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${currentSceneIndex === 3 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
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
