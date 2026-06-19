"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingBox, {
  type BookingBoxHandle,
  type BookingSelection,
} from "@/lib/components/accommodations/BookingBox";
import CompleteReservationButton from "@/lib/components/accommodations/CompleteReservationButton";
import { getCartClient } from "@/lib/api/cart";
import {
  fetchRoomAvailabilityClientShared,
  formatAvailabilityLabel,
  type RoomAvailability,
} from "@/lib/api/rooms";

interface AccommodationBookingPanelProps {
  roomId: string;
  /** Total units in the property (`room.quantity` inventory cap). */
  totalUnits: number;
  availabilityUnit?: string;
  /** Live check-in/check-out availability — chalets only. */
  checkAvailability?: boolean;
}

function availabilityQueryKey(selection: BookingSelection): string {
  return `${selection.checkInDate}|${selection.checkOutDate}`;
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
  checkAvailability = false,
}: AccommodationBookingPanelProps) {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  const bookingRef = useRef<BookingBoxHandle>(null);
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const showQuantityPickerRef = useRef(totalUnits > 1);
  const lastAvailabilityQueryRef = useRef<string | null>(null);

  const [bookingReady, setBookingReady] = useState(!cartId);
  const [cartSelection, setCartSelection] = useState<
    Partial<BookingSelection> | undefined
  >();
  const [availability, setAvailability] = useState<RoomAvailability | null>(
    null
  );
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  useEffect(() => {
    if (!cartId) return;

    const activeCartId = cartId;
    let cancelled = false;

    async function loadCartSelection() {
      try {
        const result = await getCartClient(activeCartId);
        if (cancelled) return;

        if (result.success && result.data) {
          const item =
            result.data.items.find((entry) => entry.roomId === roomId) ??
            result.data.items[0];

          if (item) {
            setCartSelection({
              checkInDate: item.checkInDate,
              checkOutDate: item.checkOutDate,
              adults: item.adults,
              children: item.children,
              quantity: item.quantity,
            });
          }
        }
      } finally {
        if (!cancelled) {
          setBookingReady(true);
        }
      }
    }

    loadCartSelection();

    return () => {
      cancelled = true;
    };
  }, [cartId, roomId]);

  const refreshAvailability = useCallback(
    (selection: BookingSelection) => {
      if (!checkAvailability) return;
      if (!selection.checkInDate || !selection.checkOutDate) return;

      const queryKey = availabilityQueryKey(selection);
      if (lastAvailabilityQueryRef.current === queryKey) {
        return;
      }
      lastAvailabilityQueryRef.current = queryKey;

      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }

      fetchTimerRef.current = setTimeout(async () => {
        const requestId = ++requestIdRef.current;
        setIsLoadingAvailability(true);

        try {
          const availabilityResult = await fetchRoomAvailabilityClientShared(
            roomId,
            {
              checkInDate: selection.checkInDate,
              checkOutDate: selection.checkOutDate,
              adults: selection.adults,
            }
          );

          if (requestId !== requestIdRef.current) return;

          if (availabilityResult) {
            setAvailability(availabilityResult);
            showQuantityPickerRef.current =
              availabilityResult.showQuantityPicker;
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
    [checkAvailability, roomId]
  );

  useEffect(() => {
    return () => {
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  const showQuantityPicker = checkAvailability
    ? availability
      ? availability.showQuantityPicker
      : totalUnits > 1
    : false;

  const showAvailabilityBadge = checkAvailability && showQuantityPicker;

  const availableUnits = availability?.availableUnits ?? 0;
  const isAvailable = availability?.isAvailable ?? false;
  const maxSelectableQuantity = availability?.maxSelectableQuantity ?? 0;

  const availabilityLabel = formatAvailabilityLabel(
    availableUnits,
    availabilityUnit
  );

  const maxQuantity =
    checkAvailability && showQuantityPicker && maxSelectableQuantity > 0
      ? maxSelectableQuantity
      : undefined;

  const canReserve = checkAvailability
    ? Boolean(availability?.isAvailable) && !isLoadingAvailability
    : true;

  if (!bookingReady) {
    return (
      <>
        {checkAvailability && totalUnits > 1 && (
          <AvailabilityBadge
            label={availabilityLabel}
            isLoading
            isAvailable={false}
          />
        )}
        <BookingBoxSkeleton showQuantity={totalUnits > 1} />
        <CompleteReservationButton
          roomId={roomId}
          showQuantity={totalUnits > 1}
          disabled
          getBooking={() => ({
            checkInDate: "",
            checkOutDate: "",
            adults: 1,
            children: 0,
            quantity: 1,
          })}
        />
      </>
    );
  }

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
        initialSelection={cartSelection}
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
