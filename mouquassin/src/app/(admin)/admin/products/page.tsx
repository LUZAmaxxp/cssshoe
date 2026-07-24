"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Archive, ArchiveRestore, Plus } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  isArchived: boolean;
  viewCount: number;
  likeCount: number;
  images: string[];
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = () => {
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleArchive = async (id: string, isArchived: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: !isArchived }),
    });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-charcoal text-cream px-5 py-2.5 text-sm tracking-wider uppercase hover:bg-brass hover:text-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Product</th>
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Category</th>
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Price</th>
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Views</th>
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Likes</th>
              <th className="text-left text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Status</th>
              <th className="text-right text-[11px] tracking-wider uppercase text-muted-foreground font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-heading text-muted-foreground">M</div>
                    )}
                    <span className="text-sm font-medium truncate max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                <td className="px-4 py-3 text-sm font-medium">{product.price} DH</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{product.viewCount}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{product.likeCount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${product.isArchived ? "bg-muted text-muted-foreground" : "bg-green-50 text-green-700"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.isArchived ? "bg-muted-foreground" : "bg-green-500"}`} />
                    {product.isArchived ? "Archived" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/products/${product._id}`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-charcoal">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => toggleArchive(product._id, product.isArchived)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-charcoal">
                      {product.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl border border-border p-4">
            <div className="flex gap-3">
              {product.images?.[0] ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs font-heading text-muted-foreground">M</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold">{product.price} DH</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${product.isArchived ? "bg-muted text-muted-foreground" : "bg-green-50 text-green-700"}`}>
                    <span className={`w-1 h-1 rounded-full ${product.isArchived ? "bg-muted-foreground" : "bg-green-500"}`} />
                    {product.isArchived ? "Archived" : "Active"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{product.viewCount} views</span>
                <span>{product.likeCount} likes</span>
              </div>
              <div className="flex gap-1">
                <Link href={`/admin/products/${product._id}`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => toggleArchive(product._id, product.isArchived)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  {product.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
