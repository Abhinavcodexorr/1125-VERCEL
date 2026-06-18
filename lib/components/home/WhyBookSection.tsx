"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion"; // Animation imports

const features = [
  {
    title: "EAT",
    desc: "Savor Local Flavors with Our Farm-to-Table Cuisine.",
  },
  {
    title: "PLAY",
    desc: "Exciting Adventures Await Every Explorer",
  },
  {
    title: "BREATHE",
    desc: "Find Tranquility in Our sanctuary, refined by the tide.",
  },
];

// Animation Variants (TypeScript Safe)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

export default function WhyBookSection() {
  return (
    <section className="bg-[#FFFEF8] pt-16 sm:pt-24 lg:pt-[120px] pb-16 lg:pb-[80px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[60px]">

        <div className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-12 lg:gap-[100px] items-start">

          {/* LEFT SIDE */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col"
          >
            {/* Image Animation */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full max-w-[454px] md:max-w-[550px] lg:max-w-[600px] aspect-[454/243] overflow-hidden mx-auto lg:mx-0"
            >
              <Image
                src="/images/chalet.jpg"
                alt="Why Book With Us"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
              />
            </motion.div>

            {/* Heading Animation */}
            <motion.h2
              variants={fadeInUp}
              className="
                font-ogg-regular
                text-[#66839C]
                font-normal
                text-left
                lg:text-left
                text-[60px]
                sm:text-[72px]
                lg:text-[96px]
                leading-[0.9]
                tracking-[-2px]
                lg:tracking-[-4.82px]
                mt-6 lg:mt-8
              "
            >
              Why Book
              <br />
              <span className="block lg:ml-[110px] ml-[110px] mt-4">
                With Us?
              </span>
            </motion.h2>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:pt-1">
            {/* Description Animation */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="
                font-ogg-regular
                text-[#66839C]
                font-normal
                text-[26px]
                sm:text-[28px]
                lg:text-[34px]
                leading-[120%]
                tracking-[1px]
                lg:tracking-[2px]
                w-full
                max-w-[429px]
                md:max-w-[550px]
                lg:max-w-[600px]
                mx-auto
                lg:mx-0
                mb-10
                lg:mb-12
              "
            >
              Enjoy two distinct pool experiences, private terraces,
              and thoughtfully designed beach house rooms and swim-up
              chalets — all set along the serene oceanfront of Ghana's
              coast.
            </motion.p>

            {/* Feature List Animation */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full max-w-[429px] mx-auto lg:mx-0 border-t border-[#D3DEE8]"
            >
              {features.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="
                    grid
                    grid-cols-[90px_1fr]
                    sm:grid-cols-[120px_1fr]
                    lg:grid-cols-[160px_1fr]
                    items-center
                    py-5
                    lg:py-[22px]
                    border-b
                    border-[#D3DEE8]
                  "
                >
                  <span
                    className="
                      font-jako-bold
                      text-[14px]
                      sm:text-[14px]
                      lg:text-[18px]
                      tracking-[2px]
                      lg:tracking-[3px]
                      text-[#222222]
                      whitespace-nowrap
                    "
                  >
                    {item.title}
                  </span>
                  <p
                    className="
                      font-jeko-medium
                      text-[15px]
                      sm:text-[14px]
                      lg:text-[15px]
                      leading-[120%]
                      tracking-[0.5px]
                      lg:tracking-[1px]
                      text-[#333333]
                      max-w-full
                      lg:max-w-[250px]
                    "
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}