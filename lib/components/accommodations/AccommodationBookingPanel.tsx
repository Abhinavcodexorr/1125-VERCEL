"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import BookingBox, {
  type BookingBoxHandle,
  type BookingSelection,
} from "@/lib/components/accommodations/BookingBox";
import CompleteReservationButton from "@/lib/components/accommodations/CompleteReservationButton";
import {
  fetchRoomBySlugClient,
  formatAvailabilityLabel,
} from "@/lib/api/rooms";

interface AccommodationBookingPanelProps {
  roomId: string;
  roomSlug: string;
  showQuantity: boolean;
  initialQuantity: number;
  availabilityUnit?: string;
}

function AvailabilityBadge({
  label,
  isLoading,
  isAvailable,
}: {
  label: string;
  isLoading: boolean;
  isAvailable: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5 ml-1">
      <span
        className={`w-3 h-3 rounded-full shrink-0 ${
          isLoading
            ? "bg-[#D8D0C8] animate-pulse"
            : isAvailable
              ? "bg-[#00C950]"
              : "bg-[#BC2623]"
        }`}
      />
      <p
        className={`text-[12px] font-[400] font-jeko-black tracking-[1.5px] uppercase ${
          isLoading
            ? "text-[#8C7A7A]"
            : isAvailable
              ? "text-[#AF2F2C]"
              : "text-[#BC2623]"
        }`}
      >
        {isLoading ? "Checking availability..." : label}
      </p>
    </div>
  );
}

function AccommodationBookingPanelInner({
  roomId,
  roomSlug,
  showQuantity,
  initialQuantity,
  availabilityUnit = "Chalet",
}: AccommodationBookingPanelProps) {
  const bookingRef = useRef<BookingBoxHandle>(null);
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const [availableQuantity, setAvailableQuantity] = useState(initialQuantity);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const refreshAvailability = useCallback(
    (selection: BookingSelection) => {
      if (!selection.checkInDate || !selection.checkOutDate) return;

      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }

      fetchTimerRef.current = setTimeout(async () => {
        const requestId = ++requestIdRef.current;
        setIsLoadingAvailability(true);

        try {
          const room = await fetchRoomBySlugClient(roomSlug, {
            checkInDate: selection.checkInDate,
            checkOutDate: selection.checkOutDate,
            adults: selection.adults,
            ...(showQuantity ? { quantity: selection.quantity } : {}),
          });

          if (requestId !== requestIdRef.current) return;

          setAvailableQuantity(room?.quantity ?? 0);
        } catch {
          if (requestId !== requestIdRef.current) return;
          setAvailableQuantity(0);
        } finally {
          if (requestId === requestIdRef.current) {
            setIsLoadingAvailability(false);
          }
        }
      }, 350);
    },
    [roomSlug, showQuantity]
  );

  useEffect(() => {
    return () => {
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  const availabilityLabel = formatAvailabilityLabel(
    availableQuantity,
    availabilityUnit
  );
  const isAvailable = availableQuantity > 0;
  const maxQuantity = showQuantity
    ? Math.max(availableQuantity, 0)
    : undefined;

  return (
    <>
      {showQuantity && (
        <AvailabilityBadge
          label={availabilityLabel}
          isLoading={isLoadingAvailability}
          isAvailable={isAvailable}
        />
      )}

      <BookingBox
        ref={bookingRef}
        showQuantity={showQuantity}
        maxQuantity={maxQuantity}
        onSelectionChange={refreshAvailability}
      />

      <CompleteReservationButton
        roomId={roomId}
        showQuantity={showQuantity}
        disabled={!isAvailable || isLoadingAvailability}
        getBooking={() =>
          bookingRef.current?.getBooking() ?? {
            checkInDate: "",
            checkOutDate: "",
            adults: 1,
            children: 0,
            quantity: 1,
          }
        }
      />
    </>
  );
}

function BookingBoxSkeleton({ showQuantity }: { showQuantity: boolean }) {
  return (
    <div
      className={`grid grid-cols-1 ${showQuantity ? "md:grid-cols-4" : "md:grid-cols-3"} w-full animate-pulse`}
    >
      {Array.from({ length: showQuantity ? 4 : 3 }).map((_, index) => (
        <div
          key={index}
          className="py-4 md:py-0 border-b md:border-b-0 md:border-r border-[#D8D0C8] last:border-r-0"
        >
          <div className="h-3 w-16 bg-[#E5D7D7] rounded mb-3" />
          <div className="h-4 w-24 bg-[#E5D7D7] rounded" />
        </div>
      ))}
    </div>
  );
}

export default function AccommodationBookingPanel(
  props: AccommodationBookingPanelProps
) {
  return (
    <Suspense fallback={<BookingBoxSkeleton showQuantity={props.showQuantity} />}>
      <AccommodationBookingPanelInner {...props} />
    </Suspense>
  );
}
