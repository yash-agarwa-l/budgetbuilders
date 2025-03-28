import { z } from "zod";

const money = z.coerce
  .number()
  .positive("Must be greater than zero")
  .max(99_999_999.99, "Amount is too large");

const area = z.coerce.number().positive();

/**
 * Per-type detail shapes. These mirror the JSONB validator on the SubOrder
 * model so a bad payload is rejected at the edge with a readable message
 * rather than as a database validation error.
 */
const detailsByType = {
  house: z.object({
    no_of_floors: z.coerce.number().int().min(1),
    no_of_rooms_per_floor: z.record(z.string(), z.coerce.number().int().min(1)),
    area,
  }),
  stairs: z.object({
    height: z.coerce.number().positive(),
    no_of_floors: z.coerce.number().int().min(1),
    area,
  }),
  room: z.object({
    room_type: z.string().min(1),
    area,
  }),
  ceiling: z.object({ area }),
  other: z.object({}).passthrough(),
};

const subOrderSchema = z
  .object({
    type: z.enum(["house", "stairs", "room", "ceiling", "other"]),
    expected_price: money.optional(),
    img_url: z.string().url().optional(),
    details: z.record(z.string(), z.unknown()),
  })
  .superRefine((value, ctx) => {
    const result = detailsByType[value.type].safeParse(value.details);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["details", ...issue.path],
          message: issue.message,
        });
      }
    }
  });

export const createOrderSchema = z.object({
  total_offered_price: money,
  subOrders: z
    .array(subOrderSchema)
    .min(1, "At least one sub-order is required")
    .max(20, "An order cannot contain more than 20 sub-orders"),
});

export const updateOrderSchema = z
  .object({
    total_offered_price: money.optional(),
    // A customer may only cancel; accepting happens by awarding a bid.
    order_status: z.enum(["cancelled"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["pending", "accepted", "completed", "cancelled"])
    .optional(),
});
