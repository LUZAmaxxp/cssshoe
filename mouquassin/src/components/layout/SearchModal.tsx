"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  slug?: string;
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=8`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const setProducts = (p: Product[]) => setResults(p);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:text-cream transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[150] bg-charcoal/95 backdrop-blur-sm flex flex-col">
          <div className="container mx-auto px-4 pt-4 md:pt-8 max-w-xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-cream/15 pb-3">
              <Search className="w-5 h-5 text-cream/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-cream text-base placeholder:text-cream/25 focus:outline-none"
              />
              <button
                onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
                className="w-8 h-8 flex items-center justify-center text-cream/40 hover:text-cream transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {loading && (
                <p className="text-cream/30 text-sm text-center py-12">Searching...</p>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <p className="text-cream/30 text-sm text-center py-12">No products found</p>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      href={`/shop/${product.slug || product._id}`}
                      onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
                      className="flex items-center gap-3 p-3 hover:bg-cream/5 transition-colors rounded"
                    >
                      <div className="w-11 h-11 bg-cream/5 flex-shrink-0 rounded overflow-hidden">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cream/20 text-[10px] font-heading">M</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm truncate">{product.name}</p>
                        <p className="text-cream/30 text-[11px]">{product.category}</p>
                      </div>
                      <span className="text-cream/50 text-sm flex-shrink-0">{product.price} DH</span>
                    </Link>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <p className="text-cream/20 text-sm text-center py-12">Type to search</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
