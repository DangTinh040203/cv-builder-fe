"use client";
import { Card, CardContent } from "@shared/ui/components/card";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  Code,
  FileText,
  FolderGit2,
  GraduationCap,
  Plus,
  User,
} from "lucide-react";
import React from "react";

export enum Section {
  Personal = "personal",
  Summary = "summary",
  Skills = "skills",
  Education = "education",
  Experience = "experience",
  Projects = "projects",
  Extra = "extra",
}

const sectionConfig = [
  { id: Section.Personal, label: "Personal", icon: User },
  { id: Section.Summary, label: "Summary", icon: FileText },
  { id: Section.Skills, label: "Skills", icon: Code },
  { id: Section.Education, label: "Education", icon: GraduationCap },
  { id: Section.Experience, label: "Experience", icon: Briefcase },
  { id: Section.Projects, label: "Projects", icon: FolderGit2 },
  { id: Section.Extra, label: "Extra", icon: Plus },
];

interface ResumeBuilderSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const ResumeBuilderSidebar = ({
  activeSection,
  onSectionChange,
}: ResumeBuilderSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        order-1 h-full w-full
        lg:col-span-2
      `}
    >
      {/* Responsive navigation: Horizontal on mobile, Vertical on desktop */}
      <Card
        className={`
          bg-card/80 border-border/50 sticky top-0 z-20 py-0 backdrop-blur-sm
          lg:top-4
        `}
      >
        <CardContent className="p-2">
          <nav
            className={`
              scrollbar-hide scrollbar-none flex space-x-2 overflow-x-auto
              lg:flex-col lg:space-y-1 lg:space-x-0
            `}
          >
            {sectionConfig.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  `
                    flex h-10 w-auto shrink-0 cursor-pointer items-center
                    justify-between rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-all duration-200
                    lg:w-full
                  `,
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  <span
                    className={`
                      hidden
                      sm:inline
                    `}
                  >
                    {section.label}
                  </span>
                  <span className="sm:hidden">{section.label.slice(0, 3)}</span>
                  {/* Keep full label on larger mobile, maybe truncate or icon only on very small? 
                      Actually, let's keep full label but allow scrolling. 
                      Reverting the span change to just use section.label for simplicity first. 
                   */}
                  {/* Let's stick to the original label but ensure it doesn't wrap awkwardly. whitespace-nowrap */}
                </span>
                {activeSection === section.id && (
                  <ChevronRight
                    className={`
                      hidden h-4 w-4
                      lg:block
                    `}
                  />
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
