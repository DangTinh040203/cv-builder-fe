"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@shared/ui/components/card";
import React, { type PropsWithChildren, useEffect } from "react";

import ResumeBuilderSidebar from "@/components/builder-screen/resume-builder-sidebar";
import ResumeControl from "@/components/builder-screen/resume-control";
import TemplatePreview from "@/components/builder-screen/template-preview";
import NotFound from "@/components/common/not-found";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { templateSelectedSelector } from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const BuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
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

  if (!templateSelected || (!isFetchingResume && !resume)) {
    return <NotFound />;
  }

  return (
    <div className="container mb-10">
      <ResumeControl />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <ResumeBuilderSidebar />
        </div>
        <div className="col-span-7">
          <Card className={`bg-card/80 border-border/50 py-0 backdrop-blur-sm`}>
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <TemplatePreview />
        </div>
      </div>
    </div>
  );
};

export default BuilderLayout;
