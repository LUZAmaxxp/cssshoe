"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  email: string;
  totalPrice: number;
  status: string;
  items: { name: string; qty: number; price: number; size?: string }[];
  deliveryLocation?: { address?: string };
  createdAt: string;
}

const statuses = ["new", "contacted", "confirmed", "shipped", "cancelled"] as const;

const statusConfig: Record<string, { bg: string; dot: string; text: string }> = {
  new: { bg: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700" },
  contacted: { bg: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-700" },
  confirmed: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700" },
  shipped: { bg: "bg-purple-50", dot: "bg-purple-500", text: "text-purple-700" },
  cancelled: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
  };

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] tracking-wider uppercase text-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] tracking-wider uppercase text-muted-foreground mb-1">New Orders</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] tracking-wider uppercase text-muted-foreground mb-1">Revenue</p>
          <p className="text-2xl font-bold text-charcoal">{stats.revenue} DH</p>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => {
          const sc = statusConfig[order.status] || statusConfig.new;
          const isExpanded = expandedOrder === order._id;

          return (
            <div key={order._id} className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Main row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                  {getInitials(order.customerName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{order.customerName}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.items.length} item(s) — {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="text-sm font-semibold text-charcoal shrink-0">{order.totalPrice} DH</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-border/50 p-4 bg-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Contact</p>
                      <p className="text-sm">{order.phone}</p>
                      {order.email && <p className="text-sm text-muted-foreground">{order.email}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Delivery</p>
                      <p className="text-sm">{order.deliveryLocation?.address || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] tracking-wider uppercase text-muted-foreground mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}{item.size ? ` (${item.size})` : ""} x{item.qty}</span>
                          <span className="font-medium">{item.price * item.qty} DH</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-[10px] tracking-wider uppercase text-muted-foreground mr-2">Status:</p>
                    {statuses.map((s) => {
                      const config = statusConfig[s];
                      const isActive = order.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(order._id, s)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${isActive ? `${config.bg} ${config.text} ring-1 ring-inset ring-current/20` : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
