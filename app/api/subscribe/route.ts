import {
  subscribeEmail,
  validateSubscribeEmail,
} from "@/lib/api/subscribe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email ?? "";

    const validationError = validateSubscribeEmail(email);
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

    const result = await subscribeEmail({ email });

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.statusCode || 400,
      });
    }

    return NextResponse.json(result, { status: result.statusCode || 201 });
  } catch (error) {
    console.error("Subscribe proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to subscribe",
      },
      { status: 500 }
    );
  }
}
