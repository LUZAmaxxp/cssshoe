"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useLocale } from "@/i18n/context";
import { PackageOpen } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  likeCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLocale();

  const fetchProducts = useCallback(
    async (page: number, append: boolean = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "24");
        if (category) params.set("category", category);

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();

        setProducts((prev) =>
          append ? [...prev, ...data.products] : data.products
        );
        setPagination(data.pagination);
        setCurrentPage(page);
      } catch {
        // silent
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category]
  );

  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const hasMore = pagination && currentPage < pagination.pages;

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(currentPage + 1, true);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,260px))]">
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
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 md:gap-6 pb-3 border-b border-border">
            <button
              onClick={() => setCategory("")}
              className={`text-xs tracking-[0.1em] uppercase pb-2 transition-colors ${
                !category
                  ? "text-charcoal border-b-2 border-brass -mb-[1px]"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              {t("shop.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs tracking-[0.1em] uppercase pb-2 transition-colors ${
                  category === cat
                    ? "text-charcoal border-b-2 border-brass -mb-[1px]"
                    : "text-muted-foreground hover:text-charcoal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {t("shop.noProducts")}
        </div>
      ) : (
        <>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,260px))]">
            {products.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}

            {/* Sparse state placeholder */}
            {products.length < 4 && (
              <div className="bg-white rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-8 min-h-[280px]">
                <PackageOpen className="w-7 h-7 text-brass mb-2.5" />
                <p className="text-sm text-muted-foreground mb-1">More arriving soon</p>
                <p className="text-xs text-muted-foreground/70">New styles added regularly</p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 text-sm tracking-wider uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
