"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { useCartStore } from "@/stores/cart";
import { useLocale } from "@/i18n/context";
import { Check, Minus, Plus, ShoppingBag, Zap } from "lucide-react";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  sizes: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: ColorVariant[];
  category: string;
  likeCount: number;
  slug?: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
        // Fetch related products from same category
        if (data.category) {
          fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`)
            .then((res) => res.json())
            .then((d) => {
              const related = (d.products || []).filter((p: Product) => p._id !== data._id);
              setRelatedProducts(related.slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const hasColors = product && product.colors && product.colors.length > 0;
  const activeColor = hasColors ? product.colors[selectedColorIdx] : null;

  // Get images and sizes for the active color
  const displayImages = activeColor && activeColor.images.length > 0
    ? activeColor.images
    : product?.images || [];

  const displaySizes = activeColor && activeColor.sizes.length > 0
    ? activeColor.sizes
    : product?.sizes || [];

  // All unique sizes across all colors (to show unavailable ones)
  const allSizes = hasColors
    ? [...new Set(product.colors.flatMap((c) => c.sizes))]
    : product?.sizes || [];

  const handleAddToCart = () => {
    if (!product) return;
    if (displaySizes.length > 0 && !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize || "One Size",
        image: displayImages[0] || "",
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (displaySizes.length > 0 && !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize || "One Size",
        image: displayImages[0] || "",
      });
    }

    router.push("/checkout");
  };

  const isSizeAvailable = (size: string) => {
    if (!hasColors) return true;
    return activeColor ? activeColor.sizes.includes(size) : false;
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
            image: displayImages[0],
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
          <ProductGallery images={displayImages} name={product.name} />

          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h1 className="text-3xl font-heading text-charcoal mt-2">
              {product.name}
            </h1>
            <p className="text-2xl text-charcoal mt-2">${product.price}</p>

            {/* Color selector */}
            {hasColors && product.colors.length > 1 && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">
                  {t("product.color")}: <span className="text-muted-foreground">{activeColor?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => {
                    const isActive = selectedColorIdx === i;
                    const hasStock = color.images.length > 0;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColorIdx(i);
                          setSelectedSize("");
                        }}
                        title={color.name}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          isActive
                            ? "border-charcoal scale-110"
                            : hasStock
                            ? "border-border hover:border-charcoal/50"
                            : "border-border opacity-40 cursor-not-allowed"
                        }`}
                        disabled={!hasStock}
                      >
                        <span
                          className="absolute inset-1 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        {!hasStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-8 h-px bg-red-500 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {allSizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">{t("product.size")} *</p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const available = isSizeAvailable(size);
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`px-4 py-2 text-sm border transition-colors relative ${
                          !available
                            ? "border-border text-muted-foreground/40 cursor-not-allowed line-through"
                            : selectedSize === size
                            ? "bg-charcoal text-white border-charcoal"
                            : "border-border hover:border-charcoal"
                        }`}
                      >
                        {size}
                        {!available && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="w-2 h-px bg-red-500 rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {allSizes.length > 0 && !selectedSize && (
                  <p className="text-xs text-burgundy mt-1">{t("product.sizeRequired")}</p>
                )}
              </div>
            )}

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
                disabled={displaySizes.length > 0 && !selectedSize}
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
                disabled={displaySizes.length > 0 && !selectedSize}
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-xl font-heading text-charcoal mb-6">{t("product.youMayAlsoLike")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/shop/${rp.slug || rp._id}`}
                  className="group"
                >
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative">
                    {rp.images[0] && (
                      <img
                        src={rp.images[0]}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-charcoal group-hover:text-brass transition-colors">
                    {rp.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">${rp.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
