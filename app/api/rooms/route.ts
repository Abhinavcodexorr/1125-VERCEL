import { getRoomsListUrl } from "@/lib/api/config";
import { fetchBackend } from "@/lib/api/fetchBackend";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = getRoomsListUrl();

  try {
    const response = await fetchBackend(url, { cache: "no-store" });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Rooms proxy error:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Unable to reach the rooms service" },
      { status: 503 }
    );
  }
}
