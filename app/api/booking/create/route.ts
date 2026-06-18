import {
  createBooking,
  validateCreateBookingPayload,
  type CreateBookingPayload,
} from "@/lib/api/booking";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBookingPayload;

    const validationError = validateCreateBookingPayload(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: validationError,
        },
        { status: 400 }
      );
    }

    const result = await createBooking(body);

    if (!result.success) {
      return NextResponse.json(result, { status: result.statusCode || 400 });
    }

    return NextResponse.json(result, { status: result.statusCode || 201 });
  } catch (error) {
    console.error("Create booking proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to create booking",
      },
      { status: 500 }
    );
  }
}
