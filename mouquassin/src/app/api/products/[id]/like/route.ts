import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await AnalyticsEvent.create({ type: "wishlist_add", productId: id });

    return NextResponse.json({ likeCount: product.likeCount });
  } catch (error) {
    console.error("Failed to like product:", error);
    return NextResponse.json(
      { error: "Failed to like product" },
      { status: 500 }
    );
  }
}
