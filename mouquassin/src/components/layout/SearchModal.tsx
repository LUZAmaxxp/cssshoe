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
      setTimeout(() => inputRef.current?.focus(), 100);
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
        .then((data) => setResults(data.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:text-cream transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[150] bg-charcoal/90 backdrop-blur-sm flex flex-col">
          <div className="container mx-auto px-4 pt-4 md:pt-8">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-cream/20 pb-3">
              <Search className="w-5 h-5 text-cream/50 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-cream text-lg placeholder:text-cream/30 focus:outline-none"
              />
              <button
                onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
                className="p-2 text-cream/50 hover:text-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {loading && (
                <p className="text-cream/40 text-sm text-center py-8">Searching...</p>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <p className="text-cream/40 text-sm text-center py-8">No products found</p>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2">
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      href={`/shop/${product.slug || product._id}`}
                      onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
                      className="flex items-center gap-4 p-3 hover:bg-cream/5 transition-colors rounded"
                    >
                      <div className="w-12 h-12 bg-cream/10 flex-shrink-0 rounded overflow-hidden">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cream/30 text-xs font-heading">M</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm truncate">{product.name}</p>
                        <p className="text-cream/40 text-xs">{product.category}</p>
                      </div>
                      <span className="text-cream/60 text-sm">{product.price} DH</span>
                    </Link>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <p className="text-cream/30 text-sm text-center py-8">Type to search</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
