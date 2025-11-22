"use client";
import { Settings } from "lucide-react";
import dynamic from "next/dynamic";
import type React from "react";
import { type PropsWithChildren, useMemo } from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeSelector } from "@/stores/features/resume.slice";
import { userSelector } from "@/stores/features/user.slice";
import { useAppSelector } from "@/stores/store";

const DownloadPdf = dynamic(
  () => import("@/components/Templates/DownloadPdf"),
  { ssr: false },
);

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
    <div className="relative flex">
      {/* <CvBuilderSidebar /> */}

      {!isEditableResume ? (
        <div className={`flex min-h-96 flex-1 items-center justify-center`}>
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 py-10">
          <div className="container-full mx-auto max-w-7xl space-y-4">
            <div className="relative grid grid-cols-3 items-start gap-8">
              <div className="col-span-2">{children}</div>

              {resume && Template && (
                <div className="sticky top-10 left-0 col-span-1">
                  <div className={`flex flex-col items-center gap-4`}>
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
