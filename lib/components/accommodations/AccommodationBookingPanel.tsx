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
  fetchRoomQuoteClientShared,
  formatAvailabilityLabel,
  type RoomQuote,
} from "@/lib/api/rooms";

interface AccommodationBookingPanelProps {
  roomId: string;
  /** Total units in the property (`room.quantity` inventory cap). */
  totalUnits: number;
  availabilityUnit?: string;
  /** Live check-in/check-out availability — chalets only. */
  checkAvailability?: boolean;
  onQuoteChange?: (quote: RoomQuote | null) => void;
}

function quoteQueryKey(selection: BookingSelection): string {
  return `${selection.checkInDate}|${selection.checkOutDate}|${selection.adults}|${selection.quantity}`;
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
  onQuoteChange,
}: AccommodationBookingPanelProps) {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  const bookingRef = useRef<BookingBoxHandle>(null);
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const lastQuoteQueryRef = useRef<string | null>(null);

  const [bookingReady, setBookingReady] = useState(!cartId);
  const [cartSelection, setCartSelection] = useState<
    Partial<BookingSelection> | undefined
  >();
  const [quote, setQuote] = useState<RoomQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

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
              quantity: item.quantity > 0 ? item.quantity : 1,
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

  const refreshQuote = useCallback(
    (selection: BookingSelection) => {
      if (!selection.checkInDate || !selection.checkOutDate) return;

      const queryKey = quoteQueryKey(selection);
      if (lastQuoteQueryRef.current === queryKey) {
        return;
      }
      lastQuoteQueryRef.current = queryKey;

      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }

      fetchTimerRef.current = setTimeout(async () => {
        const requestId = ++requestIdRef.current;
        setIsLoadingQuote(true);

        try {
          const quoteResult = await fetchRoomQuoteClientShared(roomId, {
            checkInDate: selection.checkInDate,
            checkOutDate: selection.checkOutDate,
            adults: selection.adults,
            quantity: Math.max(1, selection.quantity || 1),
          });

          if (requestId !== requestIdRef.current) return;

          setQuote(quoteResult);
          onQuoteChange?.(quoteResult);
        } catch {
          if (requestId !== requestIdRef.current) return;
          setQuote(null);
          onQuoteChange?.(null);
        } finally {
          if (requestId === requestIdRef.current) {
            setIsLoadingQuote(false);
          }
        }
      }, 350);
    },
    [onQuoteChange, roomId]
  );

  useEffect(() => {
    return () => {
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  const availability = quote?.availability ?? null;
  const showQuantityPicker = checkAvailability && totalUnits > 1;
  const showAvailabilityBadge = checkAvailability;

  const availableUnits = availability?.availableUnits ?? 0;
  const isAvailable = availability?.isAvailable ?? false;
  const maxTotalGuests = availability?.maxTotalGuests;

  const availabilityLabel = checkAvailability
    ? formatAvailabilityLabel(availableUnits, availabilityUnit)
    : isAvailable
      ? "Available"
      : "Not available";

  const maxQuantity = showQuantityPicker
    ? availableUnits > 0
      ? availableUnits
      : totalUnits
    : undefined;

  const canReserve = checkAvailability
    ? Boolean(availability?.isAvailable) && !isLoadingQuote
    : Boolean(!availability || availability.isAvailable) && !isLoadingQuote;

  if (!bookingReady) {
    return (
      <>
        {showAvailabilityBadge && (
          <AvailabilityBadge
            label={availabilityLabel}
            isLoading
            isAvailable={false}
          />
        )}
        <BookingBoxSkeleton showQuantity={showQuantityPicker} />
        <CompleteReservationButton
          roomId={roomId}
          showQuantity={showQuantityPicker}
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
          isLoading={isLoadingQuote || !availability}
          isAvailable={isAvailable}
        />
      )}

      <BookingBox
        ref={bookingRef}
        showQuantity={showQuantityPicker}
        maxQuantity={maxQuantity}
        maxTotalGuests={maxTotalGuests}
        initialSelection={cartSelection}
        onSelectionChange={refreshQuote}
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
