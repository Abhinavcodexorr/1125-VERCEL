"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getContactErrorMessage,
  getContactSuccessMessage,
  submitContactMessageClient,
  validateContactFields,
} from "@/lib/api/contact";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (feedback?.type !== "success") return;

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const inputBorderClass = (hasError) =>
    hasError
      ? "border-[#BC2623] focus:border-[#BC2623]"
      : "border-gray-200 focus:border-[#9BB9DA]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const errors = validateContactFields({ name, email, message });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await submitContactMessageClient({ name, email, message });

      if (result.success) {
        setFeedback({
          type: "success",
          message: getContactSuccessMessage(result),
        });
        setName("");
        setEmail("");
        setMessage("");
        return;
      }

      setFeedback({
        type: "error",
        message: getContactErrorMessage(result),
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FFFEF8] min-h-screen">
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
              sizes="calc(100vw - 2rem)"
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

      <section className="w-full pt-[89.5px] pb-24">
        <div className="flex flex-col lg:flex-row items-start">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full lg:flex-1 px-6 md:px-12 lg:pl-[7%] xl:pl-[7%] mb-16 lg:mb-0"
          >
            <motion.h2 variants={fadeInUp} className="font-ogg-regular text-[80px] mt-6 lg:text-[110px] font-[400] leading-[0.85] text-[#222]">
              Get in
            </motion.h2>
            <motion.h2 variants={fadeInUp} className="font-ogg-regular text-[80px] mt-5 lg:text-[110px] font-[400] leading-[0.85] text-[#9BB9DA]">
              Touch
            </motion.h2>

            <motion.p variants={fadeInUp} className="mt-10 max-w-md font-jako-medium text-[#5A4F4D] text-[18px] leading-relaxed">
              For exclusive inquiries, private events, or to simply begin your journey to barefoot luxury. We await your whisper.
            </motion.p>

            <motion.form
              variants={staggerContainer}
              className="mt-16 space-y-10 max-w-lg"
              onSubmit={handleSubmit}
            >
              <motion.div variants={fadeInUp}>
                <label htmlFor="contact-name" className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                  className={`w-full bg-transparent border-b text-[20px] pb-3 outline-none transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium disabled:opacity-60 ${inputBorderClass(Boolean(fieldErrors.name))}`}
                />
                {fieldErrors.name && (
                  <p id="contact-name-error" role="alert" className="mt-2 text-[12px] text-[#BC2623] font-jako-medium">
                    {fieldErrors.name}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label htmlFor="contact-email" className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="john@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                  className={`w-full bg-transparent border-b text-[20px] pb-3 outline-none transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium disabled:opacity-60 ${inputBorderClass(Boolean(fieldErrors.email))}`}
                />
                {fieldErrors.email && (
                  <p id="contact-email-error" role="alert" className="mt-2 text-[12px] text-[#BC2623] font-jako-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label htmlFor="contact-message" className="block font-jako-bold text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">The Whisper</label>
                <textarea
                  id="contact-message"
                  rows={1}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearFieldError("message");
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="How may we assist you?"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                  className={`w-full bg-transparent border-b text-[20px] pb-3 outline-none transition-colors placeholder:text-[#D5C2C2] text-[#5A4F4D] font-jako-medium resize-none disabled:opacity-60 ${inputBorderClass(Boolean(fieldErrors.message))}`}
                />
                {fieldErrors.message && (
                  <p id="contact-message-error" role="alert" className="mt-2 text-[12px] text-[#BC2623] font-jako-medium">
                    {fieldErrors.message}
                  </p>
                )}
              </motion.div>

              <motion.button
                variants={fadeInUp}
                type="submit"
                disabled={isSubmitting}
                className="bg-[#AF2F2C] text-white font-manrope-regular px-10 py-4 rounded-full uppercase tracking-[2px] text-[12px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>

              {feedback && (
                <div
                  id="contact-feedback"
                  role="alert"
                  aria-live="polite"
                  className={`mt-6 rounded-xl border px-5 py-4 text-[15px] leading-relaxed font-jako-medium ${
                    feedback.type === "success"
                      ? "border-[#9BB9DA] bg-[#F0F6FC] text-[#2C2422]"
                      : "border-[#BC2623] bg-[#FFF5F5] text-[#BC2623]"
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </motion.form>
          </motion.div>

          <div className="w-full md:w-[80px] lg:w-[600px] ml-auto mt-28">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative w-full h-[500px] lg:h-[600px]  bg-gray-100" 
            >
              <Image
                src="/images/contact-room.jpg"
                alt="Room"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />

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
