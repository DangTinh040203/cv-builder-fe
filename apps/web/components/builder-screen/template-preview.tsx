"use client";

import { Button } from "@shared/ui/components/button";
import { Eye } from "lucide-react";
import React, { useMemo } from "react";

import TemplateWrapper from "@/components/templates/template-wrapper";
import { TEMPLATES } from "@/configs/template.config";
import { resumeSelector } from "@/stores/features/resume.slice";
import {
  templateFormatSelector,
  templateSelectedSelector,
} from "@/stores/features/template.slice";
import { useAppSelector } from "@/stores/store";

const TemplatePreview = () => {
  const templateSelected = useAppSelector(templateSelectedSelector);
  const templateFormat = useAppSelector(templateFormatSelector);
  const { resume } = useAppSelector(resumeSelector);

  const Template = useMemo(() => {
    return TEMPLATES[templateSelected!];
  }, [templateSelected]);

  return (
    Template &&
    resume && (
      <div className="sticky top-4 z-10 flex flex-col items-center gap-4">
        <TemplateWrapper
          selectable={false}
          document={
            <Template resume={resume} templateFormat={templateFormat} />
          }
        />

        <Button
          variant="gradient"
          size={"lg"}
          className="min-w-40 shrink-0 gap-2 rounded-full shadow-xl"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>
    )
  );
};

export default TemplatePreview;
