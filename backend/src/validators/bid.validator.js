import { z } from "zod";

export const placeBidSchema = z.object({
  order_id: z.coerce.number().int().positive(),
  bid_amount: z.coerce
    .number()
    .positive("A bid must be greater than zero")
    .max(99_999_999.99, "Bid is too large"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const orderIdParamSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const bidListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["pending", "ongoing", "accepted", "rejected"]).optional(),
});
