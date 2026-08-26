"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  fetchRoomsClient,
  mapRoomsToAccommodationListings,
  type AccommodationListing,
} from "@/lib/api/rooms";
import { isNextImageOptimizable, resolveImageAlt } from "@/lib/utils/image";
import RoomOccupancyMeta from "@/lib/components/accommodations/RoomOccupancyMeta";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AccommodationsPageClient() {
  return (
    <Suspense fallback={<AccommodationsPageContent showPaymentCancelled={false} />}>
      <AccommodationsPageWithParams />
    </Suspense>
  );
}

function AccommodationsPageWithParams() {
  const searchParams = useSearchParams();
  const showPaymentCancelled =
    searchParams.get("payment") === "cancelled" ||
    searchParams.get("payment_cancelled") === "1";

  useEffect(() => {
    if (!showPaymentCancelled) return;
    try {
      sessionStorage.removeItem("bookingReference");
    } catch {
      // ignore storage errors
    }
  }, [showPaymentCancelled]);

  return (
    <AccommodationsPageContent showPaymentCancelled={showPaymentCancelled} />
  );
}

function AccommodationsPageContent({
  showPaymentCancelled,
}: {
  showPaymentCancelled: boolean;
}) {
  const [listings, setListings] = useState<AccommodationListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchRoomsClient()
      .then((rooms) => {
        if (!cancelled) {
          setLoadError(false);
          setListings(mapRoomsToAccommodationListings(rooms));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          setListings([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = listings;

  return (
    <main className="bg-[#FFFEF8] min-h-screen font-sans antialiased text-[#444444] overflow-x-hidden">
      {showPaymentCancelled && (
        <div className="px-4 pt-4">
          <div
            role="alert"
            className="max-w-[1440px] mx-auto rounded-xl border border-[#BC2623]/30 bg-[#BC2623]/10 px-5 py-4 text-center"
          >
            <p className="text-[14px] sm:text-[15px] text-[#BC2623] font-jako-medium">
              Payment cancelled. Your booking was not completed — you can choose
              a stay and try again when ready.
            </p>
          </div>
        </div>
      )}
      <section className="px-4 mt-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative h-[350px] md:h-[420px] overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/accommodation-banner.jpg"
            alt="Experience"
            fill
            priority
            sizes="calc(100vw - 2rem)"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#000]/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif capitalize text-white text-[38px] sm:text-[44px] md:text-[65px] font-[400] font-ogg-regular text-center tracking-wide leading-tight px-4"
            >
              Find your perfect <br />
              escape
            </motion.h1>
          </div>
        </motion.div>
      </section>


      <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 py-10">
        {isLoading ? (
          <div className="py-20 text-center text-[#8a929d] font-manrope-regular animate-pulse">
            Loading accommodations...
          </div>
        ) : loadError ? (
          <div className="py-20 text-center text-[#8a929d] font-manrope-regular">
            We couldn&apos;t load accommodations right now. Please refresh in a moment.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#8a929d] font-manrope-regular">
            No accommodations available right now.
          </div>
        ) : (
        <div className="space-y-12">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center pt-10 ${
                index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={resolveImageAlt(item.title, item.type)}
                  fill
                  sizes="(max-width: 1024px) calc(100vw - 3rem), min(720px, 50vw)"
                  className="object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={80}
                  unoptimized={!isNextImageOptimizable(item.image)}
                />
              </div>

              <div>
                <p className="uppercase tracking-[2px] text-[#AE2020] text-[11px] font-[400] font-jako-bold">
                  {item.type || "Sanctuary Escape"}
                </p>

                <h2 className="mt-3 text-[32.13px] font-[400] font-ogg-regular text-[#7CA5C8]">
                  {item.title}
                </h2>

                <p className="text-[#AE2020] text-[17.6px] mt-2 font-[400] font-jako-bold">
                  Starting from {item.formattedPrice}
                </p>

                <p className="mt-6 text-[#6B6B6B] text-[15px] font-[400] leading-relaxed max-w-[520px] font-light font-manrope-regular">
                  {item.description}
                </p>
                <div className="border-t border-[#66839C1F] my-6"></div>
                <RoomOccupancyMeta
                  guests={item.guests}
                  bedConfiguration={item.bedConfiguration}
                />

                <div className="border-t border-[#66839C1F] my-6"></div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {item.features.map((feature: string) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 rounded-full border border-[#66839C40] font-manrope-regular text-[#66839C] text-[12px] font-[400] font-light bg-[#FFFFFF]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/accommodations/${item.slug}`}
                  className="inline-flex items-center gap-2 bg-[#AE2020] hover:bg-[#AE2020] transition text-white px-8 py-3.5 rounded-full uppercase tracking-[2px] text-[12px] font-[700] shadow-sm font-manrope-regular"
                >
                  View & Book
                  <svg
                    width="5"
                    height="9"
                    viewBox="0 0 5 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.583496 7.58331L4.0835 4.08331L0.583496 0.583313"
                      stroke="#FFFEF8"
                      strokeWidth="1.16667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}
