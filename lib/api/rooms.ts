import { cache } from "react";
import { getApiBaseUrl } from "./config";
import { accommodations } from "@/lib/data/accommodations";
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

export interface Room {
  _id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  size: number;
  unit: string;
  pricePerNight: number;
  price: number;
  currency: string;
  currencySymbol: string;
  formattedPrice: string;
  guests: number;
  quantity: number;
  adultCapacity: number;
  childCapacity: number;
  amenities: RoomAmenity[];
  images: RoomImage[];
  isActive: boolean;
  isDeleted: boolean;
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
}

export function mapRoomToPageData(room: Room): RoomPageData {
  const sortedImages = [...room.images].sort((a, b) => a.order - b.order);
  const galleryImages = sortedImages.map((img) => img.url);
  const image =
    galleryImages[0] ?? getLocalImage(room.slug) ?? "/images/hero.jpg";

  return {
    slug: room.slug,
    title: room.title,
    description: room.description,
    price: room.price,
    currencySymbol: room.currencySymbol,
    image,
    galleryImages: galleryImages.length ? galleryImages : [image],
    quantity: room.quantity,
    amenities: room.amenities,
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
    const apiSlug = resolveApiSlug(idOrSlug);
    const params = new URLSearchParams();

    if (query?.checkInDate) params.set("checkInDate", query.checkInDate);
    if (query?.checkOutDate) params.set("checkOutDate", query.checkOutDate);
    if (query?.adults !== undefined) params.set("adults", String(query.adults));
    if (query?.quantity !== undefined) params.set("quantity", String(query.quantity));

    const qs = params.toString();
    const url = `${getApiBaseUrl()}/api/v1/rooms/${encodeURIComponent(apiSlug)}${qs ? `?${qs}` : ""}`;
    const response = await fetch(url, { next: { revalidate: 60 } });

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
  const apiSlug = resolveApiSlug(idOrSlug);
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

/** Live availability fetch (no cache) — used by the room API proxy with stay params. */
export async function fetchRoomAvailability(
  idOrSlug: string,
  query: RoomDetailQuery
): Promise<Room | null> {
  const apiSlug = resolveApiSlug(idOrSlug);
  const params = new URLSearchParams();

  if (query.checkInDate) params.set("checkInDate", query.checkInDate);
  if (query.checkOutDate) params.set("checkOutDate", query.checkOutDate);
  if (query.adults !== undefined) params.set("adults", String(query.adults));
  if (query.quantity !== undefined) params.set("quantity", String(query.quantity));

  const qs = params.toString();
  const url = `${getApiBaseUrl()}/api/v1/rooms/${encodeURIComponent(apiSlug)}${qs ? `?${qs}` : ""}`;
  const response = await fetch(url, { cache: "no-store" });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch room availability (${response.status})`);
  }

  const json: RoomDetailResponse = await response.json();
  return json.success ? json.data : null;
}

export function formatAvailabilityLabel(
  count: number,
  unitSingular = "Chalet"
): string {
  const unitPlural = unitSingular.endsWith("s")
    ? unitSingular
    : `${unitSingular}s`;

  if (count <= 0) {
    return `No ${unitPlural} Available`;
  }

  return `${count} ${count === 1 ? unitSingular : unitPlural} Available`;
}

export interface AccommodationListing {
  id: string;
  slug: string;
  category: "villa" | "room";
  subtitle: string;
  title: string;
  price: number;
  formattedPrice: string;
  guests: number;
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
    subtitle: room.name.toUpperCase(),
    title: room.title,
    price: room.price,
    formattedPrice: room.formattedPrice,
    guests: room.guests,
    area: room.size,
    areaUnit: room.unit,
    image:
      sortedImages[0]?.url ??
      getLocalImage(room.slug) ??
      "/images/hero.jpg",
    description: room.description,
    features: room.amenities.map((amenity) => amenity.name),
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
  const response = await fetch(`${getApiBaseUrl()}/api/v1/rooms`, {
    next: { revalidate: 60 },
  });

  return parseRoomsResponse(response);
});

let roomsClientCache: { data: Room[]; expiresAt: number } | null = null;
const ROOMS_CLIENT_CACHE_MS = 60_000;

export async function fetchRoomsClient(): Promise<Room[]> {
  if (roomsClientCache && Date.now() < roomsClientCache.expiresAt) {
    return roomsClientCache.data;
  }

  const response = await fetch("/api/rooms");

  const data = await parseRoomsResponse(response);
  roomsClientCache = { data, expiresAt: Date.now() + ROOMS_CLIENT_CACHE_MS };
  return data;
}

export async function fetchTourListings(): Promise<TourListingItem[]> {
  const rooms = await fetchRooms();
  return rooms.map(mapRoomToTourListing);
}
