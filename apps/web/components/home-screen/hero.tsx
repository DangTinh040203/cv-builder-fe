"use client";
import { Badge } from "@shared/ui/components/badge";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

import FloatingParticles from "@/components/common/floating-particles";
import { fadeInUp, staggerContainer } from "@/styles/animation";

const HeroSection = () => {
  return (
    <section
      className={`
        from-background via-primary/5 to-accent/10 relative flex min-h-screen
        items-center overflow-hidden bg-linear-to-br px-4 pt-32 pb-24
      `}
    >
      <FloatingParticles />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`
            bg-primary/20 absolute top-[-10%] right-[-5%] h-[500px] w-[500px]
            rounded-full blur-[120px]
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className={`
            bg-accent/20 absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px]
            rounded-full blur-[100px]
          `}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className={`
            bg-primary/15 absolute top-1/4 left-1/4 h-32 w-32 rounded-full
            blur-[60px]
          `}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            className={`
              bg-primary/10 border-primary/20 mb-8 inline-flex items-center
              gap-2 rounded-full border px-4 py-2 backdrop-blur-sm
            `}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-primary h-4 w-4" />
            </motion.div>
            <span className="text-primary text-sm font-medium">
              AI-Powered CV Builder
            </span>
            <Badge
              className={`bg-primary/20 text-primary border-none text-[10px]`}
            >
              NEW
            </Badge>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden">
            <motion.h1
              className={`
                font-display text-foreground mb-6 text-4xl leading-[1.1]
                font-extrabold tracking-tight
                md:text-7xl
                lg:text-8xl
              `}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              Discover, connect,
              <br />
              <motion.span
                className="gradient-text inline-block py-2"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                grow.
              </motion.span>
            </motion.h1>
          </div>

          <motion.p
            className={`
              text-muted-foreground mx-auto mb-10 max-w-2xl text-lg
              leading-relaxed
              md:text-xl
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Welcome to CVCraft, the largest professional CV building platform.
            <br
              className={`
                hidden
                md:block
              `}
            />
            Craft stunning, ATS-friendly resumes in minutes with AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className={`
              flex flex-col justify-center gap-4
              sm:flex-row
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/builder">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="xl"
                  className={`
                    group shadow-primary/20 relative h-14 w-full overflow-hidden
                    rounded-full px-8 text-lg shadow-xl
                    sm:w-auto
                  `}
                >
                  <motion.span
                    className={`
                      absolute inset-0 bg-linear-to-r from-transparent
                      via-white/20 to-transparent
                    `}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    Build your profile
                    <ArrowRight
                      className={`
                        h-5 w-5 transition-transform duration-300
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
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="xl"
                  className={`
                    h-14 w-full rounded-full border-2 px-8 text-lg
                    backdrop-blur-sm
                    sm:w-auto
                  `}
                >
                  View Templates
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className={`
              mt-20 grid grid-cols-2 gap-4
              md:grid-cols-4
            `}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: "👤",
                label: "Professionals",
                color: "bg-green-500",
                count: "50k+",
              },
              {
                icon: "🔗",
                label: "Connections",
                color: "bg-yellow-500",
                count: "120k+",
              },
              {
                icon: "📋",
                label: "Job listings",
                color: "bg-blue-500",
                count: "15k+",
              },
              {
                icon: "📄",
                label: "Applications",
                color: "bg-purple-500",
                count: "200k+",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className={`
                  bg-card/50 border-border/50 group relative cursor-pointer
                  overflow-hidden rounded-2xl border p-4 backdrop-blur-md
                  transition-all duration-500
                  hover:border-primary/30 hover:shadow-primary/10
                  hover:-translate-y-2 hover:shadow-2xl
                `}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`
                    absolute -top-4 -right-4 text-4xl opacity-5
                    transition-transform
                    group-hover:scale-150
                  `}
                >
                  {item.icon}
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <motion.div
                    className={`
                      h-2 w-2 rounded-full
                      ${item.color}
                    `}
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                  <span
                    className={`
                      text-muted-foreground text-xs font-medium tracking-wider
                      uppercase
                    `}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span
              className={`
                text-muted-foreground text-xs font-medium tracking-[0.2em]
                uppercase
              `}
            >
              Scroll to explore
            </span>
            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className={`
                  border-primary/30 flex h-10 w-6 justify-center rounded-full
                  border-2 p-1
                `}
              >
                <motion.div
                  className="bg-primary h-2 w-1 rounded-full"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
