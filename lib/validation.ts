import { z } from "zod";

export const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

export const webhookPayloadSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.any()),
  }),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  email: z.string().email("Invalid email address").optional(),
});
