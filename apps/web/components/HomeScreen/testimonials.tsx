"use client";
import { Card, CardContent } from "@shared/ui/components/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import React from "react";

import { fadeInUp, staggerContainer } from "@/styles/animation";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    image: "SC",
    content:
      "CVCraft helped me land my dream job at Google. The AI suggestions made my resume stand out from hundreds of applicants.",
    rating: 5,
  },
  {
    name: "Michael Roberts",
    role: "Product Manager at Meta",
    image: "MR",
    content:
      "The mock interview feature was a game-changer. I felt so prepared walking into my final round interviews.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    image: "EW",
    content:
      "I tried many CV builders, but CVCraft's templates and AI writing are simply the best. Highly recommend!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="px-4 py-20">
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
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            See what our users have to say about their experience.
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
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <Card
                className={`
                  border-border/50 h-full transition-all duration-500
                  hover:shadow-xl
                `}
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star
                          className={`h-5 w-5 fill-yellow-400 text-yellow-400`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`
                        gradient-bg text-primary-foreground flex h-12 w-12
                        items-center justify-center rounded-full font-semibold
                      `}
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.image}
                    </motion.div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
