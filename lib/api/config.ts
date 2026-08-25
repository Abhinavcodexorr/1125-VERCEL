const PRODUCTION_API_BASE_URL = "https://one125-vercel-be-g0yd.onrender.com";

function isNextFrontendOrigin(url: string): boolean {
  try {
    const parsed = new URL(url);
    const isLocal =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
    return isLocal && (port === "3000" || port === "3001");
  } catch {
    return false;
  }
}

/** Always the Render API unless NEXT_PUBLIC_API_BASE_URL is a real backend (not this Next app). */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (fromEnv && !isNextFrontendOrigin(fromEnv)) {
    return fromEnv;
  }
  return PRODUCTION_API_BASE_URL;
}

export function getRoomsListUrl(): string {
  return `${getApiBaseUrl()}/api/v1/rooms`;
}

