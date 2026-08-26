"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type GalleryCategory =
    | "outdoor-pergola"
    | "deck-events"
    | "interiors";

const galleryImages: {
    id: number;
    src: string;
    category: GalleryCategory;
    alt: string;
}[] = [
    { id: 1, src: "/images/gallery/outdoor-bar/pr60415.jpg", category: "outdoor-pergola", alt: "Outdoor bar" },
    { id: 2, src: "/images/gallery/outdoor-bar/pr60419.jpg", category: "outdoor-pergola", alt: "Outdoor bar" },
    { id: 3, src: "/images/gallery/social-lounge/pr60136.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 4, src: "/images/gallery/social-lounge/pr60139.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 5, src: "/images/gallery/social-lounge/pr60148.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 6, src: "/images/gallery/social-lounge/pr60432.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 7, src: "/images/gallery/social-lounge/pr60434.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 8, src: "/images/gallery/social-lounge/pr60436.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 9, src: "/images/gallery/social-lounge/pr60438.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 10, src: "/images/gallery/social-lounge/pr60440.jpg", category: "deck-events", alt: "Social lounge" },
    { id: 11, src: "/images/gallery/the-villa/pr60172.jpg", category: "interiors", alt: "The Villa" },
    { id: 12, src: "/images/gallery/the-villa/pr60174.jpg", category: "interiors", alt: "The Villa" },
    { id: 13, src: "/images/gallery/the-villa/pr60177.jpg", category: "interiors", alt: "The Villa" },
    { id: 14, src: "/images/gallery/the-villa/pr60181.jpg", category: "interiors", alt: "The Villa" },
    { id: 15, src: "/images/gallery/the-villa/pr60187.jpg", category: "interiors", alt: "The Villa" },
    { id: 16, src: "/images/gallery/the-villa/pr60189.jpg", category: "interiors", alt: "The Villa" },
    { id: 17, src: "/images/gallery/the-villa/pr60192.jpg", category: "interiors", alt: "The Villa" },
    { id: 18, src: "/images/gallery/the-villa/pr60198.jpg", category: "interiors", alt: "The Villa" },
    { id: 19, src: "/images/gallery/the-villa/pr60206.jpg", category: "interiors", alt: "The Villa" },
    { id: 20, src: "/images/gallery/the-villa/pr60213-hdr.jpg", category: "interiors", alt: "The Villa" },
    { id: 21, src: "/images/gallery/the-villa/pr60221.jpg", category: "interiors", alt: "The Villa" },
    { id: 22, src: "/images/gallery/the-villa/pr60230.jpg", category: "interiors", alt: "The Villa" },
    { id: 23, src: "/images/gallery/the-villa/pr60239.jpg", category: "interiors", alt: "The Villa" },
    { id: 24, src: "/images/gallery/the-villa/pr60240.jpg", category: "interiors", alt: "The Villa" },
    { id: 25, src: "/images/gallery/the-villa/pr60244.jpg", category: "interiors", alt: "The Villa" },
    { id: 26, src: "/images/gallery/the-villa/pr60258.jpg", category: "interiors", alt: "The Villa" },
    { id: 27, src: "/images/gallery/the-villa/pr60264.jpg", category: "interiors", alt: "The Villa" },
    { id: 28, src: "/images/gallery/the-villa/pr60266.jpg", category: "interiors", alt: "The Villa" },
    { id: 29, src: "/images/gallery/the-villa/pr60274-hdr.jpg", category: "interiors", alt: "The Villa" },
    { id: 30, src: "/images/gallery/the-villa/pr60281.jpg", category: "interiors", alt: "The Villa" },
    { id: 31, src: "/images/gallery/the-villa/pr60284.jpg", category: "interiors", alt: "The Villa" },
    { id: 32, src: "/images/gallery/the-villa/pr60291.jpg", category: "interiors", alt: "The Villa" },
    { id: 33, src: "/images/gallery/the-villa/pr60295.jpg", category: "interiors", alt: "The Villa" },
    { id: 34, src: "/images/gallery/the-villa/pr60296.jpg", category: "interiors", alt: "The Villa" },
    { id: 35, src: "/images/gallery/the-villa/pr60301.jpg", category: "interiors", alt: "The Villa" },
    { id: 36, src: "/images/gallery/the-villa/pr60303.jpg", category: "interiors", alt: "The Villa" },
    { id: 37, src: "/images/gallery/the-villa/pr60304.jpg", category: "interiors", alt: "The Villa" },
    { id: 38, src: "/images/gallery/the-villa/pr60307.jpg", category: "interiors", alt: "The Villa" },
    { id: 39, src: "/images/gallery/the-villa/pr60311.jpg", category: "interiors", alt: "The Villa" },
    { id: 40, src: "/images/gallery/the-villa/pr60314.jpg", category: "interiors", alt: "The Villa" },
    { id: 41, src: "/images/gallery/the-villa/pr60317.jpg", category: "interiors", alt: "The Villa" },
    { id: 42, src: "/images/gallery/the-villa/pr60320.jpg", category: "interiors", alt: "The Villa" },
    { id: 43, src: "/images/gallery/the-villa/pr60326.jpg", category: "interiors", alt: "The Villa" },
    { id: 44, src: "/images/gallery/the-villa/pr60329.jpg", category: "interiors", alt: "The Villa" },
    { id: 45, src: "/images/gallery/the-villa/pr60333.jpg", category: "interiors", alt: "The Villa" },
    { id: 46, src: "/images/gallery/the-villa/pr60338.jpg", category: "interiors", alt: "The Villa" },
    { id: 47, src: "/images/gallery/the-villa/pr60341.jpg", category: "interiors", alt: "The Villa" },
    { id: 48, src: "/images/gallery/chalets/pr60028.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 49, src: "/images/gallery/chalets/pr60030.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 50, src: "/images/gallery/chalets/pr60031.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 51, src: "/images/gallery/chalets/pr60036.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 52, src: "/images/gallery/chalets/pr60038.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 53, src: "/images/gallery/chalets/pr60040.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 54, src: "/images/gallery/chalets/pr60042.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 55, src: "/images/gallery/chalets/pr60046.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 56, src: "/images/gallery/chalets/pr60062.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 57, src: "/images/gallery/chalets/pr60064.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 58, src: "/images/gallery/chalets/pr60070.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 59, src: "/images/gallery/chalets/pr60071.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 60, src: "/images/gallery/chalets/pr60078.jpg", category: "interiors", alt: "Swim-up pool chalet" },
    { id: 61, src: "/images/gallery/deluxe-rm/pr60149.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 62, src: "/images/gallery/deluxe-rm/pr60150.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 63, src: "/images/gallery/deluxe-rm/pr60153.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 64, src: "/images/gallery/deluxe-rm/pr60155.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 65, src: "/images/gallery/deluxe-rm/pr60156.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 66, src: "/images/gallery/deluxe-rm/pr60161.jpg", category: "interiors", alt: "Deluxe room" },
    { id: 67, src: "/images/gallery/standard-rm/pr60164.jpg", category: "interiors", alt: "Standard room" },
    { id: 68, src: "/images/gallery/standard-rm/pr60166.jpg", category: "interiors", alt: "Standard room" },
    { id: 69, src: "/images/gallery/standard-rm/pr60169.jpg", category: "interiors", alt: "Standard room" },
];

const categories = [
    { label: "All", slug: "all" },
    { label: "Outdoor / Pergola", slug: "outdoor-pergola" },
    { label: "Deck & Events", slug: "deck-events" },
    { label: "Interiors", slug: "interiors" },
];

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace("#", "");
            if (categories.some((category) => category.slug === hash)) {
                setActiveCategory(hash);
            } else if (!hash) {
                setActiveCategory("all");
            }
        };

        applyHash();
        window.addEventListener("hashchange", applyHash);
        return () => window.removeEventListener("hashchange", applyHash);
    }, []);

    const visibleImages =
        activeCategory === "all"
            ? galleryImages.filter(
                (image, index, list) =>
                    list.findIndex((entry) => entry.src === image.src) === index
            )
            : galleryImages.filter((image) => image.category === activeCategory);

    return (
        <main className="bg-[#FFFEF8] min-h-screen">
            {/* Hero Section */}
            <section className="px-4 mt-4 overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative h-[350px] md:h-[420px] overflow-hidden rounded-2xl"
                >
                    <Image
                        src="/images/b0a224ce805c59442793004b3d39bd16a7496666 (1).jpg"
                        alt="Gallery"
                        fill
                        priority
                        sizes="calc(100vw - 2rem)"
                        className="object-cover object-bottom"
                    />
                    <div className="absolute inset-0 bg-[#000]/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="font-ogg-regular text-white text-[50px] md:text-[65px] font-[400] text-center"
                        >
                            Gallery
                        </motion.h1>
                    </div>
                </motion.div>
            </section>

            {/* Category Slider */}
            <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-[#9BB9DA] w-full mt-4 "
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12  ">
                    
                    <div 
                        className="overflow-x-auto "
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch' 
                        }}
                    >
                        <div className="flex w-max gap-3 py-5">
                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(category.slug);
                                        window.history.replaceState(null, "", `#${category.slug}`);
                                    }}
                                    className={`
                                        whitespace-nowrap 
                                        px-6 
                                        cursor-pointer
                                        py-2.5 
                                        rounded-full 
                                        uppercase 
                                        font-sans                
                                        text-[13px]  
                                        font-[700]              
                                        leading-[19.5px]           
                                        tracking-[0.4px]          
                                        transition-all 
                                        duration-200
                                        ${activeCategory === category.slug
                                            ? "bg-white text-[#66839C]"
                                            : "text-[#FFFEF8B2] hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >
                                    {category.label}
                                </button>
                            ))}
                            <div className="w-4 md:hidden" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Gallery Grid */}
            <section id="gallery" className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 lg:px-12">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    key={activeCategory}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {visibleImages.map((image) => (
                        <motion.div
                            key={image.id}
                            variants={fadeInUp}
                            className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {activeCategory !== "outdoor-pergola" && (
                <div className="flex justify-center pt-10 pb-4">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="inline-flex items-center gap-2 bg-[#AE2020] hover:bg-[#A71F1D] transition text-white px-8 py-3.5 rounded-full uppercase tracking-[2px] text-[12px] font-[700] shadow-sm font-manrope-regular cursor-pointer"
                    >
                        Back to Top
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" />
                        </svg>
                    </button>
                </div>
                )}
            </section>
        </main>
    );
}