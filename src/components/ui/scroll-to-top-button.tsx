"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      aria-label="Scroll to top"
      className={cn(
        `
          fixed right-6 bottom-6 z-50 hidden rounded-full shadow-2xl
          transition-all duration-300
          md:flex
        `,
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
