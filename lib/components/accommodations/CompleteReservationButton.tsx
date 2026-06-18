"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { BookingSelection } from "@/lib/components/accommodations/BookingBox";
import {
  addToCartClient,
  validateCartPayload,
  type AddToCartPayload,
} from "@/lib/api/cart";

interface CompleteReservationButtonProps {
  roomId: string;
  showQuantity: boolean;
  disabled?: boolean;
  getBooking: () => BookingSelection;
}

export default function CompleteReservationButton({
  roomId,
  showQuantity,
  disabled = false,
  getBooking,
}: CompleteReservationButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteReservation = async () => {
    setError(null);
    const booking = getBooking();

    const payload: AddToCartPayload = {
      roomId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adults: booking.adults,
      children: booking.children,
    };

    if (showQuantity) {
      payload.quantity = booking.quantity;
    }

    const existingCartId = searchParams.get("cartId");
    if (existingCartId) {
      payload.cartId = existingCartId;
    }

    const validationError = validateCartPayload(payload, {
      includeQuantity: showQuantity,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await addToCartClient(payload);

      if (!result.success || !result.data?.cartId) {
        setError(result.message || "Failed to add item to cart");
        return;
      }

      router.push(`/payment?cartId=${encodeURIComponent(result.data.cartId)}`);
    } catch {
      setError("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-9 flex flex-col items-center sm:items-start">
      <button
        type="button"
        onClick={handleCompleteReservation}
        disabled={isLoading || disabled}
        className="w-full max-w-[304px] h-[62px] rounded-full border border-[#BC2623] bg-[#BC2623] text-white uppercase text-[14px] font-[400] font-jako-bold tracking-[1.5px] shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-[#A92320] flex items-center justify-center text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Complete Reservation"}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-3 w-full max-w-[304px] text-[13px] text-[#BC2623] font-jako-medium leading-snug text-center sm:text-left"
        >
          {error}
        </p>
      )}
    </div>
  );
}
