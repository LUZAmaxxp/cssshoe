import mongoose, { Schema, Document, Model } from "mongoose";

export type MessageStatus = "delivered" | "read";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  status: MessageStatus;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["delivered", "read"],
      default: "delivered",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
