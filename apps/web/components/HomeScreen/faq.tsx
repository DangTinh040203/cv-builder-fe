"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/components/accordion";
import { motion } from "framer-motion";
import React from "react";

const faqs = [
  {
    question: "Is CVCraft really free to use?",
    answer:
      "Yes! You can create and download your CV for free. We offer premium templates and advanced AI features for users who want extra polish.",
  },
  {
    question: "How does the AI CV writing work?",
    answer:
      "Our AI analyzes your experience and the job description you're targeting. It then suggests impactful bullet points, optimizes keywords, and ensures your CV is tailored for the role.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "Absolutely. All our templates are designed to pass Applicant Tracking Systems while still looking professional and modern.",
  },
  {
    question: "Can I edit my CV after downloading?",
    answer:
      "Yes! Your CVs are saved to your account. You can come back anytime to make edits and download updated versions.",
  },
  {
    question: "How does the mock interview feature work?",
    answer:
      "Our AI interviewer asks you common questions for your target role. You can practice answering verbally, and the AI provides feedback on your responses.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto max-w-3xl">
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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about CVCraft.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className={`bg-card border-border/50 rounded-lg border px-6`}
                >
                  <AccordionTrigger
                    className={`
                      text-left font-semibold
                      hover:no-underline
                    `}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
