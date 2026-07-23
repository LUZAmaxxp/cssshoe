import { z } from "zod";

const colorVariantSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex: z.string().default("#000000"),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().positive("Price must be positive"),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(colorVariantSchema).default([]),
  category: z.string().min(1, "Category is required"),
  isArchived: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;
