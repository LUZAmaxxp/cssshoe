import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  email: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.string().email("Valid email is required").optional()
  ),
  phone: z.string().min(1, "Phone is required"),
  deliveryLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1, "Address is required"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        qty: z.number().int().positive(),
      })
    )
    .min(1, "At least one item is required"),
  totalPrice: z.number().positive(),
});

export type OrderInput = z.infer<typeof orderSchema>;
