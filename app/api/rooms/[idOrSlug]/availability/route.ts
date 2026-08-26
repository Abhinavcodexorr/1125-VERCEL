import { fetchRoomBookedDates } from "@/lib/api/rooms";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  const { idOrSlug } = await params;

  try {
    const bookedDates = await fetchRoomBookedDates(idOrSlug);

    return NextResponse.json(
      {
        success: true,
        data: { bookedDates },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Room booked dates proxy error:", error);
    return NextResponse.json(
      { success: false, data: { bookedDates: [] } },
      { status: 500 }
    );
  }
}
