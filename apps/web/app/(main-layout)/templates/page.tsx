"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@shared/ui/components/button";
import { Input } from "@shared/ui/components/input";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import FloatingParticles from "@/components/common/floating-particles";
import TemplateWrapper from "@/components/templates/template-wrapper";
import { TEMPLATES } from "@/configs/template.config";
import { MOCK_RESUME } from "@/constants/resume.constant";
import {
  setTemplateSelected,
  templateFormatSelector,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { fadeInUp, staggerContainer } from "@/styles/animation";

const categories = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
  { id: "minimal", label: "Minimal" },
];

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();
  const templateFormat = useAppSelector(templateFormatSelector);
  const dispatch = useAppDispatch();

  const handleSelectTemplate = (template: string) => {
    dispatch(setTemplateSelected(template));
    router.push("/builder");
  };

  return (
    <div
      className={`
        from-background via-primary/5 to-accent/10 relative min-h-screen
        overflow-hidden bg-linear-to-br
      `}
    >
      <FloatingParticles />

      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
      </div>

      <div className="relative z-10 container pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className={`
              font-display mb-4 text-4xl font-bold
              md:text-5xl
            `}
          >
            Choose Your <span className="gradient-text">Perfect Template</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
          >
            Browse our collection of professionally designed CV templates. Each
            template is ATS-friendly and fully customizable.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            mb-8 flex flex-col items-center justify-between gap-4
            md:flex-row
          `}
        >
          <div className="relative max-w-md flex-1">
            <Search
              className={`
                text-muted-foreground absolute top-1/2 left-3 h-5 w-5
                -translate-y-1/2
              `}
            />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 pl-10 backdrop-blur-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  selectedCategory === category.id && "gradient-bg border-0",
                  `
                    bg-background/50 backdrop-blur-sm transition-all
                    hover:scale-105
                  `,
                )}
              >
                {selectedCategory === category.id && (
                  <Check className="mr-1 h-4 w-4" />
                )}
                {category.label}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={`
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          `}
        >
          {Object.entries(TEMPLATES).map(([templateId, Template], i) => (
            <motion.div
              variants={fadeInUp}
              key={i}
              className={`
                group relative transition-all
                hover:scale-[102%]
              `}
            >
              <div
                className={`
                  group-hover:border-primary/50 group-hover:shadow-xl
                  bg-card/50 overflow-hidden rounded-xl border shadow-sm
                  backdrop-blur-sm transition-all
                `}
              >
                <div
                  className={`
                    transition-all duration-300
                    group-hover:scale-[102%] group-hover:blur-[2px]
                  `}
                >
                  <TemplateWrapper
                    scrollable={false}
                    selectable={false}
                    document={
                      <Template
                        resume={MOCK_RESUME}
                        templateFormat={templateFormat}
                      />
                    }
                  />
                </div>
              </div>

              <div
                className={`
                  group-hover:bg-muted/10 group-hover:border
                  group-hover:shadow-2xl
                  absolute top-0 left-0 z-10 flex size-full items-end
                  justify-center rounded-2xl bg-transparent px-6
                `}
              >
                <Button
                  onClick={() => handleSelectTemplate(templateId)}
                  className={`
                    mb-10 w-full rounded-full opacity-0 transition-opacity
                    group-hover:opacity-100
                  `}
                  size={"lg"}
                >
                  Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;
