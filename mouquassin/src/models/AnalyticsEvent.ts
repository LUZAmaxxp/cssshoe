import mongoose, { Schema, Document, Model } from "mongoose";

export type EventType = "product_view" | "wishlist_add" | "whatsapp_redirect";

export interface IAnalyticsEvent extends Document {
  type: EventType;
  productId?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: {
      type: String,
      enum: ["product_view", "wishlist_add", "whatsapp_redirect"],
      required: true,
    },
    productId: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ productId: 1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;
