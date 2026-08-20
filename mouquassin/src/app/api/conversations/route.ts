import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const customerId = searchParams.get("customerId");

    // If conversationId provided, return info for that conversation
    if (conversationId) {
      const convRecord = await Conversation.findOne({ conversationId }).lean();
      const latestMessage = await Message.findOne({ conversationId })
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        conversationId,
        status: "delivered",
      });

      return NextResponse.json({
        conversationId,
        customerName: convRecord?.customerName || "Unknown",
        customerEmail: convRecord?.customerEmail || "",
        latestMessage: latestMessage
          ? {
              id: latestMessage._id.toString(),
              senderId: latestMessage.senderId,
              senderName: latestMessage.senderName,
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
            }
          : null,
        unreadCount,
      });
    }

    // If customerId provided, return all conversations for this customer
    if (customerId) {
      const convRecords = await Conversation.find({ customerId })
        .sort({ lastMessageAt: -1 })
        .lean();

      const results = await Promise.all(
        convRecords.map(async (conv) => {
          const latestMessage = await Message.findOne({
            conversationId: conv.conversationId,
          })
            .sort({ createdAt: -1 })
            .lean();

          const unreadCount = await Message.countDocuments({
            conversationId: conv.conversationId,
            status: "delivered",
          });

          return {
            conversationId: conv.conversationId,
            customerName: conv.customerName,
            customerEmail: conv.customerEmail,
            latestMessage: latestMessage
              ? {
                  id: latestMessage._id.toString(),
                  senderId: latestMessage.senderId,
                  senderName: latestMessage.senderName,
                  content: latestMessage.content,
                  createdAt: latestMessage.createdAt,
                }
              : null,
            unreadCount,
          };
        })
      );

      return NextResponse.json(results);
    }

    // No params: list all conversations (for admin)
    const convRecords = await Conversation.find()
      .sort({ lastMessageAt: -1 })
      .lean();

    const results = await Promise.all(
      convRecords.map(async (conv) => {
        const latestMessage = await Message.findOne({
          conversationId: conv.conversationId,
        })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          conversationId: conv.conversationId,
          status: "delivered",
        });

        return {
          conversationId: conv.conversationId,
          customerName: conv.customerName,
          customerEmail: conv.customerEmail,
          latestMessage: latestMessage
            ? {
                id: latestMessage._id.toString(),
                senderId: latestMessage.senderId,
                senderName: latestMessage.senderName,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt,
              }
            : null,
          unreadCount,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
