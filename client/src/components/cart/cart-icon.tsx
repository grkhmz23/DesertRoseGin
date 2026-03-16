import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isCocktailDetailOpen, setIsCocktailDetailOpen] = useState(false);
  const displayCount = String(totalItems).padStart(2, '0');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCocktailDetailVisibility = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen?: boolean }>;
      setIsCocktailDetailOpen(!!customEvent.detail?.isOpen);
    };

    window.addEventListener('drg:cocktail-detail-visibility', handleCocktailDetailVisibility as EventListener);

    return () => {
      window.removeEventListener('drg:cocktail-detail-visibility', handleCocktailDetailVisibility as EventListener);
    };
  }, []);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className={`fixed z-[90] flex h-10 min-w-[3.5rem] items-center justify-center gap-2 overflow-visible text-[#CD7E31]/70 hover:text-[#CD7E31] transition-all duration-300 ${
        isCocktailDetailOpen ? 'top-6 right-6 md:top-20 md:right-8' : 'top-20 right-6 md:top-20 md:right-8'
      }`}
      aria-label={totalItems > 0 ? `Open cart with ${totalItems} items` : 'Open cart'}
    >
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            className="text-[11px] font-light uppercase tracking-[0.24em] text-[#CD7E31]"
          >
            {displayCount}
          </motion.span>
        )}
      </AnimatePresence>
      <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.2} />
    </button>
  );
}
