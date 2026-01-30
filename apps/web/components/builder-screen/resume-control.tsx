import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";
import { Eye, FileText, Settings2, Sparkles } from "lucide-react";
import React from "react";

import DownloadPdf from "@/components/templates/download-pdf";
import { resumeSelector } from "@/stores/features/resume.slice";
import { useAppSelector } from "@/stores/store";

const ResumeControl = () => {
  const { resume } = useAppSelector(resumeSelector);

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
          hidden flex-wrap gap-4
          md:flex
        `}
      >
        <Button variant="outline" className="shrink-0 gap-2">
          <Settings2 className="h-4 w-4" />
          <span>Customize</span>
        </Button>
        <Button variant="outline" className={cn("shrink-0 gap-2")}>
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>

        {resume && <DownloadPdf resume={resume} />}
      </div>
    </div>
  );
};

export default ResumeControl;
