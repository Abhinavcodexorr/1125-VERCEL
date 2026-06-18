"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getCartClient, type CartData } from "@/lib/api/cart";
import {
  COUNTRY_CODE_OPTIONS,
  createBookingClient,
  validateGuestDetails,
} from "@/lib/api/booking";
import {
  formatCartDateRange,
  formatGuests,
  formatMoney,
  getCartItemImage,
  getCartItemImageAlt,
  getItemLineTotal,
  getPrimaryRoomTitle,
} from "@/lib/utils/cartDisplay";
import { isRemoteImage } from "@/lib/utils/image";

function OrderSummarySkeleton() {
  return (
    <div className="bg-[#FFFEF8] rounded-2xl border border-gray-200/80 p-6 lg:col-span-4 lg:sticky lg:top-6 animate-pulse">
      <div className="h-4 w-32 bg-[#E5D7D7] rounded mb-5" />
      <div className="flex gap-4 pb-5">
        <div className="w-[75px] h-[75px] rounded-xl bg-[#E5D7D7]" />
        <div className="flex-1 space-y-2 py-2">
          <div className="h-4 w-40 bg-[#E5D7D7] rounded" />
          <div className="h-3 w-28 bg-[#E5D7D7] rounded" />
          <div className="h-3 w-20 bg-[#E5D7D7] rounded" />
        </div>
      </div>
      <div className="border-t border-[#D5C2C2] pt-5 space-y-3.5">
        <div className="h-3 w-full bg-[#E5D7D7] rounded" />
      </div>
      <div className="border-t border-[#D5C2C2] mt-5 pt-5 flex justify-between">
        <div className="h-5 w-16 bg-[#E5D7D7] rounded" />
        <div className="h-5 w-24 bg-[#E5D7D7] rounded" />
      </div>
    </div>
  );
}

function OrderSummaryError({
  message,
  cartId,
}: {
  message: string;
  cartId: string | null;
}) {
  return (
    <div className="bg-[#FFFEF8] rounded-2xl border border-gray-200/80 p-6 lg:col-span-4">
      <h3 className="text-[14px] tracking-[1.5px] uppercase font-[400] text-gray-700 mb-5 font-jako-bold">
        Order Summary
      </h3>
      <p
        role="alert"
        className="text-[14px] text-[#BC2623] font-jako-medium leading-relaxed"
      >
        {message}
      </p>
      <Link
        href="/accommodations"
        className="inline-block mt-5 text-[14px] text-[#66839C] font-jako-bold hover:text-[#BC2623] transition-colors"
      >
        Browse accommodations
      </Link>
      {cartId && (
        <p className="mt-3 text-[12px] text-[#8C7A7A] font-jako-regular break-all">
          Cart ID: {cartId}
        </p>
      )}
    </div>
  );
}

function OrderSummaryCard({ cart }: { cart: CartData }) {
  return (
    <div className="bg-[#FFFEF8] rounded-2xl border border-gray-200/80 p-6 lg:col-span-4 lg:sticky lg:top-6">
      <h3 className="text-[14px] tracking-[1.5px] uppercase font-[400] text-gray-700 mb-5 font-jako-bold">
        Order Summary
      </h3>

      {!cart.allAvailable && (
        <p
          role="alert"
          className="mb-4 text-[13px] text-[#BC2623] font-jako-medium leading-snug"
        >
          Some items in your cart are no longer available for the selected dates.
        </p>
      )}

      <div className="space-y-5 pb-5">
        {cart.items.map((item) => (
          <div key={item._id} className="flex gap-4">
            <div className="relative w-[75px] h-[75px] rounded-xl overflow-hidden shrink-0 bg-gray-50">
              <Image
                src={getCartItemImage(item)}
                alt={getCartItemImageAlt(item)}
                fill
                sizes="75px"
                className="object-cover"
                unoptimized={isRemoteImage(getCartItemImage(item))}
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h4 className="text-[16px] font-[400] text-[#2C2422] leading-snug font-jako-bold">
                {item.roomSnapshot.title}
              </h4>
              <p className="text-[14px] font-[400] text-[#5A4F4D] mt-1 font-jako-regular">
                {formatCartDateRange(item.checkInDate, item.checkOutDate)}
              </p>
              <p className="text-[14px] font-[400] text-[#5A4F4D] mt-0.5 font-jako-regular">
                {formatGuests(item)}
              </p>
              {!item.isAvailable && (
                <p className="text-[12px] text-[#BC2623] mt-1 font-jako-medium">
                  No longer available
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#D5C2C2] pt-5 space-y-3.5 text-xs">
        {cart.items.map((item) => (
          <div key={`${item._id}-price`} className="flex justify-between gap-3">
            <span className="font-jako-regular font-[400] text-[14px] text-[#2C2422]">
              {formatMoney(item.pricePerNight, item.currency)} x {item.nights}{" "}
              {item.nights === 1 ? "night" : "nights"}
              {item.quantity > 1 ? ` x ${item.quantity}` : ""}
            </span>
            <span className="font-[400] text-[14px] text-[#2C2422] font-jako-regular shrink-0">
              {formatMoney(getItemLineTotal(item), item.currency)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#D5C2C2] mt-5 pt-5 flex justify-between items-center text-sm font-bold text-[#2C2422]">
        <span className="text-[18px] font-[400] text-[#2C2422] font-jako-bold">
          Total
        </span>
        <span className="text-[18px] font-[400] text-[#2C2422] font-jako-bold">
          {formatMoney(cart.subTotal, cart.currency)}
        </span>
      </div>
    </div>
  );
}

function PaymentCheckoutInner({
  onSubtitleChange,
}: {
  onSubtitleChange: (subtitle: string) => void;
}) {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("233");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      if (!cartId) {
        const message = "No cart found. Please complete your reservation first.";
        setCartError(message);
        setCart(null);
        setIsLoading(false);
        onSubtitleChange("Securely finalize your reservation.");
        return;
      }

      setIsLoading(true);
      setCartError(null);

      try {
        const result = await getCartClient(cartId);
        if (cancelled) return;

        if (!result.success || !result.data) {
          const message =
            result.statusCode === 404
              ? "Cart not found"
              : result.message || "Failed to retrieve cart";
          setCartError(message);
          setCart(null);
          onSubtitleChange("Securely finalize your reservation.");
          return;
        }

        setCart(result.data);
        onSubtitleChange(
          `Securely finalize your reservation for ${getPrimaryRoomTitle(result.data)}.`
        );
      } catch {
        if (cancelled) return;
        setCartError("Failed to retrieve cart");
        setCart(null);
        onSubtitleChange("Securely finalize your reservation.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [cartId, onSubtitleChange]);

  const handleCreateBooking = async () => {
    setBookingError(null);

    if (!cartId) {
      setBookingError("No cart found. Please complete your reservation first.");
      return;
    }

    const guestValidation = validateGuestDetails({
      firstName,
      lastName,
      email,
      mobileNumber,
      countryCode,
    });
    if (guestValidation) {
      setBookingError(guestValidation);
      return;
    }

    if (!cart?.allAvailable || !cart.items.every((item) => item.isAvailable)) {
      setBookingError(
        "Some items in your cart are no longer available for the selected dates."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBookingClient({
        cartId,
        guestDetails: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
          countryCode,
          ...(specialRequests.trim()
            ? { specialRequests: specialRequests.trim() }
            : {}),
        },
      });

      if (!result.success || !result.data?.checkoutUrl) {
        setBookingError(result.message || "Failed to create booking");
        return;
      }

      window.location.href = result.data.checkoutUrl;
    } catch {
      setBookingError("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const payLabel = cart
    ? isSubmitting
      ? "Redirecting..."
      : `Pay ${formatMoney(cart.subTotal, cart.currency)}`
    : "Pay Now";
  const canPay = Boolean(
    cart?.allAvailable &&
      cart.items.every((i) => i.isAvailable) &&
      cartId &&
      !isSubmitting
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1440px] mx-auto items-start pt-4 py-6 md:py-8 px-6">
      {isLoading ? (
        <OrderSummarySkeleton />
      ) : cartError || !cart ? (
        <OrderSummaryError message={cartError ?? "Failed to retrieve cart"} cartId={cartId} />
      ) : (
        <OrderSummaryCard cart={cart} />
      )}

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-[#E5D7D7] p-6 sm:p-10 lg:col-span-8">
        <div className="flex items-center gap-2 text-[#AF2F2C] text-[10px] uppercase font-bold tracking-[2px] mb-6">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <span className="font-jako-bold font-[400] text-[12px]">
            Secure Checkout
          </span>
        </div>

        {cartError && (
          <p
            role="alert"
            className="mb-6 text-[14px] text-[#BC2623] font-jako-medium leading-relaxed"
          >
            {cartError}
          </p>
        )}

        <h2 className="text-[24px] font-[400] text-[#66839C] font-jako-bold mb-6">
          Contact Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-first-name"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#8C7A7A]"
              >
                First Name
              </label>
              <input
                id="guest-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                autoComplete="given-name"
                className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C242280] bg-[#FFFEF8] transition-all font-jako-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-last-name"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#8C7A7A]"
              >
                Last Name
              </label>
              <input
                id="guest-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Kofi"
                autoComplete="family-name"
                className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C242280] bg-[#FFFEF8] transition-all font-jako-bold"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="guest-email"
              className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#8C7A7A]"
            >
              Email Address
            </label>
            <input
              id="guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              autoComplete="email"
              className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C242280] bg-[#FFFEF8] transition-all font-jako-medium"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="guest-mobile"
              className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#8C7A7A]"
            >
              Mobile Number
            </label>
            <div className="flex rounded-xl border border-[#E5D7D7] focus-within:border-gray-400 bg-[#FFFEF8] transition-all overflow-hidden">
              <select
                id="guest-country-code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                aria-label="Country code"
                className="border-0 border-r border-[#E5D7D7] outline-none rounded-none px-3 py-3 text-[14px] font-[400] text-[#2C242280] bg-transparent transition-all font-jako-medium shrink-0 min-w-[110px]"
              >
                {COUNTRY_CODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                id="guest-mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="241234567"
                autoComplete="tel-national"
                className="border-0 outline-none rounded-none px-4 py-3 text-[16px] font-[400] text-[#2C242280] bg-transparent transition-all font-jako-medium flex-1 min-w-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="guest-special-requests"
              className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#8C7A7A]"
            >
              Special Requests <span className="normal-case">(optional)</span>
            </label>
            <textarea
              id="guest-special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests for your stay"
              rows={3}
              className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C242280] bg-[#FFFEF8] transition-all font-jako-medium resize-none"
            />
          </div>
        </div>

        {bookingError && (
          <p
            role="alert"
            className="mb-6 text-[14px] text-[#BC2623] font-jako-medium leading-relaxed"
          >
            {bookingError}
          </p>
        )}

        <button
          type="button"
          onClick={handleCreateBooking}
          disabled={!canPay || isLoading}
          className="w-full mt-2 bg-[#AF2F2C] cursor-pointer hover:bg-[#8e2523] text-white py-4 rounded-full text-[20px] font-[400] tracking-wider uppercase transition-all duration-200 shadow-sm font-jako-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {payLabel}
        </button>

        <p className="text-center text-[12px] text-gray-400 mt-5 tracking-wide font-jako-bold flex items-center justify-center gap-1 font-[400]">
          <span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_3929)">
                <path
                  d="M9.5 5.5H2.5C1.94772 5.5 1.5 5.94772 1.5 6.5V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V6.5C10.5 5.94772 10.0523 5.5 9.5 5.5Z"
                  stroke="#8C7A7A"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 5.5V3.5C3.5 2.83696 3.76339 2.20107 4.23223 1.73223C4.70107 1.26339 5.33696 1 6 1C6.66304 1 7.29893 1.26339 7.76777 1.73223C8.23661 2.20107 8.5 2.83696 8.5 3.5V5.5"
                  stroke="#8C7A7A"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_3929">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          Payments are secure and encrypted.
        </p>
      </div>
    </div>
  );
}

export default function PaymentCheckout({
  onSubtitleChange,
}: {
  onSubtitleChange: (subtitle: string) => void;
}) {
  return (
    <Suspense fallback={<OrderSummarySkeleton />}>
      <PaymentCheckoutInner onSubtitleChange={onSubtitleChange} />
    </Suspense>
  );
}
