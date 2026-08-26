"use client";

import { useCallback, useState, type ReactNode } from "react";
import AccommodationBookingPanel from "@/lib/components/accommodations/AccommodationBookingPanel";
import RoomImageGallery from "@/lib/components/accommodations/RoomImageGallery";
import { getHighestPerNightRate, type RoomQuote } from "@/lib/api/rooms";

interface AccommodationDetailContentProps {
  roomId: string;
  totalUnits: number;
  availabilityUnit: string;
  checkAvailability: boolean;
  displayType: string;
  description: string;
  guests: number;
  bedConfiguration?: string;
  image: string;
  galleryImages: string[];
  currencySymbol: string;
  initialPrice: number;
  amenities: ReactNode;
}

function getImagePrice(quote: RoomQuote | null, fallbackPrice: number): number {
  if (!quote) return fallbackPrice;

  return getHighestPerNightRate({
    nightBreakdown: quote.availability?.nightBreakdown,
    wdPrice: quote.wdPrice,
    wePrice: quote.wePrice,
    pricePerNight: quote.pricePerNight,
    fallback: fallbackPrice,
  });
}

export default function AccommodationDetailContent({
  roomId,
  totalUnits,
  availabilityUnit,
  checkAvailability,
  displayType,
  description,
  guests,
  bedConfiguration,
  image,
  galleryImages,
  currencySymbol,
  initialPrice,
  amenities,
}: AccommodationDetailContentProps) {
  const [displayPrice, setDisplayPrice] = useState(initialPrice);

  const handleQuoteChange = useCallback(
    (quote: RoomQuote | null) => {
      setDisplayPrice(getImagePrice(quote, initialPrice));
    },
    [initialPrice]
  );

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-start">
      <div className="w-full lg:col-span-5 shrink-0">
        <RoomImageGallery
          image={image}
          galleryImages={galleryImages}
          title={displayType}
          currencySymbol={currencySymbol}
          price={displayPrice}
        />
      </div>

      <div className="w-full lg:col-span-7 flex flex-col justify-between min-h-[440px] pt-2">
        <div>
          <h2 className="font-ogg-regular text-[#7CA5C8] text-[38px] font-[500] lg:text-[38px] leading-tight ">
            {displayType}
          </h2>
          <p className="mt-4 text-[#242424] text-[16px] font-[400] leading-relaxed max-w-[540px] font-jako-regular">
            {description || "Experience a sanctuary..."}
          </p>

          {(guests > 0 || bedConfiguration) && (
            <div className="flex flex-wrap gap-8 mt-6 text-[#8B8B8B]">
              {guests > 0 && (
                <span className="flex items-center gap-1.5 text-[13px] font-[400] font-jako-regular">
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
              {bedConfiguration ? (
                <span className="flex items-center gap-1.5 text-[13px] font-[400] font-jako-regular">
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
                  {bedConfiguration}
                </span>
              ) : null}
            </div>
          )}

          {amenities}
        </div>

        <div className="w-full max-w-[600px] bg-[#FFFEF8] border border-[#E7DDD4] rounded-[12px] p-[24px] mt-10">
          <AccommodationBookingPanel
            roomId={roomId}
            totalUnits={totalUnits}
            availabilityUnit={availabilityUnit}
            checkAvailability={checkAvailability}
            onQuoteChange={handleQuoteChange}
          />
        </div>
      </div>
    </div>
  );
}
