"use client";

import { useUser } from "@clerk/nextjs";
import { cn } from "@shared/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";

import PersonalForm from "@/components/builder-screen/forms/personal-form";
import SummaryForm from "@/components/builder-screen/forms/summary-form";
import ResumeBuilderSidebar, {
  Section,
} from "@/components/builder-screen/resume-builder-sidebar";
import ResumeControl from "@/components/builder-screen/resume-control";
import TemplatePreview from "@/components/builder-screen/template-preview";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { templateConfigSelector } from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const BuilderScreen = () => {
  const [activeSection, setActiveSection] = React.useState<Section>(
    Section.Personal,
  );
  const { resume } = useAppSelector(resumeSelector);
  const { previewMode } = useAppSelector(templateConfigSelector);

  const { user } = useUser();
  const resumeService = useService(ResumeService);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchResume = async () => {
      if (user && !resume) {
        const resumeRes = await resumeService.getResume();
        if (resumeRes) {
          dispatch(setResume(resumeRes));
        }
      }
    };
    fetchResume();
  }, [dispatch, resume, resumeService, user]);

  const sectionOrder = [
    Section.Personal,
    Section.Summary,
    Section.Experience,
    Section.Education,
    Section.Skills,
    Section.Projects,
  ];

  const handleNext = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    const nextSection = sectionOrder[currentIndex + 1];
    if (currentIndex < sectionOrder.length - 1 && nextSection) {
      setActiveSection(nextSection);
    }
  };

  const handleBack = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    const prevSection = sectionOrder[currentIndex - 1];
    if (currentIndex > 0 && prevSection) {
      setActiveSection(prevSection);
    }
  };

  return (
    <div className="container mb-10">
      <ResumeControl />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <ResumeBuilderSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <AnimatePresence mode="popLayout">
          {!previewMode && (
            <motion.div
              key="form-section"
              className="col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeSection === Section.Personal && (
                <PersonalForm onNext={handleNext} />
              )}
              {activeSection === Section.Summary && (
                <SummaryForm onNext={handleNext} onBack={handleBack} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className={cn("col-span-3", previewMode && "col-span-10")}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            layout
            initial={false}
            animate={{ scale: previewMode ? 1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <TemplatePreview />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuilderScreen;
