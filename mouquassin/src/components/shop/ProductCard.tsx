"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
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
  const [showActions, setShowActions] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
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
            className="absolute top-2 right-2 p-2.5 bg-white/80 backdrop-blur-sm rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-burgundy text-burgundy" : "text-muted-foreground"}`}
            />
          </button>
        </div>
      </Link>

      <div className="mt-2 md:mt-3">
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
          {category}
        </p>
        <Link href={`/shop/${_id}`}>
          <h3 className="text-sm font-medium mt-1 hover:text-brass transition-colors line-clamp-1">{name}</h3>
        </Link>

        {/* Price + Likes row */}
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm font-medium">${price}</p>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {likes}
          </span>
        </div>

        {/* Size selector + Add to Cart */}
        {sizes.length > 0 && (
          <div className="mt-2 md:mt-3 space-y-2">
            {!selectedSize && showActions ? (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("shop.selectSize")}</p>
                <div className="flex flex-wrap gap-1">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                      className="px-2 py-1.5 text-[10px] border border-border hover:border-charcoal transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 md:py-2 text-[10px] tracking-wider uppercase transition-colors ${
                  added
                    ? "bg-green-700 text-white"
                    : "border border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                {added ? t("shop.added") : t("shop.addToCart")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
