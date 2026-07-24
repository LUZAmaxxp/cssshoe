import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Lyzane",
  description:
    "Browse our collection of handcrafted tuxedo and mocassin shoes. Premium Italian leather, available in classic black, brown, and burgundy. Free delivery on orders over 1000 DH.",
  openGraph: {
    title: "Shop | Lyzane — Handcrafted Tuxedo & Mocassin Shoes",
    description:
      "Browse our collection of handcrafted tuxedo and mocassin shoes. Premium Italian leather, timeless elegance.",
    url: "https://lyzane.ma/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
