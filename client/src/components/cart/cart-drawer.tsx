import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from './cart-context';
import { useTranslation } from 'react-i18next';
import { trackInitiateCheckout } from '@/lib/analytics';

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartDrawer() {
  const { t } = useTranslation('common');
  const [hasConfirmedAge, setHasConfirmedAge] = useState(false);
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
    checkoutUrl,
    currencyCode,
  } = useCart();
  const shopifyStoreDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN?.trim() || '';
  const shopifyStoreUrl = import.meta.env.VITE_SHOPIFY_STORE_URL?.trim() || '';

  useEffect(() => {
    if (!isCartOpen || items.length === 0) {
      setHasConfirmedAge(false);
    }
  }, [isCartOpen, items.length]);

  const checkoutDestination = checkoutUrl || shopifyStoreUrl || '';

  const getShopifyOrigin = () => {
    if (shopifyStoreDomain) {
      return `https://${shopifyStoreDomain}`;
    }

    if (shopifyStoreUrl) {
      try {
        return new URL(shopifyStoreUrl).origin;
      } catch {
        return '';
      }
    }

    return '';
  };

  const openCustomerAccount = (mode: 'login' | 'register') => {
    if (!hasConfirmedAge) {
      return;
    }

    const origin = getShopifyOrigin();
    if (!origin) {
      alert(t('ui.cart.checkoutMissing'));
      return;
    }

    const path = mode === 'login' ? '/account/login' : '/account/register';
    const nextUrl = checkoutDestination
      ? `${origin}${path}?return_url=${encodeURIComponent(checkoutDestination)}`
      : `${origin}${path}`;

    trackInitiateCheckout({
      content_ids: items.map(i => i.id),
      content_type: 'product',
      currency: currencyCode,
      value: totalPrice,
      num_items: totalItems,
    });

    window.open(nextUrl, '_blank');
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
                        <p className="text-[#F5EFE6] mt-1">{formatCurrency(item.price, item.currencyCode || currencyCode)}</p>
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
                  <span className="text-[#F5EFE6] font-medium">{formatCurrency(totalPrice, currencyCode)}</span>
                </div>
                <p className="text-xs text-[#F5EFE6]/50 mb-4">{t('ui.cart.shippingTaxes')}</p>
                <div className="mb-4 border border-[#F5EFE6]/10 bg-[#F5EFE6]/[0.03] p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#D4A373]">
                    {t('ui.cart.reassuranceTitle')}
                  </p>
                  <div className="space-y-2.5">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4A373]" strokeWidth={1.5} />
                        <p className="text-xs leading-relaxed text-[#F5EFE6]/75">
                          {t(`ui.cart.reassurance.${index}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="mb-4 flex items-start gap-3 border border-[#D4A373]/20 bg-[#D4A373]/[0.05] p-4">
                  <input
                    type="checkbox"
                    checked={hasConfirmedAge}
                    onChange={(event) => setHasConfirmedAge(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4A373]"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A373]">
                      {t('ui.cart.ageConfirmationTitle')}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white">
                      {t('ui.cart.ageConfirmation')}
                    </p>
                  </div>
                </label>
                <div className="mb-3 border border-[#F5EFE6]/10 bg-[#F5EFE6]/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A373]">
                    {t('ui.cart.accountRequiredTitle')}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#F5EFE6]/75">
                    {t('ui.cart.accountRequiredDescription')}
                  </p>
                </div>
                {/* Direct Checkout — opens Shopify checkout URL immediately */}
                <button
                  onClick={() => {
                    if (!checkoutDestination) {
                      alert(t('ui.cart.checkoutMissing'));
                      return;
                    }
                    trackInitiateCheckout({
                      content_ids: items.map(i => i.id),
                      content_type: 'product',
                      currency: currencyCode,
                      value: totalPrice,
                      num_items: totalItems,
                    });
                    window.open(checkoutDestination, '_blank');
                  }}
                  disabled={isLoading || !hasConfirmedAge || !checkoutDestination}
                  className="w-full py-3 bg-[#F5EFE6] text-[#2B1810] font-semibold tracking-wider uppercase hover:bg-[#F5EFE6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('ui.cart.checkout')}
                </button>

                {/* Divider */}
                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#F5EFE6]/10" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5EFE6]/40">{t('ui.cart.accountRequiredTitle')}</span>
                  <div className="h-px flex-1 bg-[#F5EFE6]/10" />
                </div>

                <button
                  onClick={() => openCustomerAccount('login')}
                  disabled={isLoading || !hasConfirmedAge}
                  className="w-full py-3 border border-[#F5EFE6]/20 text-[#F5EFE6] font-semibold tracking-wider uppercase hover:border-[#F5EFE6]/40 hover:bg-[#F5EFE6]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('ui.cart.signInCheckout')}
                </button>
                <button
                  onClick={() => openCustomerAccount('register')}
                  disabled={isLoading || !hasConfirmedAge}
                  className="w-full py-3 mt-2 border border-[#F5EFE6]/20 text-[#F5EFE6] font-semibold tracking-wider uppercase hover:border-[#F5EFE6]/40 hover:bg-[#F5EFE6]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('ui.cart.createAccount')}
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
