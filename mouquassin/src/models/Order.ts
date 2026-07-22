import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus = "new" | "contacted" | "confirmed" | "shipped" | "cancelled";

export interface IOrder extends Document {
  customerName: string;
  email: string;
  phone: string;
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    qty: number;
  }[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "shipped", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
