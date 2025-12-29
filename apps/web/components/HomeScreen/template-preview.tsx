"use client";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { fadeInUp, scaleIn, staggerContainer } from "@/styles/animation";

const templateCategories = [
  { name: "Professional", count: 4, color: "bg-primary/10 text-primary" },
  { name: "Modern", count: 2, color: "bg-accent/10 text-accent" },
  { name: "Creative", count: 2, color: "bg-destructive/10 text-destructive" },
  { name: "Minimal", count: 2, color: "bg-muted text-muted-foreground" },
];

const TemplatePreviewSection = () => {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <div
          className={`
            grid items-center gap-16
            lg:grid-cols-2
          `}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`
                font-display mb-6 text-3xl font-bold
                md:text-4xl
              `}
            >
              Choose from{" "}
              <span className="gradient-text">10+ Professional Templates</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Our templates are designed by hiring managers and career coaches
              to help you make the best first impression.
            </p>

            <motion.div
              className="mb-8 flex flex-wrap gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {templateCategories.map((cat) => (
                <motion.span
                  key={cat.name}
                  className={`
                    cursor-pointer rounded-full px-4 py-2 text-sm font-medium
                    ${cat.color}
                  `}
                  variants={scaleIn}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.name} ({cat.count})
                </motion.span>
              ))}
            </motion.div>

            <Link href="/templates">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group">
                  Browse All Templates
                  <ChevronRight
                    className={`
                      ml-1 h-4 w-4 transition-transform
                      group-hover:translate-x-1
                    `}
                  />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={`
                    bg-card border-border/50 rounded-xl border p-4 shadow-lg
                    ${i === 1 ? "col-span-2" : ""}
                  `}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="bg-primary/20 h-8 w-8 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                      <div className="flex-1">
                        <div className="bg-foreground/20 h-2 w-3/4 rounded" />
                        <div
                          className={`
                            bg-muted-foreground/20 mt-1 h-1.5 w-1/2 rounded
                          `}
                        />
                      </div>
                    </div>
                    <div className="border-border/50 space-y-1 border-t pt-2">
                      <motion.div
                        className="bg-muted h-1.5 rounded"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                      <motion.div
                        className="bg-muted h-1.5 rounded"
                        initial={{ width: 0 }}
                        whileInView={{ width: "83%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                      />
                      <motion.div
                        className="bg-muted h-1.5 rounded"
                        initial={{ width: 0 }}
                        whileInView={{ width: "66%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className={`
                gradient-bg absolute -right-4 -bottom-4 -z-10 h-32 w-32
                rounded-2xl opacity-20 blur-xl
              `}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TemplatePreviewSection;
