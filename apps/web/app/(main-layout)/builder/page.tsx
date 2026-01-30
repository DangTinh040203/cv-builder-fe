"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@shared/ui/components/card";
import React, { useEffect } from "react";

import PersonalForm from "@/components/builder-screen/forms/personal-form";
import SummaryForm from "@/components/builder-screen/forms/summary-form";
import ResumeBuilderSidebar, {
  Section,
} from "@/components/builder-screen/resume-builder-sidebar";
import ResumeControl from "@/components/builder-screen/resume-control";
import TemplatePreview from "@/components/builder-screen/template-preview";
import NotFound from "@/components/common/not-found";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { templateSelectedSelector } from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const BuilderScreen = () => {
  const [activeSection, setActiveSection] = React.useState<Section>(
    Section.Personal,
  );
  const [isFetchingResume, setIsFetchingResume] = React.useState(true);
  const templateSelected = useAppSelector(templateSelectedSelector);
  const { resume } = useAppSelector(resumeSelector);

  const { user } = useUser();
  const resumeService = useService(ResumeService);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchResume = async () => {
      setIsFetchingResume(true);
      if (user && !resume) {
        const resumeRes = await resumeService.getResume();
        if (resumeRes) {
          dispatch(setResume(resumeRes));
        }
      }

      setIsFetchingResume(false);
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

  if (!templateSelected || (!isFetchingResume && !resume)) {
    return <NotFound />;
  }

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
        <div className="col-span-7">
          {activeSection === Section.Personal && (
            <PersonalForm onNext={handleNext} />
          )}
          {activeSection === Section.Summary && (
            <SummaryForm onNext={handleNext} onBack={handleBack} />
          )}
        </div>
        <div className="col-span-3">
          <TemplatePreview />
        </div>
      </div>
    </div>
  );
};

export default BuilderScreen;
