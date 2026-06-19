import { accommodations } from "@/lib/data/accommodations";
import type { CartData, CartItem } from "@/lib/api/cart";

const LEGACY_SLUG_MAP: Record<string, string> = {
  "the-villa": "5-bedroom-beach-house",
};

export function getRoomImage(slug: string): string {
  const localSlug = LEGACY_SLUG_MAP[slug] ?? slug;
  return (
    accommodations.find((item) => item.slug === localSlug)?.image ??
    "/images/50deabec7df2ce9855d14e5125d8b2a525e84eb8 (1).jpg"
  );
}

export function getCartItemImage(item: CartItem): string {
  const images = item.roomSnapshot.images;
  if (images?.length) {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    return sorted[0].url;
  }
  return getRoomImage(item.roomSnapshot.slug);
}

export function getCartItemImageAlt(item: CartItem): string {
  const { title, slug } = item.roomSnapshot;
  const images = item.roomSnapshot.images;
  if (images?.length) {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    const alt = sorted[0].alt?.trim();
    if (alt) return alt;
  }
  const roomTitle = title?.trim();
  if (roomTitle) return roomTitle;
  if (slug?.trim()) return slug.replace(/-/g, " ");
  return "Room photo";
}

export function formatCartDateRange(checkIn: string, checkOut: string): string {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const sameYear = start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endFmt = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startFmt} - ${endFmt}`;
}

export function formatGuests(item: CartItem): string {
  const parts = [
    `${item.adults} ${item.adults === 1 ? "Adult" : "Adults"}`,
  ];

  if (item.children > 0) {
    parts.push(
      `${item.children} ${item.children === 1 ? "Child" : "Children"}`
    );
  }

  if (item.quantity > 1) {
    parts.push(`${item.quantity} Units`);
  }

  return parts.join(", ");
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function getPrimaryRoomTitle(cart: CartData): string {
  return cart.items[0]?.roomSnapshot.title ?? "your stay";
}

export function getPrimaryRoomDetailHref(cart: CartData | null | undefined): string {
  const slug = cart?.items[0]?.roomSnapshot.slug?.trim();
  const base = slug ? `/accommodations/${slug}` : "/accommodations";
  const cartId = cart?.cartId?.trim();
  return cartId ? `${base}?cartId=${encodeURIComponent(cartId)}` : base;
}

export function getItemLineTotal(item: CartItem): number {
  return item.subTotal ?? item.pricePerNight * item.nights * item.quantity;
}
