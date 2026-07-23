interface OrderItem {
  name: string;
  price: number;
  qty: number;
  size?: string;
}

export async function sendOrderNotification(order: {
  _id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryLocation?: { address?: string };
}) {
  const topic = process.env.NTFY_TOPIC || "lyzane-orders";

  const itemLines = order.items
    .map(
      (item) =>
        `- ${item.name}${item.size ? ` (${item.size})` : ""} x${item.qty} — $${item.price * item.qty}`
    )
    .join("\n");

  const address = order.deliveryLocation?.address || "Not provided";

  const message =
    `🛒 New Order — Lyzane\n` +
    `\n` +
    `👤 ${order.customerName}\n` +
    `📞 ${order.phone}\n` +
    `📍 ${address}\n` +
    `\n` +
    `${itemLines}\n` +
    `\n` +
    `💰 Total: $${order.totalPrice}\n` +
    `🆔 ${order._id}`;

  try {
    const response = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: `New Order — $${order.totalPrice}`,
        Priority: "high",
        Tags: "shopping_cart,white_check_mark",
      },
      body: message,
    });

    if (!response.ok) {
      console.error("ntfy.sh notification failed:", response.status);
      return;
    }

    console.log("ntfy.sh notification sent");
  } catch (error) {
    console.error("ntfy.sh notification error:", error);
  }
}
