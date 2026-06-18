import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";

export interface AddToCartPayload {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  quantity?: number;
  cartId?: string;
}

export interface AddToCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    cartId: string;
  };
  error?: string | null;
}

export interface CartRoomImage {
  url: string;
  alt: string;
  order: number;
}

export interface CartRoomSnapshot {
  title: string;
  slug: string;
  type: string;
  price: number;
  currency: string;
  guests: number;
  quantity: number;
  images?: CartRoomImage[];
}

export interface CartItem {
  _id: string;
  roomId: string;
  roomSnapshot: CartRoomSnapshot;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  quantity: number;
  nights: number;
  pricePerNight: number;
  subTotal?: number;
  currency: string;
  isAvailable: boolean;
}

export interface CartData {
  cartId: string;
  subTotal: number;
  currency: string;
  expiresAt: string;
  items: CartItem[];
  allAvailable: boolean;
  updatedAt: string;
}

export interface GetCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: CartData;
  error?: string | null;
}

export function validateCartPayload(
  payload: Partial<AddToCartPayload>,
  options?: { includeQuantity?: boolean }
): string | null {
  if (!payload.roomId?.trim()) {
    return "roomId is required";
  }
  if (!payload.checkInDate?.trim()) {
    return "checkInDate and checkOutDate are required";
  }
  if (!payload.checkOutDate?.trim()) {
    return "checkInDate and checkOutDate are required";
  }
  if (payload.checkOutDate <= payload.checkInDate) {
    return "checkOutDate must be after checkInDate";
  }
  if (!payload.adults || payload.adults < 1) {
    return "adults must be at least 1";
  }
  if (
    options?.includeQuantity &&
    payload.quantity !== undefined &&
    payload.quantity < 1
  ) {
    return "quantity must be at least 1 when provided (only for rooms with multiple units)";
  }
  return null;
}

export async function addToCart(
  payload: AddToCartPayload
): Promise<AddToCartResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetchBackend(`${baseUrl}/api/v1/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await response.json()) as AddToCartResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to add item to cart",
      error: data.error,
    };
  }

  return data;
}

export async function addToCartClient(
  payload: AddToCartPayload
): Promise<AddToCartResponse> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as AddToCartResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to add item to cart",
      error: data.error,
    };
  }

  return data;
}

export async function getCart(cartId: string): Promise<GetCartResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetchBackend(
    `${baseUrl}/api/v1/cart/${encodeURIComponent(cartId)}`,
    { cache: "no-store" }
  );

  const data = (await response.json()) as GetCartResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to retrieve cart",
      error: data.error,
    };
  }

  return data;
}

export async function getCartClient(cartId: string): Promise<GetCartResponse> {
  const response = await fetch(`/api/cart/${encodeURIComponent(cartId)}`, {
    cache: "no-store",
  });

  const data = (await response.json()) as GetCartResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to retrieve cart",
      error: data.error,
    };
  }

  return data;
}
