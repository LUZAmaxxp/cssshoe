interface OrderItem {
  name: string;
  price: number;
  qty: number;
  size?: string;
}

const NTFY_URLS = ["https://ntfy.sh", "https://ntfy.liamcycle.com"];

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

  for (const baseUrl of NTFY_URLS) {
    try {
      const response = await fetch(`${baseUrl}/${topic}`, {
        method: "POST",
        headers: {
          Title: `New Order - $${order.totalPrice}`,
          Priority: "high",
          Tags: "shopping_cart,white_check_mark",
        },
        body: message,
      });

      if (response.ok) {
        console.log(`ntfy.sh notification sent via ${baseUrl}`);
        return;
      }

      console.error(`ntfy.sh failed via ${baseUrl}:`, response.status);
    } catch (error) {
      console.error(`ntfy.sh error via ${baseUrl}:`, error);
    }
  }

  console.error("All ntfy.sh notification attempts failed");
}
