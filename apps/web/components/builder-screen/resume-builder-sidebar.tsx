"use client";
import { Card, CardContent } from "@shared/ui/components/card";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  ChevronRight,
  Code,
  FileText,
  FolderGit2,
  GraduationCap,
  User,
} from "lucide-react";
import React, { useState } from "react";

export enum Section {
  Personal = "personal",
  Summary = "summary",
  Experience = "experience",
  Education = "education",
  Skills = "skills",
  Certifications = "certifications",
  Projects = "projects",
}

const sectionConfig = [
  { id: Section.Personal, label: "Personal", icon: User },
  { id: Section.Summary, label: "Summary", icon: FileText },
  { id: Section.Experience, label: "Experience", icon: Briefcase },
  { id: Section.Education, label: "Education", icon: GraduationCap },
  { id: Section.Skills, label: "Skills", icon: Code },
  { id: Section.Certifications, label: "Certifications", icon: Award },
  { id: Section.Projects, label: "Projects", icon: FolderGit2 },
];

const ResumeBuilderSidebar = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Personal);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        order-1 h-full
        lg:col-span-2
      `}
    >
      {/* Desktop: Vertical navigation */}
      <Card
        className={`
          bg-card/80 border-border/50 sticky top-4 hidden py-0 backdrop-blur-sm
          lg:block
        `}
      >
        <CardContent className="p-2">
          <nav className="space-y-1">
            {sectionConfig.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  `
                    flex h-10 w-full cursor-pointer items-center justify-between
                    rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    duration-200
                  `,
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </span>
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeBuilderSidebar;
