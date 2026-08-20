import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Message from "@/models/Message";
import { ablyPublish } from "@/lib/ably-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const message = await Message.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Notify sender that message was read
    void ablyPublish(`conversation:${message.conversationId}`, "message_read", {
      messageId: message._id.toString(),
      conversationId: message.conversationId,
      readAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    return NextResponse.json(
      { error: "Failed to mark message as read" },
      { status: 500 }
    );
  }
}
