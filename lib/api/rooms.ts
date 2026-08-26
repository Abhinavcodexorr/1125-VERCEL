import { cache } from "react";
import { getApiBaseUrl } from "./config";
import { fetchBackend } from "./fetchBackend";
import { accommodations } from "@/lib/data/accommodations";
import { formatListingPrice } from "@/lib/utils/cartDisplay";
import type { TourItem } from "@/lib/data/tours";

export interface RoomAmenity {
  key: string;
  name: string;
  icon: string;
  iconType: string;
}

export interface RoomImage {
  url: string;
  alt: string;
  order: number;
}

export interface RoomNightBreakdown {
  date: string;
  day?: string;
  dayType?: string;
  rate?: number;
  /** @deprecated API returns `rate` — kept for backward compatibility */
  price?: number;
  rateType?: string;
}

export function getNightRateValue(night: {
  rate?: number;
  price?: number;
}): number | null {
  const value = night.rate ?? night.price;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Highest per-night rate from breakdown or wd/we — never an average. */
export function getHighestPerNightRate(options: {
  nightBreakdown?: RoomNightBreakdown[];
  wdPrice?: number;
  wePrice?: number;
  pricePerNight?: number;
  fallback?: number;
}): number {
  const breakdownRates = (options.nightBreakdown ?? [])
    .map(getNightRateValue)
    .filter((value): value is number => value !== null);

  if (breakdownRates.length > 0) {
    return Math.max(...breakdownRates);
  }

  const wd =
    typeof options.wdPrice === "number" && Number.isFinite(options.wdPrice)
      ? options.wdPrice
      : null;
  const we =
    typeof options.wePrice === "number" && Number.isFinite(options.wePrice)
      ? options.wePrice
      : null;

  if (wd !== null && we !== null) return Math.max(wd, we);
  if (wd !== null) return wd;
  if (we !== null) return we;

  if (
    typeof options.pricePerNight === "number" &&
    Number.isFinite(options.pricePerNight)
  ) {
    return options.pricePerNight;
  }

  return options.fallback ?? 0;
}

export interface RoomAvailability {
  isAvailable: boolean;
  quantity: number;
  availableUnits: number;
  bookedUnits: number;
  requestedQuantity: number;
  showQuantityPicker: boolean;
  maxSelectableQuantity: number;
  nights: number;
  subTotal: number;
  wdNights?: number;
  weNights?: number;
  wdPrice?: number;
  wePrice?: number;
  avgPricePerNight?: number;
  nightBreakdown?: RoomNightBreakdown[];
  maxTotalGuests?: number;
}

export interface RoomQuote {
  wdPrice: number;
  wePrice: number;
  /** Current check-in day rate from GET /rooms/:id */
  pricePerNight: number;
  currency: string;
  currencySymbol: string;
  availability: RoomAvailability | null;
}

export interface Room {
  _id: string;
  name: string;
  title: string;
  type: string;
  slug: string;
  description: string;
  size: number;
  unit: string;
  pricePerNight: number;
  price: number;
  wdPrice?: number;
  wePrice?: number;
  currency: string;
  currencySymbol: string;
  formattedPrice: string;
  guests: number;
  /** Total units in the property (inventory cap). */
  quantity: number;
  adultCapacity: number;
  childCapacity: number;
  bedConfiguration?: string;
  amenities: RoomAmenity[];
  images: RoomImage[];
  isActive: boolean;
  isDeleted: boolean;
  availability?: RoomAvailability;
}

export interface RoomsResponse {
  success: boolean;
  totalItems: number;
  page: number;
  limit: number;
  data: Room[];
}

export interface TourListingItem extends TourItem {
  slug: string;
}

export type TourItemWithSlug = TourItem & { slug: string };

/** Legacy URL slugs mapped to API slugs. */
const LEGACY_SLUG_MAP: Record<string, string> = {
  "5-bedroom-beach-house": "the-villa",
};

export function resolveApiSlug(urlSlug: string): string {
  return LEGACY_SLUG_MAP[urlSlug] ?? urlSlug;
}

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

/** Use MongoDB _id as-is; only map legacy URL slugs. */
export function resolveRoomIdOrSlug(idOrSlug: string): string {
  if (OBJECT_ID_REGEX.test(idOrSlug)) {
    return idOrSlug;
  }
  return resolveApiSlug(idOrSlug);
}

export function getAccommodationHref(slug: string): string {
  return `/accommodations/${slug}`;
}

function getLocalImage(slug: string): string | undefined {
  const localSlug = LEGACY_SLUG_MAP[slug] ?? slug;
  return accommodations.find((item) => item.slug === localSlug)?.image;
}

export function mapRoomToTourItem(room: Room, id: number): TourItemWithSlug {
  const sortedImages = [...room.images].sort((a, b) => a.order - b.order);
  const feature =
    room.amenities
      .slice(0, 3)
      .map((amenity) => amenity.name)
      .join(", ") || room.description;

  const labelType = room.quantity > 1 ? "Units" : "Occupancy";
  const labelValue =
    room.quantity > 1
      ? String(room.quantity)
      : `${room.guests} Guest${room.guests === 1 ? "" : "s"}`;

  return {
    id,
    image: sortedImages[0]?.url ?? getLocalImage(room.slug) ?? "/images/hero.jpg",
    title: room.title,
    feature,
    labelType,
    labelValue,
    gallerySection: "all",
    slug: room.slug,
  };
}

export function mapRoomsToTourItems(rooms: Room[]): TourItemWithSlug[] {
  return rooms.map((room, index) => mapRoomToTourItem(room, index + 1));
}

export interface RoomPageData {
  slug: string;
  title: string;
  description: string;
  price: number;
  currencySymbol: string;
  image: string;
  galleryImages: string[];
  quantity: number;
  amenities: RoomAmenity[];
  guests: number;
  bedConfiguration?: string;
}

function getLocalTitle(slug: string): string | undefined {
  const localSlug = LEGACY_SLUG_MAP[slug] ?? slug;
  return accommodations.find((item) => item.slug === localSlug)?.title;
}

export function getRoomDisplayTitle(room: Room): string {
  return room.title?.trim() || room.name?.trim() || getLocalTitle(room.slug) || "";
}

export function getRoomDisplayType(room: Room): string {
  return room.type?.trim() || "";
}

export interface AccommodationTab {
  slug: string;
  label: string;
}

/** Detail page tabs use `title`. */
export function buildAccommodationTabs(
  rooms: Room[],
  currentRoom?: Room | null
): AccommodationTab[] {
  return rooms.map((item) => {
    const source = currentRoom?.slug === item.slug ? currentRoom : item;
    return {
      slug: item.slug,
      label: getRoomDisplayTitle(source),
    };
  });
}

export function mapRoomToPageData(room: Room): RoomPageData {
  const sortedImages = [...room.images].sort((a, b) => a.order - b.order);
  const galleryImages = sortedImages.map((img) => img.url);
  const image =
    galleryImages[0] ?? getLocalImage(room.slug) ?? "/images/hero.jpg";

  return {
    slug: room.slug,
    title: getRoomDisplayTitle(room),
    description: room.description,
    price: room.price,
    currencySymbol: room.currencySymbol,
    image,
    galleryImages: galleryImages.length ? galleryImages : [image],
    quantity: room.quantity,
    amenities: room.amenities,
    guests: room.guests,
    bedConfiguration: room.bedConfiguration?.trim() || "",
  };
}

export interface RoomDetailResponse {
  success: boolean;
  data: Room;
}

export interface RoomDetailQuery {
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  quantity?: number;
}

export async function fetchRoomBySlug(
  idOrSlug: string,
  query?: RoomDetailQuery
): Promise<Room | null> {
  return fetchRoomBySlugCached(idOrSlug, query);
}

const fetchRoomBySlugCached = cache(
  async (idOrSlug: string, query?: RoomDetailQuery): Promise<Room | null> => {
    const apiSlug = resolveRoomIdOrSlug(idOrSlug);
    const params = new URLSearchParams();

    if (query?.checkInDate) params.set("checkInDate", query.checkInDate);
    if (query?.checkOutDate) params.set("checkOutDate", query.checkOutDate);
    if (query?.adults !== undefined) params.set("adults", String(query.adults));
    if (query?.quantity !== undefined) params.set("quantity", String(query.quantity));

    const qs = params.toString();
    const url = `${getApiBaseUrl()}/api/v1/rooms/${encodeURIComponent(apiSlug)}${qs ? `?${qs}` : ""}`;
    const response = await fetchBackend(url, { cache: "no-store" });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to fetch room (${response.status})`);
    }

    const json: RoomDetailResponse = await response.json();
    return json.success ? json.data : null;
  }
);

export async function fetchRoomBySlugClient(
  idOrSlug: string,
  query?: RoomDetailQuery
): Promise<Room | null> {
  const apiSlug = resolveRoomIdOrSlug(idOrSlug);
  const params = new URLSearchParams();

  if (query?.checkInDate) params.set("checkInDate", query.checkInDate);
  if (query?.checkOutDate) params.set("checkOutDate", query.checkOutDate);
  if (query?.adults !== undefined) params.set("adults", String(query.adults));
  if (query?.quantity !== undefined) params.set("quantity", String(query.quantity));

  const qs = params.toString();
  const response = await fetch(
    `/api/rooms/${encodeURIComponent(apiSlug)}${qs ? `?${qs}` : ""}`,
    { cache: "no-store" }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch room (${response.status})`);
  }

  const json: RoomDetailResponse = await response.json();
  return json.success ? json.data : null;
}

const availabilityInFlight = new Map<string, Promise<Room | null>>();
const availabilityCache = new Map<
  string,
  { fetchedAt: number; data: Room | null }
>();
const AVAILABILITY_CACHE_MS = 15_000;

function availabilityRequestKey(
  idOrSlug: string,
  query: Pick<RoomDetailQuery, "checkInDate" | "checkOutDate" | "adults" | "quantity">
): string {
  return `${idOrSlug}|${query.checkInDate}|${query.checkOutDate}|${query.adults ?? ""}|${query.quantity ?? ""}`;
}

function mapRoomToQuote(room: Room | null): RoomQuote | null {
  if (!room) return null;

  return {
    wdPrice: room.wdPrice ?? room.pricePerNight,
    wePrice: room.wePrice ?? room.pricePerNight,
    pricePerNight: room.pricePerNight,
    currency: room.currency,
    currencySymbol: room.currencySymbol,
    availability: room.availability ?? null,
  };
}

/** Dedupes identical quote requests (e.g. desktop + mobile booking panels). */
export async function fetchRoomQuoteClientShared(
  idOrSlug: string,
  query: Pick<RoomDetailQuery, "checkInDate" | "checkOutDate" | "adults" | "quantity">
): Promise<RoomQuote | null> {
  if (!query.checkInDate || !query.checkOutDate) return null;

  const key = availabilityRequestKey(idOrSlug, query);
  const cached = availabilityCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < AVAILABILITY_CACHE_MS) {
    return mapRoomToQuote(cached.data as Room | null);
  }

  let pending = availabilityInFlight.get(key);
  if (!pending) {
    pending = fetchRoomBySlugClient(idOrSlug, query)
      .then((room) => {
        availabilityCache.set(key, { fetchedAt: Date.now(), data: room });
        return room;
      })
      .finally(() => {
        availabilityInFlight.delete(key);
      });
    availabilityInFlight.set(key, pending);
  }

  const room = await pending;
  return mapRoomToQuote(room);
}

/** @deprecated Use fetchRoomQuoteClientShared — returns availability only. */
export async function fetchRoomAvailabilityClientShared(
  idOrSlug: string,
  query: Pick<RoomDetailQuery, "checkInDate" | "checkOutDate" | "adults" | "quantity">
): Promise<RoomAvailability | null> {
  const quote = await fetchRoomQuoteClientShared(idOrSlug, query);
  return quote?.availability ?? null;
}

/** Live availability fetch (no cache) — used by the room API proxy with stay params. */
export async function fetchRoomAvailability(
  idOrSlug: string,
  query: RoomDetailQuery
): Promise<Room | null> {
  const apiSlug = resolveRoomIdOrSlug(idOrSlug);
  const params = new URLSearchParams();

  if (query.checkInDate) params.set("checkInDate", query.checkInDate);
  if (query.checkOutDate) params.set("checkOutDate", query.checkOutDate);
  if (query.adults !== undefined) params.set("adults", String(query.adults));
  if (query.quantity !== undefined) params.set("quantity", String(query.quantity));

  const qs = params.toString();
  const url = `${getApiBaseUrl()}/api/v1/rooms/${encodeURIComponent(apiSlug)}${qs ? `?${qs}` : ""}`;
  const response = await fetchBackend(url, { cache: "no-store" });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch room availability (${response.status})`);
  }

  const json: RoomDetailResponse = await response.json();
  return json.success ? json.data : null;
}

export interface RoomBookedDatesResponse {
  success: boolean;
  message?: string;
  data?: {
    bookedDates?: string[];
  };
}

function parseBookedDates(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => /^\d{4}-\d{2}-\d{2}/.test(entry))
    .map((entry) => entry.slice(0, 10));
}

export async function fetchRoomBookedDates(
  idOrSlug: string
): Promise<string[]> {
  const apiSlug = resolveRoomIdOrSlug(idOrSlug);
  const url = `${getApiBaseUrl()}/api/v1/rooms/${encodeURIComponent(apiSlug)}/availability`;
  const response = await fetchBackend(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch booked dates (${response.status})`);
  }

  const json = (await response.json()) as RoomBookedDatesResponse;
  if (!json.success) return [];
  return parseBookedDates(json.data?.bookedDates);
}

export async function fetchRoomBookedDatesClient(
  idOrSlug: string
): Promise<string[]> {
  const apiSlug = resolveRoomIdOrSlug(idOrSlug);
  const response = await fetch(
    `/api/rooms/${encodeURIComponent(apiSlug)}/availability`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch booked dates (${response.status})`);
  }

  const json = (await response.json()) as RoomBookedDatesResponse;
  if (!json.success) return [];
  return parseBookedDates(json.data?.bookedDates);
}

export function formatAvailabilityLabel(
  availableUnits: number,
  unitSingular = "Chalet"
): string {
  const unitPlural = unitSingular.endsWith("s")
    ? unitSingular
    : `${unitSingular}s`;

  if (availableUnits <= 0) {
    return `No ${unitPlural} Available`;
  }

  return `${availableUnits} ${availableUnits === 1 ? unitSingular : unitPlural} Available`;
}

export function parseRoomAvailability(room: Room | null): RoomAvailability | null {
  if (!room?.availability) return null;
  return room.availability;
}

export function isRoomDimensionLabel(text: string): boolean {
  const label = text.toLowerCase().trim();
  return (
    /\d+\s*(sq\.?\s*m|sqm|m²|m2|square\s*met)/i.test(label) ||
    /^(size|area|room size|square metres?|sq m|sqm)$/i.test(label)
  );
}

export interface AccommodationListing {
  id: string;
  slug: string;
  category: "villa" | "room";
  /** Room type shown first in red. */
  type: string;
  /** Room title shown as the large blue heading. */
  title: string;
  price: number;
  formattedPrice: string;
  guests: number;
  bedConfiguration: string;
  area: number;
  areaUnit: string;
  image: string;
  description: string;
  features: string[];
}

export function mapRoomToAccommodationListing(room: Room): AccommodationListing {
  const sortedImages = [...room.images].sort((a, b) => a.order - b.order);

  return {
    id: room._id,
    slug: room.slug,
    category: room.slug === "the-villa" ? "villa" : "room",
    type: room.type?.trim() || "",
    title: room.title?.trim() || room.name?.trim() || "",
    price: room.price,
    formattedPrice: formatListingPrice(room.price, room.currencySymbol),
    guests: room.guests,
    bedConfiguration: room.bedConfiguration?.trim() || "",
    area: room.size,
    areaUnit: room.unit,
    image: sortedImages[0]?.url ?? "",
    description: room.description,
    features: room.amenities
      .map((amenity) => amenity.name)
      .filter((name) => !isRoomDimensionLabel(name)),
  };
}

export function mapRoomsToAccommodationListings(
  rooms: Room[]
): AccommodationListing[] {
  return rooms.map(mapRoomToAccommodationListing);
}

export function mapRoomToTourListing(room: Room): TourListingItem {
  const tourItem = mapRoomToTourItem(room, 0);
  return { ...tourItem, slug: room.slug };
}

async function parseRoomsResponse(response: Response): Promise<Room[]> {
  if (!response.ok) {
    throw new Error(`Failed to fetch rooms (${response.status})`);
  }

  const json: RoomsResponse = await response.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Invalid rooms API response");
  }

  return json.data.filter((room) => room.isActive && !room.isDeleted);
}

export async function fetchRooms(): Promise<Room[]> {
  return fetchRoomsCached();
}

const fetchRoomsCached = cache(async (): Promise<Room[]> => {
  const response = await fetchBackend(`${getApiBaseUrl()}/api/v1/rooms`, {
    cache: "no-store",
  });

  return parseRoomsResponse(response);
});

let roomsClientCache: { data: Room[]; expiresAt: number } | null = null;
let roomsClientInflight: Promise<Room[]> | null = null;
const ROOMS_CLIENT_CACHE_MS = 60_000;

export async function fetchRoomsClient(): Promise<Room[]> {
  if (roomsClientCache && Date.now() < roomsClientCache.expiresAt) {
    return roomsClientCache.data;
  }

  if (roomsClientInflight) {
    return roomsClientInflight;
  }

  roomsClientInflight = (async () => {
    try {
      const response = await fetch("/api/rooms", { cache: "no-store" });
      const data = await parseRoomsResponse(response);
      roomsClientCache = {
        data,
        expiresAt: Date.now() + ROOMS_CLIENT_CACHE_MS,
      };
      return data;
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      throw error;
    } finally {
      roomsClientInflight = null;
    }
  })();

  return roomsClientInflight;
}

export async function fetchTourListings(): Promise<TourListingItem[]> {
  const rooms = await fetchRooms();
  return rooms.map(mapRoomToTourListing);
}
