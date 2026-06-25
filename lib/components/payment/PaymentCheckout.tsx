"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getCartClient, type CartData } from "@/lib/api/cart";
import { clearStoredCartId } from "@/lib/utils/cartStorage";
import {
  COUNTRY_CODE_OPTIONS,
  createBookingClient,
  validateGuestDetailsFields,
  type GuestFieldErrors,
} from "@/lib/api/booking";
import {
  formatCartDateRange,
  formatGuests,
  formatMoney,
  getCartItemImage,
  getCartItemImageAlt,
  getItemLineTotal,
  getPrimaryRoomTitle,
  getPrimaryRoomDetailHref,
} from "@/lib/utils/cartDisplay";
import { isRemoteImage } from "@/lib/utils/image";

type CartStatus = "loading" | "empty" | "expired" | "error" | "ready";

const GUEST_DETAILS_STORAGE_KEY = "1125_guestDetails";

function sanitizeMobileInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

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
        <p className="mt-3 text-[12px] text-[#444444] font-jako-regular break-all">
          Cart ID: {cartId}
        </p>
      )}
    </div>
  );
}

function OrderSummaryStatePanel({
  title,
  message,
  actionLabel,
}: {
  title: string;
  message: string;
  actionLabel: string;
}) {
  return (
    <div className="bg-[#FFFEF8] rounded-2xl border border-gray-200/80 p-8 lg:col-span-4 flex flex-col items-center text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E7E7]">
        <svg
          className="w-7 h-7 text-[#AF2F2C]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      <h3 className="text-[20px] font-[400] text-[#2C2422] font-jako-bold mb-2.5">
        {title}
      </h3>
      <p className="text-[14px] text-[#6B6B6B] font-jako-regular leading-relaxed max-w-[320px] mb-6">
        {message}
      </p>
      <Link
        href="/accommodations"
        className="min-w-[220px] h-[52px] px-8 rounded-full bg-[#BC2623] text-white text-[14px] font-jako-bold tracking-[1px] uppercase transition-colors hover:bg-[#A92320] inline-flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function OrderSummaryEmpty() {
  return (
    <OrderSummaryStatePanel
      title="Your cart is empty"
      message="You haven't added a room yet. Taking you to our accommodations so you can pick your stay and dates."
      actionLabel="Browse rooms"
    />
  );
}

function OrderSummaryExpired() {
  return (
    <OrderSummaryStatePanel
      title="Your cart has expired"
      message="Your reservation hold timed out. Please select your room and dates again."
      actionLabel="Select your room"
    />
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
  onBackHrefChange,
}: {
  onSubtitleChange: (subtitle: string) => void;
  onBackHrefChange: (href: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const [cart, setCart] = useState<CartData | null>(null);
  const [cartStatus, setCartStatus] = useState<CartStatus>("loading");
  const [cartError, setCartError] = useState<string | null>(null);
  const isLoading = cartStatus === "loading";
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("233");
  const [specialRequests, setSpecialRequests] = useState("");
  const [fieldErrors, setFieldErrors] = useState<GuestFieldErrors>({});

  // Restore guest details typed before redirecting to Hubtel, so coming back
  // (which reloads the page) doesn't wipe the form.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(GUEST_DETAILS_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<{
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber: string;
        countryCode: string;
        specialRequests: string;
      }>;
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.email) setEmail(saved.email);
      if (saved.mobileNumber) setMobileNumber(saved.mobileNumber);
      if (saved.countryCode) setCountryCode(saved.countryCode);
      if (saved.specialRequests) setSpecialRequests(saved.specialRequests);
    } catch {
      // ignore storage/parse errors
    }
  }, []);

  // Keep the saved copy in sync as the guest types.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        GUEST_DETAILS_STORAGE_KEY,
        JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNumber,
          countryCode,
          specialRequests,
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [firstName, lastName, email, mobileNumber, countryCode, specialRequests]);

  const clearFieldError = (field: keyof GuestFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const inputBorderClass = (hasError: boolean) =>
    hasError
      ? "border-[#BC2623] focus:border-[#BC2623]"
      : "border-[#E5D7D7] focus:border-gray-400";

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      if (!cartId) {
        setCart(null);
        setCartError(null);
        setCartStatus("empty");
        onSubtitleChange("Securely finalize your reservation.");
        onBackHrefChange("/accommodations");
        return;
      }

      setCartStatus("loading");
      setCartError(null);

      try {
        const result = await getCartClient(cartId);
        if (cancelled) return;

        if (!result.success || !result.data) {
          setCart(null);
          onSubtitleChange("Securely finalize your reservation.");
          onBackHrefChange("/accommodations");

          // 404 / success:false => the stored id is dead. Drop it so the next
          // add-to-cart starts a fresh cart, and show the expired empty state.
          if (result.statusCode === 404) {
            clearStoredCartId();
            setCartStatus("expired");
            return;
          }

          setCartError(result.message || "Failed to retrieve cart");
          setCartStatus("error");
          return;
        }

        // Cart already past its expiry: treat as expired without keeping the id.
        const expiry = new Date(result.data.expiresAt).getTime();
        if (!Number.isNaN(expiry) && expiry <= Date.now()) {
          clearStoredCartId();
          setCart(null);
          setCartStatus("expired");
          onSubtitleChange("Securely finalize your reservation.");
          onBackHrefChange("/accommodations");
          return;
        }

        setCart(result.data);
        setCartStatus("ready");
        onBackHrefChange(getPrimaryRoomDetailHref(result.data));
        onSubtitleChange(
          `Securely finalize your reservation for ${getPrimaryRoomTitle(result.data)}.`
        );
      } catch {
        if (cancelled) return;
        setCart(null);
        setCartError("Failed to retrieve cart");
        setCartStatus("error");
        onSubtitleChange("Securely finalize your reservation.");
        onBackHrefChange("/accommodations");
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [cartId, onSubtitleChange, onBackHrefChange]);

  // Returning from the external checkout (e.g. browser Back from Hubtel) often
  // restores this page from the back-forward cache, so React effects never
  // re-run and the cart stays stale. Force a real reload in that case — it is
  // exactly what a manual refresh does.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;

      if (event.persisted || navEntry?.type === "back_forward") {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Countdown using the cart's expiresAt. When it hits zero we flip to the
  // expired state locally without hitting the API again.
  useEffect(() => {
    if (cartStatus !== "ready" || !cart?.expiresAt) {
      return;
    }

    const expiry = new Date(cart.expiresAt).getTime();
    if (Number.isNaN(expiry)) {
      return;
    }

    const tick = () => {
      if (expiry - Date.now() <= 0) {
        clearStoredCartId();
        setCart(null);
        setCartStatus("expired");
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cartStatus, cart?.expiresAt]);

  // No cart in the session: show the empty state briefly, then send the guest
  // back to accommodations.
  useEffect(() => {
    if (cartStatus !== "empty") return;
    const timer = setTimeout(() => {
      router.push("/accommodations");
    }, 4000);
    return () => clearTimeout(timer);
  }, [cartStatus, router]);

  const handleCreateBooking = async () => {
    setBookingError(null);

    if (!cartId) {
      setBookingError("No cart found. Please complete your reservation first.");
      return;
    }

    const guestValidation = validateGuestDetailsFields({
      firstName,
      lastName,
      email,
      mobileNumber,
      countryCode,
    });
    if (Object.keys(guestValidation).length > 0) {
      setFieldErrors(guestValidation);
      return;
    }
    setFieldErrors({});

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

      if (!result.success || !result.data) {
        setBookingError(
          result.statusCode === 500
            ? "Payment could not start. Try again."
            : result.message || "Failed to create booking"
        );
        return;
      }

      const { bookingReference, checkoutUrl } = result.data;

      if (!bookingReference?.trim() || !checkoutUrl?.trim()) {
        setBookingError("Payment could not start. Try again.");
        return;
      }

      sessionStorage.setItem("bookingReference", bookingReference.trim());
      window.location.href = checkoutUrl.trim();
      return;
    } catch {
      setBookingError("Payment could not start. Try again.");
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
    cartStatus === "ready" &&
      cart?.allAvailable &&
      cart.items.every((i) => i.isAvailable) &&
      cartId &&
      !isSubmitting
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1440px] mx-auto items-start pt-4 py-6 md:py-8 px-6">
      {cartStatus === "loading" ? (
        <OrderSummarySkeleton />
      ) : cartStatus === "empty" ? (
        <OrderSummaryEmpty />
      ) : cartStatus === "expired" ? (
        <OrderSummaryExpired />
      ) : cartStatus === "ready" && cart ? (
        <OrderSummaryCard cart={cart} />
      ) : (
        <OrderSummaryError
          message={cartError ?? "Failed to retrieve cart"}
          cartId={cartId}
        />
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

        <h2 className="text-[24px] font-[400] text-[#7CA5C8] font-jako-bold mb-6">
          Contact Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-first-name"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#444444]"
              >
                First Name <span className="text-[#BC2623]">*</span>
              </label>
              <input
                id="guest-first-name"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError("firstName");
                }}
                placeholder="First name"
                autoComplete="given-name"
                aria-invalid={Boolean(fieldErrors.firstName)}
                aria-describedby={fieldErrors.firstName ? "guest-first-name-error" : undefined}
                className={`border outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C2422] bg-[#FFFEF8] transition-all font-jako-bold ${inputBorderClass(Boolean(fieldErrors.firstName))}`}
              />
              {fieldErrors.firstName && (
                <p id="guest-first-name-error" role="alert" className="text-[12px] text-[#BC2623] font-jako-medium">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-last-name"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#444444]"
              >
                Last Name
              </label>
              <input
                id="guest-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                autoComplete="family-name"
                className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C2422] bg-[#FFFEF8] transition-all font-jako-bold"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-email"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#444444]"
              >
                Email Address <span className="text-[#BC2623]">*</span>
              </label>
              <input
                id="guest-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                placeholder="Email address"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "guest-email-error" : undefined}
                className={`border outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C2422] bg-[#FFFEF8] transition-all font-jako-bold ${inputBorderClass(Boolean(fieldErrors.email))}`}
              />
              {fieldErrors.email && (
                <p id="guest-email-error" role="alert" className="text-[12px] text-[#BC2623] font-jako-medium">
                  {fieldErrors.email}
                </p>
              )}
          </div>
          <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guest-mobile"
                className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#444444]"
              >
                Mobile Number <span className="text-[#BC2623]">*</span>
              </label>
              <div
                className={`flex rounded-xl border bg-[#FFFEF8] transition-all overflow-hidden ${inputBorderClass(Boolean(fieldErrors.mobileNumber))} ${fieldErrors.mobileNumber ? "focus-within:border-[#BC2623]" : "focus-within:border-gray-400"}`}
              >
                <select
                  id="guest-country-code"
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                    clearFieldError("mobileNumber");
                  }}
                  aria-label="Country code"
                  className="border-0 border-r border-[#E5D7D7] outline-none rounded-none px-3 py-3 text-[14px] font-[400] text-[#2C2422] bg-transparent transition-all font-jako-medium shrink-0 min-w-[110px]"
                >
                  {COUNTRY_CODE_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  id="guest-mobile"
                  type="tel"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(sanitizeMobileInput(e.target.value));
                    clearFieldError("mobileNumber");
                  }}
                  placeholder="Mobile number"
                  autoComplete="tel-national"
                  maxLength={10}
                  aria-invalid={Boolean(fieldErrors.mobileNumber)}
                  aria-describedby={fieldErrors.mobileNumber ? "guest-mobile-error" : undefined}
                  className="border-0 outline-none rounded-none px-4 py-3 text-[16px] font-[400] text-[#2C2422] bg-transparent transition-all font-jako-bold flex-1 min-w-0"
                />
              </div>
              {fieldErrors.mobileNumber && (
                <p id="guest-mobile-error" role="alert" className="text-[12px] text-[#BC2623] font-jako-medium">
                  {fieldErrors.mobileNumber}
                </p>
              )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="guest-special-requests"
              className="text-[12px] uppercase tracking-wider font-[400] font-jako-bold text-[#444444]"
            >
              Special Requests <span className="normal-case">(optional)</span>
            </label>
            <textarea
              id="guest-special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests for your stay"
              rows={3}
              className="border border-[#E5D7D7] focus:border-gray-400 outline-none rounded-xl px-4 py-3 text-[16px] font-[400] text-[#2C2422] bg-[#FFFEF8] transition-all font-jako-medium resize-none"
            />
          </div>
        </div>

        {bookingError && (
          <p
            role="alert"
            className="mt-3 mb-6 text-[14px] text-[#BC2623] font-jako-medium leading-relaxed"
          >
            {bookingError}
          </p>
        )}

        <button
          type="button"
          onClick={handleCreateBooking}
          disabled={!canPay || isLoading}
          className="w-full mt-6 bg-[#AF2F2C] cursor-pointer hover:bg-[#8e2523] text-white py-4 rounded-full text-[20px] font-[400] tracking-wider uppercase transition-all duration-200 shadow-sm font-jako-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {payLabel}
        </button>

        <p className="text-center text-[13px] leading-none text-[#444444] mt-5 tracking-wide font-jako-bold flex items-center justify-center gap-1.5 font-[400]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block shrink-0"
          >
            <g clipPath="url(#clip0_1_3929)">
              <path
                d="M9.5 5.5H2.5C1.94772 5.5 1.5 5.94772 1.5 6.5V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V6.5C10.5 5.94772 10.0523 5.5 9.5 5.5Z"
                stroke="#444444"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 5.5V3.5C3.5 2.83696 3.76339 2.20107 4.23223 1.73223C4.70107 1.26339 5.33696 1 6 1C6.66304 1 7.29893 1.26339 7.76777 1.73223C8.23661 2.20107 8.5 2.83696 8.5 3.5V5.5"
                stroke="#444444"
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
          <span className="leading-none">Payments are secure and encrypted.</span>
        </p>
      </div>
    </div>
  );
}

export default function PaymentCheckout({
  onSubtitleChange,
  onBackHrefChange,
}: {
  onSubtitleChange: (subtitle: string) => void;
  onBackHrefChange: (href: string) => void;
}) {
  return (
    <Suspense fallback={<OrderSummarySkeleton />}>
      <PaymentCheckoutInner
        onSubtitleChange={onSubtitleChange}
        onBackHrefChange={onBackHrefChange}
      />
    </Suspense>
  );
}
