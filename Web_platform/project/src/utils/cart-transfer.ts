import { cartApi } from '@/api/cart';
import type { CartItem } from '@/types';

const GUEST_CART_KEY = 'squadlink_guest_cart';

export function readGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function writeGuestCart(items: CartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export async function transferGuestCart(items: CartItem[] = readGuestCart()): Promise<CartItem[]> {
  if (!items.length) {
    return [];
  }

  const serverCart = await cartApi.get();
  const serverItems = serverCart.data?.items ?? [];
  const serverByProductId = new Map(
    serverItems.map((item) => [item.productId, item])
  );

  for (const item of items) {
    const existing = serverByProductId.get(item.productId);

    if (existing?.id) {
      const nextQuantity = (existing.quantity ?? 0) + item.quantity;
      await cartApi.updateItem(existing.id, { quantity: nextQuantity });
      continue;
    }

    await cartApi.addItem({
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  writeGuestCart([]);

  const refreshed = await cartApi.get();
  const refreshedItems = refreshed.data?.items ?? [];

  return refreshedItems.map((item) => {
    const fallback = items.find((candidate) => candidate.productId === item.productId);

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
