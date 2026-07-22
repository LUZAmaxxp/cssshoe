"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Select, MenuItem } from "@mui/material";

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: string;
  items: { name: string; qty: number }[];
  createdAt: string;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  new: { bg: "rgba(26,26,26,0.06)", text: "#1a1a1a" },
  contacted: { bg: "rgba(181,152,90,0.15)", text: "#8a6d2f" },
  confirmed: { bg: "rgba(99,153,34,0.12)", text: "#3b6d11" },
  shipped: { bg: "rgba(114,47,55,0.1)", text: "#722f37" },
  cancelled: { bg: "rgba(220,38,38,0.1)", text: "#dc2626" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const columns: GridColDef[] = [
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
              style={{ backgroundColor: "#ebebeb", color: "#6b6b6b" }}
            >
              {getInitials(params.value)}
            </div>
            <span className="truncate">{params.value}</span>
          </div>
        );
      },
    },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 100 },
    {
      field: "items",
      headerName: "Items",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="truncate">
          {params.value?.map((i: { name: string; qty: number }) => `${i.name} x${i.qty}`).join(", ")}
        </span>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Total",
      flex: 0.5,
      minWidth: 70,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const s = statusStyles[params.value] || statusStyles["new"];
        return (
          <Select
            size="small"
            fullWidth
            value={params.value}
            onChange={(e) => updateStatus(params.row._id, e.target.value)}
            renderValue={() => (
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {params.value}
              </span>
            )}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Orders
      </Typography>
      <div className="w-full overflow-x-auto">
        <div style={{ height: 500, minWidth: 700 }}>
          <DataGrid
            rows={orders}
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
}
