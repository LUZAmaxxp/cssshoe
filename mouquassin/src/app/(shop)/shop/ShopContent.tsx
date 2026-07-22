"use client";

import { useEffect, useState, useCallback } from "react";
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

  // Fetch categories once
  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch products when category changes
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
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

          {pagination && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Showing {products.length} of {pagination.total} products
            </p>
          )}
        </>
      )}
    </>
  );
}
