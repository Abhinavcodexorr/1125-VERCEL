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
  type RoomAvailability,
} from "@/lib/api/rooms";

interface AccommodationBookingPanelProps {
  roomId: string;
  /** Total units in the property (`room.quantity` inventory cap). */
  totalUnits: number;
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
  totalUnits,
  availabilityUnit = "Chalet",
}: AccommodationBookingPanelProps) {
  const bookingRef = useRef<BookingBoxHandle>(null);
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const showQuantityPickerRef = useRef(totalUnits > 1);

  const [availability, setAvailability] = useState<RoomAvailability | null>(
    null
  );
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

        const includeQuantity = showQuantityPickerRef.current;

        try {
          const room = await fetchRoomBySlugClient(roomId, {
            checkInDate: selection.checkInDate,
            checkOutDate: selection.checkOutDate,
            adults: selection.adults,
            ...(includeQuantity ? { quantity: selection.quantity } : {}),
          });

          if (requestId !== requestIdRef.current) return;

          if (room?.availability) {
            setAvailability(room.availability);
            showQuantityPickerRef.current = room.availability.showQuantityPicker;
          } else {
            setAvailability(null);
          }
        } catch {
          if (requestId !== requestIdRef.current) return;
          setAvailability(null);
        } finally {
          if (requestId === requestIdRef.current) {
            setIsLoadingAvailability(false);
          }
        }
      }, 350);
    },
    [roomId]
  );

  useEffect(() => {
    return () => {
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  const showQuantityPicker = availability
    ? availability.showQuantityPicker
    : totalUnits > 1;
  const showAvailabilityBadge = showQuantityPicker;

  const availableUnits = availability?.availableUnits ?? 0;
  const isAvailable = availability?.isAvailable ?? false;
  const maxSelectableQuantity = availability?.maxSelectableQuantity ?? 0;

  const availabilityLabel = formatAvailabilityLabel(
    availableUnits,
    availabilityUnit
  );

  const maxQuantity =
    showQuantityPicker && maxSelectableQuantity > 0
      ? maxSelectableQuantity
      : undefined;

  const canReserve =
    Boolean(availability?.isAvailable) && !isLoadingAvailability;

  return (
    <>
      {showAvailabilityBadge && (
        <AvailabilityBadge
          label={availabilityLabel}
          isLoading={isLoadingAvailability || !availability}
          isAvailable={isAvailable}
        />
      )}

      <BookingBox
        ref={bookingRef}
        showQuantity={showQuantityPicker}
        maxQuantity={maxQuantity}
        onSelectionChange={refreshAvailability}
      />

      <CompleteReservationButton
        roomId={roomId}
        showQuantity={showQuantityPicker}
        disabled={!canReserve}
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
    <Suspense
      fallback={<BookingBoxSkeleton showQuantity={props.totalUnits > 1} />}
    >
      <AccommodationBookingPanelInner {...props} />
    </Suspense>
  );
}
