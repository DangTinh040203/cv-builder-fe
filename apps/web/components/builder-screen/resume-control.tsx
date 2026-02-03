import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff, FileText, Settings2, Sparkles } from "lucide-react";
import React from "react";

import DownloadPdf from "@/components/templates/download-pdf";
import { resumeSelector } from "@/stores/features/resume.slice";
import {
  templateConfigSelector,
  updatePreviewMode,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const ResumeControl = () => {
  const { resume } = useAppSelector(resumeSelector);
  const { previewMode } = useAppSelector(templateConfigSelector);
  const dispatch = useAppDispatch();

  const handleTogglePreviewMode = () => {
    dispatch(updatePreviewMode(!previewMode));
  };

  return (
    <div className="mb-4">
      <div className="my-4 flex items-center gap-4">
        <div
          className={`
            from-primary to-primary/70 flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl bg-linear-to-br
            md:h-12 md:w-12
          `}
        >
          <FileText
            className={`
              text-primary-foreground h-5 w-5
              md:h-6 md:w-6
            `}
          />
        </div>
        <div>
          <h1
            className={`
              font-display from-foreground to-foreground/70 bg-linear-to-br
              bg-clip-text text-xl font-bold text-transparent
              md:text-2xl
              lg:text-3xl
            `}
          >
            CV Builder
          </h1>
          <p
            className={`
              text-muted-foreground text-xs
              md:text-sm
            `}
          >
            Craft your professional story
          </p>
        </div>
      </div>

      <div
        className={`
          flex flex-wrap gap-4
          md:flex
        `}
      >
        <Button variant="outline" className={cn("shrink-0 gap-2")}>
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className={cn("shrink-0 gap-2 transition-colors duration-200")}
            onClick={handleTogglePreviewMode}
          >
            <motion.div
              initial={false}
              animate={{ rotate: previewMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {previewMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </motion.div>
            {previewMode ? "Edit" : "Customize"}
          </Button>
        </motion.div>

        {resume && <DownloadPdf resume={resume} />}
      </div>
    </div>
  );
};

export default ResumeControl;
