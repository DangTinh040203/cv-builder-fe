"use client";
import { Button } from "@shared/ui/components/button";
import { Input } from "@shared/ui/components/input";
import { cn } from "@shared/ui/lib/utils";
import { Check, Search } from "lucide-react";
import React, { useState } from "react";

import TemplateWrapper from "@/components/templates/template-wrapper";
import Template01 from "@/components/templates/Template01";
import { type Resume } from "@/types/resume.type";

export const MOCK_RESUMES: Resume[] = [
  {
    id: "resume-1",
    userId: "user-1",
    title: "Senior Full Stack Developer",
    subTitle: "Software Engineer",
    overview:
      "Passionate software engineer with 5+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud technologies. Proven track record of delivering high-quality code and leading development teams.",
    avatar: "https://github.com/shadcn.png",
    information: [
      {
        id: "info-1",
        label: "Email",
        value: "hello@example.com",
        resumeId: "resume-1",
      },
      {
        id: "info-2",
        label: "Phone",
        value: "+1 (555) 123-4567",
        resumeId: "resume-1",
      },
      {
        id: "info-3",
        label: "Location",
        value: "San Francisco, CA",
        resumeId: "resume-1",
      },
      {
        id: "info-4",
        label: "Website",
        value: "www.example.com",
        resumeId: "resume-1",
      },
    ],
    educations: [
      {
        id: "edu-1",
        school: "Stanford University",
        degree: "Master of Science",
        major: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2020-06-15"),
        resumeId: "resume-1",
      },
      {
        id: "edu-2",
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        major: "Electrical Engineering",
        startDate: new Date("2014-09-01"),
        endDate: new Date("2018-05-30"),
        resumeId: "resume-1",
      },
    ],
    skills: [
      {
        id: "skill-1",
        label: "Frontend",
        value: "React, Next.js, TypeScript, Tailwind CSS",
        resumeId: "resume-1",
      },
      {
        id: "skill-2",
        label: "Backend",
        value: "Node.js, NestJS, PostgreSQL, Redis",
        resumeId: "resume-1",
      },
      {
        id: "skill-3",
        label: "DevOps",
        value: "Docker, Kubernetes, AWS, CI/CD",
        resumeId: "resume-1",
      },
      {
        id: "skill-4",
        label: "Tools",
        value: "Git, Jira, Figma, VS Code",
        resumeId: "resume-1",
      },
    ],
    workExperiences: [
      {
        id: "exp-1",
        company: "Tech Giant Corp",
        position: "Senior Software Engineer",
        description:
          "Leading the frontend architecture for the main dashboard. Improved load time by 40% and implemented a new design system used across 5 different products. Mentoring junior developers and conducting code reviews.",
        startDate: new Date("2022-01-01"),
        endDate: null,
        resumeId: "resume-1",
      },
      {
        id: "exp-2",
        company: "StartUp Inc",
        position: "Full Stack Developer",
        description:
          "Built the MVP from scratch using MERN stack. Integrated payment gateways, real-time chat, and notification system. Scaled the application to support 10k+ concurrent users.",
        startDate: new Date("2020-07-01"),
        endDate: new Date("2021-12-31"),
        resumeId: "resume-1",
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "Project Alpha",
        subTitle: "Open Source Contribution",
        details:
          "Contributed to a major open source React UI library. Added 5 new components and fixed critical accessibility bugs.",
        resumeId: "resume-1",
      },
      {
        id: "proj-2",
        title: "Task Master App",
        subTitle: "Personal Project",
        details:
          "A productivity application built with Flutter and Firebase. Features include task organization, time tracking, and team collaboration.",
        resumeId: "resume-1",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
        {MOCK_RESUMES.map((res) => (
          <TemplateWrapper key={res.id} document={<Template01 />} />
        ))}
      </div>
    </div>
  );
};

export default Templates;
