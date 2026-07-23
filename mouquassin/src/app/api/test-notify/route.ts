import { NextResponse } from "next/server";

export async function GET() {
  const topic = process.env.NTFY_TOPIC || "lyzane-orders";

  try {
    const response = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: "Vercel Test",
        Priority: "high",
        Tags: "white_check_mark",
      },
      body: "Test from Vercel deployment - notifications are working!",
    });

    const body = await response.text();

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      topic,
      response: body,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      topic,
    }, { status: 500 });
  }
}
