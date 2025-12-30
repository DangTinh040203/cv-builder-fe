"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed right-8 bottom-8 z-50"
        >
          <button
            onClick={scrollToTop}
            className={`
              bg-primary text-primary-foreground flex size-12 items-center
              justify-center rounded-full shadow-lg transition-all
              hover:bg-primary/90 hover:shadow-xl
              focus:ring-2 focus:ring-offset-2 focus:outline-none
            `}
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
