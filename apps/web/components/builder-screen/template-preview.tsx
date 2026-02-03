"use client";

import { Button } from "@shared/ui/components/button";
import React, { useMemo } from "react";

import TemplateWrapper from "@/components/templates/template-wrapper";
import { TEMPLATES } from "@/configs/template.config";
import { resumeSelector } from "@/stores/features/resume.slice";
import {
  templateConfigSelector,
  templateFormatSelector,
  templateSelectedSelector,
  updatePreviewMode,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const TemplatePreview = () => {
  const templateSelected = useAppSelector(templateSelectedSelector);
  const templateFormat = useAppSelector(templateFormatSelector);
  const { resume } = useAppSelector(resumeSelector);
  const { previewMode } = useAppSelector(templateConfigSelector);
  const dispatch = useAppDispatch();

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
          className="rounded-full px-6"
          onClick={() => dispatch(updatePreviewMode(!previewMode))}
        >
          {!previewMode ? "Preview" : "Back to Edit"}
        </Button>
      </div>
    )
  );
};

export default TemplatePreview;
