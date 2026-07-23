"use client";

import { useEffect, useState } from "react";

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
      .then((data) => setProducts(data.products || data))
      .catch(() => setProducts([]));
  }, []);

  const topViewed = [...products]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const topLiked = [...products]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  const maxViews = Math.max(...topViewed.map((p) => p.viewCount), 1);
  const maxLikes = Math.max(...topLiked.map((p) => p.likeCount), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Most Viewed Products</h2>
          {topViewed.length > 0 ? (
            <div className="space-y-3">
              {topViewed.map((p) => (
                <div key={p._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate mr-2">{p.name}</span>
                    <span className="font-medium shrink-0">{p.viewCount}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-[#722f37] h-2 rounded-full transition-all"
                      style={{ width: `${(p.viewCount / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No data yet</p>
          )}
        </div>

        {/* Most Liked */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Most Liked Products</h2>
          {topLiked.length > 0 ? (
            <div className="space-y-3">
              {topLiked.map((p) => (
                <div key={p._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate mr-2">{p.name}</span>
                    <span className="font-medium shrink-0">{p.likeCount}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-[#c9a876] h-2 rounded-full transition-all"
                      style={{ width: `${(p.likeCount / maxLikes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
