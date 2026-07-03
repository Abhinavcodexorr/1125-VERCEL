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
