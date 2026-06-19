import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  countryCode?: string;
  specialRequests?: string;
}

export interface CreateBookingPayload {
  cartId?: string;
  roomId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  quantity?: number;
  children?: number;
  guestDetails: GuestDetails;
}

export interface CreateBookingData {
  bookingReference: string;
  bookingIds: string[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  checkoutUrl: string;
  bookings: unknown[];
}

export interface CreateBookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: CreateBookingData;
  error?: string | null;
}

export const COUNTRY_CODE_OPTIONS = [
  { label: "GH +233", value: "233" },
  { label: "NG +234", value: "234" },
  { label: "US +1", value: "1" },
  { label: "UK +44", value: "44" },
  { label: "ZA +27", value: "27" },
  { label: "KE +254", value: "254" },
  { label: "IN +91", value: "91" },
  { label: "AE +971", value: "971" },
] as const;

export type GuestFieldErrors = {
  firstName?: string;
  email?: string;
  mobileNumber?: string;
};

export function validateGuestDetailsFields(
  guest: Partial<GuestDetails>
): GuestFieldErrors {
  const errors: GuestFieldErrors = {};

  if (!guest.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!guest.email?.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!guest.mobileNumber?.trim()) {
    errors.mobileNumber = "Mobile number is required";
  } else {
    const mobile = formatGuestMobileNumber(
      guest.countryCode ?? "",
      guest.mobileNumber
    );

    if (mobile.replace(/\D/g, "").length < 9) {
      errors.mobileNumber = "Please enter a valid mobile number";
    }
  }

  return errors;
}

export function formatGuestMobileNumber(
  countryCode: string,
  mobileNumber: string
): string {
  const code = countryCode.replace(/\D/g, "");
  let local = mobileNumber.replace(/\D/g, "");

  if (local.startsWith("0")) {
    local = local.slice(1);
  }

  if (!local) return "";

  if (code && !local.startsWith(code)) {
    return `${code}${local}`;
  }

  return local;
}

export function validateGuestDetails(
  guest: Partial<GuestDetails>
): string | null {
  const errors = validateGuestDetailsFields(guest);
  return errors.firstName ?? errors.email ?? errors.mobileNumber ?? null;
}

export function validateCreateBookingPayload(
  payload: Partial<CreateBookingPayload>
): string | null {
  const guestError = validateGuestDetails(payload.guestDetails ?? {});
  if (guestError) return guestError;

  if (!payload.cartId?.trim() && !payload.roomId?.trim()) {
    return "cartId or roomId is required";
  }

  if (!payload.cartId?.trim() && payload.roomId?.trim()) {
    if (!payload.checkInDate?.trim() || !payload.checkOutDate?.trim()) {
      return "roomId, checkInDate, checkOutDate, and adults are required";
    }
    if (!payload.adults || payload.adults < 1) {
      return "roomId, checkInDate, checkOutDate, and adults are required";
    }
    if (payload.quantity !== undefined && payload.quantity < 1) {
      return "quantity must be at least 1";
    }
  }

  return null;
}

function buildBookingBody(payload: CreateBookingPayload): Record<string, unknown> {
  const countryCode = payload.guestDetails.countryCode?.replace(/\D/g, "") ?? "";
  const mobileNumber = formatGuestMobileNumber(
    countryCode,
    payload.guestDetails.mobileNumber
  );

  const guestDetails: Record<string, string> = {
    firstName: payload.guestDetails.firstName.trim(),
    lastName: payload.guestDetails.lastName.trim(),
    email: payload.guestDetails.email.trim(),
    mobileNumber,
  };

  if (countryCode) {
    guestDetails.countryCode = countryCode;
  }
  if (payload.guestDetails.specialRequests?.trim()) {
    guestDetails.specialRequests = payload.guestDetails.specialRequests.trim();
  }

  const body: Record<string, unknown> = { guestDetails };

  if (payload.cartId?.trim()) {
    body.cartId = payload.cartId.trim();
    return body;
  }

  body.roomId = payload.roomId!.trim();
  body.checkInDate = payload.checkInDate!.trim();
  body.checkOutDate = payload.checkOutDate!.trim();
  body.adults = payload.adults!;
  if (payload.quantity !== undefined) body.quantity = payload.quantity;
  if (payload.children !== undefined) body.children = payload.children;

  return body;
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetchBackend(`${baseUrl}/api/v1/booking/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildBookingBody(payload)),
    cache: "no-store",
  });

  const data = (await response.json()) as CreateBookingResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to create booking",
      error: data.error,
    };
  }

  return data;
}

export async function createBookingClient(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const response = await fetch("/api/booking/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildBookingBody(payload)),
  });

  const data = (await response.json()) as CreateBookingResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to create booking",
      error: data.error,
    };
  }

  return data;
}
