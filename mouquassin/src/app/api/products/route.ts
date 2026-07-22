import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations/product";
import { rateLimiters, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const result = rateLimiters.api(ip);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(result, 60) }
    );
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");

    const filter: Record<string, unknown> = { isArchived: false };

    if (category) filter.category = category;
    if (size) filter.sizes = size;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const result = rateLimiters.api(ip);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(result, 60) }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.create(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
