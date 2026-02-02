"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@shared/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import EducationForm from "@/components/builder-screen/forms/education-form";
import ExperienceForm from "@/components/builder-screen/forms/experience-form";
import PersonalForm from "@/components/builder-screen/forms/personal-form";
import ProjectsForm from "@/components/builder-screen/forms/projects-form";
import SkillsForm from "@/components/builder-screen/forms/skills-form";
import SummaryForm from "@/components/builder-screen/forms/summary-form";
import ResumeBuilderSidebar, {
  Section,
} from "@/components/builder-screen/resume-builder-sidebar";
import ResumeControl from "@/components/builder-screen/resume-control";
import TemplateFormat from "@/components/builder-screen/template-format";
import TemplatePreview from "@/components/builder-screen/template-preview";
import NotFound from "@/components/common/not-found";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import {
  templateConfigSelector,
  templateSelectedSelector,
  updatePreviewMode,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const BuilderScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") as Section;

  const [activeSection, setActiveSection] = React.useState<Section>(
    Object.values(Section).includes(currentStep)
      ? currentStep
      : Section.Personal,
  );

  const { resume } = useAppSelector(resumeSelector);
  const { previewMode } = useAppSelector(templateConfigSelector);
  const templateSelected = useAppSelector(templateSelectedSelector);

  const { user } = useUser();
  const { getToken } = useAuth();
  const resumeService = useService(ResumeService);
  const dispatch = useAppDispatch();

  // Keep Clerk session alive by refreshing token periodically
  useEffect(() => {
    const refreshInterval = setInterval(
      async () => {
        try {
          await getToken();
        } catch (error) {
          console.error("Failed to refresh token:", error);
        }
      },
      50 * 1000, // Refresh every 50 seconds (before 60s expiry)
    );

    return () => clearInterval(refreshInterval);
  }, [getToken]);

  useEffect(() => {
    if (!templateSelected) {
      toast.error("Please select a template to continue");
      router.push("/templates");
    }
  }, [templateSelected, router]);

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

  useEffect(() => {
    const step = searchParams.get("step") as Section;
    const targetSection =
      step && Object.values(Section).includes(step) ? step : Section.Personal;

    if (targetSection !== activeSection) {
      setActiveSection(targetSection);
    }
  }, [searchParams, activeSection]);

  const handleSectionChange = (section: Section) => {
    if (previewMode) {
      dispatch(updatePreviewMode(false));
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", section);
    router.push(`/builder?${params.toString()}`, { scroll: false });
  };

  const sectionOrder = [
    Section.Personal,
    Section.Summary,
    Section.Skills,
    Section.Education,
    Section.Experience,
    Section.Projects,
  ];

  const handleNext = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    const nextSection = sectionOrder[currentIndex + 1];
    if (currentIndex < sectionOrder.length - 1 && nextSection) {
      handleSectionChange(nextSection);
    }
  };

  const handleBack = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    const prevSection = sectionOrder[currentIndex - 1];
    if (currentIndex > 0 && prevSection) {
      handleSectionChange(prevSection);
    }
  };

  if (!templateSelected) {
    return <NotFound />;
  }

  return (
    <div className="container mb-10">
      <ResumeControl />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <ResumeBuilderSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        <div className="col-span-7">
          <AnimatePresence mode="wait">
            {!previewMode ? (
              <motion.div
                key="forms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === Section.Personal && (
                  <PersonalForm onNext={handleNext} />
                )}
                {activeSection === Section.Summary && (
                  <SummaryForm onNext={handleNext} onBack={handleBack} />
                )}
                {activeSection === Section.Skills && (
                  <SkillsForm onNext={handleNext} onBack={handleBack} />
                )}
                {activeSection === Section.Education && (
                  <EducationForm onNext={handleNext} onBack={handleBack} />
                )}
                {activeSection === Section.Experience && (
                  <ExperienceForm onNext={handleNext} onBack={handleBack} />
                )}
                {activeSection === Section.Projects && (
                  <ProjectsForm onNext={handleNext} onBack={handleBack} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="preview-main"
                layoutId="template-preview-container"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <TemplatePreview />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={cn("col-span-3")}>
          <AnimatePresence mode="wait">
            {!previewMode ? (
              <motion.div
                key="preview-sidebar"
                layoutId="template-preview-container"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <TemplatePreview />
              </motion.div>
            ) : (
              <motion.div
                key="template-format"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TemplateFormat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BuilderScreen;
