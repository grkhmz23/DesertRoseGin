import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { shopifyClient } from "@/lib/shopify/client";
import { toast } from "@/hooks/use-toast";
import type { ShopifyCart } from "../../../../shared/shopify-schema";
import { useTranslation } from "react-i18next";
import { STORE_CURRENCY } from "@/lib/currency";

export interface CartItem {
  id: string;
  cartLineId?: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  handle?: string;
  currencyCode?: string;
  /** False when Shopify cannot sell this line — see `isUnfulfillable`. */
  availableForSale?: boolean;
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
const DEFAULT_VARIANT_TITLE = "Default Title";

const CartContext = createContext<CartContextType | undefined>(undefined);

function isShopifyVariantId(value: string | undefined): boolean {
  return typeof value === "string" && value.startsWith("gid://shopify/ProductVariant/");
}

/**
 * Technical failure detail (HTTP status, Shopify/GraphQL messages, request ids)
 * belongs in the console for debugging only. Customers see the localized,
 * non-technical toast copy instead — never a raw error string.
 */
function logCartError(operation: string, error: unknown) {
  console.error(`[CartContext] ${operation} failed:`, error);
}

/**
 * Shopify zeroes a line's quantity instead of raising an error when it cannot
 * sell the merchandise, which otherwise looks like an empty cart for no reason.
 * Print what Shopify actually said so the cause is identifiable:
 * `availableForSale: false` with stock means the variant is not sellable in the
 * cart's market (Markets / sales-channel settings); `quantityAvailable: 0`
 * means it is simply out of stock.
 */
function logUnfulfillableLines(cart: ShopifyCart) {
  const zeroed = cart.lines.edges.filter(({ node }) => node.quantity < 1);
  if (zeroed.length === 0) return;

  console.error(
    `[CartContext] Shopify returned ${zeroed.length} cart line(s) with quantity 0 — they cannot be purchased and contribute nothing to the total:`,
    zeroed.map(({ node }) => ({
      variantId: node.merchandise.id,
      title: node.merchandise.title,
      quantity: node.quantity,
      availableForSale: node.merchandise.availableForSale,
      quantityAvailable: node.merchandise.quantityAvailable,
    })),
  );
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
      typeof item.image === "string" &&
      // Items stored back when the site quoted EUR/USD carry that currency.
      // Their price is meaningless now, so leave them behind.
      (item.currencyCode === undefined || item.currencyCode === STORE_CURRENCY)
    ));
  } catch {
    return [];
  }
}

function mapCartToItems(cart: ShopifyCart, previousItems: CartItem[] = []): CartItem[] {
  return cart.lines.edges.map(({ node }) => {
    const existingItem = previousItems.find((item) => item.id === node.merchandise.id);

    // Shopify titles a single-variant product's only variant "Default Title".
    // Showing that as both the name and the option reads as broken data, so fall
    // back to the product title and drop the placeholder option.
    const variantTitle = node.merchandise.title === DEFAULT_VARIANT_TITLE ? "" : node.merchandise.title;

    return {
      id: node.merchandise.id,
      cartLineId: node.id,
      name: existingItem?.name || node.merchandise.product?.title || node.merchandise.title,
      variant: existingItem?.variant || variantTitle,
      price: parseFloat(node.merchandise.price.amount),
      currencyCode: node.merchandise.price.currencyCode,
      quantity: node.quantity,
      availableForSale: node.merchandise.availableForSale,
      image: existingItem?.image || node.merchandise.image?.url || "",
      handle: existingItem?.handle,
    };
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  const [items, setItems] = useState<CartItem[]>([]);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
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

    // Carts are created against the Swiss market, so this should always be CHF.
    // Anything else means the Shopify market config drifted — surface it in the
    // console rather than quietly quoting a foreign amount to the customer.
    const cartCurrency = cart.cost.totalAmount.currencyCode;
    if (cartCurrency && cartCurrency !== STORE_CURRENCY) {
      console.error(
        `[CartContext] Shopify returned a ${cartCurrency} cart; expected ${STORE_CURRENCY}. Check the store's Markets settings.`,
      );
    }

    logUnfulfillableLines(cart);
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

  /**
   * Did Shopify actually take the item? A zeroed line means it refused without
   * reporting an error, so tell the customer instead of sliding open a cart
   * whose new line is worth nothing.
   */
  const wasAccepted = (cart: ShopifyCart, variantId: string): boolean => {
    const line = cart.lines.edges.find(({ node }) => node.merchandise.id === variantId);

    if (!line || line.node.quantity < 1) {
      toast({
        variant: "destructive",
        title: t('ui.cart.unavailableTitle'),
        description: t('ui.cart.unavailableDescription'),
      });
      return false;
    }

    return true;
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
              // A cart saved before the store was pinned to CHF still carries its
              // old currency. Drop it rather than render foreign amounts under a
              // CHF label — the customer re-adds into a fresh Swiss-market cart.
              if (existingCart.cost.totalAmount.currencyCode !== STORE_CURRENCY) {
                console.warn(
                  `[CartContext] Discarding a saved ${existingCart.cost.totalAmount.currencyCode} cart; the store quotes in ${STORE_CURRENCY}.`,
                );
                clearPersistedCart();
                return;
              }

              applyShopifyCart(existingCart);
              return;
            }
          } catch (error) {
            // Stale/expired cart id: recover silently for the customer, but keep
            // the reason in the console so real outages are still diagnosable.
            logCartError("loadCart", error);
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
  }, []);

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
        const newCart = await shopifyClient.createCart([
          { merchandiseId: item.id, quantity: quantityToAdd },
        ]);
        applyShopifyCart(newCart);
        if (!wasAccepted(newCart, item.id)) return;
        setIsCartOpen(true);
        return;
      }

      if (existingItem?.cartLineId) {
        const updatedCart = await shopifyClient.updateCartLines(shopifyCartId, [
          { id: existingItem.cartLineId, quantity: existingItem.quantity + quantityToAdd },
        ]);
        applyShopifyCart(updatedCart);
        if (!wasAccepted(updatedCart, item.id)) return;
      } else {
        const updatedCart = await shopifyClient.addCartLines(shopifyCartId, [
          { merchandiseId: item.id, quantity: quantityToAdd },
        ]);
        applyShopifyCart(updatedCart);
        if (!wasAccepted(updatedCart, item.id)) return;
      }

      setIsCartOpen(true);
    } catch (error) {
      previousItemsRef.current = items;
      logCartError("addItem", error);
      toast({
        variant: "destructive",
        title: t('ui.cart.addErrorTitle'),
        description: t('ui.cart.addErrorDescription'),
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
      logCartError("removeItem", error);
      toast({
        variant: "destructive",
        title: t('ui.cart.updateErrorTitle'),
        description: t('ui.cart.updateErrorDescription'),
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
      logCartError("updateQuantity", error);
      toast({
        variant: "destructive",
        title: t('ui.cart.quantityErrorTitle'),
        description: t('ui.cart.quantityErrorDescription'),
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
        currencyCode: STORE_CURRENCY,
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
