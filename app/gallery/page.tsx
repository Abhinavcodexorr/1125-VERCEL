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
    { id: 1, src: "/images/gallery/outdoor-pergola/pergola-01.jpg", category: "outdoor-pergola", alt: "Outdoor pergola lounge cabanas" },
    { id: 2, src: "/images/gallery/outdoor-pergola/pergola-02.jpg", category: "outdoor-pergola", alt: "Outdoor pergola seating and bar tables" },
    { id: 26, src: "/images/gallery/deck-events/deck-01.jpg", category: "outdoor-pergola", alt: "Aerial view of outdoor pergola, deck, and beach" },
    { id: 3, src: "/images/gallery/deck-events/deck-dining.jpg", category: "deck-events", alt: "Oceanfront deck dining table for events" },
    { id: 4, src: "/images/gallery/deck-events/deck-terrace.jpg", category: "deck-events", alt: "Oceanfront deck terrace for events" },
    { id: 21, src: "/images/gallery/deck-events/deck-01.jpg", category: "deck-events", alt: "Aerial view of the oceanfront deck" },
    { id: 22, src: "/images/gallery/deck-events/lounge-01.jpg", category: "deck-events", alt: "Social lounge and events games room" },
    { id: 24, src: "/images/gallery/deck-events/lounge-games.jpg", category: "deck-events", alt: "Events lounge board games" },
    { id: 7, src: "/images/gallery/interiors/villa-living-01.jpg", category: "interiors", alt: "Villa living room" },
    { id: 8, src: "/images/gallery/interiors/villa-living-02.jpg", category: "interiors", alt: "Villa lounge with television wall" },
    { id: 9, src: "/images/gallery/interiors/dining-kitchen.jpg", category: "interiors", alt: "Dining area and kitchen" },
    { id: 10, src: "/images/gallery/interiors/kitchen-bar.jpg", category: "interiors", alt: "Kitchen breakfast bar" },
    { id: 11, src: "/images/gallery/interiors/villa-bedroom-01.jpg", category: "interiors", alt: "Villa bedroom" },
    { id: 12, src: "/images/gallery/interiors/deluxe-bedroom.jpg", category: "interiors", alt: "Deluxe room bedroom" },
    { id: 13, src: "/images/gallery/interiors/chalet-bedroom.jpg", category: "interiors", alt: "Chalet bedroom" },
    { id: 14, src: "/images/gallery/interiors/chalet-studio.jpg", category: "interiors", alt: "Chalet studio living space" },
    { id: 15, src: "/images/gallery/interiors/chalet-sitting.jpg", category: "interiors", alt: "Chalet sitting corner" },
    { id: 16, src: "/images/gallery/interiors/chalet-kitchenette.jpg", category: "interiors", alt: "Chalet kitchenette" },
    { id: 17, src: "/images/gallery/interiors/villa-bathroom-01.jpg", category: "interiors", alt: "Villa bathroom" },
    { id: 18, src: "/images/gallery/interiors/villa-bathroom-02.jpg", category: "interiors", alt: "Villa walk-in shower" },
    { id: 19, src: "/images/gallery/interiors/standard-bathroom.jpg", category: "interiors", alt: "Standard room bathroom" },
    { id: 20, src: "/images/gallery/interiors/chalet-bathroom.jpg", category: "interiors", alt: "Chalet bathroom" },
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
            </section>
        </main>
    );
}