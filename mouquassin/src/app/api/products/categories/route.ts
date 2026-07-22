import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Product.distinct("category", { isArchived: false });

    const response = NextResponse.json(categories);
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
