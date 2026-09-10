import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(5000).optional()
});

export type CreateCategoryInput =
  z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  isActive: z.boolean().optional()
});

export type UpdateCategoryInput =
  z.infer<typeof updateCategorySchema>;

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().max(5000).optional()
});

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(255).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  isActive: z.boolean().optional()
});

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;