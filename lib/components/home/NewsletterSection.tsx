"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  subscribeEmailClient,
  validateSubscribeEmail,
} from "@/lib/api/subscribe";

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
      staggerChildren: 0.2,
    },
  },
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const validationError = validateSubscribeEmail(email);
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await subscribeEmailClient({ email });

      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message || "Subscribed successfully",
        });
        setEmail("");
        return;
      }

      setFeedback({
        type: "error",
        message: result.message || "Failed to subscribe",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className="relative min-h-[280px] sm:h-[340px] md:h-[380px] flex items-center justify-center bg-cover bg-left py-12 sm:py-0"
        style={{
          backgroundImage: "url('/images/newsletter-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/25" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-center"
        >
          <div className="text-center w-full max-w-[640px]">
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

            <motion.form
              variants={fadeInUp}
              className="mt-2 flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <div className="newsletter-pill relative w-full max-w-[507px] h-[62px] md:h-[70px] lg:h-[77px] rounded-[45px] shadow-lg overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="Email Address"
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={feedback?.type === "error"}
                  aria-describedby={
                    feedback ? "newsletter-feedback" : undefined
                  }
                  className="newsletter-pill-input absolute inset-0 w-full h-full pl-6 pr-[68px] md:pr-[74px] lg:pr-[80px] rounded-[45px] border-0 outline-none font-jako-bold text-[20px] md:text-[15px] lg:text-[20px] placeholder:text-[#66839C]/70 text-[#1a242d] font-[400] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Subscribe to newsletter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-[48px] h-[48px] md:w-[54px] md:h-[54px] lg:w-[61px] lg:h-[61px] flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <svg viewBox="0 0 57 57" className="w-full h-full">
                    <rect width="57" height="57" rx="28.5" fill="#BC2623" />
                    <path
                      d="M42.0607 30.0607C42.6464 29.4749 42.6464 28.5251 42.0607 27.9393L32.5147 18.3934C31.9289 17.8076 30.9792 17.8076 30.3934 18.3934C29.8076 18.9792 29.8076 19.9289 30.3934 20.5147L38.8787 29L30.3934 37.4853C29.8076 38.0711 29.8076 39.0208 30.3934 39.6066C30.9792 40.1924 31.9289 40.1924 32.5147 39.6066L42.0607 30.0607ZM17 29V30.5L41 30.5V29V27.5L17 27.5V29Z"
                      fill="#FFFEF8"
                    />
                  </svg>
                </button>
              </div>

              {feedback && (
                <p
                  id="newsletter-feedback"
                  role="alert"
                  className={`mt-3 text-[13px] sm:text-[14px] font-jako-medium max-w-[507px] ${
                    feedback.type === "success"
                      ? "text-[#E8F5E9]"
                      : "text-[#FFE0E0]"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
