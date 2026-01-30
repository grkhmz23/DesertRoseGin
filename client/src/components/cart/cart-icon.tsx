import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';
import { motion, AnimatePresence } from 'framer-motion';

export function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed top-20 right-6 md:top-20 md:right-8 z-[90] p-3 bg-[#2B1810]/80 backdrop-blur-sm border border-[#F5EFE6]/30 hover:border-[#F5EFE6]/60 transition-all"
    >
      <ShoppingBag className="w-5 h-5 text-[#F5EFE6]" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-[#F5EFE6] text-[#2B1810] text-xs font-bold rounded-full flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
