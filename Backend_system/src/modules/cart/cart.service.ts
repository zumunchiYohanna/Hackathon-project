import { AppError } from "../../utils/app-error";

import {
  addCartItem,
  clearCart,
  findProductById,
  getOrCreateCart,
  removeCartItem,
  updateCartItem
} from "./cart.repository";

import type {
  AddCartItemInput,
  UpdateCartItemInput
} from "./cart.schemas";

export async function getCustomerCart(
  userId: string
) {
  return getOrCreateCart(userId);
}

export async function addItemToCustomerCart(
  userId: string,
  input: AddCartItemInput
) {
  const product = await findProductById(
    input.productId
  );

  if (!product) {
    throw new AppError(
      "Product not found.",
      404,
      "PRODUCT_NOT_FOUND",
      true
    );
  }

  if (!product.is_active) {
    throw new AppError(
      "Product is no longer available.",
      409,
      "PRODUCT_NOT_ACTIVE",
      true
    );
  }

  try {
    return await addCartItem(
      userId,
      input.productId,
      input.quantity
    );
  } catch (error) {
    handleCartError(error);
    throw error;
  }
}

export async function updateCustomerCartItem(
  userId: string,
  itemId: string,
  input: UpdateCartItemInput
) {
  try {
    return await updateCartItem(
      userId,
      itemId,
      input.quantity
    );
  } catch (error) {
    handleCartError(error);
    throw error;
  }
}

export async function removeCustomerCartItem(
  userId: string,
  itemId: string
) {
  try {
    return await removeCartItem(
      userId,
      itemId
    );
  } catch (error) {
    handleCartError(error);
    throw error;
  }
}

export async function clearCustomerCart(
  userId: string
) {
  try {
    return await clearCart(userId);
  } catch (error) {
    handleCartError(error);
    throw error;
  }
}

function handleCartError(
  error: unknown
): void {
  if (
    !(error instanceof Error)
  ) {
    return;
  }

  switch (error.message) {
    case "CART_NOT_FOUND":
      throw new AppError(
        "Cart not found.",
        404,
        "CART_NOT_FOUND",
        true
      );

    case "CART_NOT_ACTIVE":
      throw new AppError(
        "This cart is no longer active.",
        409,
        "CART_NOT_ACTIVE",
        true
      );

    case "CART_ITEM_NOT_FOUND":
      throw new AppError(
        "Cart item not found.",
        404,
        "CART_ITEM_NOT_FOUND",
        true
      );

    case "PRODUCT_NOT_FOUND":
      throw new AppError(
        "Product not found.",
        404,
        "PRODUCT_NOT_FOUND",
        true
      );

    case "PRODUCT_NOT_ACTIVE":
      throw new AppError(
        "Product is no longer available.",
        409,
        "PRODUCT_NOT_ACTIVE",
        true
      );

    default:
      return;
  }
}