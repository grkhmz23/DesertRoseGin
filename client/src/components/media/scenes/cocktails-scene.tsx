import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { cocktailAssets } from '@/lib/cocktails';

type Cocktail = (typeof cocktailAssets)[0];

interface FullCocktailsSceneProps {
  isActive: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

function CocktailGridCard({
  cocktail,
  isActive,
  onClick,
}: {
  cocktail: Cocktail;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden border text-left transition-all duration-300 ${
        isActive
          ? 'border-[#F5EFE6]/80 shadow-[0_0_0_1px_rgba(245,239,230,0.35)]'
          : 'border-white/10 hover:border-white/35'
      }`}
    >
      <div className="absolute inset-0">
        <img
          src={cocktail.image}
          alt={cocktail.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b120d]/95 via-[#1b120d]/30 to-transparent" />
      </div>
      <div className="relative flex aspect-[1.45/1] items-end p-3 md:p-3.5">
        <div>
          <p className="text-[11px] font-ergon uppercase tracking-[0.18em] text-white/55">
            Cocktail
          </p>
          <h3 className="mt-1 text-sm md:text-[15px] font-ergon-light leading-tight text-white">
            {cocktail.title}
          </h3>
        </div>
      </div>
    </button>
  );
}

function CocktailDetail({
  cocktail,
  onClose,
}: {
  cocktail: Cocktail;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative z-20 w-full max-w-4xl border border-white/15 bg-[#2a1c15]/96 shadow-2xl backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-white/15 bg-[#2a1c15]/90 text-white/70 transition-colors hover:text-white"
        aria-label="Close cocktail details"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="grid min-h-[32rem] grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[17rem] md:min-h-full">
          <img
            src={cocktail.image}
            alt={cocktail.title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a120d] via-[#1a120d]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#1a120d]/10 md:to-[#1a120d]/20" />
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
      </div>
    </motion.div>
  );
}

export function FullCocktailsScene({
  isActive,
  onDragStateChange,
  onScrollPositionChange,
}: FullCocktailsSceneProps) {
  const [selectedCocktailId, setSelectedCocktailId] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    onDragStateChange(false);
    onScrollPositionChange({ isAtTop: true, isAtBottom: true });
  }, [onDragStateChange, onScrollPositionChange]);

  const selectedCocktail = useMemo(
    () => cocktailAssets.find((cocktail) => cocktail.id === selectedCocktailId) ?? null,
    [selectedCocktailId],
  );

  const mobileCocktail = cocktailAssets[mobileIndex % cocktailAssets.length];

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

      <div className="relative z-10 flex h-full flex-col px-4 pb-5 pt-24 md:px-6 lg:px-8">
        <header className="mx-auto w-full max-w-7xl flex-none text-center">
          <p className="text-[10px] font-ergon uppercase tracking-[0.34em] text-white/62">
            The Collection
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-lux tracking-tight text-white">
            Bespoke <span className="font-body italic text-white/78">Beverages</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/64 font-ergon-light">
            Explore all signature serves from one fixed collection view. Open any cocktail for its dedicated recipe detail and PDF download.
          </p>
        </header>

        <div className="mx-auto mt-6 hidden h-full w-full max-w-7xl flex-1 md:block">
          <div className="relative h-full">
            <div className={`grid h-full grid-cols-4 gap-3 lg:grid-cols-5 ${selectedCocktail ? 'opacity-35 blur-[1px]' : 'opacity-100'}`}>
              {cocktailAssets.map((cocktail) => (
                <CocktailGridCard
                  key={cocktail.id}
                  cocktail={cocktail}
                  isActive={cocktail.id === selectedCocktailId}
                  onClick={() => setSelectedCocktailId(cocktail.id)}
                />
              ))}
            </div>

            <AnimatePresence>
              {selectedCocktail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#1a120d]/40 p-6"
                >
                  <CocktailDetail
                    cocktail={selectedCocktail}
                    onClose={() => setSelectedCocktailId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto mt-6 flex h-full w-full max-w-md flex-1 flex-col md:hidden">
          <div className="relative flex-1 overflow-hidden border border-white/12 bg-[#2a1c15]/70">
            <img
              src={mobileCocktail.image}
              alt={mobileCocktail.title}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a120d] via-[#1a120d]/35 to-transparent" />
            <div className="relative flex h-full flex-col justify-end gap-4 p-5">
              <p className="text-[10px] font-ergon uppercase tracking-[0.24em] text-[#CD7E31]">
                Cocktail {mobileIndex + 1} / {cocktailAssets.length}
              </p>
              <h2 className="text-3xl font-lux leading-tight text-[#F5EFE6]">
                {mobileCocktail.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#F5EFE6]/78 font-ergon-light">
                {mobileCocktail.description}
              </p>
              <a
                href={mobileCocktail.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 border border-[#F5EFE6]/30 px-5 py-3 text-xs font-ergon uppercase tracking-[0.18em] text-[#F5EFE6]"
              >
                <span>Download PDF</span>
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev - 1 + cocktailAssets.length) % cocktailAssets.length)}
              className="flex flex-1 items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 text-xs font-ergon uppercase tracking-[0.18em] text-white/75"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev + 1) % cocktailAssets.length)}
              className="flex flex-1 items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 text-xs font-ergon uppercase tracking-[0.18em] text-white/75"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
