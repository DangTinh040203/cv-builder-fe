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
    <section
      className={`
        from-primary/10 via-accent/10 to-primary/10 bg-linear-to-r px-4 py-16
      `}
    >
      <div className="container mx-auto">
        <motion.div
          className={`
            flex flex-wrap justify-center gap-12
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
              className="text-center"
              variants={scaleIn}
            >
              <motion.div
                className={`
                  font-display gradient-text text-5xl font-bold
                  md:text-6xl
                `}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <div className="text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
