import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Scale, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import assets
const imgBalance = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414899-64867436-417x460x419x462x1x0-section-04-photo.jpg";
const imgIntrigue = "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414901-64888837-559x314x559x317x0x2-section-05-photo-03.png";

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

// Luxury Story Block Component
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
          <span className="font-ergon text-[9px] md:text-[10px] tracking-[0.25em] uppercase opacity-90">{subtitle}</span>
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

export function ExperienceScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
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
      setShowHint(true);
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
        setShowHint(false);
      } else if (info.offset.x < 0 && currentCard < experiences.length - 1) {
        setCurrentCard(currentCard + 1);
        setShowHint(false);
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
        <div className="absolute inset-0 bg-[url('/textures/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

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
      <div className="absolute inset-0 bg-[url('/textures/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

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
}