"use client";
import { ArrowLeft, UserCog } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { type PropsWithChildren, useMemo } from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { TEMPLATE_MOCK_DATA } from "@/constants";
import useCheckEditable from "@/hooks/useCheckEditable";
import useGetTemplates from "@/hooks/useGetTemplates";

const CvBuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { templateFormat, templates } = useGetTemplates();
  const templateSelected = useCheckEditable();
  const router = useRouter();

  const Template = useMemo(() => {
    if (!templateSelected) return null;
    return templates[templateSelected];
  }, [templateSelected, templates]);

  return (
    Template && (
      <div className="flex h-screen">
        <CvBuilderSidebar />

        <div className="scrollbar-thin flex-1 overflow-y-auto py-10">
          <div className="container-full mx-auto max-w-7xl space-y-4">
            <Button
              variant={"link"}
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeft /> Go Back
            </Button>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">{children}</div>

              <div className="relative col-span-1">
                <div
                  className={`
                    sticky top-10 left-0 flex flex-col items-center gap-4
                  `}
                >
                  <TemplateWrapper
                    document={
                      <Template
                        templateFormat={templateFormat}
                        data={TEMPLATE_MOCK_DATA}
                      />
                    }
                  />
                  <Button className="min-w-40">
                    <UserCog /> Config
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CvBuilderLayout;
