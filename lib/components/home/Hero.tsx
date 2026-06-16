"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, Variants } from "framer-motion"; // Variants import kiya

// 1. Animation Variants with explicit Types for TypeScript
const fadeInUp: Variants = {
   hidden: { 
      opacity: 0, 
      y: 30 
   },
   visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
         duration: 0.8, 
         ease: "easeOut" 
      } 
   }
};

const imageZoom: Variants = {
   hidden: { 
      scale: 1.1, 
      opacity: 0 
   },
   visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
         duration: 1.5, 
         ease: "easeOut" 
      } 
   }
};

export default function Hero() {
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      router.push("/accommodations/5-bedroom-beach-house");
   };

   const [date, setDate] = useState<Date | null>(new Date());

   const handleDateChange = (d: Date | null) => {
      setDate(d);
   };

   return (
      <section className="bg-[#FFFEF8] overflow-hidden w-full md:pt-4">
         <div className="max-w-[1200px] mx-auto px-0 md:pt-4">
            
            {/* Mobile Hero */}
            <div className="block md:hidden relative h-[720px] overflow-hidden">
               <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={imageZoom}
                  className="absolute inset-0 w-full h-full"
               >
                  <Image
                     src="/images/hero.jpg"
                     alt="Beach Villa"
                     fill
                     priority
                     sizes="100vw"
                     className="object-cover object-center"
                  />
               </motion.div>

               <div className="absolute inset-0 bg-black/10" />

               <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pt-[180px]">
                  {/* Logo Animation */}
                  <motion.svg
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                     width="58"
                     height="72"
                     viewBox="0 0 58 72"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className="mb-6"
                  >
                     <path d="M11.2569 0V71.4904C9.242 71.6129 6.63761 69.7971 6.63761 69.7971C6.63761 69.7971 -1.76507 44.8382 0.3378 24.2672C2.07113 7.50786 8.79327 1.62118 11.2569 0Z" fill="white" />
                     <path d="M19.2979 66.4666C18.6832 68.5734 18.2793 69.7886 18.2793 69.7886C18.2793 69.7886 15.6451 71.6006 13.6694 71.4927V61.8574L19.2979 66.4666Z" fill="white" />
                     <path d="M19.9898 64.2663L13.6694 59.1227V0C16.1342 1.61099 22.8506 7.51315 24.5848 24.3166C26.0812 38.9095 22.3137 55.6985 19.9898 64.2663Z" fill="white" />
                     <path d="M43.4197 0V71.4904C41.4043 71.6129 38.7992 69.7971 38.7992 69.7971C38.7992 69.7971 30.3591 44.8382 32.5154 24.2672C34.2227 7.50786 40.9555 1.62118 43.4197 0Z" fill="white" />
                     <path d="M52.2644 66.3909C51.6284 68.5735 51.1928 69.8296 51.1928 69.8296C51.1928 69.8296 48.6225 71.5981 46.636 71.4929V61.8574L52.2644 66.3909Z" fill="white" />
                     <path d="M52.9799 63.463L46.636 58.3176V0C49.0678 1.59588 55.8082 7.44266 57.5439 24.0885C59.0506 38.4299 55.3324 54.904 52.9799 63.463Z" fill="white" />
                     <path d="M49.743 62.4714L43.7449 57.5779V57.5234L49.743 62.4714Z" fill="white" />
                  </motion.svg>

                  <motion.h1
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 0.7 }}
                     className="font-ogg-trial text-white text-[42px] leading-[46px] tracking-[-1px]"
                  >
                     Lose Your Shoes.<br />Find Your Soul.
                  </motion.h1>

                  <motion.p
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 0.9 }}
                     className="mt-4 max-w-[320px] text-white/95 text-[14px] leading-relaxed font-manrope-regular"
                  >
                     Experience a sanctuary where the only schedule is the tide and
                     the only dress code is the sand.
                  </motion.p>

                  <motion.form 
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 1.1 }}
                     onSubmit={handleSubmit} 
                     className="mt-6 w-[92%] max-w-[360px] rounded-full bg-white p-[4px] shadow-xl"
                  >
                     <div className="flex items-center">
                        <div className="flex-1 px-4">
                           <DatePicker
                              selected={date}
                              onChange={handleDateChange}
                              placeholderText="Select Date"
                              dateFormat="yyyy-MM-dd"
                              filterDate={(d) => {
                                 const today = new Date();
                                 today.setHours(0, 0, 0, 0);
                                 return d >= today;
                              }}
                              disabledKeyboardNavigation
                              customInput={
                                 <button
                                    type="button"
                                    className="w-full bg-transparent outline-none text-[#425a70] text-[14px] font-semibold text-left select-none"
                                 >
                                    {date ? date.toLocaleDateString('en-CA') : "Select Date"}
                                 </button>
                              }
                           />
                        </div>
                        <button
                           type="submit"
                           className="h-[48px] w-[155px] rounded-full bg-[#BC2623] hover:bg-[#a71f1d] text-white text-[12px] font-bold uppercase tracking-[1px] shrink-0 cursor-pointer"
                        >
                           Book A Chalet
                        </button>
                     </div>
                  </motion.form>
               </div>
            </div>

            {/* Desktop Hero */}
            <motion.div
               initial="hidden"
               animate="visible"
               variants={imageZoom}
               className="hidden md:block relative h-[100vh] w-full overflow-hidden"
               style={{
                  maskImage: "url('/Vector.svg')",
                  WebkitMaskImage: "url('/Vector.svg')",
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
               }}
            >
               <Image
                  src="/images/hero.jpg"
                  alt="Beach Villa Panoramic View"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
               />
               <div className="absolute inset-0 bg-black/10" />
               <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-8">
                  {/* Logo */}
                  <motion.svg
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.6, duration: 0.8 }}
                     width="58"
                     height="72"
                     viewBox="0 0 58 72"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className="mx-auto"
                  >
                     <path d="M11.2569 0V71.4904C9.242 71.6129 6.63761 69.7971 6.63761 69.7971C6.63761 69.7971 -1.76507 44.8382 0.3378 24.2672C2.07113 7.50786 8.79327 1.62118 11.2569 0Z" fill="white" />
                     <path d="M19.2979 66.4666C18.6832 68.5734 18.2793 69.7886 18.2793 69.7886C18.2793 69.7886 15.6451 71.6006 13.6694 71.4927V61.8574L19.2979 66.4666Z" fill="white" />
                     <path d="M19.9898 64.2663L13.6694 59.1227V0C16.1342 1.61099 22.8506 7.51315 24.5848 24.3166C26.0812 38.9095 22.3137 55.6985 19.9898 64.2663Z" fill="white" />
                     <path d="M43.4197 0V71.4904C41.4043 71.6129 38.7992 69.7971 38.7992 69.7971C38.7992 69.7971 30.3591 44.8382 32.5154 24.2672C34.2227 7.50786 40.9555 1.62118 43.4197 0Z" fill="white" />
                     <path d="M52.2644 66.3909C51.6284 68.5735 51.1928 69.8296 51.1928 69.8296C51.1928 69.8296 48.6225 71.5981 46.636 71.4929V61.8574L52.2644 66.3909Z" fill="white" />
                     <path d="M52.9799 63.463L46.636 58.3176V0C49.0678 1.59588 55.8082 7.44266 57.5439 24.0885C59.0506 38.4299 55.3324 54.904 52.9799 63.463Z" fill="white" />
                     <path d="M49.743 62.4714L43.7449 57.5779V57.5234L49.743 62.4714Z" fill="white" />
                  </motion.svg>
                  
                  {/* Heading */}
                  <motion.h1
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 0.8 }}
                     className="font-ogg-trial text-white font-normal text-[60px] lg:text-[80px] leading-[68px] lg:leading-[86px] tracking-[-2px] max-w-[950px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                  >
                     Lose Your Shoes.<br />Find Your Soul.
                  </motion.h1>

                  {/* Description */}
                  <motion.p 
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 1 }}
                     className="mt-5 max-w-[520px] font-manrope-regular text-white/95 text-base font-light tracking-[0.5px] leading-relaxed"
                  >
                     Experience a sanctuary where the only schedule is the tide and
                     the only dress code is the sand.
                  </motion.p>

                  {/* Form */}
                  <motion.form 
                     initial="hidden"
                     animate="visible"
                     variants={fadeInUp}
                     transition={{ delay: 1.2 }}
                     onSubmit={handleSubmit} 
                     className="mt-12 w-[680px] h-[62px] rounded-[51px] bg-white p-[4px] shadow-xl"
                  >
                     <div className="flex items-center justify-between h-full">
                        <div className="flex-1 pl-8">
                           <DatePicker
                              selected={date}
                              onChange={handleDateChange}
                              placeholderText="Select Date"
                              dateFormat="yyyy-MM-dd"
                              filterDate={(d) => {
                                 const today = new Date();
                                 today.setHours(0, 0, 0, 0);
                                 return d >= today;
                              }}
                              disabledKeyboardNavigation
                              customInput={
                                 <button
                                    type="button"
                                    className="w-full h-[54px] bg-transparent outline-none text-[#425a70] text-[14px] font-[700] font-manrope-regular text-left select-none"
                                 >
                                    {date ? date.toLocaleDateString('en-CA') : "Select Date"}
                                 </button>
                              }
                           />
                        </div>
                        <button
                           type="submit"
                           className="h-[54px] w-[190px] rounded-full bg-[#BC2623] hover:bg-[#a71f1d] text-white font-manrope-regular text-[14px] font-[700] uppercase tracking-[1.5px] transition-all shrink-0 cursor-pointer"
                        >
                           Book A Chalet
                        </button>
                     </div>
                  </motion.form>
               </div>
            </motion.div>
         </div>
      </section>
   );
}