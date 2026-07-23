"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { useCartStore } from "@/stores/cart";
import { useLocale } from "@/i18n/context";
import { ShoppingBag, Heart, ChevronDown, Truck, Info, RefreshCw } from "lucide-react";

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
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [liked, setLiked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
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

  const displayImages = activeColor && activeColor.images.length > 0
    ? activeColor.images
    : product?.images || [];

  const allSizes = hasColors
    ? [...new Set(product.colors.flatMap((c) => c.sizes))]
    : product?.sizes || [];

  const isSizeAvailable = (size: string) => {
    if (!hasColors) return true;
    return activeColor ? activeColor.sizes.includes(size) : false;
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (allSizes.length > 0 && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize || "One Size",
      image: displayImages[0] || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (allSizes.length > 0 && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize || "One Size",
      image: displayImages[0] || "",
    });

    router.push("/checkout");
  };

  if (loading) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="aspect-square bg-[#f5f5f5] animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/6 animate-pulse" />
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
              priceCurrency: "MAD",
              price: product.price,
              availability: "https://schema.org/InStock",
            },
            brand: { "@type": "Brand", name: "Lyzane" },
          }),
        }}
      />
      <main className="pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.85fr] gap-0">
          {/* Left: Image */}
          <div className="w-full bg-[#f5f5f5] h-[45vh] md:h-[55vh] overflow-hidden flex items-center justify-center md:self-center">
            <ProductGallery images={displayImages} name={product.name} />
          </div>

          {/* Right: Info */}
          <div className="p-5 md:p-8 lg:p-12 flex flex-col">
            {/* Name & Price */}
            <h1 className="text-xl md:text-3xl font-heading text-charcoal">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl text-charcoal mt-1.5 md:mt-2">{product.price} DH</p>

            {/* Trust icons */}
            <div className="flex gap-4 mt-3 md:mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />Free delivery
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />14-day returns
              </span>
            </div>

            <div className="border-t border-border mt-6 pt-6">
              {/* Color selector */}
              {hasColors && product.colors.length > 1 && (
                <div className="mb-6">
                  <p className="text-xs tracking-wider uppercase text-charcoal mb-3">
                    {t("product.color")} : <span className="font-medium">{activeColor?.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, i) => {
                      const isActive = selectedColorIdx === i;
                      const hasStock = color.images.length > 0;
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!hasStock) return;
                            setSelectedColorIdx(i);
                            setSelectedSize("");
                            setShowSizeError(false);
                          }}
                          title={hasStock ? color.name : `${color.name} — Unavailable`}
                          className={`relative w-9 h-9 rounded-full transition-all ${
                            isActive
                              ? "ring-2 ring-offset-2 ring-charcoal"
                              : "hover:ring-2 hover:ring-offset-1 hover:ring-charcoal/30"
                          } ${!hasStock ? "opacity-40" : ""}`}
                          disabled={!hasStock}
                        >
                          <span
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          {!hasStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-[120%] h-[1.5px] bg-red-600 -rotate-45 absolute" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size chips */}
              {allSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wider uppercase text-charcoal">{t("product.size")}</p>
                    <button className="text-xs text-brass hover:underline">+ {t("product.sizeGuide")}</button>
                  </div>
                  <div className="flex gap-2">
                    {allSizes.map((size) => {
                      const available = isSizeAvailable(size);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!available) return;
                            setSelectedSize(size);
                            setShowSizeError(false);
                          }}
                          disabled={!available}
                          className={`w-10 h-10 text-sm border transition-colors relative ${
                            !available
                              ? "border-border text-muted-foreground/30 cursor-not-allowed"
                              : selectedSize === size
                              ? "border-charcoal text-charcoal bg-charcoal/5"
                              : "border-border text-muted-foreground hover:border-charcoal"
                          }`}
                        >
                          {size}
                          {!available && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="w-full h-px bg-muted-foreground/30 -rotate-[30deg] absolute" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {showSizeError && allSizes.length > 0 && !selectedSize && (
                    <p className="text-xs text-burgundy mt-2">Select a size to continue</p>
                  )}
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-2 sm:gap-3 mb-4 md:mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase bg-charcoal text-cream hover:bg-brass hover:text-charcoal transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> {added ? t("product.addedToCart") : t("product.addToCart")}
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 border flex items-center justify-center transition-colors flex-shrink-0 ${
                    liked
                      ? "border-burgundy text-burgundy bg-burgundy/5"
                      : "border-charcoal text-charcoal hover:bg-charcoal hover:text-cream"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream transition-colors mb-4 md:mb-6"
              >
                {t("product.buyNow")}
              </button>

              {/* Description - editorial style */}
              <p className="text-xs text-muted-foreground italic leading-relaxed mb-6">
                Handcrafted with pure Italian leather, designed for the bold and the timeless.
              </p>
            </div>

            {/* Expandable: Product Details */}
            <div className="border-t border-border">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between py-4 text-xs tracking-wider uppercase text-charcoal"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-charcoal" />
                  {t("product.details")}
                </span>
                <ChevronDown className={`w-4 h-4 text-charcoal transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
              </button>
              {detailsOpen && (
                <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
                  <p>{product.description}</p>
                  <p className="mt-2">{t("product.category")}: {product.category}</p>
                </div>
              )}
            </div>

            {/* Expandable: Delivery */}
            <div className="border-t border-border">
              <button
                onClick={() => setDeliveryOpen(!deliveryOpen)}
                className="w-full flex items-center justify-between py-4 text-xs tracking-wider uppercase text-charcoal"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-charcoal" />
                  {t("product.delivery")}
                </span>
                <ChevronDown className={`w-4 h-4 text-charcoal transition-transform ${deliveryOpen ? "rotate-180" : ""}`} />
              </button>
              {deliveryOpen && (
                <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
                  <p>{t("product.deliveryInfo")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="px-6 md:px-10 lg:px-14 py-16">
            <h2 className="text-xl font-heading text-charcoal mb-6">{t("product.youMayAlsoLike")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/shop/${rp.slug || rp._id}`}
                  className="group"
                >
                  <div className="aspect-square bg-[#f5f5f5] overflow-hidden mb-3">
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
                  <p className="text-sm text-muted-foreground">{rp.price} DH</p>
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
