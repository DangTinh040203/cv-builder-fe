"use client";
import { Button } from "@shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/components/dialog";
import { toast } from "@shared/ui/components/sonner";
import { AxiosError } from "axios";
import { Brain, Sparkles } from "lucide-react";
import React from "react";

import { MatchingForm } from "@/components/builder-screen/matching/matching-form";
import { MatchingLoading } from "@/components/builder-screen/matching/matching-loading";
import { MatchingResult } from "@/components/builder-screen/matching/matching-result";
import { useService } from "@/hooks/use-http";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { ResumeService } from "@/services/resume.service";
import { type ErrorResponse } from "@/types/error.response";
import { type MatchResult } from "@/types/resume.type";
import { toastErrorMessage } from "@/utils/toast-error-message.util";

const MatchingDialog = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [jdText, setJdText] = React.useState("");
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [matchResult, setMatchResult] = React.useState<MatchResult | null>(
    null,
  );

  const { resume } = useSyncResume();
  const resumeService = useService(ResumeService);

  const handleAnalyze = async () => {
    if (!resume) {
      toast.error("No resume found. Please create a resume first.");
      return;
    }

    if (!jdText.trim() && !jdFile) {
      toast.error("Please provide a Job Description (text or file).");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await resumeService.matchResume(
        resume.id,
        jdFile ? undefined : jdText,
        jdFile ?? undefined,
      );
      setMatchResult(result);
    } catch (e) {
      if (e instanceof AxiosError) {
        const error = e.response?.data as ErrorResponse;
        toastErrorMessage(error.message);
      } else {
        toast.error("Something went wrong, please try again.");
      }

      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setJdText("");
    setJdFile(null);
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      handleReset();
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className={`
            border-primary w-full border shadow-xl
            sm:w-auto
          `}
        >
          <Brain className="mr-2 h-4 w-4" /> JD Matching
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`
          w-[90vw] space-y-2
          sm:max-w-4xl
        `}
      >
        <div className="space-y-2">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={20} /> JD Matching Analysis
          </DialogTitle>
          <DialogDescription>
            {matchResult
              ? "Here's how well your CV matches the job description."
              : "Provide a job description to see how well your CV matches."}
          </DialogDescription>
        </div>

        {isAnalyzing ? (
          <MatchingLoading />
        ) : matchResult ? (
          <MatchingResult
            matchResult={matchResult}
            onReset={handleReset}
            jdText={jdText}
            resumeId={resume?.id ?? ""}
          />
        ) : (
          <MatchingForm
            jdText={jdText}
            setJdText={setJdText}
            jdFile={jdFile}
            setJdFile={setJdFile}
            onAnalyze={handleAnalyze}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchingDialog;
