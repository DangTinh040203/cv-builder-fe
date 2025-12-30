"use client";
import { motion } from "framer-motion";
import { Download, Upload, Wand2 } from "lucide-react";
import React from "react";

const howItWorks = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Info",
    description:
      "Start fresh or import your existing CV. Add your experience, education, and skills.",
  },
  {
    step: "02",
    icon: Wand2,
    title: "AI Enhancement",
    description:
      "Let AI optimize your content for the job you want. Paste a job description for tailored suggestions.",
  },
  {
    step: "03",
    icon: Download,
    title: "Download & Apply",
    description:
      "Export your polished CV in PDF or Word format. Ready to land your dream job!",
  },
];

const HowItWorksSection = () => {
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
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Create your perfect CV in just 3 simple steps
          </p>
        </motion.div>

        <div
          className={`
            relative grid gap-8
            md:grid-cols-3
          `}
        >
          {/* Connection Line */}
          <motion.div
            className={`
              from-primary via-accent to-primary absolute top-1/2 right-1/4
              left-1/4 hidden h-0.5 bg-linear-to-r opacity-20
              md:block
            `}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className={`
                  gradient-bg relative z-10 mb-6 inline-flex h-20 w-20
                  items-center justify-center rounded-2xl shadow-lg
                `}
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                <item.icon className="text-primary-foreground h-10 w-10" />
              </motion.div>
              <motion.span
                className={`
                  font-display text-muted/50 absolute -top-2 -right-2 text-6xl
                  font-bold
                  md:right-1/4
                `}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
              >
                {item.step}
              </motion.span>
              <h3 className="font-display mb-3 text-xl font-semibold">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
