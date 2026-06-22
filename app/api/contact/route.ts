import {
  submitContactMessage,
  validateContactFields,
} from "@/lib/api/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const fieldErrors = validateContactFields(body);
    const firstError =
      fieldErrors.name ?? fieldErrors.email ?? fieldErrors.message;

    if (firstError) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: firstError,
        },
        { status: 400 }
      );
    }

    const result = await submitContactMessage({
      name: body.name!,
      email: body.email!,
      message: body.message!,
    });

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.statusCode || 400,
      });
    }

    return NextResponse.json(result, { status: result.statusCode || 201 });
  } catch (error) {
    console.error("Contact proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
