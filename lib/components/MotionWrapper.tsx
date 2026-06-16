"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const FadeIn = ({ children, delay = 0, y = 20, once = false }: { children: ReactNode, delay?: number, y?: number, once?: boolean }) => {
  if (once) {
    return (
      <motion.div
        initial={{ opacity: 0, y: y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Parent Container
export const StaggerContainer = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: delay }
      }
    }}
  >
    {children}
  </motion.div>
);

// Child Items (Use this for the individual Tabs)
export const StaggerItem = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

export const SectionFade = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.7,
      delay,
    }}
  >
    {children}
  </motion.div>
);