"use client";
import { Settings } from "lucide-react";
import type React from "react";
import { type PropsWithChildren, useMemo } from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";
import DownloadPdf from "@/components/Templates/DownloadPdf";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeSelector } from "@/stores/features/resume.slice";
import { userSelector } from "@/stores/features/user.slice";
import { useAppSelector } from "@/stores/store";

const CvBuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { templates, templateFormat, templateSelected } = useGetTemplates();

  const { resume } = useAppSelector(resumeSelector);
  const { user } = useAppSelector(userSelector);

  const Template = useMemo(() => {
    if (!templateSelected) return null;
    return templates[templateSelected];
  }, [templateSelected, templates]);

  const isEditableResume = useMemo(() => {
    return Boolean(user && resume && Template);
  }, [user, resume, Template]);

  return (
    <div className="flex h-screen">
      <CvBuilderSidebar />

      {!isEditableResume ? (
        <div className={`flex min-h-96 flex-1 items-center justify-center`}>
          <Spinner />
        </div>
      ) : (
        <div className="scrollbar-thin flex-1 overflow-y-auto py-10">
          <div className="container-full mx-auto max-w-7xl space-y-4">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">{children}</div>

              {resume && Template && (
                <div className="relative col-span-1">
                  <div
                    className={`
                      sticky top-0 left-0 flex flex-col items-center gap-4
                    `}
                  >
                    <TemplateWrapper
                      document={
                        <Template
                          templateFormat={templateFormat}
                          resume={resume}
                        />
                      }
                    />
                    <div
                      className={`
                        flex w-full flex-wrap items-center justify-center gap-4
                      `}
                    >
                      <Button
                        className="min-w-40 shadow-lg"
                        size={"lg"}
                        variant={"outline"}
                      >
                        <Settings /> Change Template
                      </Button>
                      <DownloadPdf />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CvBuilderLayout;
