import {
  fetchRoomAvailability,
  fetchRoomBySlug,
} from "@/lib/api/rooms";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  const { idOrSlug } = await params;
  const { searchParams } = request.nextUrl;

  const availabilityQuery = {
    checkInDate: searchParams.get("checkInDate") ?? undefined,
    checkOutDate: searchParams.get("checkOutDate") ?? undefined,
    adults: searchParams.get("adults")
      ? Number(searchParams.get("adults"))
      : undefined,
    quantity: searchParams.get("quantity")
      ? Number(searchParams.get("quantity"))
      : undefined,
  };

  const hasAvailabilityQuery = Boolean(
    availabilityQuery.checkInDate && availabilityQuery.checkOutDate
  );

  try {
    const room = hasAvailabilityQuery
      ? await fetchRoomAvailability(idOrSlug, availabilityQuery)
      : await fetchRoomBySlug(idOrSlug);

    if (!room) {
      return NextResponse.json({ success: false, data: null }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: room },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Room detail proxy error:", error);
    return NextResponse.json(
      { success: false, data: null },
      { status: 500 }
    );
  }
}
