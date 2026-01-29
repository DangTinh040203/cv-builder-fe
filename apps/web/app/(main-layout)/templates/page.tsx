"use client";
import { Button } from "@shared/ui/components/button";
import { Input } from "@shared/ui/components/input";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import TemplateWrapper from "@/components/templates/template-wrapper";
import { TEMPLATES } from "@/configs/template.config";
import { MOCK_RESUME } from "@/constants/resume.constant";
import {
  setTemplateSelected,
  templateFormatSelector,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

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
    <div className="container min-h-screen">
      <div className="mb-12 pt-24 text-center">
        <h1
          className={`
            font-display mb-4 text-4xl font-bold
            md:text-5xl
          `}
        >
          Choose Your <span className="gradient-text">Perfect Template</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Browse our collection of professionally designed CV templates. Each
          template is ATS-friendly and fully customizable.
        </p>
      </div>

      <div
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
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                selectedCategory === category.id && "gradient-bg border-0",
              )}
            >
              {selectedCategory === category.id && (
                <Check className="mr-1 h-4 w-4" />
              )}
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Object.entries(TEMPLATES).map(([templateId, Template], i) => (
          <div
            key={i}
            className={`
              group relative transition-all
              hover:scale-[102%]
            `}
          >
            <div
              className={`
                group-hover:border-primary/50 group-hover:shadow-xl
                overflow-hidden rounded-xl border shadow-sm transition-all
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
