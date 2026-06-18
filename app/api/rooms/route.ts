import { fetchRooms } from "@/lib/api/rooms";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await fetchRooms();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Rooms proxy error:", error);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}
