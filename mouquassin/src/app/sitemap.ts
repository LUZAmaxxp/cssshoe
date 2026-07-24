import { MetadataRoute } from "next";

const BASE_URL = "https://lyzane.ma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${BASE_URL}/api/products?limit=200`);
    if (res.ok) {
      const data = await res.json();
      const products = data.products || data;
      productPages = products.map((p: { _id: string; slug?: string }) => ({
        url: `${BASE_URL}/shop/${p.slug || p._id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // silent
  }

  return [...staticPages, ...productPages];
}
