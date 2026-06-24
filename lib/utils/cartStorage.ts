const CART_ID_STORAGE_KEY = "1125_cartId";

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CART_ID_STORAGE_KEY)?.trim();
    return value ? value : null;
  } catch {
    return null;
  }
}

export function setStoredCartId(cartId: string): void {
  if (typeof window === "undefined") return;
  const value = cartId?.trim();
  if (!value) return;
  try {
    window.localStorage.setItem(CART_ID_STORAGE_KEY, value);
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CART_ID_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
