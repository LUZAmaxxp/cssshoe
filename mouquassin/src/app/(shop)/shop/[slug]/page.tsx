"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { useCartStore } from "@/stores/cart";
import { useLocale } from "@/i18n/context";
import { Check, Minus, Plus, ShoppingBag, Zap } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  likeCount: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize || "One Size",
        image: product.images[0] || "",
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize || "One Size",
        image: product.images[0] || "",
      });
    }

    router.push("/checkout");
  };

  if (loading) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/6 animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="container mx-auto px-4 py-8 pt-24 text-center">
          <p className="text-muted-foreground">{t("product.notFound")}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar alwaysSolid />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images[0],
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.price,
              availability: "https://schema.org/InStock",
            },
            brand: {
              "@type": "Brand",
              name: "Lyzane",
            },
          }),
        }}
      />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h1 className="text-3xl font-heading text-charcoal mt-2">
              {product.name}
            </h1>
            <p className="text-2xl text-charcoal mt-2">${product.price}</p>

            {/* Size selector */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">{t("product.size")} *</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === size
                        ? "bg-charcoal text-white border-charcoal"
                        : "border-border hover:border-charcoal"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {product.sizes.length > 0 && !selectedSize && (
                <p className="text-xs text-burgundy mt-1">{t("product.sizeRequired")}</p>
              )}
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">{t("product.quantity")}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 border border-border flex items-center justify-center hover:border-charcoal transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 border border-border flex items-center justify-center hover:border-charcoal transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.sizes.length > 0 && !selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase transition-colors ${
                  added
                    ? "bg-green-700 text-white"
                    : "bg-charcoal text-white hover:bg-brass hover:text-charcoal disabled:bg-muted disabled:text-muted-foreground"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> {t("product.addedToCart")}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {t("product.addToCart")}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.sizes.length > 0 && !selectedSize}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors disabled:border-muted disabled:text-muted-foreground"
              >
                <Zap className="w-4 h-4" /> {t("product.buyNow")}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-medium mb-2">{t("product.description")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {product.likeCount} {t("product.peopleLiked")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
