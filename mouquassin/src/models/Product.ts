import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  isArchived: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    sizes: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    category: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ isArchived: 1 });
productSchema.index({ price: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
