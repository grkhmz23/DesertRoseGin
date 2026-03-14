import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';
import { motion, AnimatePresence } from 'framer-motion';

export function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed top-20 right-6 md:top-20 md:right-8 z-[90] flex h-10 w-10 items-center justify-center text-[#E8DCCA]/88 hover:text-[#E8DCCA] transition-all duration-300"
    >
      <ShoppingBag className="w-5 h-5" strokeWidth={1.2} />
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
