"use client";
import { motion } from "framer-motion";
import React from "react";

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];

const Marquee = () => {
  return (
    <section
      className={`
        border-border bg-muted/20 relative overflow-hidden border-y py-12
      `}
    >
      <div
        className={`
          from-background absolute top-0 left-0 z-10 h-full w-24 bg-linear-to-r
          to-transparent
          md:w-32
        `}
      />
      <div
        className={`
          from-background absolute top-0 right-0 z-10 h-full w-24 bg-linear-to-l
          to-transparent
          md:w-32
        `}
      />

      <div className="container mx-auto">
        <motion.p
          className={`
            text-muted-foreground mb-8 text-center text-xs font-semibold
            tracking-[0.2em] uppercase opacity-70
          `}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted by professionals worldwide
        </motion.p>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center gap-20 pr-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...companies, ...companies, ...companies].map((company, i) => (
              <span
                key={i}
                className={`
                  font-display text-muted-foreground text-2xl font-bold
                  whitespace-nowrap opacity-40 transition-all duration-300
                  hover:text-primary hover:scale-110 hover:opacity-100
                  md:text-3xl
                `}
              >
                {company}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
