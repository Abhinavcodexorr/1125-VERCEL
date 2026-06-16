"use client";
import Link from "next/link";
import { motion, Variants } from "framer-motion"; // Animation imports

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
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
      staggerChildren: 0.2, // Har element ke beech ka gap
    }
  }
};

export default function StorySection() {
  return (
    <section className="bg-[#FFFEF8] py-16 md:py-28 lg:py-[60px] lg:pb-[100px] overflow-hidden">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-[1100px] mx-auto px-6 flex flex-col items-center text-center"
      >

        {/* Logo Animation */}
        <motion.svg
          variants={fadeInUp}
          width="69"
          height="86"
          viewBox="0 0 58 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[48px] h-[60px] md:w-[58px] md:h-[72px] lg:w-[69px] lg:h-[86px]"
        >
          <path d="M11.2569 0V71.4904C9.242 71.6129 6.63761 69.7971 6.63761 69.7971C6.63761 69.7971 -1.76507 44.8382 0.3378 24.2672C2.07113 7.50786 8.79327 1.62118 11.2569 0Z" fill="#6E89A3"/>
          <path d="M19.2979 66.4666C18.6832 68.5734 18.2793 69.7886 18.2793 69.7886C18.2793 69.7886 15.6451 71.6006 13.6694 71.4927V61.8574L19.2979 66.4666Z" fill="#6E89A3"/>
          <path d="M19.9898 64.2663L13.6694 59.1227V0C16.1342 1.61099 22.8506 7.51315 24.5848 24.3166C26.0812 38.9095 22.3137 55.6985 19.9898 64.2663Z" fill="#6E89A3"/>
          <path d="M43.4197 0V71.4904C41.4043 71.6129 38.7992 69.7971 38.7992 69.7971C38.7992 69.7971 30.3591 44.8382 32.5154 24.2672C34.2227 7.50786 40.9555 1.62118 43.4197 0Z" fill="#6E89A3"/>
          <path d="M52.2644 66.3909C51.6284 68.5735 51.1928 69.8296 51.1928 69.8296C51.1928 69.8296 48.6225 71.5981 46.636 71.4929V61.8574L52.2644 66.3909Z" fill="#6E89A3"/>
          <path d="M52.9799 63.463L46.636 58.3176V0C49.0678 1.59588 55.8082 7.44266 57.5439 24.0885C59.0506 38.4299 55.3324 54.904 52.9799 63.463Z" fill="#6E89A3"/>
        </motion.svg>

        {/* Title Animation */}
        <motion.h2
          variants={fadeInUp}
          className="
            font-ogg-regular
            text-[#6E89A3]
            text-[24px]
            md:text-[30px]
            lg:text-[36px]
            font-[500]
            leading-[128%]
            tracking-[1px]
            max-w-[920px]
            mt-8
            md:mt-10
          "
        >
          Your Own Corner Of The Ghanaian Coast, Where
          <br className="hidden md:block" />
          Every Day Begins And Ends With The Ocean.
        </motion.h2>

        {/* Description Animation */}
        <motion.p
          variants={fadeInUp}
          className="
            font-jako-medium
            text-[#2C2C2C]
            text-[14px]
            md:text-[16px]
            lg:text-[17px]
            leading-[120%]
            tracking-[1px]
            font-[400]
            max-w-[680px]
            mt-8
          "
        >
          1125 Beach Villa offers a private coastal retreat where luxury meets
          the natural beauty of Ghana's shoreline. Settle into the rhythm of
          the Atlantic and enjoy an experience designed entirely around rest,
          seclusion, and the simple pleasure of being by the sea.
        </motion.p>

        {/* Button Animation Wrapper */}
        <motion.div variants={fadeInUp}>
          <Link
            href="/our-story"
            className="
              mt-12
              inline-flex
              items-center
              justify-center
              h-[52px]
              px-[25px]
              border border-[#AF2F2C]
              rounded-[50px]
              bg-[#AE2020]
              hover:bg-[#AE2020]
              text-white
              font-manrope-regular
              font-[700]
              text-[14px]
              leading-[16px]
              tracking-[1.2px]
              uppercase
              transition-all
              duration-300
              cursor-pointer
            "
          >
            Discover Our Story
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
}