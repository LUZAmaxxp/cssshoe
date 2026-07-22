"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart";
import { useLocale } from "@/i18n/context";
import { MapPin, Phone, User, Mail, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const { t } = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const orderData = {
        customerName: name,
        email,
        phone,
        deliveryLocation: { lat: 0, lng: 0, address },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.quantity,
        })),
        totalPrice: totalPrice(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const order = await res.json();

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
      const itemLines = items
        .map(
          (item) =>
            `- ${item.name} (Size: ${item.size}) x${item.quantity} — $${item.price * item.quantity}`
        )
        .join("\n");

      const message = encodeURIComponent(
        `New Order from Lyzane\n\n` +
          `Customer: ${name}\n` +
          `Phone: ${phone}\n` +
          `Delivery: ${address}\n\n` +
          `Items:\n${itemLines}\n\n` +
          `Total: $${totalPrice()}\n\n` +
          `Order ID: ${order._id}`
      );

      clearCart();
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      router.push("/shop");
    } catch {
      setError(t("checkout.error"));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="container mx-auto px-4 py-8 pt-24 text-center">
          <h1 className="text-3xl font-heading text-charcoal mb-4">{t("checkout.title")}</h1>
          <p className="text-muted-foreground mb-6">{t("checkout.empty")}</p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-burgundy text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors"
          >
            {t("checkout.browseShop")}
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar alwaysSolid />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        <h1 className="text-3xl font-heading text-charcoal mb-8">{t("checkout.title")}</h1>

        <div className="space-y-3 mb-8">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} ({t("checkout.size")}: {item.size}) x{item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-medium text-lg">
            <span>{t("checkout.total")}</span>
            <span>${totalPrice()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <User className="w-4 h-4" /> {t("checkout.fullName")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border px-3 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder={t("checkout.fullNamePlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> {t("checkout.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border px-3 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder={t("checkout.emailPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4" /> {t("checkout.phone")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border px-3 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder={t("checkout.phonePlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" /> {t("checkout.address")}
            </label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-border px-3 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px]"
              placeholder={t("checkout.addressPlaceholder")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {t("checkout.processing")}
              </>
            ) : (
              t("checkout.orderViaWhatsapp")
            )}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
