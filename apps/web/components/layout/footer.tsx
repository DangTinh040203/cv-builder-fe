"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import React from "react";

import { fadeInUp, staggerContainer } from "@/styles/animation";

const Footer = () => {
  return (
    <footer className="border-border bg-muted/30 border-t px-4 py-12">
      <div className="container mx-auto">
        <motion.div
          className={`
            grid gap-8
            md:grid-cols-4
          `}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp}>
            <div className="mb-4 flex items-center gap-2">
              <motion.div
                className={`
                  gradient-bg flex h-8 w-8 items-center justify-center
                  rounded-lg
                `}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="text-primary-foreground h-5 w-5" />
              </motion.div>
              <span className="font-display text-xl font-bold">CVCraft</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The AI-powered CV builder that helps you land your dream job.
            </p>
          </motion.div>

          {[
            {
              title: "Product",
              links: ["Templates", "CV Builder", "Mock Interviews", "Pricing"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((section) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h4 className="mb-4 font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className={`
                        text-muted-foreground text-sm transition-colors
                        hover:text-foreground
                      `}
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={`
            border-border text-muted-foreground mt-12 border-t pt-8 text-center
            text-sm
          `}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © 2026 CVCraft - Cao Dang Tinh. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
