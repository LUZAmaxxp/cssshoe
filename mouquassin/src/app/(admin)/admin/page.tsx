"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalProducts: 0,
    mostLikedProduct: "N/A",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([productsData, orders]) => {
      const products = productsData.products || productsData;
      const mostLiked = [...products].sort((a: { likeCount: number }, b: { likeCount: number }) => b.likeCount - a.likeCount)[0];
      setMetrics({
        totalOrders: orders.length,
        totalProducts: products.length,
        mostLikedProduct: mostLiked?.name || "N/A",
      });
    });
  }, []);

  const cards = [
    { label: "Total Orders", value: metrics.totalOrders, icon: ShoppingBag, color: "text-burgundy", bg: "bg-burgundy/10" },
    { label: "Most Liked", value: metrics.mostLikedProduct, icon: Heart, color: "text-brass", bg: "bg-brass/10" },
    { label: "Live Products", value: metrics.totalProducts, icon: Package, color: "text-charcoal", bg: "bg-charcoal/5" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border p-5">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{card.value}</p>
            <p className="text-[11px] tracking-wider uppercase text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
