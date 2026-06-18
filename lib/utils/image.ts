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
