"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useLocale } from "@/i18n/context";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  likeCount: number;
}

export function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    const url = category
      ? `/api/products?category=${encodeURIComponent(category)}`
      : "/api/products";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (!category) {
          const cats = [...new Set(data.map((p: Product) => p.category))] as string[];
          setCategories(cats);
        }
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded" />
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`px-3 py-1 text-sm border transition-colors ${
              !category
                ? "bg-charcoal text-white border-charcoal"
                : "border-border hover:border-charcoal"
            }`}
          >
            {t("shop.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 text-sm border transition-colors ${
                category === cat
                  ? "bg-charcoal text-white border-charcoal"
                  : "border-border hover:border-charcoal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {t("shop.noProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </>
  );
}
