import { z } from "zod";

export const checkoutPreviewSchema = z.object({
  deliveryAddressLine: z.string().trim().min(3).max(255),
  deliveryCity: z.string().trim().min(2).max(100),
  deliveryState: z.string().trim().min(2).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export type CheckoutPreviewInput =
  z.infer<typeof checkoutPreviewSchema>;