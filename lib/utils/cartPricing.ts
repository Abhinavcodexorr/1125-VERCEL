import type { CartItem, CartNightBreakdown } from "@/lib/api/cart";
import { getNightRateValue } from "@/lib/api/rooms";

export interface CartPriceLine {
  dayType: "weekday" | "weekend" | "other";
  rate: number;
  nights: number;
  total: number;
}

function getDayTypeKey(dayType?: string): "weekday" | "weekend" | "other" {
  const label = (dayType ?? "").trim().toLowerCase();
  if (label === "we" || label.includes("weekend")) return "weekend";
  if (label === "wd" || label.includes("weekday")) return "weekday";
  return "other";
}

function resolveNightDayType(
  night: CartNightBreakdown,
  wdPrice?: number,
  wePrice?: number
): "weekday" | "weekend" | "other" {
  const fromField = getDayTypeKey(night.dayType);
  if (fromField !== "other") return fromField;

  const rate = getNightRateValue(night);
  if (rate == null) return "other";
  if (wdPrice != null && rate === wdPrice) return "weekday";
  if (wePrice != null && rate === wePrice) return "weekend";
  return "other";
}

export function formatDayTypeNightLabel(
  dayType: "weekday" | "weekend" | "other",
  nights: number
): string {
  const nightWord = nights === 1 ? "night" : "nights";
  if (dayType === "weekday") return `Weekday ${nightWord}`;
  if (dayType === "weekend") return `Weekend ${nightWord}`;
  return nightWord;
}

function buildLinesFromBreakdown(
  item: CartItem,
  wdPrice?: number,
  wePrice?: number
): CartPriceLine[] {
  const quantity = item.quantity > 0 ? item.quantity : 1;
  const breakdown = item.nightBreakdown;
  if (!breakdown?.length) return [];

  const groups = new Map<
    string,
    { dayType: "weekday" | "weekend" | "other"; rate: number; nights: number; total: number }
  >();

  for (const night of breakdown) {
    const rate = getNightRateValue(night);
    if (rate == null) continue;

    const dayType = resolveNightDayType(night, wdPrice, wePrice);
    const key = `${dayType}-${rate}`;
    const existing = groups.get(key);

    if (existing) {
      existing.nights += 1;
      existing.total += rate;
    } else {
      groups.set(key, { dayType, rate, nights: 1, total: rate });
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      dayType: group.dayType,
      rate: group.rate,
      nights: group.nights,
      total: group.total * quantity,
    }))
    .sort((a, b) => {
      const order = { weekday: 0, weekend: 1, other: 2 };
      return order[a.dayType] - order[b.dayType] || a.rate - b.rate;
    });
}

function buildLinesFromNightCounts(
  item: CartItem,
  wdPrice?: number,
  wePrice?: number
): CartPriceLine[] {
  const quantity = item.quantity > 0 ? item.quantity : 1;
  const lines: CartPriceLine[] = [];

  if ((item.wdNights ?? 0) > 0 && wdPrice != null) {
    lines.push({
      dayType: "weekday",
      rate: wdPrice,
      nights: item.wdNights!,
      total: wdPrice * item.wdNights! * quantity,
    });
  }

  if ((item.weNights ?? 0) > 0 && wePrice != null) {
    lines.push({
      dayType: "weekend",
      rate: wePrice,
      nights: item.weNights!,
      total: wePrice * item.weNights! * quantity,
    });
  }

  return lines;
}

export function getCartItemPriceLines(item: CartItem): CartPriceLine[] {
  const wdPrice = item.wdPrice ?? item.roomSnapshot.wdPrice;
  const wePrice = item.wePrice ?? item.roomSnapshot.wePrice;

  const fromBreakdown = buildLinesFromBreakdown(item, wdPrice, wePrice);
  if (fromBreakdown.length) {
    return fromBreakdown;
  }

  const fromCounts = buildLinesFromNightCounts(item, wdPrice, wePrice);
  if (fromCounts.length) {
    return fromCounts;
  }

  const quantity = item.quantity > 0 ? item.quantity : 1;
  const rate = item.pricePerNight || item.roomSnapshot.price || wdPrice || wePrice || 0;

  return [
    {
      dayType: "other",
      rate,
      nights: item.nights,
      total: item.subTotal ?? rate * item.nights * quantity,
    },
  ];
}
