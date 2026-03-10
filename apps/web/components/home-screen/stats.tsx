"use client";
import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { scaleIn, staggerContainer } from "@/styles/animation";

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const stats = [
  { value: "50", suffix: "K+", label: "CVs Created" },
  { value: "10", suffix: "K+", label: "Users Hired" },
  { value: "95", suffix: "%", label: "Success Rate" },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div
        className={`
          via-primary/20 absolute top-0 left-0 h-px w-full bg-linear-to-r
          from-transparent to-transparent
        `}
      />
      <div
        className={`
          via-primary/20 absolute bottom-0 left-0 h-px w-full bg-linear-to-r
          from-transparent to-transparent
        `}
      />

      <div className="container mx-auto">
        <motion.div
          className={`
            grid grid-cols-1 gap-12
            sm:grid-cols-3
            md:gap-24
          `}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="group text-center"
              variants={scaleIn}
            >
              <motion.div
                className={`
                  font-display gradient-text mb-2 text-6xl font-extrabold
                  tracking-tighter
                  md:text-7xl
                `}
                whileHover={{ scale: 1.05 }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <div
                className={`
                  text-muted-foreground text-sm font-semibold tracking-widest
                  uppercase opacity-80 transition-opacity
                  group-hover:opacity-100
                `}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
