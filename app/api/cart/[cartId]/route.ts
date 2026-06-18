import { getCart } from "@/lib/api/cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  const { cartId } = await params;

  if (!cartId?.trim()) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "Cart not found",
      },
      { status: 404 }
    );
  }

  try {
    const result = await getCart(cartId);

    if (!result.success) {
      return NextResponse.json(result, { status: result.statusCode || 500 });
    }

    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (error) {
    console.error("Get cart proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to retrieve cart",
      },
      { status: 500 }
    );
  }
}
