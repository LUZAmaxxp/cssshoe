import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations/product";
import { rateLimiters, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

// Fields needed for shop grid (no description, no timestamps)
const SHOP_FIELDS = "_id name price images category sizes likeCount";

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "24")));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isArchived: false };

    if (category) filter.category = category;
    if (size) filter.sizes = size;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(SHOP_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

    // Cache for 60s, stale-while-revalidate for 5min
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Separate endpoint for categories (lightweight)
export async function HEAD() {
  try {
    await connectToDatabase();
    const categories = await Product.distinct("category", { isArchived: false });
    const response = new NextResponse(null, { status: 200 });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    response.headers.set("X-Categories", JSON.stringify(categories));
    return response;
  } catch {
    return new NextResponse(null, { status: 500 });
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
