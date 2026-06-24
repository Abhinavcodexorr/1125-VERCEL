"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  confirmBookingClient,
  resolveBookingConfirmState,
  type ConfirmBookingData,
  type BookingConfirmUiState,
} from "@/lib/api/booking";

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_DURATION_MS = 40000;

type PageState =
  | "loading"
  | "pending"
  | "success"
  | "failed"
  | "timeout"
  | "error"
  | "invalid";

function formatDisplayDate(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const parsed = new Date(value.trim());
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function clearStoredReference() {
  try {
    sessionStorage.removeItem("bookingReference");
  } catch {
    // ignore storage errors
  }
}

function Spinner({ className = "border-[#66839C]" }: { className?: string }) {
  return (
    <div
      className={`mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#E7DDD4] ${className} border-t-current`}
      role="status"
      aria-label="Loading"
    />
  );
}

function ThankYouContentInner() {
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [confirmData, setConfirmData] = useState<ConfirmBookingData | null>(
    null
  );
  const [reference, setReference] = useState<string | null>(null);
  const pollStartedAtRef = useRef<number | null>(null);
  const isFinalRef = useRef(false);

  const finishWithState = useCallback(
    (state: PageState, data?: ConfirmBookingData | null) => {
      if (isFinalRef.current) return;
      if (state !== "loading" && state !== "pending") {
        isFinalRef.current = true;
        clearStoredReference();
      }
      if (data !== undefined) {
        setConfirmData(data);
      }
      setPageState(state);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const resolveReference = (): string | null => {
      const fromQuery = searchParams.get("reference")?.trim();
      if (fromQuery) return fromQuery;
      try {
        return sessionStorage.getItem("bookingReference")?.trim() || null;
      } catch {
        return null;
      }
    };

    const checkConfirm = async (
      ref: string
    ): Promise<{
      state: BookingConfirmUiState;
      data: ConfirmBookingData | null;
    }> => {
      const result = await confirmBookingClient(ref);
      if (cancelled) {
        return { state: "error", data: null };
      }

      if (!result.success || !result.data) {
        return { state: "error", data: null };
      }

      return {
        state: resolveBookingConfirmState(result.data),
        data: result.data,
      };
    };

    async function run() {
      const ref = resolveReference();
      setReference(ref);

      if (!ref) {
        finishWithState("invalid");
        return;
      }

      setPageState("loading");

      try {
        const initial = await checkConfirm(ref);
        if (cancelled) return;

        if (initial.data) {
          setConfirmData(initial.data);
        }

        if (initial.state === "success") {
          finishWithState("success", initial.data);
          return;
        }

        if (initial.state === "failed") {
          finishWithState("failed", initial.data);
          return;
        }

        if (initial.state === "error") {
          finishWithState("error", initial.data);
          return;
        }

        setPageState("pending");
        pollStartedAtRef.current = Date.now();

        const poll = async () => {
          if (cancelled || isFinalRef.current) return;

          const elapsed = Date.now() - (pollStartedAtRef.current ?? Date.now());
          if (elapsed >= MAX_POLL_DURATION_MS) {
            finishWithState("timeout");
            return;
          }

          const next = await checkConfirm(ref);
          if (cancelled || isFinalRef.current) return;

          if (next.data) {
            setConfirmData(next.data);
          }

          if (next.state === "success") {
            finishWithState("success", next.data);
            return;
          }

          if (next.state === "failed") {
            finishWithState("failed", next.data);
            return;
          }

          if (next.state === "error") {
            finishWithState("error", next.data);
            return;
          }

          pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
        };

        pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) {
          finishWithState("error");
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [searchParams, finishWithState]);

  const booking = confirmData?.bookings?.[0];
  const checkIn = formatDisplayDate(booking?.checkInDate);
  const checkOut = formatDisplayDate(booking?.checkOutDate);
  const roomTitle = booking?.roomSnapshot?.title;

  if (pageState === "invalid") {
    return (
      <ThankYouShell
        icon={<FailedIcon />}
        iconBg="bg-[#BC2623]"
        title="Invalid booking"
        description="We couldn't find a booking reference. Please start your reservation again."
        actions={
          <PrimaryLink href="/accommodations" label="Browse accommodations" />
        }
      />
    );
  }

  if (pageState === "loading" || pageState === "pending") {
    return (
      <ThankYouShell
        icon={<Spinner />}
        title={
          pageState === "loading"
            ? "Confirming your payment…"
            : "Payment processing… please wait"
        }
        description="Please wait while we verify your payment with our payment provider."
      />
    );
  }

  if (pageState === "success") {
    return (
      <ThankYouShell
        icon={<SuccessIcon />}
        iconBg="bg-[#00C950]"
        title="Thank you! Booking confirmed."
        description="Your reservation is confirmed. We've sent a confirmation email with all the details of your stay."
        extra={
          <div className="mt-8 rounded-2xl border border-[#E7DDD4] bg-white px-6 py-5 text-left shadow-sm">
            {reference && (
              <p className="text-[14px] text-[#6B6B6B] font-jako-regular">
                <span className="font-jako-bold text-[#2C2422]">
                  Booking reference:{" "}
                </span>
                {reference}
              </p>
            )}
            {roomTitle && (
              <p className="mt-2 text-[14px] text-[#6B6B6B] font-jako-regular">
                <span className="font-jako-bold text-[#2C2422]">Stay: </span>
                {roomTitle}
              </p>
            )}
            {checkIn && checkOut && (
              <p className="mt-2 text-[14px] text-[#6B6B6B] font-jako-regular">
                <span className="font-jako-bold text-[#2C2422]">Dates: </span>
                {checkIn} – {checkOut}
              </p>
            )}
          </div>
        }
        actions={
          <>
            <SecondaryLink href="/accommodations" label="Explore more stays" />
            <PrimaryLink href="/" label="Back to home" />
          </>
        }
        showHero
      />
    );
  }

  if (pageState === "failed") {
    return (
      <ThankYouShell
        icon={<FailedIcon />}
        iconBg="bg-[#BC2623]"
        title="Payment failed or not completed"
        description="Your payment was not completed. No charge has been confirmed for this booking."
        actions={
          <>
            <PrimaryLink href="/accommodations" label="Try again" />
            <SecondaryLink href="/accommodations" label="Back to accommodations" />
          </>
        }
      />
    );
  }

  if (pageState === "timeout") {
    return (
      <ThankYouShell
        icon={<FailedIcon />}
        iconBg="bg-[#D97706]"
        title="We couldn't confirm payment yet"
        description="Your payment may still be processing. If you were charged, please contact us with your booking reference and we'll help right away."
        extra={
          reference ? (
            <p className="mt-6 text-[14px] text-[#6B6B6B] font-jako-regular break-all">
              Reference: {reference}
            </p>
          ) : null
        }
        actions={
          <>
            <PrimaryLink href="/accommodations" label="Back to accommodations" />
            <SecondaryLink href="/" label="Back to home" />
          </>
        }
      />
    );
  }

  return (
    <ThankYouShell
      icon={<FailedIcon />}
      iconBg="bg-[#BC2623]"
      title="Could not verify payment"
      description="We couldn't verify your payment status. Please contact support if you believe payment was completed."
      extra={
        reference ? (
          <p className="mt-6 text-[14px] text-[#6B6B6B] font-jako-regular break-all">
            Reference: {reference}
          </p>
        ) : null
      }
      actions={
        <>
          <PrimaryLink href="/accommodations" label="Back to accommodations" />
          <SecondaryLink href="/" label="Back to home" />
        </>
      }
    />
  );
}

function SuccessIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="#FFFEF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FailedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="#FFFEF8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PrimaryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="w-full sm:w-auto min-w-[220px] h-[52px] px-8 rounded-full bg-[#BC2623] text-white text-[14px] font-jako-bold tracking-[1px] uppercase transition-colors hover:bg-[#A92320] inline-flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
    >
      {label}
    </Link>
  );
}

function SecondaryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="w-full sm:w-auto min-w-[220px] h-[52px] px-8 rounded-full border border-[#2C2422] bg-white text-[#2C2422] text-[14px] font-jako-bold tracking-[1px] uppercase transition-colors hover:bg-[#FFFEF8] inline-flex items-center justify-center"
    >
      {label}
    </Link>
  );
}

function ThankYouShell({
  icon,
  iconBg = "",
  title,
  description,
  extra,
  actions,
  showHero = false,
}: {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  extra?: ReactNode;
  actions?: ReactNode;
  showHero?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-[#444444] flex items-center justify-center px-4 sm:px-8 py-12 md:py-16">
      <div className="w-full max-w-[920px] text-center">
        <div
          className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </div>

        <h1 className="font-ogg-regular text-[#2C2422] text-[32px] sm:text-[40px] font-[500] leading-tight tracking-wide">
          {title}
        </h1>

        <p className="mt-4 text-[15px] sm:text-[16px] text-[#6B6B6B] font-jako-regular leading-relaxed max-w-[640px] mx-auto">
          {description}
        </p>

        {extra}

        {showHero && (
          <div className="mt-10 bg-white rounded-2xl border border-[#E7DDD4] shadow-sm overflow-hidden text-left">
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              <div className="relative min-h-[240px] md:min-h-[320px] bg-[#f9f8f6]">
                <Image
                  src="/images/hero.jpg"
                  alt="1125 Beach Villa oceanfront stay"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center px-6 sm:px-8 py-8 md:py-10">
                <h2 className="font-ogg-regular text-[#2C2422] text-[24px] sm:text-[28px] font-[500] leading-snug">
                  Your escape awaits
                </h2>
                <p className="mt-4 text-[15px] sm:text-[16px] text-[#6B6B6B] font-jako-regular leading-relaxed">
                  Relax and enjoy your time at 1125 Beach Villa. We look forward
                  to welcoming you soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {actions && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ThankYouClient() {
  return (
    <Suspense
      fallback={
        <ThankYouShell
          icon={<Spinner />}
          title="Confirming your payment…"
          description="Please wait while we verify your payment."
        />
      }
    >
      <ThankYouContentInner />
    </Suspense>
  );
}
