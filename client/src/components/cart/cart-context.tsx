import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '@/lib/shopify/client';
import type { ShopifyCart } from '../../../../shared/shopify-schema';

export interface CartItem {
  id: string;           // Shopify variant ID
  cartLineId?: string;  // Shopify cart line ID
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  handle?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'cartLineId'>) => Promise<void>;
  removeItem: (id: string, variant: string) => Promise<void>;
  updateQuantity: (id: string, variant: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
  checkoutUrl: string | null;
  shopifyCartId: string | null;
}

const CART_STORAGE_KEY = 'desert-rose-cart-v2';
const CART_ID_KEY = 'desert-rose-shopify-cart-id';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage and sync with Shopify on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Load saved cart ID
        const savedCartId = localStorage.getItem(CART_ID_KEY);
        
        if (savedCartId) {
          // Try to fetch existing Shopify cart
          try {
            const shopifyCart = await shopifyClient.getCart(savedCartId);
            if (shopifyCart) {
              setShopifyCartId(shopifyCart.id);
              setCheckoutUrl(shopifyCart.checkoutUrl);
              
              // Convert Shopify cart to local items
              const cartItems: CartItem[] = shopifyCart.lines.edges.map(({ node }) => ({
                id: node.merchandise.id,
                cartLineId: node.id,
                name: node.merchandise.title,
                variant: node.merchandise.title,
                price: parseFloat(node.merchandise.price.amount),
                quantity: node.quantity,
                image: node.merchandise.image?.url || '',
              }));
              
              setItems(cartItems);
              setIsInitialized(true);
              return;
            }
          } catch (error) {
            console.warn('Failed to load Shopify cart, creating new one:', error);
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        // Load from legacy local storage if no Shopify cart
        const saved = localStorage.getItem('desert-rose-cart');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const validItems = parsed.filter((item: any) => 
                item && 
                typeof item.id === 'string' && 
                typeof item.name === 'string' && 
                typeof item.variant === 'string' && 
                typeof item.price === 'number' && 
                typeof item.quantity === 'number' && 
                typeof item.image === 'string'
              );
              setItems(validItems);
              
              // Sync with Shopify if we have items
              if (validItems.length > 0) {
                await syncWithShopify(validItems);
              }
            }
          } catch (e) {
            console.error('Failed to parse legacy cart:', e);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadCart();
  }, []);

  // Sync with Shopify when items change
  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isInitialized]);

  // Create or sync cart with Shopify
  const syncWithShopify = async (cartItems: CartItem[]) => {
    if (cartItems.length === 0) {
      setShopifyCartId(null);
      setCheckoutUrl(null);
      localStorage.removeItem(CART_ID_KEY);
      return;
    }

    setIsLoading(true);
    try {
      const lines = cartItems.map(item => ({
        merchandiseId: item.id,
        quantity: item.quantity,
      }));

      const shopifyCart = await shopifyClient.createCart(lines);
      setShopifyCartId(shopifyCart.id);
      setCheckoutUrl(shopifyCart.checkoutUrl);
      localStorage.setItem(CART_ID_KEY, shopifyCart.id);

      // Update cart line IDs
      const updatedItems = cartItems.map((item, index) => ({
        ...item,
        cartLineId: shopifyCart.lines.edges[index]?.node.id,
      }));
      setItems(updatedItems);
    } catch (error) {
      console.error('Error syncing with Shopify:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity' | 'cartLineId'>) => {
    setIsLoading(true);
    try {
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id && i.variant === item.variant);
        let newItems: CartItem[];
        
        if (existing) {
          newItems = prev.map(i => 
            i.id === item.id && i.variant === item.variant
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          newItems = [...prev, { ...item, quantity: 1 }];
        }
        
        // Sync with Shopify asynchronously
        setTimeout(() => syncWithShopify(newItems), 0);
        
        return newItems;
      });
      
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string, variant: string) => {
    setIsLoading(true);
    try {
      setItems(prev => {
        const newItems = prev.filter(i => !(i.id === id && i.variant === variant));
        
        // Sync with Shopify
        setTimeout(() => syncWithShopify(newItems), 0);
        
        return newItems;
      });
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id, variant);
      return;
    }

    setIsLoading(true);
    try {
      setItems(prev => {
        const newItems = prev.map(i => 
          i.id === id && i.variant === variant ? { ...i, quantity } : i
        );
        
        // Sync with Shopify
        setTimeout(() => syncWithShopify(newItems), 0);
        
        return newItems;
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      setItems([]);
      setShopifyCartId(null);
      setCheckoutUrl(null);
      localStorage.removeItem(CART_ID_KEY);
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem('desert-rose-cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      isLoading,
      checkoutUrl,
      shopifyCartId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
