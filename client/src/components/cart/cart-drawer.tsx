import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from './cart-context';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '@/lib/analytics';

export function CartDrawer() {
  const { t } = useTranslation('common');
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity, 
    totalItems, 
    totalPrice, 
    clearCart,
    isLoading,
    checkoutUrl 
  } = useCart();

  const handleCheckout = () => {
    trackEvent('begin_checkout', {
      currency: 'CHF',
      value: totalPrice,
      items_count: totalItems,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    });

    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    } else {
      // Fallback to legacy Shopify URL
      const shopifyBaseUrl = import.meta.env.VITE_SHOPIFY_STORE_URL || '';
      if (shopifyBaseUrl) {
        window.open(shopifyBaseUrl, '_blank');
      } else {
        alert(t('ui.cart.checkoutMissing'));
      }
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[200]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md md:max-w-lg lg:max-w-md bg-[#2B1810] z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6]/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#F5EFE6]" strokeWidth={1.2} />
                <h2 className="text-xl font-lux text-[#F5EFE6]">{t('ui.cart.title')}</h2>
                <span className="text-sm text-[#F5EFE6]/60">{t('ui.cart.itemsCount', { count: totalItems })}</span>
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-[#F5EFE6]/60 animate-spin" strokeWidth={1.2} />
                )}
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-[#F5EFE6]/70 hover:text-[#F5EFE6]"
                disabled={isLoading}
              >
                <X className="w-6 h-6" strokeWidth={1.2} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-[#F5EFE6]/30 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-[#F5EFE6]/60">{t('ui.cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4 p-4 border border-[#F5EFE6]/15">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-contain bg-[#F5EFE6]/5" />
                      <div className="flex-1">
                        <h3 className="text-[#F5EFE6] font-medium">{item.name}</h3>
                        <p className="text-sm text-[#F5EFE6]/60">{item.variant}</p>
                        <p className="text-[#F5EFE6] mt-1">{item.price} CHF</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                            disabled={isLoading}
                            className="p-1 border border-[#F5EFE6]/20 hover:border-[#F5EFE6]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3 text-[#F5EFE6]" strokeWidth={1.2} />
                          </button>
                          <span className="text-[#F5EFE6] w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 border border-[#F5EFE6]/20 hover:border-[#F5EFE6]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3 text-[#F5EFE6]" strokeWidth={1.2} />
                          </button>
                          <button 
                            onClick={() => removeItem(item.id, item.variant)}
                            disabled={isLoading}
                            className="ml-auto text-[#F5EFE6]/50 hover:text-[#F5EFE6] text-xs disabled:opacity-50"
                          >
                            {t('ui.cart.remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#F5EFE6]/10">
                <div className="flex justify-between mb-4">
                  <span className="text-[#F5EFE6]/70">{t('ui.cart.subtotal')}</span>
                  <span className="text-[#F5EFE6] font-medium">{totalPrice.toFixed(2)} CHF</span>
                </div>
                <p className="text-xs text-[#F5EFE6]/50 mb-4">{t('ui.cart.shippingTaxes')}</p>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-3 bg-[#F5EFE6] text-[#2B1810] font-semibold tracking-wider uppercase hover:bg-[#F5EFE6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('ui.cart.checkout')}
                </button>
                <button
                  onClick={clearCart}
                  disabled={isLoading}
                  className="w-full py-2 mt-2 text-[#F5EFE6]/50 text-sm hover:text-[#F5EFE6] disabled:opacity-50"
                >
                  {t('ui.cart.clear')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
