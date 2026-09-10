import { db } from "../../db/database";
import { AppError } from "../../utils/app-error";

import {
  createInventory,
  createInventoryAdjustment,
  findBusinessProductForOwner,
  findInventoryAdjustments,
  findInventoryByBusinessProductId,
  findInventoryForBusiness,
  findInventoryById,
  updateInventory
} from "./inventory.repository";

import type {
  CreateInventoryInput,
  CreateInventoryAdjustmentInput,
  UpdateInventoryInput
} from "./inventory.schemas";

export async function getInventoryForOwner(
  ownerUserId: string
) {
  const businessId =
    await getOwnerBusinessId(ownerUserId);

  return findInventoryForBusiness(businessId);
}

export async function getInventoryItemForOwner(
  ownerUserId: string,
  inventoryId: string
) {
  const inventory =
    await findInventoryById(inventoryId);

  if (!inventory) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  const businessProduct =
    await findBusinessProductForOwner(
      inventory.businessProductId,
      ownerUserId
    );

  if (!businessProduct) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  return inventory;
}

export async function createInventoryForOwner(
  ownerUserId: string,
  input: CreateInventoryInput
) {
  const businessProduct =
    await findBusinessProductForOwner(
      input.businessProductId,
      ownerUserId
    );

  if (!businessProduct) {
    throw new AppError(
      "The requested product is not enrolled in your business catalog.",
      404,
      "BUSINESS_PRODUCT_NOT_FOUND",
      true
    );
  }

  if (!businessProduct.isAvailable) {
    throw new AppError(
      "Inventory cannot be configured for a product that is unavailable in the business catalog.",
      409,
      "BUSINESS_PRODUCT_UNAVAILABLE",
      true
    );
  }

  const existingInventory =
    await findInventoryByBusinessProductId(
      input.businessProductId
    );

  if (existingInventory) {
    throw new AppError(
      "Inventory has already been configured for this business product.",
      409,
      "INVENTORY_ALREADY_EXISTS",
      true
    );
  }

  try {
    return await createInventory(
      input.businessProductId,
      input.quantityOnHand,
      input.lowStockThreshold,
      ownerUserId
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "BUSINESS_PRODUCT_NOT_FOUND"
    ) {
      throw new AppError(
        "The requested product is not enrolled in the business catalog.",
        404,
        "BUSINESS_PRODUCT_NOT_FOUND",
        true
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_ALREADY_EXISTS"
    ) {
      throw new AppError(
        "Inventory has already been configured for this business product.",
        409,
        "INVENTORY_ALREADY_EXISTS",
        true
      );
    }

    throw error;
  }
}

export async function updateInventoryForOwner(
  ownerUserId: string,
  inventoryId: string,
  input: UpdateInventoryInput
) {
  if (
    input.quantityOnHand === undefined &&
    input.lowStockThreshold === undefined
  ) {
    throw new AppError(
      "At least one inventory field must be provided.",
      400,
      "NO_INVENTORY_FIELDS",
      true
    );
  }

  const inventory =
    await findInventoryById(inventoryId);

  if (!inventory) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  const businessProduct =
    await findBusinessProductForOwner(
      inventory.businessProductId,
      ownerUserId
    );

  if (!businessProduct) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  try {
    return await updateInventory(
      inventoryId,
      ownerUserId,
      input.quantityOnHand,
      input.lowStockThreshold
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_NOT_FOUND"
    ) {
      throw new AppError(
        "Inventory record not found.",
        404,
        "INVENTORY_NOT_FOUND",
        true
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "QUANTITY_BELOW_RESERVED"
    ) {
      throw new AppError(
        "Quantity on hand cannot be lower than the quantity already reserved.",
        409,
        "QUANTITY_BELOW_RESERVED",
        true
      );
    }

    throw error;
  }
}

export async function adjustInventoryForOwner(
  ownerUserId: string,
  inventoryId: string,
  input: CreateInventoryAdjustmentInput
) {
  const inventory =
    await findInventoryById(inventoryId);

  if (!inventory) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  const businessProduct =
    await findBusinessProductForOwner(
      inventory.businessProductId,
      ownerUserId
    );

  if (!businessProduct) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  try {
    return await createInventoryAdjustment(
      inventoryId,
      ownerUserId,
      input.quantityChange,
      input.reason
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_NOT_FOUND"
    ) {
      throw new AppError(
        "Inventory record not found.",
        404,
        "INVENTORY_NOT_FOUND",
        true
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INSUFFICIENT_STOCK"
    ) {
      throw new AppError(
        "The inventory adjustment would result in negative stock.",
        409,
        "INSUFFICIENT_STOCK",
        true
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "QUANTITY_BELOW_RESERVED"
    ) {
      throw new AppError(
        "The inventory adjustment would reduce stock below the quantity already reserved.",
        409,
        "QUANTITY_BELOW_RESERVED",
        true
      );
    }

    throw error;
  }
}

export async function getInventoryAdjustmentsForOwner(
  ownerUserId: string,
  inventoryId: string
) {
  const inventory =
    await findInventoryById(inventoryId);

  if (!inventory) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  const businessProduct =
    await findBusinessProductForOwner(
      inventory.businessProductId,
      ownerUserId
    );

  if (!businessProduct) {
    throw new AppError(
      "Inventory record not found.",
      404,
      "INVENTORY_NOT_FOUND",
      true
    );
  }

  try {
    return await findInventoryAdjustments(
      inventoryId,
      ownerUserId
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_NOT_FOUND"
    ) {
      throw new AppError(
        "Inventory record not found.",
        404,
        "INVENTORY_NOT_FOUND",
        true
      );
    }

    throw error;
  }
}

async function getOwnerBusinessId(
  ownerUserId: string
): Promise<string> {
  const result =
    await db.query<{ id: string }>(
      `
        SELECT id
        FROM public.businesses
        WHERE owner_user_id = $1
        LIMIT 1
      `,
      [ownerUserId]
    );

  if (result.rows.length === 0) {
    throw new AppError(
      "No business is associated with this account.",
      404,
      "BUSINESS_NOT_FOUND",
      true
    );
  }

  return result.rows[0].id;
}