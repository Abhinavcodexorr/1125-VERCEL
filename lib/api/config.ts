const PRODUCTION_API_BASE_URL = "https://one125-vercel-be-g0yd.onrender.com";

/** API base URL — set NEXT_PUBLIC_API_BASE_URL for a local backend, otherwise uses Render. */
export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    PRODUCTION_API_BASE_URL
  );
}
