"use client";
import { Card, CardContent } from "@shared/ui/components/card";
import { motion } from "framer-motion";
import { Award, Clock, Shield, Target, TrendingUp, Zap } from "lucide-react";
import React from "react";

import { fadeInUp, staggerContainer } from "@/styles/animation";

const whyChooseUs = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create a professional CV in under 10 minutes with our intuitive builder.",
  },
  {
    icon: Shield,
    title: "ATS-Friendly",
    description:
      "All templates are optimized to pass Applicant Tracking Systems.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description:
      "AI writes compelling content so you can focus on what matters.",
  },
  {
    icon: Target,
    title: "Job-Targeted",
    description:
      "Tailor your CV to specific job descriptions for higher success rates.",
  },
  {
    icon: Award,
    title: "Expert Approved",
    description: "Templates designed by hiring managers and career coaches.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "95% of users report getting more interview callbacks.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className={`
              font-display mb-4 text-3xl font-bold
              md:text-4xl
            `}
          >
            Why Choose <span className="gradient-text">CVCraft</span>?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            We&apos;re not just another CV builder. Here&apos;s what makes us
            different.
          </p>
        </motion.div>

        <motion.div
          className={`
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          `}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whyChooseUs.map((item) => (
            <motion.div key={item.title} variants={fadeInUp}>
              <Card
                className={`
                  border-border/50 group overflow-hidden transition-all
                  duration-500
                  hover:shadow-xl
                `}
              >
                <CardContent className="relative pt-6">
                  <motion.div
                    className={`
                      from-primary/5 absolute inset-0 bg-linear-to-br
                      to-transparent opacity-0 transition-opacity duration-500
                      group-hover:opacity-100
                    `}
                  />
                  <motion.div
                    className={`
                      bg-primary/10 relative z-10 mb-4 flex h-12 w-12
                      items-center justify-center rounded-lg
                    `}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="text-primary h-6 w-6" />
                  </motion.div>
                  <h3
                    className={`
                      font-display relative z-10 mb-2 text-lg font-semibold
                    `}
                  >
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground relative z-10 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
