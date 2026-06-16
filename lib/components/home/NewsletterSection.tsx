"use client";
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
      staggerChildren: 0.2, // Gap between elements
    }
  }
};

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative min-h-[280px] sm:h-[340px] md:h-[380px] flex items-center justify-center bg-cover bg-left py-12 sm:py-0"
        style={{
          backgroundImage: "url('/images/newsletter-bg.jpg')",
        }}
      >
        {/* Premium Dark Soft Overlay */}
        <div className="absolute inset-0 bg-black/25" />
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-center"
        >
          <div className="text-center w-full max-w-[640px]">
            {/* Heading Animation */}
            <motion.h2
              variants={fadeInUp}
              className="
               font-ogg-regular
               text-white
               text-[30px]
               sm:text-[40px]
               lg:text-[48px]
               font-[500]
               leading-[128%]
               tracking-[1px]
               text-center
               "
            >
              Join Our Mailing List
            </motion.h2>

            {/* Description Animation */}
            <motion.p
              variants={fadeInUp}
              className="
               font-jako-trial
               text-white
               font-[400]
               text-[14px]
               md:text-[15px]
               lg:text-[16px]
               text-center
               max-w-[650px]
               mx-auto
               mt-3
               lg:mt-4
               "
            >
              Sign Up For Our Newsletter To Be The First To Hear About Our
              News And Happenings Around The World.
            </motion.p>

            {/* Form Animation */}
            <motion.form
              variants={fadeInUp}
              className="mt-2 flex justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="w-full max-w-[507px] h-[62px] md:h-[70px] lg:h-[77px] rounded-[45px] flex items-center pl-6 pr-2 shadow-lg bg-[rgba(255,255,255,0.78)] ">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="font-jako-bold flex-1 bg-transparent outline-none text-[20px] md:text-[15px] lg:text-[20px] placeholder:text-[#66839C]/70 text-[#425a70] font-medium font-jake-bold text-[400] opacity-100"
                />
                <button
                  type="submit"
                  className="w-[48px] h-[48px] md:w-[54px] md:h-[54px] lg:w-[61px] lg:h-[61px] flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 57 57"
                    className="w-full h-full"
                  >
                    <rect width="57" height="57" rx="28.5" fill="#BC2623" />
                    <path
                      d="M42.0607 30.0607C42.6464 29.4749 42.6464 28.5251 42.0607 27.9393L32.5147 18.3934C31.9289 17.8076 30.9792 17.8076 30.3934 18.3934C29.8076 18.9792 29.8076 19.9289 30.3934 20.5147L38.8787 29L30.3934 37.4853C29.8076 38.0711 29.8076 39.0208 30.3934 39.6066C30.9792 40.1924 31.9289 40.1924 32.5147 39.6066L42.0607 30.0607ZM17 29V30.5L41 30.5V29V27.5L17 27.5V29Z"
                      fill="#FFFEF8"
                    />
                  </svg>
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}