import { NextRequest, NextResponse } from "next/server";
import { getAblyRest } from "@/lib/ably-server";
import { auth } from "@/lib/auth";
import type { capabilityOp } from "ably";

export async function GET(request: NextRequest) {
  try {
    const ably = getAblyRest();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId query parameter is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userRole = (session?.user as Record<string, unknown>)?.role;
    const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;
    const isAdmin = userRole === "owner" || userRole === "staff";

    const clientId = isAdmin && userId
      ? `admin:${userId}`
      : `customer:${conversationId}`;

    const perms: capabilityOp[] = ["subscribe", "publish", "presence"];
    const capability: { [key: string]: capabilityOp[] } = isAdmin
      ? { "conversation:*": perms }
      : { [`conversation:${conversationId}`]: perms };

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId,
      capability,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("[ably-token] Failed to create token request:", error);
    return NextResponse.json(
      { error: "Failed to create Ably token" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ably = getAblyRest();
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required in request body" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userRole = (session?.user as Record<string, unknown>)?.role;
    const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;
    const isAdmin = userRole === "owner" || userRole === "staff";

    const clientId = isAdmin && userId
      ? `admin:${userId}`
      : `customer:${conversationId}`;

    const perms: capabilityOp[] = ["subscribe", "publish", "presence"];
    const capability: { [key: string]: capabilityOp[] } = isAdmin
      ? { "conversation:*": perms }
      : { [`conversation:${conversationId}`]: perms };

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId,
      capability,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("[ably-token] Failed to create token request:", error);
    return NextResponse.json(
      { error: "Failed to create Ably token" },
      { status: 500 }
    );
  }
}
