import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  AnimatePresence,
} from "framer-motion";
import { Download, Wine, Droplets, Martini } from "lucide-react";
import { cn } from "@/lib/utils";
import { cocktailAssetById } from "@/lib/cocktails";

// --- Data: 19 Cocktails ---
const cocktails = [
  {
    id: "cocktail-desert-rose-gin-tonic",
    title: "Desert Rose Gin Tonic",
    description:
      "A bright, floral G&T highlighting our signature desert botanicals with a crisp finish.",
    pdf: cocktailAssetById["cocktail-desert-rose-gin-tonic"].pdf,
    tags: ["Signature", "Tonic"],
  },
  {
    id: "cocktail-mediterranean-desert-tonic",
    title: "Mediterranean Desert Tonic",
    description:
      "An herbal twist on the classic, fusing desert heat with coastal Mediterranean breezes.",
    pdf: cocktailAssetById["cocktail-mediterranean-desert-tonic"].pdf,
    tags: ["Herbal", "Refreshing"],
  },
  {
    id: "cocktail-desert-on-the-rock",
    title: "Desert On the Rock",
    description:
      "Pure and unapologetic. Ideally served over a single large ice sphere.",
    pdf: cocktailAssetById["cocktail-desert-on-the-rock"].pdf,
    tags: ["Pure", "Strong"],
  },
  {
    id: "cocktail-desert-rose-negroni",
    title: "Desert Rose Negroni",
    description:
      "A bitter-sweet symphony where rose petals meet the classic Italian aperitivo.",
    pdf: cocktailAssetById["cocktail-desert-rose-negroni"].pdf,
    tags: ["Negroni", "Bitter"],
  },
  {
    id: "chili-passion-desert",
    title: "Chili Passion Desert",
    description:
      "A fiery mix of passion fruit sweetness and a subtle kick of chili spice.",
    pdf: cocktailAssetById["chili-passion-desert"].pdf,
    tags: ["Spicy", "Exotic"],
  },
  {
    id: "desert-aviation",
    title: "Desert Aviation",
    description:
      "A violet-hued sky in a glass, featuring maraschino nuances and lemon zest.",
    pdf: cocktailAssetById["desert-aviation"].pdf,
    tags: ["Floral", "Classic"],
  },
  {
    id: "desert-tangerine-french-75",
    title: "Desert Tangerine French 75",
    description:
      "Sparkling elegance. Gin and champagne elevated by the bright citrus of tangerine.",
    pdf: cocktailAssetById["desert-tangerine-french-75"].pdf,
    tags: ["Sparkling", "Citrus"],
  },
  {
    id: "desert-orange-spritz",
    title: "Desert Orange Spritz",
    description:
      "The golden hour in liquid form. Refreshing, bubbly, and undeniably zestful.",
    pdf: cocktailAssetById["desert-orange-spritz"].pdf,
    tags: ["Spritz", "Summer"],
  },
  {
    id: "desert-rose-beer",
    title: "Desert Rose Beer",
    description:
      "An unexpected fusion of botanical gin complexity with the crispness of premium lager.",
    pdf: cocktailAssetById["desert-rose-beer"].pdf,
    tags: ["Fusion", "Highball"],
  },
  {
    id: "desert-aperitif",
    title: "Desert Aperitif",
    description:
      "The perfect starter to the evening. Light, aromatic, and palate-awakening.",
    pdf: cocktailAssetById["desert-aperitif"].pdf,
    tags: ["Aperitif", "Light"],
  },
  {
    id: "white-desert-negroni",
    title: "White Desert Negroni",
    description:
      "A clearer, gentler take on the classic. Floral notes shine through the white vermouth.",
    pdf: cocktailAssetById["white-desert-negroni"].pdf,
    tags: ["Negroni", "Modern"],
  },
  {
    id: "the-red-desert",
    title: "The Red Desert",
    description:
      "Bold and crimson. A rich berry profile balanced against dry gin notes.",
    pdf: cocktailAssetById["the-red-desert"].pdf,
    tags: ["Fruity", "Bold"],
  },
  {
    id: "spanish-rose-gin-tonic",
    title: "Spanish Rose Gin Tonic",
    description:
      "Served Copa-style with abundant garnish to enhance the aromatic bouquet.",
    pdf: cocktailAssetById["spanish-rose-gin-tonic"].pdf,
    tags: ["Tonic", "Copa"],
  },
  {
    id: "desert-spring-negroni",
    title: "Desert Spring Negroni",
    description:
      "Lighter and greener, capturing the fleeting essence of a desert bloom.",
    pdf: cocktailAssetById["desert-spring-negroni"].pdf,
    tags: ["Seasonal", "Fresh"],
  },
  {
    id: "desert-sunset",
    title: "Desert Sunset",
    description:
      "Layers of color and flavor that mimic the fading light over the sand dunes.",
    pdf: cocktailAssetById["desert-sunset"].pdf,
    tags: ["Sweet", "Visual"],
  },
  {
    id: "desert-pineapple-bullet",
    title: "Desert Pineapple Bullet",
    description:
      "Tropical heat meets desert dry. Roasted pineapple notes with a sharp finish.",
    pdf: cocktailAssetById["desert-pineapple-bullet"].pdf,
    tags: ["Tropical", "Punch"],
  },
  {
    id: "desert-rose-martini",
    title: "Desert Rose Martini",
    description:
      "Sophistication in a glass. Dry, cold, and finished with a single rose petal.",
    pdf: cocktailAssetById["desert-rose-martini"].pdf,
    tags: ["Martini", "Elegant"],
  },
  {
    id: "desert-rose-paradise",
    title: "Desert Rose Paradise",
    description:
      "A lush, fruity escape that transports you straight to the oasis.",
    pdf: cocktailAssetById["desert-rose-paradise"].pdf,
    tags: ["Fruity", "Sweet"],
  },
];

// --- Components ---

type Cocktail = (typeof cocktails)[0];

interface CocktailCardProps {
  cocktail: Cocktail;
  index: number;
  dragConstraints?: any;
  onDragEnd?: (e: any, info: PanInfo) => void;
  style?: any;
  drag?: boolean | "x" | "y";
}

/**
 * Individual Card Component
 */
const CocktailCard = ({
  cocktail,
  index,
  dragConstraints,
  onDragEnd,
  style,
  drag,
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
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0 left-0 w-full h-full origin-bottom",
        "flex flex-col overflow-hidden",
        "bg-[#f0e5d1]", // Brand Sand/Beige Background
        "shadow-2xl shadow-black/40",
        "cursor-grab touch-none select-none"
      )}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/textures/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        {/* Tags */}
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

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-lux text-[#2b1810] mb-3 leading-tight">
          {cocktail.title}
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base font-body text-[#2b1810]/70 mb-8 line-clamp-3 leading-relaxed max-w-[90%]">
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

/**
 * Main Page Component
 */
export default function CocktailsPage() {
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
    <div className="min-h-screen bg-[#2b1810] text-[#f0e5d1] overflow-hidden selection:bg-[#a65d3d]/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1810] via-[#3a2218] to-[#4a2a20]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a65d3d]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/textures/stardust.png')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero */}
        <section className="flex-none pt-24 pb-12 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-[#a65d3d] font-hud tracking-[0.3em] uppercase text-xs mb-4">
              The Collection
            </h3>
            <h1 className="text-5xl md:text-7xl font-lux text-[#f0e5d1] mb-6 tracking-tight drop-shadow-sm">
              Bespoke{" "}
              <span className="italic font-body text-[#a65d3d]">
                Beverages
              </span>
            </h1>
            <p className="font-body text-[#f0e5d1]/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
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
            animate={{ opacity: 1 }}
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

        {/* Footer CTA */}
        <section className="flex-none py-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="px-6"
          >
            <h2 className="text-2xl font-lux text-[#f0e5d1] mb-2">
              Discover your ritual with Desert Rose Gin.
            </h2>
            <a
              href="/"
              className="inline-block mt-4 text-sm font-hud text-[#a65d3d] hover:text-[#f0e5d1] border-b border-[#a65d3d]/30 hover:border-[#f0e5d1]/50 pb-0.5 transition-colors uppercase tracking-widest"
            >
              Order the Bottle
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
