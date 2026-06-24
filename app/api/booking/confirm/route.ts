import { confirmBooking } from "@/lib/api/booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "Reference is required",
      },
      { status: 400 }
    );
  }

  try {
    const result = await confirmBooking(reference);

    if (!result.success) {
      return NextResponse.json(result, { status: result.statusCode || 500 });
    }

    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (error) {
    console.error("Confirm booking proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to confirm booking",
      },
      { status: 500 }
    );
  }
}
