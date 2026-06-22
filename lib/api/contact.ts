import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactData {
  message?: string;
  _id?: string;
  name?: string;
  email?: string;
}

export interface ContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: ContactData;
  timestamp?: string;
  error?: string | null;
}

export function getContactSuccessMessage(result: ContactResponse): string {
  return (
    result.data?.message?.trim() ||
    result.message?.trim() ||
    "Message sent successfully"
  );
}

export function getContactErrorMessage(result: ContactResponse): string {
  return (
    result.data?.message?.trim() ||
    result.message?.trim() ||
    "Failed to send message"
  );
}

export type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function validateContactFields(
  payload: Partial<ContactPayload>
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!payload.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!payload.email?.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!payload.message?.trim()) {
    errors.message = "Message is required";
  }

  return errors;
}

export async function submitContactMessage(
  payload: ContactPayload
): Promise<ContactResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetchBackend(`${baseUrl}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as ContactResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to send message",
      error: data.error,
    };
  }

  return data;
}

export async function submitContactMessageClient(
  payload: ContactPayload
): Promise<ContactResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
    }),
  });

  const data = (await response.json()) as ContactResponse;

  if (!response.ok) {
    return {
      success: false,
      statusCode: data.statusCode ?? response.status,
      message: data.message ?? "Failed to send message",
      error: data.error,
    };
  }

  return data;
}
