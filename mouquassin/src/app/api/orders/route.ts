import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { orderSchema } from "@/lib/validations/order";
import { rateLimiters, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";
import { sendOrderConfirmationEmail, sendAdminOrderEmail } from "@/lib/email";
import { sendOrderNotification } from "@/lib/notify";

export async function GET(request: NextRequest) {
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
  const ip = getClientIp(request);
  const result = rateLimiters.orders(ip);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(result, 10) }
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

    // Send confirmation email to customer (fire-and-forget)
    sendOrderConfirmationEmail({
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      items: order.items,
      totalPrice: order.totalPrice,
      deliveryLocation: order.deliveryLocation,
    });

    // Send notification email to admin (fire-and-forget)
    sendAdminOrderEmail({
      _id: order._id.toString(),
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      items: order.items.map((item: { name: string; price: number; qty: number }) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totalPrice: order.totalPrice,
      deliveryLocation: order.deliveryLocation,
    }).catch((err) => console.error("Admin email failed:", err));

    // Send push notification to admin via ntfy.sh (fire-and-forget)
    console.log("Attempting ntfy.sh notification for order:", order._id.toString());
    sendOrderNotification({
      _id: order._id.toString(),
      customerName: order.customerName,
      phone: order.phone,
      items: order.items.map((item: { name: string; price: number; qty: number }) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totalPrice: order.totalPrice,
      deliveryLocation: order.deliveryLocation,
    }).then(() => console.log("ntfy.sh notification completed for order:", order._id.toString()))
      .catch((err) => console.error("ntfy.sh notification failed:", err));

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
