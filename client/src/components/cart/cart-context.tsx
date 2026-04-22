import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { shopifyClient } from "@/lib/shopify/client";
import { toast } from "@/hooks/use-toast";
import type { ShopifyCart } from "../../../../shared/shopify-schema";
import { useTranslation } from "react-i18next";
import { useMarket } from "@/components/market/market-context";

export interface CartItem {
  id: string;
  cartLineId?: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  handle?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "cartLineId">, quantityToAdd?: number) => Promise<void>;
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
  currencyCode: string;
}

const CART_STORAGE_KEY = "desert-rose-cart-v2";
const LEGACY_CART_STORAGE_KEY = "desert-rose-cart";
const CART_ID_KEY = "desert-rose-shopify-cart-id";

const CartContext = createContext<CartContextType | undefined>(undefined);

function isShopifyVariantId(value: string | undefined): boolean {
  return typeof value === "string" && value.startsWith("gid://shopify/ProductVariant/");
}

function normalizeStoredItems(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => (
      item &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.variant === "string" &&
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      typeof item.image === "string"
    ));
  } catch {
    return [];
  }
}

function mapCartToItems(cart: ShopifyCart, previousItems: CartItem[] = []): CartItem[] {
  return cart.lines.edges.map(({ node }) => {
    const existingItem = previousItems.find((item) => item.id === node.merchandise.id);

    return {
      id: node.merchandise.id,
      cartLineId: node.id,
      name: existingItem?.name || node.merchandise.title,
      variant: existingItem?.variant || node.merchandise.title,
      price: parseFloat(node.merchandise.price.amount),
      currencyCode: node.merchandise.price.currencyCode,
      quantity: node.quantity,
      image: existingItem?.image || node.merchandise.image?.url || "",
      handle: existingItem?.handle,
    };
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  const { country, ready } = useMarket();
  const [items, setItems] = useState<CartItem[]>([]);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState("CHF");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previousItemsRef = useRef<CartItem[]>([]);

  const persistItems = (nextItems: CartItem[]) => {
    setItems(nextItems);
    previousItemsRef.current = nextItems;

    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    }
  };

  const applyShopifyCart = (cart: ShopifyCart) => {
    const nextItems = mapCartToItems(cart, previousItemsRef.current);
    setShopifyCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    setCurrencyCode(cart.cost.totalAmount.currencyCode || nextItems[0]?.currencyCode || "CHF");
    persistItems(nextItems);

    if (typeof window !== "undefined") {
      localStorage.setItem(CART_ID_KEY, cart.id);
    }
  };

  const clearPersistedCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  };

  useEffect(() => {
    const loadCart = async () => {
      if (typeof window === "undefined") return;

      setIsLoading(true);

      try {
        const savedCartId = localStorage.getItem(CART_ID_KEY);

        if (savedCartId) {
          try {
            const existingCart = await shopifyClient.getCart(savedCartId);
            if (existingCart) {
              if (ready && country) {
                const localizedCart = await shopifyClient.updateCartBuyerIdentity(savedCartId, country);
                applyShopifyCart(localizedCart);
              } else {
                applyShopifyCart(existingCart);
              }
              return;
            }
          } catch {
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        const storedItems = normalizeStoredItems(
          localStorage.getItem(CART_STORAGE_KEY) ?? localStorage.getItem(LEGACY_CART_STORAGE_KEY),
        );
        if (storedItems.length > 0) {
          persistItems(storedItems);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [country, ready]);

  const addItem = async (item: Omit<CartItem, "quantity" | "cartLineId">, quantityToAdd = 1) => {
    if (!isShopifyVariantId(item.id)) {
      toast({
        variant: "destructive",
        title: t('ui.cart.unavailableTitle'),
        description: t('ui.cart.unavailableDescription'),
      });
      return;
    }

    setIsLoading(true);

    try {
      const existingItem = previousItemsRef.current.find(
        (entry) => entry.id === item.id && entry.variant === item.variant,
      );
      const optimisticItems = previousItemsRef.current.some(
        (entry) => entry.id === item.id && entry.variant === item.variant,
      )
        ? previousItemsRef.current.map((entry) =>
            entry.id === item.id && entry.variant === item.variant
              ? { ...entry, quantity: entry.quantity + quantityToAdd, name: item.name, image: item.image, handle: item.handle }
              : entry,
          )
        : [...previousItemsRef.current, { ...item, quantity: quantityToAdd }];
      previousItemsRef.current = optimisticItems;

      if (!shopifyCartId) {
        const newCart = await shopifyClient.createCart(
          [{ merchandiseId: item.id, quantity: quantityToAdd }],
          ready ? country : undefined,
        );
        applyShopifyCart(newCart);
        setIsCartOpen(true);
        return;
      }

      if (existingItem?.cartLineId) {
        const updatedCart = await shopifyClient.updateCartLines(shopifyCartId, [
          { id: existingItem.cartLineId, quantity: existingItem.quantity + quantityToAdd },
        ]);
        applyShopifyCart(updatedCart);
      } else {
        const updatedCart = await shopifyClient.addCartLines(shopifyCartId, [
          { merchandiseId: item.id, quantity: quantityToAdd },
        ]);
        applyShopifyCart(updatedCart);
      }

      setIsCartOpen(true);
    } catch (error) {
      previousItemsRef.current = items;
      console.error("[CartContext] addItem failed:", error);
      toast({
        variant: "destructive",
        title: t('ui.cart.addErrorTitle'),
        description: error instanceof Error ? error.message : t('ui.cart.unknownShopifyError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string, variant: string) => {
    const existingItem = previousItemsRef.current.find(
      (entry) => entry.id === id && entry.variant === variant,
    );
    if (!existingItem) return;

    if (!shopifyCartId || !existingItem.cartLineId) {
      const nextItems = previousItemsRef.current.filter(
        (entry) => !(entry.id === id && entry.variant === variant),
      );
      persistItems(nextItems);
      return;
    }

    setIsLoading(true);

    try {
      const updatedCart = await shopifyClient.removeCartLines(shopifyCartId, [existingItem.cartLineId]);
      applyShopifyCart(updatedCart);
    } catch (error) {
      previousItemsRef.current = items;
      toast({
        variant: "destructive",
        title: t('ui.cart.updateErrorTitle'),
        description: error instanceof Error ? error.message : t('ui.cart.unknownShopifyError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id, variant);
      return;
    }

    const existingItem = previousItemsRef.current.find(
      (entry) => entry.id === id && entry.variant === variant,
    );
    if (!existingItem?.cartLineId || !shopifyCartId) return;

    setIsLoading(true);

    try {
      const updatedCart = await shopifyClient.updateCartLines(shopifyCartId, [
        { id: existingItem.cartLineId, quantity },
      ]);
      applyShopifyCart(updatedCart);
    } catch (error) {
      previousItemsRef.current = items;
      toast({
        variant: "destructive",
        title: t('ui.cart.quantityErrorTitle'),
        description: error instanceof Error ? error.message : t('ui.cart.unknownShopifyError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    persistItems([]);
    previousItemsRef.current = [];
    setShopifyCartId(null);
    setCheckoutUrl(null);
    clearPersistedCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
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
        currencyCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
