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
    <section className="relative overflow-hidden px-4 py-24">
      <div
        className={`
          via-primary/20 absolute top-0 left-0 h-px w-full bg-linear-to-r
          from-transparent to-transparent
        `}
      />

      <div className="container mx-auto">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`
              text-primary bg-primary/10 mb-6 inline-block rounded-full px-4
              py-1.5 text-sm font-semibold tracking-wider uppercase
            `}
          >
            Simple 3-Step Process
          </motion.div>
          <h2 className="font-display mb-6 text-3xl font-extrabold tracking-tight md:text-5xl">
            Start Your Journey in <span className="gradient-text">Minutes</span>
          </h2>
          <p
            className={`
              text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed
            `}
          >
            We&apos;ve streamlined the CV building process so you can focus on
            what matters: telling your professional story.
          </p>
        </motion.div>

        <div
          className={`
            relative grid gap-12
            md:grid-cols-3
          `}
        >
          {/* Connection Line */}
          <motion.div
            className={`
              from-primary via-accent to-primary absolute top-10 right-1/4
              left-1/4 hidden h-0.5 bg-linear-to-r opacity-20
              md:block
            `}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />

          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              className="group relative text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative mb-10 inline-block">
                <motion.div
                  className={`
                    from-primary to-accent shadow-primary/30 relative z-10 flex
                    h-20 w-20 items-center justify-center rounded-[24px]
                    bg-linear-to-br shadow-xl transition-all duration-500
                    group-hover:shadow-primary/50 group-hover:rotate-6
                  `}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  <item.icon className="text-primary-foreground h-10 w-10" />
                </motion.div>

                <motion.div
                  className={`
                    text-primary/10 absolute -top-6 -right-6 text-6xl font-black
                    transition-colors select-none
                    group-hover:text-primary/20
                  `}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {item.step}
                </motion.div>
              </div>

              <h3
                className={`
                  font-display mb-4 text-2xl font-bold transition-colors
                  group-hover:text-primary
                `}
              >
                {item.title}
              </h3>
              <p
                className={`
                  text-muted-foreground mx-auto max-w-xs text-lg leading-relaxed
                `}
              >
                {item.description}
              </p>

              <div
                className={`
                  bg-primary/20 mx-auto mt-8 h-1 w-12 rounded-full
                  transition-all
                  group-hover:bg-primary/40 group-hover:w-20
                `}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
