import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { rateLimiters, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const result = rateLimiters.api(ip);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(result, 60) }
    );
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
