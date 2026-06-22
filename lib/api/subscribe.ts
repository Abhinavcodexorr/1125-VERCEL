import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";

export interface SubscribePayload {
  email: string;
}

export interface SubscribeData {
  _id: string;
  email: string;
  source: string;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: SubscribeData;
  timestamp?: string;
  error?: string | null;
}

export function validateSubscribeEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email address is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please enter a valid email address";
  }
  return null;
}

export async function subscribeEmail(
  payload: SubscribePayload
): Promise<SubscribeResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetchBackend(`${baseUrl}/api/v1/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email.trim() }),
    cache: "no-store",
  });

  const data = (await response.json()) as SubscribeResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to subscribe",
      error: data.error,
    };
  }

  return data;
}

export async function subscribeEmailClient(
  payload: SubscribePayload
): Promise<SubscribeResponse> {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email.trim() }),
  });

  const data = (await response.json()) as SubscribeResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to subscribe",
      error: data.error,
    };
  }

  return data;
}
