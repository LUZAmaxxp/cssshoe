"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart";
import { useLocale } from "@/i18n/context";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  likeCount: number;
  sizes: string[];
}

export function ProductCard({
  _id,
  name,
  price,
  images,
  category,
  likeCount,
  sizes,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const { t } = useLocale();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) return;

    try {
      const res = await fetch(`/api/products/${_id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likeCount);
        setLiked(true);
      }
    } catch {
      // silently fail
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sizes.length > 0 && !selectedSize) {
      setShowActions(true);
      return;
    }

    addItem({
      productId: _id,
      name,
      price,
      size: selectedSize || "One Size",
      image: images[0] || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sizes.length > 0 && !selectedSize) {
      setShowActions(true);
      return;
    }

    addItem({
      productId: _id,
      name,
      price,
      size: selectedSize || "One Size",
      image: images[0] || "",
    });

    router.push("/checkout");
  };

  return (
    <div className="group block">
      <Link href={`/shop/${_id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-heading">
              M
            </div>
          )}

          <button
            onClick={handleLike}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-burgundy text-burgundy" : "text-muted-foreground"}`}
            />
          </button>
        </div>
      </Link>

      <div className="mt-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {category}
        </p>
        <Link href={`/shop/${_id}`}>
          <h3 className="text-sm font-medium mt-1 hover:text-brass transition-colors">{name}</h3>
        </Link>
        <p className="text-sm font-medium mt-1">${price}</p>
        <p className="text-xs text-muted-foreground">{likes} {t("shop.likes")}</p>

        {/* Size selector + Action buttons */}
        {sizes.length > 0 && (
          <div className="mt-3 space-y-2">
            {!selectedSize && showActions ? (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("shop.selectSize")}</p>
                <div className="flex flex-wrap gap-1">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                      className="px-2 py-1 text-[10px] border border-border hover:border-charcoal transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-wider uppercase transition-colors ${
                    added
                      ? "bg-green-700 text-white"
                      : "bg-charcoal text-white hover:bg-brass hover:text-charcoal"
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  {added ? t("shop.added") : t("shop.addToCart")}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-wider uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  {t("shop.buyNow")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
