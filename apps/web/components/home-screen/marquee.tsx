"use client";
import { motion } from "framer-motion";
import React from "react";

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];

const Marquee = () => {
  return (
    <section
      className={`border-border bg-muted/30 overflow-hidden border-b px-4 py-12`}
    >
      <div className="container mx-auto space-y-2">
        <motion.p
          className="text-muted-foreground mb-6 text-center text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted by professionals from leading companies
        </motion.p>
        <div className="relative">
          <motion.div
            className="flex items-center gap-16"
            animate={{ x: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...companies, ...companies].map((company, i) => (
              <span
                key={i}
                className={`
                  font-display text-muted-foreground text-xl font-bold
                  whitespace-nowrap opacity-60 transition-opacity
                  hover:opacity-100
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
