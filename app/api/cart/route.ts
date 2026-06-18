import {
  addToCart,
  validateCartPayload,
  type AddToCartPayload,
} from "@/lib/api/cart";
import { NextRequest, NextResponse } from "next/server";

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AddToCartPayload;

    const validationError = validateCartPayload(body, {
      includeQuantity: body.quantity !== undefined,
    });
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

    if (!OBJECT_ID_REGEX.test(body.roomId.trim())) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Invalid roomId",
        },
        { status: 400 }
      );
    }

    const result = await addToCart(body);

    if (!result.success) {
      const statusCode =
        result.statusCode === 500 &&
        result.error?.includes("Cast to ObjectId")
          ? 400
          : result.statusCode || 400;

      return NextResponse.json(
        {
          ...result,
          statusCode,
          message:
            statusCode === 400 && result.error?.includes("Cast to ObjectId")
              ? "Invalid roomId"
              : result.message,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(result, { status: result.statusCode || 201 });
  } catch (error) {
    console.error("Cart proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to add item to cart",
      },
      { status: 500 }
    );
  }
}
