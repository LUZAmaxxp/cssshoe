"use client";

import { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

interface Product {
  _id: string;
  name: string;
  viewCount: number;
  likeCount: number;
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || data));
  }, []);

  const topViewed = [...products]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const topLiked = [...products]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Most Viewed Products
              </Typography>
              {topViewed.length > 0 ? (
                <BarChart
                  height={300}
                  colors={["#722f37"]}
                  series={[
                    {
                      data: topViewed.map((p) => p.viewCount),
                      label: "Views",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: topViewed.map((p) =>
                        p.name.length > 15
                          ? p.name.substring(0, 15) + "..."
                          : p.name
                      ),
                    },
                  ]}
                />
              ) : (
                <Typography color="text.secondary">No data yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Most Liked Products
              </Typography>
              {topLiked.length > 0 ? (
                <BarChart
                  height={300}
                  colors={["#b5985a"]}
                  series={[
                    {
                      data: topLiked.map((p) => p.likeCount),
                      label: "Likes",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: topLiked.map((p) =>
                        p.name.length > 15
                          ? p.name.substring(0, 15) + "..."
                          : p.name
                      ),
                    },
                  ]}
                />
              ) : (
                <Typography color="text.secondary">No data yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}