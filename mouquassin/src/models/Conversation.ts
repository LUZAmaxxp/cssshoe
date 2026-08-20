import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  conversationId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessageAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    conversationId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

conversationSchema.index({ conversationId: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
