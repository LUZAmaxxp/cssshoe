import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  customerName: string;
  email: string;
  phone: string;
  items: { name: string; price: number; qty: number }[];
  totalPrice: number;
  deliveryLocation: { address: string };
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@lyzane.com";

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">
          ${item.name}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; text-align: center;">
          ${item.qty}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; text-align: right;">
          $${item.price}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333; text-align: right; font-weight: 500;">
          $${item.price * item.qty}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #b5985a; font-size: 28px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase;">
                    LYZANE
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 24px; font-weight: 500;">
                    Order Confirmation
                  </h2>
                  <p style="margin: 0 0 24px 0; color: #666; font-size: 14px;">
                    Thank you for your purchase, ${order.customerName}!
                  </p>
                  
                  <!-- Order Items -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #1a1a1a;">
                        <th style="padding: 12px 0; text-align: left; color: #1a1a1a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                          Product
                        </th>
                        <th style="padding: 12px 0; text-align: center; color: #1a1a1a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                          Qty
                        </th>
                        <th style="padding: 12px 0; text-align: right; color: #1a1a1a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                          Price
                        </th>
                        <th style="padding: 12px 0; text-align: right; color: #1a1a1a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemRows}
                    </tbody>
                    <tfoot>
                      <tr style="border-top: 2px solid #1a1a1a;">
                        <td colspan="3" style="padding: 16px 0; text-align: right; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                          Total
                        </td>
                        <td style="padding: 16px 0; text-align: right; color: #722f37; font-size: 18px; font-weight: 600;">
                          $${order.totalPrice}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <!-- Delivery Info -->
                  <div style="background-color: #f9f9f9; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">
                      Delivery Information
                    </h3>
                    <p style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                      <strong>Address:</strong> ${order.deliveryLocation.address}
                    </p>
                    <p style="margin: 0; color: #333; font-size: 14px;">
                      <strong>Phone:</strong> ${order.phone}
                    </p>
                  </div>
                  
                  <!-- Contact -->
                  <p style="margin: 0; color: #666; font-size: 13px; text-align: center;">
                    Questions about your order? Contact us on WhatsApp for instant support.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} Lyzane. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: order.email,
      subject: `Order Confirmation — Lyzane`,
      html,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}