"use client";
import { motion } from "framer-motion";
import { FileText, MessageSquare, Sparkles } from "lucide-react";
import React from "react";

import { fadeInUp, staggerContainer } from "@/styles/animation";

const features = [
  {
    icon: FileText,
    title: "10 Professional Templates",
    description:
      "Choose from beautifully designed templates that catch recruiters' attention.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description:
      "Generate and refine your CV content with AI. Just paste a job description.",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviews",
    description:
      "Practice with AI interviews tailored to your target role and industry.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`
              font-display mb-4 text-3xl font-bold
              md:text-4xl
            `}
          >
            Everything You Need to{" "}
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Our comprehensive toolkit helps you create professional CVs, tailor
            them to job descriptions, and practice interviews.
          </p>
        </motion.div>

        <motion.div
          className={`
            grid gap-8
            md:grid-cols-3
          `}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className={`
                group bg-card border-border/50 shadow-card rounded-2xl border
                p-8 transition-all duration-500
                hover:shadow-xl
              `}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div
                className={`
                  gradient-bg mb-6 flex h-14 w-14 items-center justify-center
                  rounded-xl transition-shadow duration-300
                  group-hover:shadow-glow
                `}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="text-primary-foreground h-7 w-7" />
              </motion.div>
              <h3 className="font-display mb-3 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
