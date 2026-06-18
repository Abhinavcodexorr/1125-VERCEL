"use client";

import Image from "next/image";
import { motion } from "framer-motion"; // 1. Import Framer Motion

const galleryImages = [   
    { id: 1, src: "/images/gallery/1.jpg", height: "h-[282px]" },
    { id: 2, src: "/images/gallery/2.jpg", height: "h-[318px]" },
    { id: 3, src: "/images/gallery/6.jpg", height: "h-[212px]" },
    { id: 4, src: "/images/gallery/4.jpg", height: "h-[477px]" },
    { id: 5, src: "/images/gallery/5.jpg", height: "h-[212px]" },
    { id: 6, src: "/images/gallery/6.jpg", height: "h-[239px]" },
    { id: 7, src: "/images/gallery/7.jpg", height: "h-[477px]" },
    { id: 8, src: "/images/gallery/8.jpg", height: "h-[477px]" },
    { id: 9, src: "/images/gallery/9.jpg", height: "h-[212px]" },
    { id: 10, src: "/images/gallery/10.jpg", height: "h-[477px]" },
];

const categories = [
    "All",
    "Outdoor / Pergola",
    "Deck & Events",
    "Experiences",
    "Interiors",
    "Pool & Beach",
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
                    <div className="absolute inset-0 bg-[#00000033]" />
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
                            {categories.map((item, index) => (
                                <button
                                    key={item}
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
                                        ${index === 0
                                            ? "bg-white text-[#66839C]"
                                            : "text-[#FFFEF8B2] hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="w-4 md:hidden" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Gallery Grid */}
            <section className="max-w-[1400px] mx-auto px-6 py-8  md:px-10 lg:px-12 ">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5"
                >
                    {galleryImages.map((image) => (
                        <motion.div
                            key={image.id}
                            variants={fadeInUp}
                            className={`relative ${image.height} overflow-hidden rounded-lg break-inside-avoid shadow-sm group`}
                        >
                            <Image
                                src={image.src}
                                alt={`Gallery ${image.id}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition duration-700 ease-in-out group-hover:scale-110"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </main>
    );
}