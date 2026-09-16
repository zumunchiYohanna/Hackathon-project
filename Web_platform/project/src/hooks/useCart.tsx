import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { cartApi } from '@/api/cart';
import { useAuth } from '@/hooks/useAuth';
import { readGuestCart, transferGuestCart, writeGuestCart } from '@/utils/cart-transfer';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeServerCart(items: CartItem[] = [], fallbackItems: CartItem[] = []): CartItem[] {
  const fallbackByProductId = new Map(fallbackItems.map((item) => [item.productId, item]));

  return items.map((item) => {
    const fallback = fallbackByProductId.get(item.productId);

    return {
      id: item.id,
      productId: item.productId,
      name: item.name ?? fallback?.name ?? 'Cart item',
      price: fallback?.price ?? 0,
      imageUrl: fallback?.imageUrl ?? item.imageUrl,
      unit: fallback?.unit ?? item.unit,
      quantity: item.quantity,
    };
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(readGuestCart);

  const refreshFromServer = useCallback(async () => {
    try {
      const response = await cartApi.get();
      const serverItems = response.data?.items ?? [];
      const fallback = readGuestCart();
      const normalized = normalizeServerCart(serverItems, fallback);

      setItems(normalized);
      writeGuestCart(normalized);
    } catch {
      setItems(readGuestCart());
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setItems(readGuestCart());
      return;
    }

    let active = true;

    async function syncCart() {
      const guestItems = readGuestCart();

      if (guestItems.length > 0) {
        try {
          const merged = await transferGuestCart(guestItems);
          if (active && merged.length > 0) {
            setItems(merged);
            writeGuestCart(merged);
          }
        } catch {
          // Keep the guest cart available until the next successful sync.
        }
      }

      try {
        const response = await cartApi.get();
        const serverItems = response.data?.items ?? [];

        if (!active) return;

        const normalized = normalizeServerCart(serverItems, readGuestCart());
        setItems(normalized);
        writeGuestCart(normalized);
      } catch {
        if (active) {
          setItems(readGuestCart());
        }
      }
    }

    syncCart();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      writeGuestCart(items);
    }
  }, [items, user]);

  const addItem = useCallback(async (product: Product, quantity: number) => {
    if (user) {
      try {
        const response = await cartApi.get();
        const existingServerItem = (response.data?.items ?? []).find(
          (item) => item.productId === product.id
        );

        if (existingServerItem?.id) {
          await cartApi.updateItem(existingServerItem.id, {
            quantity: existingServerItem.quantity + quantity,
          });
        } else {
          await cartApi.addItem({
            productId: product.id,
            quantity,
          });
        }

        await refreshFromServer();
        return;
      } catch {
        // Fall back to the local guest cart if the backend call fails.
      }
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        const nextItems = prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );

        writeGuestCart(nextItems);
        return nextItems;
      }

      const nextItems = [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price ?? 0,
          imageUrl: product.imageUrl,
          unit: product.unit,
          quantity,
        },
      ];

      writeGuestCart(nextItems);
      return nextItems;
    });
  }, [refreshFromServer, user]);

  const removeItem = useCallback(async (productId: string) => {
    if (user) {
      try {
        const response = await cartApi.get();
        const serverItem = (response.data?.items ?? []).find(
          (item) => item.productId === productId
        );

        if (serverItem?.id) {
          await cartApi.removeItem(serverItem.id);
          await refreshFromServer();
          return;
        }
      } catch {
        // Fall back to the guest cart if the backend call fails.
      }
    }

    setItems((prev) => {
      const nextItems = prev.filter((i) => i.productId !== productId);
      writeGuestCart(nextItems);
      return nextItems;
    });
  }, [refreshFromServer, user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (user) {
      try {
        const response = await cartApi.get();
        const serverItem = (response.data?.items ?? []).find(
          (item) => item.productId === productId
        );

        if (serverItem?.id) {
          if (quantity <= 0) {
            await cartApi.removeItem(serverItem.id);
          } else {
            await cartApi.updateItem(serverItem.id, { quantity });
          }
          await refreshFromServer();
          return;
        }
      } catch {
        // Fall back to the guest cart if the backend call fails.
      }
    }

    if (quantity <= 0) {
      setItems((prev) => {
        const nextItems = prev.filter((i) => i.productId !== productId);
        writeGuestCart(nextItems);
        return nextItems;
      });
      return;
    }
    setItems((prev) => {
      const nextItems = prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      writeGuestCart(nextItems);
      return nextItems;
    });
  }, [refreshFromServer, user]);

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await cartApi.clear();
        await refreshFromServer();
        return;
      } catch {
        // Fall back to a local clear if the backend call fails.
      }
    }

    setItems([]);
    writeGuestCart([]);
  }, [refreshFromServer, user]);

  const getItemQuantity = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items]
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
