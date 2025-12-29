"use client";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className={`
            gradient-bg relative overflow-hidden rounded-3xl p-12 text-center
            md:p-16
          `}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Animated background elements */}
          <motion.div
            className={`
              absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl
            `}
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className={`
              absolute right-0 bottom-0 h-96 w-96 rounded-full bg-white/5
              blur-3xl
            `}
            animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.h2
              className={`
                font-display text-primary-foreground mb-6 text-3xl font-bold
                md:text-5xl
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Land Your Dream Job?
            </motion.h2>
            <motion.p
              className={`
                text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of professionals who have already transformed their
              careers with CVCraft.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/builder">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="rounded-full px-8 text-lg">
                    Start Building for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
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
