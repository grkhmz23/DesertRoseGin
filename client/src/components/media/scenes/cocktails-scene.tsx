import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import { ArrowLeftRight, Download, Grid2x2, Layers3, X } from 'lucide-react';
import { getLocalizedCocktailAssets } from '@/lib/cocktails';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type Cocktail = ReturnType<typeof getLocalizedCocktailAssets>[number];

interface FullCocktailsSceneProps {
  isActive: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

type CocktailsLayout = 'stack' | 'grid';

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
  const { t } = useTranslation('common');
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
      <div className="relative flex h-full flex-col justify-end p-4 pb-5 sm:p-5 md:p-6">
        <p className="text-[9px] sm:text-[10px] font-ergon uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#CD7E31]/85">
          {t('ui.cocktailsScene.cardLabel')}
        </p>
        <h3 className="mt-2 max-w-[92%] text-[clamp(1.35rem,6vw,2rem)] md:text-4xl font-ergon-light leading-[1.08] text-white [overflow-wrap:anywhere]">
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
  const { t } = useTranslation('common');
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
        className="relative grid w-full max-w-3xl overflow-hidden border border-white/10 bg-[#2a1c15] shadow-2xl md:grid-cols-[1fr_1fr]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-white/10 bg-[#2a1c15]/90 text-white/70 transition-colors hover:text-white"
          aria-label={t('ui.navigation.close')}
        >
          <X className="h-4 w-4" strokeWidth={1.2} />
        </button>

        <div className="relative min-h-[16rem] md:min-h-[26rem]">
          <img
            src={cocktail.image}
            alt={cocktail.title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a120d] via-[#1a120d]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1a120d]/20" />
        </div>

        <div className="flex flex-col justify-between gap-5 p-5 md:p-6 lg:p-8 bg-[#2a1c15]">
          <div>
            <p className="text-[11px] font-ergon uppercase tracking-[0.22em] text-[#CD7E31]">
              {t('ui.cocktailsScene.detailLabel')}
            </p>
            <h2 className="mt-3 max-w-sm text-2xl md:text-3xl font-ergon-light leading-tight text-[#F5EFE6]">
              {cocktail.title}
            </h2>
            <div className="mt-5 h-px w-14 bg-[#CD7E31]/55" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F5EFE6]/78 font-ergon-light">
              {cocktail.description}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-ergon uppercase tracking-[0.18em] text-[#F5EFE6]/48">
              {t('ui.cocktailsScene.recipePrompt')}
            </p>
            <a
              href={cocktail.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#F5EFE6]/20 px-5 py-3 text-xs font-ergon uppercase tracking-[0.18em] text-[#F5EFE6] transition-all duration-300 hover:bg-white/10"
            >
              <span>{t('ui.cocktailsScene.downloadPdf')}</span>
              <Download className="h-3.5 w-3.5" strokeWidth={1.2} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CocktailGridCard({
  cocktail,
  onSelect,
}: {
  cocktail: Cocktail;
  onSelect: () => void;
}) {
  const { t } = useTranslation('common');

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-[#3a2820] text-left shadow-xl shadow-black/25 transition-transform duration-300 hover:-translate-y-1"
      aria-label={`${t('ui.cocktailsScene.cardLabel')}: ${cocktail.title}`}
    >
      <img
        src={cocktail.image}
        alt={cocktail.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#18100b] via-[#18100b]/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-3 sm:p-4">
        <p className="text-[8px] sm:text-[9px] font-ergon uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#CD7E31]/85">
          {t('ui.cocktailsScene.cardLabel')}
        </p>
        <h3 className="mt-2 text-[0.95rem] sm:text-lg font-ergon-light leading-[1.12] text-white [overflow-wrap:anywhere]">
          {cocktail.title}
        </h3>
      </div>
    </button>
  );
}

export function FullCocktailsScene({
  isActive,
  onDragStateChange,
  onScrollPositionChange,
}: FullCocktailsSceneProps) {
  const { t, i18n } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCocktailId, setSelectedCocktailId] = useState<string | null>(null);
  const [layout, setLayout] = useState<CocktailsLayout>('stack');
  const dragMovedRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-220, -140, 0, 140, 220], [0.5, 1, 1, 1, 0.5]);
  const cocktailAssets = useMemo(() => getLocalizedCocktailAssets(i18n.language), [i18n.language]);

  useEffect(() => {
    onDragStateChange(false);
    onScrollPositionChange({ isAtTop: true, isAtBottom: true });
  }, [onDragStateChange, onScrollPositionChange]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('drg:cocktail-detail-visibility', {
        detail: { isOpen: selectedCocktailId !== null },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent('drg:cocktail-detail-visibility', {
          detail: { isOpen: false },
        }),
      );
    };
  }, [selectedCocktailId]);

  useEffect(() => {
    if (layout === 'grid') {
      onDragStateChange(false);
    }
  }, [layout, onDragStateChange]);

  const activeCocktail = cocktailAssets[currentIndex % cocktailAssets.length];
  const nextCocktail = cocktailAssets[(currentIndex + 1) % cocktailAssets.length];
  const thirdCocktail = cocktailAssets[(currentIndex + 2) % cocktailAssets.length];
  const selectedCocktail = useMemo(
    () => cocktailAssets.find((cocktail) => cocktail.id === selectedCocktailId) ?? null,
    [cocktailAssets, selectedCocktailId],
  );

  const handleSwipe = useCallback((direction: number) => {
    setCurrentIndex((prev) =>
      direction > 0
        ? (prev - 1 + cocktailAssets.length) % cocktailAssets.length
        : (prev + 1) % cocktailAssets.length,
    );
    x.set(0);
  }, [cocktailAssets.length, x]);

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

      <div className="relative z-10 flex h-full min-h-0 flex-col items-center px-4 pb-4 pt-16 md:px-6 md:pb-6 md:pt-20 lg:px-8">
        <header className="mx-auto w-full max-w-3xl flex-none text-center">
          <p className="text-[10px] font-ergon uppercase tracking-[0.34em] text-white/62">
            {t('cocktails.subtitle')}
          </p>
          <h1 className="mt-2 text-2xl md:mt-3 md:text-5xl font-ergon-light tracking-tight text-white">
            {t('cocktails.title')}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-white/64 font-ergon-light sm:text-sm">
            {t('cocktails.description')}
          </p>
        </header>

        <div className="mt-3 flex w-full flex-none items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setLayout('stack')}
            className={cn(
              'inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-ergon uppercase tracking-[0.18em] transition-colors',
              layout === 'stack'
                ? 'border-[#F5EFE6]/28 bg-[#F5EFE6]/10 text-[#F5EFE6]'
                : 'border-white/10 bg-black/10 text-white/55 hover:text-white/80',
            )}
            aria-pressed={layout === 'stack'}
          >
            <Layers3 className="h-3.5 w-3.5" strokeWidth={1.4} />
            <span>Stack</span>
          </button>
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={cn(
              'inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-ergon uppercase tracking-[0.18em] transition-colors',
              layout === 'grid'
                ? 'border-[#F5EFE6]/28 bg-[#F5EFE6]/10 text-[#F5EFE6]'
                : 'border-white/10 bg-black/10 text-white/55 hover:text-white/80',
            )}
            aria-pressed={layout === 'grid'}
          >
            <Grid2x2 className="h-3.5 w-3.5" strokeWidth={1.4} />
            <span>Grid</span>
          </button>
        </div>

        <div className="relative mt-3 flex w-full min-h-0 flex-1 items-start justify-center overflow-hidden">
          {layout === 'stack' ? (
            <div className="relative flex w-full max-w-[15.5rem] flex-1 items-start justify-center sm:max-w-[17rem] md:max-w-[20rem] lg:max-w-[23rem]">
              <div className="absolute left-full top-1/2 ml-10 hidden -translate-y-1/2 md:flex lg:ml-12">
                <ArrowLeftRight className="h-8 w-8 text-white/62" strokeWidth={1.2} />
              </div>
              <div className="relative h-[min(52vh,22rem)] w-full sm:h-[min(52vh,23rem)] md:h-[min(56vh,28rem)] lg:h-[min(60vh,32rem)]">
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
          ) : (
            <div className="mx-auto h-full w-full max-w-5xl overflow-y-auto px-1 pb-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cocktailAssets.map((cocktail) => (
                  <CocktailGridCard
                    key={cocktail.id}
                    cocktail={cocktail}
                    onSelect={() => setSelectedCocktailId(cocktail.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex min-h-[1.25rem] flex-none items-center justify-center text-center">
          {layout === 'stack' ? (
            <span className="font-ergon-light text-[10px] font-light uppercase tracking-[0.22em] text-white/62">
              {t('ui.cocktailsScene.swipeHelp')}
            </span>
          ) : (
            <p className="font-ergon-light text-[10px] font-light uppercase tracking-[0.22em] text-white/62">
              Tap a card to explore
            </p>
          )}
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
