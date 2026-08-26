import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";
import { fetchRoomQuoteClientShared } from "./rooms";

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
  wdPrice?: number;
  wePrice?: number;
  currency: string;
  guests: number;
  quantity: number;
  images?: CartRoomImage[];
}

export interface CartNightBreakdown {
  date: string;
  day?: string;
  dayType?: string;
  rate?: number;
  price?: number;
}

type CartPricingFields = {
  nightBreakdown?: CartNightBreakdown[];
  wdNights?: number;
  weNights?: number;
  wdPrice?: number;
  wePrice?: number;
  subTotal?: number;
};

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
  wdPrice?: number;
  wePrice?: number;
  wdNights?: number;
  weNights?: number;
  nightBreakdown?: CartNightBreakdown[];
  subTotal?: number;
  currency: string;
  isAvailable: boolean;
  availability?: CartPricingFields;
  pricing?: CartPricingFields;
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

function normalizeCartItemPricing(item: CartItem): CartItem {
  const nested = item.availability ?? item.pricing;

  return {
    ...item,
    nightBreakdown: item.nightBreakdown ?? nested?.nightBreakdown,
    wdNights: item.wdNights ?? nested?.wdNights,
    weNights: item.weNights ?? nested?.weNights,
    wdPrice:
      item.wdPrice ??
      nested?.wdPrice ??
      item.roomSnapshot.wdPrice,
    wePrice:
      item.wePrice ??
      nested?.wePrice ??
      item.roomSnapshot.wePrice,
    subTotal: item.subTotal ?? nested?.subTotal,
  };
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

/** Always fetch room quote so weekday/weekend lines are available on payment. */
export async function enrichCartWithRoomPricing(
  cart: CartData
): Promise<CartData> {
  const items = await Promise.all(
    cart.items.map(async (item) => {
      const normalized = normalizeCartItemPricing(item);

      try {
        const idOrSlug = normalized.roomId || normalized.roomSnapshot.slug;
        const quote = await fetchRoomQuoteClientShared(idOrSlug, {
          checkInDate: normalized.checkInDate,
          checkOutDate: normalized.checkOutDate,
          adults: normalized.adults,
          quantity: normalized.quantity > 0 ? normalized.quantity : 1,
        });

        const availability = quote?.availability;
        if (!quote || !availability) {
          return normalized;
        }

        return normalizeCartItemPricing({
          ...normalized,
          wdPrice: availability.wdPrice ?? quote.wdPrice ?? normalized.wdPrice,
          wePrice: availability.wePrice ?? quote.wePrice ?? normalized.wePrice,
          wdNights: availability.wdNights ?? normalized.wdNights,
          weNights: availability.weNights ?? normalized.weNights,
          nightBreakdown:
            availability.nightBreakdown ?? normalized.nightBreakdown,
          subTotal:
            availability.subTotal ??
            normalized.subTotal ??
            cart.subTotal,
        });
      } catch {
        return normalized;
      }
    })
  );

  const subTotal = items.reduce((sum, item) => sum + (item.subTotal ?? 0), 0);

  return { ...cart, items, subTotal: subTotal > 0 ? subTotal : cart.subTotal };
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

  if (data.success && data.data) {
    data.data = await enrichCartWithRoomPricing(data.data);
  }

  return data;
}
