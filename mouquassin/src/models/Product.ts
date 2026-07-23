import mongoose, { Schema, Document, Model } from "mongoose";

export interface IColorVariant {
  name: string;
  hex: string;
  images: string[];
  sizes: string[];
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: IColorVariant[];
  category: string;
  isArchived: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const colorVariantSchema = new Schema<IColorVariant>(
  {
    name: { type: String, required: true },
    hex: { type: String, default: "#000000" },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [colorVariantSchema], default: [] },
    category: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for common query patterns
productSchema.index({ isArchived: 1, createdAt: -1 });
productSchema.index({ isArchived: 1, category: 1, createdAt: -1 });
productSchema.index({ isArchived: 1, price: 1 });
productSchema.index({ category: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
