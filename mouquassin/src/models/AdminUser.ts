import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminRole = "owner" | "staff";

export interface IAdminUser extends Document {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  createdAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "staff",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", adminUserSchema);

export default AdminUser;
