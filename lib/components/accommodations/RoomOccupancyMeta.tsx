interface RoomOccupancyMetaProps {
  guests: number;
  bedConfiguration?: string;
}

export default function RoomOccupancyMeta({
  guests,
  bedConfiguration,
}: RoomOccupancyMetaProps) {
  const bed = bedConfiguration?.trim() || "";

  if (guests <= 0 && !bed) return null;

  return (
    <div className="flex flex-wrap gap-8 mt-6 text-[#8B8B8B] text-xs font-light tracking-wide">
      {guests > 0 && (
        <span className="flex items-center gap-1.5 text-[13px] font-[400] font-manrope-regular">
          <svg
            className="w-5 h-5 text-[#AE2020]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="10" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 21v-1.5a4.5 4.5 0 0 1 4.5-4.5h7a4.5 4.5 0 0 1 4.5 4.5V21"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 3.13a4 4 0 0 1 0 7.75M22 21v-1.5a4.5 4.5 0 0 0-3-4.15"
            />
          </svg>
          Up to {guests} guests
        </span>
      )}
      {bed ? (
        <span className="flex items-center gap-1.5 text-[13px] font-[400] font-manrope-regular">
          <svg
            className="w-5 h-5 text-[#AE2020]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 18v-5.5A1.5 1.5 0 0 1 4.5 11H20a1.5 1.5 0 0 1 1.5 1.5V18"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M3 18v2m18-2v2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.5 11V8.25A1.75 1.75 0 0 1 7.25 6.5h4A1.75 1.75 0 0 1 13 8.25V11"
            />
          </svg>
          {bed}
        </span>
      ) : null}
    </div>
  );
}
