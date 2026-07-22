import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { orderSchema } from "@/lib/validations/order";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`order:${ip}`, 10, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(`order:${ip}`, 10) }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await Order.create(parsed.data);

    // Send confirmation email (fire-and-forget)
    sendOrderConfirmationEmail({
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      items: order.items,
      totalPrice: order.totalPrice,
      deliveryLocation: order.deliveryLocation,
    });

    await AnalyticsEvent.create({
      type: "whatsapp_redirect",
      meta: {
        orderId: order._id.toString(),
        totalPrice: order.totalPrice,
        itemCount: order.items.length,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
