"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, TrendingUp, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  viewCount: number;
  likeCount: number;
  price: number;
}

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { name: string; qty: number }[];
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([productsData, ordersData]) => {
      setProducts(productsData.products || productsData);
      setOrders(ordersData);
    });
  }, []);

  const topViewed = [...products].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const topLiked = [...products].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);
  const maxViews = Math.max(...topViewed.map((p) => p.viewCount), 1);
  const maxLikes = Math.max(...topLiked.map((p) => p.likeCount), 1);

  const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
  const totalLikes = products.reduce((sum, p) => sum + p.likeCount, 0);
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: totalViews, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Likes", value: totalLikes, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Revenue", value: `$${totalRevenue}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Orders", value: totalOrders, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[11px] tracking-wider uppercase text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-sm font-semibold text-charcoal mb-4">Most Viewed Products</h2>
          {topViewed.length > 0 ? (
            <div className="space-y-4">
              {topViewed.map((p, i) => (
                <div key={p._id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-medium text-muted-foreground w-4">{i + 1}</span>
                      <span className="text-sm truncate">{p.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums shrink-0 ml-2">{p.viewCount}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5 ml-6">
                    <div
                      className="bg-charcoal h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(p.viewCount / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
          )}
        </div>

        {/* Most Liked */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-sm font-semibold text-charcoal mb-4">Most Liked Products</h2>
          {topLiked.length > 0 ? (
            <div className="space-y-4">
              {topLiked.map((p, i) => (
                <div key={p._id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-medium text-muted-foreground w-4">{i + 1}</span>
                      <span className="text-sm truncate">{p.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums shrink-0 ml-2">{p.likeCount}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5 ml-6">
                    <div
                      className="bg-brass h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(p.likeCount / maxLikes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-border p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-charcoal mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left text-[10px] tracking-wider uppercase text-muted-foreground font-medium pb-2">Order</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-muted-foreground font-medium pb-2">Items</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-muted-foreground font-medium pb-2">Total</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-muted-foreground font-medium pb-2">Status</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-muted-foreground font-medium pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const sc = statusConfig[order.status] || statusConfig.new;
                    return (
                      <tr key={order._id} className="border-b border-border/30 last:border-0">
                        <td className="py-3 text-sm font-medium">{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3 text-sm text-muted-foreground">{order.items.length} item(s)</td>
                        <td className="py-3 text-sm font-medium">${order.totalPrice}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

const statusConfig: Record<string, { bg: string; dot: string; text: string }> = {
  new: { bg: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700" },
  contacted: { bg: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-700" },
  confirmed: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700" },
  shipped: { bg: "bg-purple-50", dot: "bg-purple-500", text: "text-purple-700" },
  cancelled: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700" },
};
