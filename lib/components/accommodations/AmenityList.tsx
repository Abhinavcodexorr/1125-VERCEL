import type { RoomAmenity } from "@/lib/api/rooms";

function normalizeAmenityKey(amenity: RoomAmenity): string {
  return `${amenity.key} ${amenity.icon} ${amenity.name}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ");
}

function getAmenityInitials(name: string): string {
  return name
    .split(/[\s&-]+/)
    .filter((word) => word.length > 0 && !/^(and|or|the|on|request)$/i.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function formatIconKeyLabel(amenity: RoomAmenity): string {
  const source = amenity.name || amenity.icon || amenity.key;
  return source
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMaterialSymbolName(amenity: RoomAmenity): string | null {
  const label = normalizeAmenityKey(amenity);

  if (label.includes("wifi") || label.includes("wfi")) return "wifi";
  if (label.includes("shower")) return "shower";
  if (label.includes("kitchen")) return "kitchen";
  if (label.includes("fridge") || label.includes("refrigerator")) return "kitchen";
  if (label.includes("laundry")) return "local_laundry_service";
  if (label.includes("tv") || label.includes("television")) return "tv";
  if (label.includes("butler")) return "room_service";
  if (label.includes("conditioning") || label.split(" ").includes("ac")) {
    return "ac_unit";
  }
  if (label.includes("pool")) return "pool";
  if (label.includes("parking")) return "local_parking";
  if (label.includes("breakfast")) return "free_breakfast";
  if (label.includes("beach")) return "beach_access";

  return null;
}

function AmenityTextFallback({ amenity }: { amenity: RoomAmenity }) {
  const initials = getAmenityInitials(amenity.name) || amenity.name.slice(0, 2).toUpperCase();

  return (
    <span
      className="w-5 h-5 shrink-0 inline-flex items-center justify-center rounded-full border border-[#C22D28]/35 bg-[#C22D28]/8 text-[8px] font-jeko-bold text-[#C22D28] leading-none uppercase"
      title={formatIconKeyLabel(amenity)}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function MaterialAmenityIcon({ amenity, symbol }: { amenity: RoomAmenity; symbol: string }) {
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

function renderAmenitySvg(label: string) {
  const iconClass = "w-5 h-5 text-[#C22D28] shrink-0";

  if (label.includes("shower")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A3.75 3.75 0 0 0 2.25 7.5v10.5a1.5 1.5 0 0 0 1.5 1.5H18a1.5 1.5 0 0 0 1.5-1.5V7.5A3.75 3.75 0 0 0 15.75 3.75h-1.5m-6.75 0v3.75m6.75-3.75v3.75M5.25 7.5h13.5M7.5 11.25h.008v.008H7.5v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008H15v-.008Zm-7.5 3.75h.008v.008H7.5v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008H15v-.008Z" />
      </svg>
    );
  }

  if (label.includes("conditioning") || label.split(" ").includes("ac")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75A1.875 1.875 0 0 1 20.25 6.375v1.5a1.875 1.875 0 0 1-1.875 1.875H5.625A1.875 1.875 0 0 1 3.75 7.875v-1.5A1.875 1.875 0 0 1 5.625 4.5Z" />
      </svg>
    );
  }

  if (label.includes("wifi") || label.includes("wfi")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856a9.75 9.75 0 0 1 13.788 0M1.924 8.674a14.25 14.25 0 0 1 20.152 0M12 19.25h.008v.008H12v-.008Z" />
      </svg>
    );
  }

  if (label.includes("kitchen")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    );
  }

  if (label.includes("fridge") || label.includes("refrigerator")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25Zm-6.75 4.5h.008v.008h-.008V8.25Zm0 4.5h.008v.008h-.008v-.008Z" />
      </svg>
    );
  }

  if (label.includes("tv") || label.includes("television")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-9-3v3m6-3v3M3.75 3.75h16.5A1.5 1.5 0 0 1 21.75 5.25v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 15.75V5.25A1.5 1.5 0 0 1 3.75 3.75Z" />
      </svg>
    );
  }

  if (label.includes("laundry")) {
    return (
      <svg className="w-5 h-5 text-[#AF2F2C] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.50 6h15m-15 12h15" />
      </svg>
    );
  }

  if (label.includes("butler")) {
    return (
      <svg className="w-5 h-5 text-[#AF2F2C] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  }

  return null;
}

function AmenityIcon({ amenity }: { amenity: RoomAmenity }) {
  const label = normalizeAmenityKey(amenity);
  const svgIcon = renderAmenitySvg(label);

  if (svgIcon) return svgIcon;

  const materialSymbol = getMaterialSymbolName(amenity);
  if (materialSymbol) {
    return <MaterialAmenityIcon amenity={amenity} symbol={materialSymbol} />;
  }

  return <AmenityTextFallback amenity={amenity} />;
}

export default function AmenityList({ amenities }: { amenities: RoomAmenity[] }) {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-2 gap-y-5 gap-x-8 mt-10 text-[13px] text-[#444]">
      {amenities.map((amenity) => (
        <div key={amenity.key} className="flex items-center gap-3">
          <AmenityIcon amenity={amenity} />
          <span className="font-jako-medium text-[14px] font-[400]">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
}
