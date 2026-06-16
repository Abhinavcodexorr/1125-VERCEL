"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function ContactPage() {
  return (
    <main className="bg-[#FFFEF8] min-h-screen">
      {/* Banner Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="px-4 mt-4"
      >
        <div className="relative h-[350px] md:h-[420px] overflow-hidden rounded-2xl">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src="/images/accommodation-banner.jpg"
              alt="Banner"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-ogg-regular font-[400] text-white text-[50px] md:text-[55px] lg:text-[75px]">
              Contact Us
            </h1>
          </div>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <section className="w-full pt-[89.5px] pb-24">
        <div className="flex flex-col lg:flex-row items-start">
          
          {/* LEFT SIDE - Form (Original Alignment) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full lg:flex-1 px-6 md:px-12 lg:pl-[7%] xl:pl-[7%] mb-16 lg:mb-0"
          >
            <motion.h2 variants={fadeInUp} className="font-ogg-regular text-[80px] lg:text-[110px] font-[400] leading-[0.85] text-[#222]">
              Get in
            </motion.h2>
            <motion.h2 variants={fadeInUp} className="font-ogg-regular text-[80px] lg:text-[110px] font-[400] leading-[0.85] text-[#9BB9DA]">
              Touch
            </motion.h2>

            <motion.p variants={fadeInUp} className="mt-10 max-w-md font-jako-medium text-[#5A4F4D] text-[18px] leading-relaxed">
              For exclusive inquiries, private events, or to simply begin your journey to barefoot luxury. We await your whisper.
            </motion.p>

            <motion.form variants={staggerContainer} className="mt-16 space-y-10 max-w-lg">
              <motion.div variants={fadeInUp}>
                <label className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-gray-200 text-[20px] pb-3 outline-none focus:border-[#9BB9DA] transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium"  />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">Your Email</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-gray-200 text-[20px] pb-3 outline-none focus:border-[#9BB9DA] transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium" />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">The Whisper</label>
                <textarea rows={1} placeholder="How may we assist you?" className="w-full bg-transparent border-b border-gray-200 text-[20px] pb-3 outline-none focus:border-[#9BB9DA] transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium" />
              </motion.div>

              <motion.button variants={fadeInUp} className="bg-[#AF2F2C] text-white font-manrope-regular px-10 py-4 rounded-full uppercase tracking-[2px] text-[12px] mt-4">
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>

          {/* RIGHT SIDE - Exact Figma Specs: 480x600 & Sticking to Right Edge */}
          <div className="w-full md:w-[80px] lg:w-[600px] ml-auto mt-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative w-full h-[500px] lg:h-[600px] bg-gray-100" 
            >
              <Image
                src="/images/contact-room.jpg"
                alt="Room"
                fill
                className="object-cover"
              />

              {/* White Info Box */}
              <div className="absolute bottom-0 right-0 bg-white p-10 lg:p-12  max-w-[250px] lg:max-w-[310px] shadow-sm z-10">
                <div className="space-y-6 pr-10">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-gray-400 mb-2 font-jako-bold">Direct</p>
                    <p className="font-manrope-regular text-[#2C2422] text-[18px] lg:text-[20px] leading-tight">+233 50 940 4673</p>
                    <p className="font-manrope-regular text-[#2C2422] text-[18px] lg:text-[20px] leading-tight">+233 24 970 8679</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-gray-400 mb-2 font-jako-bold">Location</p>
                    <p className="font-manrope-regular text-[#2C2422] text-[18px] lg:text-[20px]">Kokrobite</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </main>
  );
}