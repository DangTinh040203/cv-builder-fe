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
import { Mic, Sparkles } from "lucide-react";
import React from "react";

import {
  InterviewForm,
  type InterviewType,
} from "@/components/builder-screen/interview/interview-form";

const InterviewDialog = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [jdText, setJdText] = React.useState("");
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [questionCount, setQuestionCount] = React.useState(5);
  const [interviewType, setInterviewType] =
    React.useState<InterviewType>("both");

  const handleStartInterview = () => {
    toast.info(
      `Starting interview — ${questionCount} questions, type: ${interviewType}`,
    );
    // TODO: integrate with backend interview service
  };

  const handleReset = () => {
    setJdText("");
    setJdFile(null);
    setQuestionCount(5);
    setInterviewType("both");
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      handleReset();
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="border-primary border shadow-xl"
        >
          <Mic /> Mock Interview
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
            <Sparkles size={20} /> Mock Interview
          </DialogTitle>
          <DialogDescription>
            Provide a job description and configure your mock interview session.
          </DialogDescription>
        </div>

        <InterviewForm
          jdText={jdText}
          setJdText={setJdText}
          jdFile={jdFile}
          setJdFile={setJdFile}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          interviewType={interviewType}
          setInterviewType={setInterviewType}
          onStart={handleStartInterview}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDialog;
