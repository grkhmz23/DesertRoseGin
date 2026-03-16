import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isCocktailDetailOpen, setIsCocktailDetailOpen] = useState(false);

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
      className={`fixed z-[90] flex h-10 w-10 items-center justify-center overflow-hidden text-[#CD7E31]/70 hover:text-[#CD7E31] transition-all duration-300 ${
        isCocktailDetailOpen ? 'top-6 right-6 md:top-20 md:right-8' : 'top-20 right-6 md:top-20 md:right-8'
      }`}
    >
      <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.2} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 flex min-w-[1.35rem] h-[1.35rem] items-center justify-center rounded-full border border-[#F5EFE6]/20 bg-[linear-gradient(135deg,#6c4929_0%,#b9854a_48%,#e3c18a_100%)] px-1 text-[10px] font-light tracking-[0.02em] text-[#1a120c] shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
