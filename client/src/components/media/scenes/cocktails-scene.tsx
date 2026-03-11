import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { cocktailAssets } from '@/lib/cocktails';
import { cn } from '@/lib/utils';

type Cocktail = (typeof cocktailAssets)[0];

interface FullCocktailsSceneProps {
  isActive: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

function CocktailCard({
  cocktail,
  style,
  drag,
  onDragStart,
  onDragEnd,
  onPointerDown,
  onPointerUp,
}: {
  cocktail: Cocktail;
  style?: any;
  drag?: 'x' | false;
  onDragStart?: () => void;
  onDragEnd?: (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <motion.button
      type="button"
      style={style}
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      whileTap={{ cursor: drag ? 'grabbing' : 'pointer' }}
      className={cn(
        'absolute inset-0 overflow-hidden border border-white/10 bg-[#3a2820] text-left shadow-2xl shadow-black/35',
        drag ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
      )}
    >
      <img
        src={cocktail.image}
        alt={cocktail.title}
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#21160f] via-[#21160f]/30 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
        <p className="text-[10px] font-ergon uppercase tracking-[0.24em] text-[#CD7E31]/85">
          Cocktail
        </p>
        <h3 className="mt-2 text-2xl md:text-4xl font-ergon-light leading-tight text-white">
          {cocktail.title}
        </h3>
      </div>
    </motion.button>
  );
}

function CocktailDetailModal({
  cocktail,
  onClose,
}: {
  cocktail: Cocktail;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-[#140d09]/70 p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
        className="relative grid w-full max-w-4xl overflow-hidden border border-white/15 bg-[#2a1c15]/96 shadow-2xl md:grid-cols-[1.1fr_0.9fr]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-white/15 bg-[#2a1c15]/90 text-white/70 transition-colors hover:text-white"
          aria-label="Close cocktail details"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative min-h-[18rem] md:min-h-[34rem]">
          <img
            src={cocktail.image}
            alt={cocktail.title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a120d] via-[#1a120d]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1a120d]/20" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 md:p-8 lg:p-10">
          <div>
            <p className="text-[11px] font-ergon uppercase tracking-[0.22em] text-[#CD7E31]">
              Cocktail Details
            </p>
            <h2 className="mt-3 max-w-md text-3xl md:text-4xl font-lux leading-tight text-[#F5EFE6]">
              {cocktail.title}
            </h2>
            <div className="mt-5 h-px w-14 bg-[#CD7E31]/55" />
            <p className="mt-5 max-w-md text-sm md:text-base leading-relaxed text-[#F5EFE6]/78 font-ergon-light">
              {cocktail.description}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-ergon uppercase tracking-[0.18em] text-[#F5EFE6]/48">
              Download the recipe card to prepare this serve.
            </p>
            <a
              href={cocktail.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#F5EFE6]/35 px-5 py-3 text-xs font-ergon uppercase tracking-[0.18em] text-[#F5EFE6] transition-all duration-300 hover:bg-white/10"
            >
              <span>Download PDF</span>
              <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FullCocktailsScene({
  isActive,
  onDragStateChange,
  onScrollPositionChange,
}: FullCocktailsSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCocktailId, setSelectedCocktailId] = useState<string | null>(null);
  const dragMovedRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-220, -140, 0, 140, 220], [0.5, 1, 1, 1, 0.5]);

  useEffect(() => {
    onDragStateChange(false);
    onScrollPositionChange({ isAtTop: true, isAtBottom: true });
  }, [onDragStateChange, onScrollPositionChange]);

  const activeCocktail = cocktailAssets[currentIndex % cocktailAssets.length];
  const nextCocktail = cocktailAssets[(currentIndex + 1) % cocktailAssets.length];
  const thirdCocktail = cocktailAssets[(currentIndex + 2) % cocktailAssets.length];
  const selectedCocktail = useMemo(
    () => cocktailAssets.find((cocktail) => cocktail.id === selectedCocktailId) ?? null,
    [selectedCocktailId],
  );

  const handleSwipe = useCallback((direction: number) => {
    setCurrentIndex((prev) =>
      direction > 0
        ? (prev - 1 + cocktailAssets.length) % cocktailAssets.length
        : (prev + 1) % cocktailAssets.length,
    );
    x.set(0);
  }, [x]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onDragStateChange(false);
      dragMovedRef.current = Math.abs(info.offset.x) > 8;
      const threshold = 85;
      const velocityThreshold = 320;

      if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
        handleSwipe(info.offset.x > 0 ? 1 : -1);
        return;
      }

      x.set(0);
    },
    [handleSwipe, onDragStateChange, x],
  );

  const handleCardPointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleCardPointerUp = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start) return;

    const movedX = Math.abs(event.clientX - start.x);
    const movedY = Math.abs(event.clientY - start.y);
    const tapThreshold = 8;

    if (dragMovedRef.current || movedX > tapThreshold || movedY > tapThreshold) {
      dragMovedRef.current = false;
      return;
    }

    setSelectedCocktailId(activeCocktail.id);
  }, [activeCocktail.id]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#35231b] scene-locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      data-testid="scene-cocktails-full"
      data-scene-type="locked"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(205,126,49,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,239,230,0.08),_transparent_28%),linear-gradient(180deg,_#4a3228_0%,_#2a1b15_100%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center px-4 pt-24 pb-6 md:px-6 lg:px-8">
        <header className="mx-auto w-full max-w-3xl flex-none text-center">
          <p className="text-[10px] font-ergon uppercase tracking-[0.34em] text-white/62">
            The Collection
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-lux tracking-tight text-white">
            Bespoke <span className="font-body italic text-white/78">Beverages</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/64 font-ergon-light">
            Swipe through the signature cocktails, then click the front card to open its description and recipe download.
          </p>
        </header>

        <div className="relative mt-8 flex w-full max-w-[18rem] flex-1 items-center justify-center md:max-w-[22rem] lg:max-w-[26rem]">
          <div className="relative h-[27rem] w-full md:h-[33rem] lg:h-[38rem]">
            <motion.div
              key={`third-${thirdCocktail.id}`}
              className="absolute inset-0"
              initial={{ scale: 0.9, y: 28, x: 18, rotate: 6, opacity: 0 }}
              animate={{ scale: 0.9, y: 28, x: 18, rotate: 6, opacity: 0.36 }}
              transition={{ duration: 0.35 }}
            >
              <CocktailCard cocktail={thirdCocktail} />
            </motion.div>

            <motion.div
              key={`next-${nextCocktail.id}`}
              className="absolute inset-0"
              initial={{ scale: 0.94, y: 14, x: 10, rotate: 3, opacity: 0.45 }}
              animate={{ scale: 0.95, y: 14, x: 10, rotate: 3, opacity: 0.68 }}
              transition={{ duration: 0.35 }}
            >
              <CocktailCard cocktail={nextCocktail} />
            </motion.div>

            <CocktailCard
              key={`active-${activeCocktail.id}`}
              cocktail={activeCocktail}
              style={{ x, rotate, opacity, zIndex: 10 }}
              drag="x"
              onDragStart={() => {
                dragMovedRef.current = false;
                pointerStartRef.current = null;
                onDragStateChange(true);
              }}
              onDragEnd={handleDragEnd}
              onPointerDown={handleCardPointerDown}
              onPointerUp={handleCardPointerUp}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-center">
          <button
            type="button"
            onClick={() => handleSwipe(1)}
            className="border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-ergon uppercase tracking-[0.18em] text-white/72 transition-colors hover:text-white"
          >
            Previous
          </button>
          <p className="text-[10px] font-ergon uppercase tracking-[0.22em] text-white/48">
            Swipe cards or click to view details
          </p>
          <button
            type="button"
            onClick={() => handleSwipe(-1)}
            className="border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-ergon uppercase tracking-[0.18em] text-white/72 transition-colors hover:text-white"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedCocktail && (
          <CocktailDetailModal
            cocktail={selectedCocktail}
            onClose={() => setSelectedCocktailId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
