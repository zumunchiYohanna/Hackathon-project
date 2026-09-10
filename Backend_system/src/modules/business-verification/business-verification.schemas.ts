import { z } from "zod";

export const businessVerificationStatusSchema =
  z.enum([
    "PENDING",
    "VERIFIED",
    "REJECTED",
    "SUSPENDED"
  ]);

export const businessIdParamsSchema = z.object({
  businessId: z.string().uuid()
});

export type BusinessVerificationStatus =
  z.infer<
    typeof businessVerificationStatusSchema
  >;

export const updateBusinessVerificationSchema =
  z.object({
    status:
      businessVerificationStatusSchema,
    notes: z
      .string()
      .trim()
      .max(255)
      .nullable()
      .optional()
  });

export type UpdateBusinessVerificationInput =
  z.infer<
    typeof updateBusinessVerificationSchema
  >;