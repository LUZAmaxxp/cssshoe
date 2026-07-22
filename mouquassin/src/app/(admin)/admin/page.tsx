"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  ShoppingCart as OrderIcon,
  Favorite as LikeIcon,
  Inventory as ProductIcon,
} from "@mui/icons-material";

interface Metrics {
  totalOrders: number;
  totalProducts: number;
  mostLikedProduct: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalOrders: 0,
    totalProducts: 0,
    mostLikedProduct: "N/A",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
    ]).then(([products]) => {
      setMetrics({
        totalOrders: 0,
        totalProducts: products.length,
        mostLikedProduct:
          products.sort((a: { likeCount: number }, b: { likeCount: number }) => b.likeCount - a.likeCount)[0]
            ?.name || "N/A",
      });
    });
  }, []);

  const cards = [
    {
      label: "Orders in Process",
      value: metrics.totalOrders,
      icon: <OrderIcon sx={{ fontSize: 20 }} />,
      iconBg: "rgba(114,47,55,0.1)",
      iconColor: "#722f37",
    },
    {
      label: "Most Liked Product",
      value: metrics.mostLikedProduct,
      icon: <LikeIcon sx={{ fontSize: 20 }} />,
      iconBg: "rgba(181,152,90,0.15)",
      iconColor: "#8a6d2f",
    },
    {
      label: "Live Products",
      value: metrics.totalProducts,
      icon: <ProductIcon sx={{ fontSize: 20 }} />,
      iconBg: "rgba(26,26,26,0.06)",
      iconColor: "#1a1a1a",
    },
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 4 }} key={card.label}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                      {card.label}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}