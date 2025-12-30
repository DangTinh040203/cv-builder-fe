"use client";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { fadeInLeft, staggerContainer } from "@/styles/animation";

const benefits = [
  "ATS-optimized formatting",
  "Real-time preview",
  "Export to PDF & Word",
  "Job-specific tailoring",
  "Grammar & spelling check",
  "Unlimited revisions",
];

const BenefitsSection = () => {
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
          >
            <h2
              className={`
                font-display mb-6 text-3xl font-bold
                md:text-4xl
              `}
            >
              Stand Out from the{" "}
              <span className="gradient-text">Competition</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Our CV builder is designed by hiring managers and career coaches
              to give you the best chance of getting noticed.
            </p>

            <motion.div
              className={`
                grid gap-4
                sm:grid-cols-2
              `}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-3"
                  variants={fadeInLeft}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  </motion.div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <Link href="/builder" className="mt-8 inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`
                bg-card border-border/50 rounded-2xl border p-8 shadow-xl
              `}
              whileHover={{ y: -5 }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    className={`
                      from-primary to-accent text-primary-foreground flex h-16
                      w-16 items-center justify-center rounded-full
                      bg-linear-to-br text-xl font-bold
                    `}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    JA
                  </motion.div>
                  <div>
                    <div className="font-display text-lg font-semibold">
                      John Anderson
                    </div>
                    <div className="text-muted-foreground">
                      Senior Software Engineer
                    </div>
                  </div>
                </div>
                <div className="border-border space-y-2 border-t pt-4">
                  {[100, 80, 90, 70].map((width, i) => (
                    <motion.div
                      key={i}
                      className="bg-muted h-3 overflow-hidden rounded-full"
                    >
                      <motion.div
                        className="bg-primary/30 h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              className={`
                gradient-bg absolute -bottom-4 -left-4 -z-10 h-40 w-40
                rounded-2xl opacity-20 blur-xl
              `}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
