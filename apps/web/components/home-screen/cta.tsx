"use client";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="px-4 py-24 pb-32">
      <div className="container mx-auto">
        <motion.div
          className={`
            from-primary to-primary/50 shadow-primary/20 relative
            overflow-hidden rounded-[48px] bg-linear-to-br p-12 text-center
            shadow-2xl
            md:p-24
          `}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        >
          {/* Animated background elements */}
          <motion.div
            className={`
              absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl
            `}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`
              absolute right-0 bottom-0 h-96 w-96 rounded-full bg-black/10
              blur-3xl
            `}
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`
                text-primary-foreground mb-8 inline-block rounded-full
                bg-white/20 px-6 py-2 text-sm font-black tracking-[0.2em]
                uppercase backdrop-blur-md
              `}
            >
              Take the next step
            </motion.div>
            <motion.h2
              className={`
                font-display text-primary-foreground mb-8 text-4xl font-black
                tracking-tighter
                md:text-6xl
                lg:text-7xl
              `}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Ready to Land Your{" "}
              <br
                className={`
                  hidden
                  md:block
                `}
              />
              <span className="text-white">Dream Job?</span>
            </motion.h2>
            <motion.p
              className={`
                text-primary-foreground/80 mx-auto mb-12 max-w-2xl text-xl
                leading-relaxed font-medium
              `}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Join 10,000+ professionals who have already transformed their
              careers with our AI-powered toolkit.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className={`
                flex flex-col items-center justify-center gap-6
                sm:flex-row
              `}
            >
              <Link href="/templates">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="xl"
                    className={`
                      text-primary h-16 rounded-full bg-white px-12 text-xl
                      font-black shadow-2xl transition-all duration-300
                      hover:bg-white/90
                    `}
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
