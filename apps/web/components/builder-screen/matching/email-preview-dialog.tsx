"use client";

import { Button } from "@shared/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@shared/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/components/tooltip";
import {
  ClipboardCheck,
  ClipboardCopy,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import React from "react";

import { type GenerateEmailResponse } from "@/types/resume.type";

interface EmailPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  emailResult: GenerateEmailResponse | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onCopySubject: () => void;
  isSubjectCopied: boolean;
}

const splitIntoParagraphs = (body: string): string[] => {
  // Force a paragraph break between sign-off and the candidate's name
  // if they are generated on the same line or separated by a single newline.
  const formattedBody = body.replace(
    /(Sincerely|Best regards|Regards|Thank you|Warm regards|Trân trọng|Thân mến)(,?)\s+([^\n.]{2,40})$/i,
    "$1$2\n$3",
  );

  return formattedBody
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => p.trim());
};

export const EmailPreviewDialog = ({
  isOpen,
  onOpenChange,
  emailResult,
  isGenerating,
  onRegenerate,
  onCopy,
  isCopied,
  onCopySubject,
  isSubjectCopied,
}: EmailPreviewDialogProps) => {
  const paragraphs = React.useMemo(
    () => (emailResult ? splitIntoParagraphs(emailResult.body) : []),
    [emailResult],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`
          flex max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden
          border-none p-0 shadow-2xl
          sm:rounded-2xl
          md:max-w-4xl
        `}
      >
        {/* Header Section */}
        <div
          className={`
            gradient-bg relative flex shrink-0 flex-col px-4 py-4 text-white
            md:px-8 md:py-8
          `}
        >
          {/* Decorative Elements */}
          <div
            className={`
              pointer-events-none absolute -top-12 -right-12 h-40 w-40
              rounded-full bg-white/[0.07] blur-2xl
            `}
          />
          <div
            className={`
              pointer-events-none absolute bottom-0 left-1/4 h-24 w-24
              rounded-full bg-white/4 blur-xl
            `}
          />

          <div
            className={`relative z-10 flex items-start justify-between gap-4`}
          >
            <div
              className={`
                flex items-center gap-3
                sm:gap-4
              `}
            >
              <div
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-2xl bg-white/20 shadow-inner backdrop-blur-md
                  sm:h-12 sm:w-12
                `}
              >
                <Sparkles
                  size={24}
                  className={`
                    h-5 w-5 text-white drop-shadow-md
                    sm:h-6 sm:w-6
                  `}
                />
              </div>
              <div className="flex flex-col">
                <DialogTitle
                  className={`
                    text-lg font-bold tracking-tight text-white drop-shadow-sm
                    sm:text-2xl
                  `}
                >
                  Application Email
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Preview and copy your AI-generated application email.
                </DialogDescription>
                <p
                  className={`
                    mt-0.5 text-xs font-medium text-white/70
                    sm:mt-1 sm:text-sm
                  `}
                >
                  Ready to be sent directly to the hiring manager.
                </p>
              </div>
            </div>

            {/* Actions for generated email */}
            {emailResult && (
              <TooltipProvider delayDuration={200}>
                <div
                  className={`
                    flex shrink-0 items-center gap-1 rounded-xl bg-white/10 p-1
                    backdrop-blur-sm
                    sm:gap-2
                  `}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRegenerate}
                        disabled={isGenerating}
                        className={`
                          h-8 w-8 rounded-lg text-white
                          hover:bg-white/20
                          sm:h-10 sm:w-10
                        `}
                      >
                        <RefreshCw size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Regenerate</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
          </div>

          {emailResult && (
            <div
              className={`
                relative z-10 mt-6 rounded-xl border border-white/10 bg-white/10
                px-4 py-3 backdrop-blur-sm
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    hidden shrink-0 text-sm text-white/60 uppercase
                    md:block
                  `}
                >
                  Subject
                </span>
                <span className={`flex-1 text-sm text-white`}>
                  {emailResult.subject}
                </span>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCopySubject}
                        className={`
                          h-7 w-7 shrink-0 rounded-md transition-all
                          ${
                            isSubjectCopied
                              ? "bg-white/30 text-white"
                              : `
                                text-white
                                hover:bg-white/20
                              `
                          }
                        `}
                      >
                        {isSubjectCopied ? (
                          <ClipboardCheck size={14} />
                        ) : (
                          <ClipboardCopy size={14} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSubjectCopied ? "Copied!" : "Copy Subject"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={`
            bg-background relative flex min-h-[300px] flex-1 flex-col
            overflow-hidden
            sm:min-h-[400px]
          `}
        >
          {emailResult ? (
            <>
              <div
                className={`
                  scrollbar-thin flex-1 overflow-y-auto px-4 py-4
                  sm:px-8 sm:py-8
                `}
              >
                <div className="space-y-5">
                  {paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className={`
                        text-foreground/80 text-[15px] leading-relaxed
                        whitespace-pre-wrap
                      `}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className={`
                  border-border/40 bg-muted/30 flex flex-col-reverse justify-end
                  gap-3 border-t px-6 py-4
                  sm:flex-row sm:gap-4 sm:px-8
                `}
              >
                <DialogClose asChild>
                  <Button
                    variant={"outline"}
                    className={`
                      h-12 w-full gap-2 px-8 shadow-md transition-all
                      sm:w-auto
                    `}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  onClick={onCopy}
                  className={`
                    h-12 w-full gap-2 px-8 shadow-md transition-all
                    sm:w-auto
                    ${
                      isCopied
                        ? `
                          bg-green-600! text-white!
                          hover:bg-green-700!
                        `
                        : `
                          bg-primary! text-primary-foreground!
                          hover:bg-primary/90!
                        `
                    }
                  `}
                >
                  {isCopied ? (
                    <>
                      <ClipboardCheck size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardCopy size={18} />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div
              className={`
                absolute inset-0 flex flex-col items-center justify-center gap-4
              `}
            >
              <p className="text-muted-foreground text-sm">
                Failed to display email.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
