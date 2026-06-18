"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  fetchRoomsClient,
  mapRoomsToAccommodationListings,
  type AccommodationListing,
} from "@/lib/api/rooms";
import { accommodations as staticAccommodations } from "@/lib/data/accommodations";
import { isRemoteImage, resolveImageAlt } from "@/lib/utils/image";

// Animation Variants (TypeScript safe)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

function mapStaticToListing(
  item: (typeof staticAccommodations)[number]
): AccommodationListing {
  return {
    id: String(item.id),
    slug: item.slug,
    category: item.category as "villa" | "room",
    subtitle: item.subtitle,
    title: item.title,
    price: item.price,
    formattedPrice: `GHS ${item.price} / night`,
    guests: item.guests,
    area: item.area,
    areaUnit: "sq m",
    image: item.image,
    description: item.description,
    features: item.features,
  };
}

export default function AccommodationsPage() {
    const [listings, setListings] = useState<AccommodationListing[]>(() =>
        staticAccommodations.map(mapStaticToListing)
    );
    const [filter, setFilter] = useState("all");
    const [priceOpen, setPriceOpen] = useState(false);
    const [occupancyOpen, setOccupancyOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetchRoomsClient()
            .then((rooms) => {
                if (!cancelled && rooms.length) {
                    setListings(mapRoomsToAccommodationListings(rooms));
                }
            })
            .catch(() => {
                // Keep static fallback
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered =
        filter === "all"
            ? listings
            : listings.filter(
                (item) => item.category === filter
            );

    return (
        <main className="bg-[#FFFEF8] min-h-screen font-sans antialiased text-[#444444] overflow-x-hidden">

            {/* Hero Section - Page Load Animation */}
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
                            className="font-serif text-white text-[45px] md:text-[65px] font-[400] font-ogg-regular text-center tracking-wide leading-none"
                        >
                            Host your most unforgettable <br />event
                        </motion.h1>
                    </div>
                </motion.div>
            </section>

            {/* FIGMA FILTER INTERFACE - Subtle Fade-in */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 pt-10 pb-2"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold tracking-widest text-[#7c828c]">

                        {/* Filter Indicator Label */}
                        <div className="flex items-center gap-2 pr-2 uppercase text-[#5c626d]">
                            <svg className="w-4 h-4 text-[#8A7E74]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            <span className="font-manrope-regular font-[700] text-[11px]">Filter</span>
                        </div>

                        {/* Any Price Dynamic Action */}
                        <div className="relative">
                            <button
                                onClick={() => setPriceOpen(!priceOpen)}
                                className="flex items-center justify-between gap-6 px-5 py-2.5 bg-white border border-gray-200 rounded-full hover:border-gray-400 transition-colors uppercase cursor-pointer"
                            >
                                <span className="font-manrope-regular font-[700] text-[11px]">
                                    Any Price
                                </span>

                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    className={`transition-transform ${priceOpen ? "rotate-180" : ""}`}
                                >
                                    <path
                                        d="M3.5 5.25L7 8.75L10.5 5.25"
                                        stroke="#242424"
                                        strokeWidth="1.16667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {priceOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                                >
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">₹5,000+</button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">₹10,000+</button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">₹20,000+</button>
                                </motion.div>
                            )}
                        </div>

                        {/* Occupancy Action Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setOccupancyOpen(!occupancyOpen)}
                                className="flex items-center justify-between gap-6 px-5 py-2.5 bg-white border border-gray-200 rounded-full hover:border-gray-400 transition-colors uppercase cursor-pointer"
                            >
                                <span className="font-manrope-regular font-[700] text-[11px]">
                                    Occupancy
                                </span>

                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    className={`transition-transform ${occupancyOpen ? "rotate-180" : ""}`}
                                >
                                    <path
                                        d="M3.5 5.25L7 8.75L10.5 5.25"
                                        stroke="#242424"
                                        strokeWidth="1.16667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {occupancyOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                                >
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">1-2 Guests</button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">3-4 Guests</button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50">5+ Guests</button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="text-[12px] font-[400] font-light text-[#8a929d] tracking-normal italic font-manrope-regular sm:text-right">
                        {filtered.length} {filtered.length === 1 ? "sanctuary" : "sanctuaries"}
                    </div>
                </div>
            </motion.section>

            {/* Listings Section - Scroll-triggered Animation */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 py-10">
                <div className="space-y-12">
                    {filtered.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center pt-10 ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                                }`}
                        >
                            {/* Image Showcase Box */}
                            <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image}
                                    alt={resolveImageAlt(item.title, item.subtitle)}
                                    fill
                                    sizes="(max-width: 1024px) calc(100vw - 3rem), min(720px, 50vw)"
                                    className="object-cover"
                                    unoptimized={isRemoteImage(item.image)}
                                />
                            </div>

                            {/* Content Block */}
                            <div>
                                <p className="uppercase tracking-[2px]  text-[#AE2020] text-[11px] font-[400] font-jako-bold">
                                    {item.subtitle || "Sanctuary Escape"}
                                </p>

                                <h2 className="mt-3 text-[32.13px] font-[400] font-ogg-regular text-[#7CA5C8] ">
                                    {item.title}
                                </h2>

                                <p className="text-[#AE2020] text-[17.6px] mt-2 font-[400] font-jako-bold">
                                    Starting from {item.formattedPrice}
                                </p>

                                <p className="mt-6 text-[#6B6B6B] text-[15px] font-[400] leading-relaxed max-w-[520px] font-light font-manrope-regular">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap gap-8 mt-6 text-[#8B8B8B] text-xs font-light tracking-wide">
                                    <span className="flex items-center gap-1.5 text-[13px] font-[400] font-manrope-regular">
                                        <svg
                                            className="w-5 h-5 text-[#AE2020]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="10" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2 21v-1.5a4.5 4.5 0 0 1 4.5-4.5h7a4.5 4.5 0 0 1 4.5 4.5V21"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 3.13a4 4 0 0 1 0 7.75M22 21v-1.5a4.5 4.5 0 0 0-3-4.15"
                                            />
                                        </svg>
                                        Up to {item.guests} guests
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[13px] font-[400] font-manrope-regular">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.33333 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V5.33333" stroke="#AE2020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13.9998 5.33333V3.33333C13.9998 2.97971 13.8594 2.64057 13.6093 2.39052C13.3593 2.14048 13.0201 2 12.6665 2H10.6665" stroke="#AE2020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 10.666V12.666C2 13.0196 2.14048 13.3588 2.39052 13.6088C2.64057 13.8589 2.97971 13.9993 3.33333 13.9993H5.33333" stroke="#AE2020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.6665 13.9993H12.6665C13.0201 13.9993 13.3593 13.8589 13.6093 13.6088C13.8594 13.3588 13.9998 13.0196 13.9998 12.666V10.666" stroke="#AE2020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {item.area} {item.areaUnit}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200/60 my-6"></div>

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
            </section>
        </main>
    );
}