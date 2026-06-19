const DEFAULT_IMAGE_ALT = "1125 Beach Villa";

export function resolveImageAlt(
  label: string | undefined | null,
  fallback = DEFAULT_IMAGE_ALT
): string {
  const trimmed = label?.trim();
  return trimmed || fallback;
}

export function isRemoteImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

const OPTIMIZABLE_REMOTE_HOSTS = new Set([
  "palmisland.s3.eu-north-1.amazonaws.com",
]);

/** Use Next.js image optimization when the src is local or on an allowed remote host. */
export function isNextImageOptimizable(src: string): boolean {
  if (!isRemoteImage(src)) return true;

  try {
    return OPTIMIZABLE_REMOTE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}
