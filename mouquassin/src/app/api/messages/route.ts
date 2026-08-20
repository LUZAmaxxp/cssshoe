import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { sendMessageSchema } from "@/lib/validations/message";
import { ablyPublish } from "@/lib/ably-server";

const PAGE_SIZE = 25;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const before = searchParams.get("before");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId query parameter is required" },
        { status: 400 }
      );
    }

    const query: Record<string, unknown> = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .lean();

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { conversationId, senderId, senderName, content } = parsed.data;

    // Extract customer info from senderId (format: "cust_xxx" or "admin:xxx")
    const isCustomer = senderId.startsWith("cust_");

    if (isCustomer) {
      // Upsert conversation record for customers
      await Conversation.findOneAndUpdate(
        { conversationId },
        {
          conversationId,
          customerId: senderId,
          customerName: senderName,
          lastMessageAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    const message = await Message.create({
      conversationId,
      senderId,
      senderName,
      content,
      status: "delivered",
    });

    // Best-effort Ably publish (do not fail HTTP on publish error)
    void ablyPublish(`conversation:${conversationId}`, "message_received", {
      id: message._id.toString(),
      conversationId,
      senderId,
      senderName,
      content,
      createdAt: message.createdAt,
    });

    return NextResponse.json(
      {
        id: message._id.toString(),
        conversationId,
        senderId,
        senderName,
        content,
        status: message.status,
        createdAt: message.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
