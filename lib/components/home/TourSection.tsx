"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/data/tours";
import { getAccommodationHref, type TourItemWithSlug } from "@/lib/api/rooms";
import { motion, Variants } from "framer-motion";

const STATIC_TOURS: TourItemWithSlug[] = tours.map((tour) => ({
  ...tour,
  slug: tour.title.toLowerCase().includes("chalet") ? "chalets" : "the-villa",
}));

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function TourSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onDragStop = () => {
    setIsDragging(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative overflow-hidden bg-[#7CA5C8] py-[80px] lg:py-[100px] w-full select-none">
      {/* Background Vectors - Subtle Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute bottom-[-10px] left-[-30px] hidden lg:block w-[305px] h-[904px] pointer-events-none z-0"
      >
        <div className="relative w-full h-full brightness-0 invert">
          <Image src="/images/Group 44.png" alt="Vector" fill sizes="305px" className="object-contain object-bottom" draggable={false} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute bottom-[-15px] right-[-30px] hidden lg:block w-[305px] h-[904px] pointer-events-none z-0"
      >
        <div className="relative w-full h-full brightness-0 invert">
          <Image src="/images/Group 43.png" alt="Vector" fill sizes="305px" className="object-contain object-bottom" draggable={false} />
        </div>
      </motion.div>

      <div className="w-full relative z-10">
        {/* Header Grid - Staggered Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-[1553px] mx-auto px-6 md:px-12 lg:px-[77px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-[42px]"
        >
          <div>
            <motion.span variants={fadeInUp} className="font-ogg-trial text-white text-[30px] md:text-[32px] lg:text-[36px] leading-[128%] tracking-[1px] font-medium block mb-1">Take A</motion.span>
            <motion.h2 variants={fadeInUp} className="font-ogg-regular text-white text-[80px] sm:text-[80px] lg:text-[96px] leading-[100%] tracking-[1px] font-medium">Tour</motion.h2>
          </div>
          <motion.div variants={fadeInUp} className="flex lg:justify-end w-full">
            <p className="font-jeko-medium font-normal text-white/90 max-w-[520px] text-left lg:text-right text-[20px] md:text-[18px] lg:text-[20px] leading-[120%] tracking-[1px]">
              Our accommodations blend luxury with natural charm, offering a variety of options suited to every traveler&apos;s needs.
            </p>
          </motion.div>
        </motion.div>

        {/* Slider Wrapper */}
        <div className="w-full relative overflow-visible">
          <motion.div
            ref={scrollContainerRef}
            onMouseDown={onDragStart}
            onMouseLeave={onDragStop}
            onMouseUp={onDragStop}
            onMouseMove={onDragMove}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className={`flex gap-[42px] overflow-x-auto pb-6 w-full scroll-smooth snap-x snap-mandatory style-scroll-container 
              px-6 md:px-12 lg:px-[77px] scroll-pl-6 md:scroll-pl-12 lg:scroll-pl-[77px] ${isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab snap-x"
              }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {STATIC_TOURS.map((tour) => (
              <motion.div
                key={tour.id}
                variants={fadeInUp}
                className="w-[280px] sm:w-[300px] lg:w-[330px] shrink-0 snap-start snap-always transform will-change-transform"
              >
                {/* Card Design - Identical to provided code */}
                <div className="border border-white rounded-[18px] p-[14px] bg-white/[0.06] backdrop-blur-[8px] flex flex-col h-[450px] lg:h-[500px] w-full shadow-sm">
                  <div>
                    <div className="relative aspect-[246/218] w-full overflow-hidden rounded-[8px] pointer-events-none select-none">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 330px"
                        className="object-cover"
                        draggable={false}
                        priority
                      />
                    </div>
                    <div className="flex justify-between items-start gap-3 pt-5 px-1">
                      <h3 className="font-ogg-regular text-white text-[22px] lg:text-[24px] leading-[1.15] font-[500] tracking-wide capitalize pr-2">{tour.title}</h3>
                      <Link
                        href={getAccommodationHref(tour.slug)}
                        aria-label={`View ${tour.title}`}
                        className="w-[31px] h-[31px] rounded-full bg-[#AE2020] hover:bg-[#AE2020] flex items-center justify-center shrink-0 transition-colors mt-0.5 shadow-sm cursor-pointer"
                      >
                        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.2071 8.07112C16.5976 7.6806 16.5976 7.04743 16.2071 6.65691L9.84315 0.292946C9.45262 -0.0975785 8.81946 -0.0975785 8.42893 0.292946C8.03841 0.68347 8.03841 1.31664 8.42893 1.70716L14.0858 7.36401L8.42893 13.0209C8.03841 13.4114 8.03841 14.0446 8.42893 14.4351C8.81946 14.8256 9.45262 14.8256 9.84315 14.4351L16.2071 8.07112ZM0 7.36401V8.36401H15.5V7.36401V6.36401H0V7.36401Z" fill="#FFFEF8" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-auto px-1">
                    <div className="grid grid-cols-[80px_1fr] gap-3 py-4 border-t border-white mt-2">
                      <span className="font-jeko-medium font-normal text-white text-[13px] tracking-[0.5px]">Features</span>
                      <span className="font-jeko-medium text-white text-right text-[14px] leading-[128%] tracking-[1px] break-words">{tour.feature}</span>
                    </div>
                    <div className="grid grid-cols-[75px_1fr] gap-3 py-4 border-t border-white">
                      <span className="font-jeko-medium font-normal text-white text-[13px] tracking-[0.5px]">{tour.labelType || "Units"}</span>
                      <span className="font-jeko-medium text-white text-right text-[14px] leading-[128%] tracking-[1px] break-words">{tour.labelValue || "5"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="w-1 shrink-0" />
          </motion.div>
        </div>

        {/* Footer Button Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/accommodations"
            className="w-[218px] h-[52px] rounded-[50px] bg-[#AE2020] hover:bg-[#AE2020] text-white text-[14px] font-[700] tracking-[1.2px] uppercase transition-all font-manrope-regular cursor-pointer inline-flex items-center justify-center"
          >
            Make A Reservation
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
