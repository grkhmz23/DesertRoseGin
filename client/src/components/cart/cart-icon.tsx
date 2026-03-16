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
        isCocktailDetailOpen ? 'top-6 left-6 right-auto md:top-20 md:right-8 md:left-auto' : 'top-20 right-6 md:top-20 md:right-8'
      }`}
    >
      <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.2} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 w-[1.125rem] h-[1.125rem] bg-[#F5EFE6] text-[#2B1810] text-[10px] font-medium rounded-full flex items-center justify-center border-0"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
