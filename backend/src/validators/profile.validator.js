import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{9,14}$/, "Enter a valid phone number");

const latitude = z.coerce.number().min(-90).max(90);
const longitude = z.coerce.number().min(-180).max(180);

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone_no: phone,
  email: z.string().trim().toLowerCase().email(),
  address: z.string().trim().min(1).max(255),
  latitude,
  longitude,
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });

export const createBuilderSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone_no: phone,
  address: z.string().trim().min(1).max(255),
  gst_number: z
    .string()
    .trim()
    .toUpperCase()
    .length(15, "A GST number is exactly 15 characters"),
  years_of_Experience: z.coerce.number().int().min(0).max(100).default(0),
  type: z.enum(["residential", "commercial", "both"]),
});

export const updateBuilderSchema = createBuilderSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });

export const builderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(["residential", "commercial", "both"]).optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
