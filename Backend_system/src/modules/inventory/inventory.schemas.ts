import { z } from "zod";

export const inventoryQuantitySchema = z
  .number()
  .int()
  .nonnegative();

export const createInventorySchema = z.object({
  businessProductId: z.string().uuid(),
  quantityOnHand: inventoryQuantitySchema,
  lowStockThreshold: inventoryQuantitySchema.default(0)
});

export type CreateInventoryInput =
  z.infer<typeof createInventorySchema>;

export const updateInventorySchema = z.object({
  quantityOnHand: inventoryQuantitySchema.optional(),
  lowStockThreshold: inventoryQuantitySchema.optional()
});

export type UpdateInventoryInput =
  z.infer<typeof updateInventorySchema>;

export const inventoryAdjustmentReasonSchema =
  z.enum([
    "RESTOCK",
    "DAMAGED",
    "EXPIRED",
    "LOST",
    "COUNT_CORRECTION",
    "RETURN",
    "MANUAL_ADJUSTMENT",
    "OTHER"
  ]);

export type InventoryAdjustmentReason =
  z.infer<typeof inventoryAdjustmentReasonSchema>;

export const createInventoryAdjustmentSchema =
  z.object({
    quantityChange: z.number().int().refine(
      (value) => value !== 0,
      {
        message:
          "Quantity change cannot be zero."
      }
    ),
    reason: inventoryAdjustmentReasonSchema
  });

export type CreateInventoryAdjustmentInput =
  z.infer<
    typeof createInventoryAdjustmentSchema
  >;