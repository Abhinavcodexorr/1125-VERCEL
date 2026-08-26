import { isRoomDimensionLabel, type RoomAmenity } from "@/lib/api/rooms";

/** Matches the admin amenity picker (Material Symbols). */
const CUSTOM_ICON_MAP: Record<string, string> = {
  hot_cold_shower: "shower",
  shower: "shower",
  high_speed_wifi: "wifi",
  wifi: "wifi",
  mini_fridge: "kitchen",
  kitchen: "kitchen",
  equipped_kitchenette: "kitchen",
  on_request_laundry: "local_laundry_service",
  laundry: "local_laundry_service",
  local_laundry_service: "local_laundry_service",
  air_conditioning: "air",
  air: "air",
  ac: "air",
  flat_screen_tv: "tv",
  tv: "tv",
  butler_service: "person",
  person: "person",
  pool: "pool",
  ocean_view: "waves",
  waves: "waves",
  private_deck: "deck",
  deck: "deck",
  lounge_access: "weekend",
  weekend: "weekend",
  game_room: "sports_esports",
  sports_esports: "sports_esports",
  direct_access_to_game_room: "sports_esports",
  star: "star",
  menu_book: "menu_book",
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[&-]+/g, "_").replace(/[^a-z0-9_]+/g, "_").replace(/_+/g, "_");
}

function getMaterialSymbolName(amenity: RoomAmenity): string | null {
  const icon = slugify(amenity.icon || "");
  const key = slugify(amenity.key || "");
  const name = slugify(amenity.name || "");

  if (amenity.iconType === "material" && icon) {
    return icon;
  }

  const mapped = CUSTOM_ICON_MAP[icon] || CUSTOM_ICON_MAP[key] || CUSTOM_ICON_MAP[name];
  if (mapped) return mapped;

  const haystack = `${key} ${icon} ${name}`;
  if (haystack.includes("wifi")) return "wifi";
  if (haystack.includes("shower")) return "shower";
  if (haystack.includes("fridge") || haystack.includes("refrigerator")) return "kitchen";
  if (haystack.includes("laundry")) return "local_laundry_service";
  if (haystack.includes("kitchen")) return "kitchen";
  if (haystack.includes("tv") || haystack.includes("television")) return "tv";
  if (haystack.includes("butler")) return "person";
  if (haystack.includes("conditioning") || haystack.split("_").includes("ac")) return "air";
  if (haystack.includes("deck") || haystack.includes("terrace")) return "deck";
  if (haystack.includes("lounge") || haystack.includes("sofa")) return "weekend";
  if (haystack.includes("ocean") || haystack.includes("wave")) return "waves";
  if (haystack.includes("game")) return "sports_esports";
  if (haystack.includes("pool")) return "pool";
  if (haystack.includes("parking")) return "local_parking";
  if (haystack.includes("breakfast")) return "free_breakfast";
  if (haystack.includes("beach")) return "beach_access";

  return icon || null;
}

function AmenityIcon({ amenity }: { amenity: RoomAmenity }) {
  const symbol = getMaterialSymbolName(amenity);

  if (!symbol) {
    return (
      <span
        className="w-5 h-5 shrink-0 inline-flex items-center justify-center rounded-full border border-[#C22D28]/35 text-[8px] font-jeko-bold text-[#C22D28]"
        aria-hidden
      >
        {(amenity.name[0] || "?").toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className="material-symbols-outlined text-[20px] text-[#C22D28] leading-none shrink-0"
      title={amenity.name}
      aria-hidden
    >
      {symbol}
    </span>
  );
}

export default function AmenityList({ amenities }: { amenities: RoomAmenity[] }) {
  const visibleAmenities = amenities.filter((amenity) => {
    return !isRoomDimensionLabel(amenity.name) && !isRoomDimensionLabel(amenity.key);
  });

  if (!visibleAmenities.length) return null;

  return (
    <div className="grid grid-cols-2 gap-y-5 gap-x-8 mt-10 text-[13px] text-[#444]">
      {visibleAmenities.map((amenity) => (
        <div key={amenity.key} className="flex items-center gap-3">
          <AmenityIcon amenity={amenity} />
          <span className="font-jako-medium text-[14px] font-[400]">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
}
