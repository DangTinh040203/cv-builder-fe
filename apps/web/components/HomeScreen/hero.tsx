"use client";
import { Button } from "@shared/ui/components/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MousePointer2, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

import FloatingParticles from "@/components/Common/floating-particles";
import { fadeInUp, staggerContainer } from "@/styles/animation";

const HeroSection = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      ref={heroRef}
      className={`
        from-background via-primary/5 to-accent/10 relative flex min-h-[90vh]
        items-center overflow-hidden bg-linear-to-br px-4 pt-32 pb-24
      `}
    >
      <FloatingParticles />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`
            bg-primary/15 absolute top-20 right-[10%] h-96 w-96 rounded-full
            blur-[120px]
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`
            bg-accent/15 absolute bottom-20 left-[5%] h-80 w-80 rounded-full
            blur-[100px]
          `}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`
            bg-primary/10 absolute top-1/3 left-[15%] h-64 w-64 rounded-full
            blur-[80px]
          `}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`
            bg-accent/10 absolute right-[15%] bottom-1/3 h-48 w-48 rounded-full
            blur-[60px]
          `}
          animate={{ y: [0, 30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Geometric shapes */}
        <motion.div
          className={`
            border-primary/30 absolute top-40 left-[20%] h-4 w-4 rotate-45
            border-2
          `}
          animate={{ rotate: [45, 135, 45], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className={`
            border-accent/30 absolute right-[25%] bottom-40 h-6 w-6 rounded-full
            border-2
          `}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className={`
            bg-primary/30 absolute top-1/2 right-[10%] h-3 w-3 rounded-full
          `}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 container mx-auto"
        style={{ y: heroY }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            className={`
              bg-primary/10 border-primary/20 mb-8 inline-flex items-center
              gap-2 rounded-full border px-4 py-2
            `}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-primary h-4 w-4" />
            </motion.div>
            <span className="text-primary text-sm font-medium">
              AI-Powered CV Builder
            </span>
            <motion.span
              className={`
                bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs
                font-bold
              `}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              NEW
            </motion.span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className={`
              font-display text-foreground mb-6 text-4xl leading-[1.1] font-bold
              tracking-tight
              md:text-6xl
              lg:text-7xl
            `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover, connect,
            <br />
            <motion.span
              className="gradient-text inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              grow.
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className={`
              text-muted-foreground mx-auto mb-10 max-w-xl text-lg
              leading-relaxed
              md:text-xl
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Welcome to CVCraft, the largest professional CV building platform.
            Create stunning resumes in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className={`
              flex flex-col justify-center gap-3
              sm:flex-row
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/builder">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className={`
                    group relative w-full overflow-hidden rounded-full px-6
                    sm:w-auto
                  `}
                >
                  <motion.span
                    className={`
                      absolute inset-0 bg-linear-to-r from-transparent
                      via-white/20 to-transparent
                    `}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    Build your profile
                    <ArrowRight
                      className={`
                        h-4 w-4 transition-transform
                        group-hover:translate-x-1
                      `}
                    />
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/templates">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={`
                    w-full rounded-full px-6
                    sm:w-auto
                  `}
                >
                  Templates
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className={`
              mt-16 grid grid-cols-2 gap-4
              md:grid-cols-4
            `}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: "👤", label: "Professionals", color: "bg-green-500" },
              { icon: "🔗", label: "Connections", color: "bg-yellow-500" },
              { icon: "📋", label: "Job listings", color: "bg-blue-500" },
              { icon: "📄", label: "Applications", color: "bg-purple-500" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className={`
                  bg-card border-border cursor-pointer rounded-xl border p-4
                  shadow-sm transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                `}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <motion.div
                    className={`
                      h-2 w-2 rounded-full
                      ${item.color}
                    `}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                  <span className="text-muted-foreground text-sm">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-muted-foreground text-xs">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <MousePointer2 className="text-primary h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
