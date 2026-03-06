"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/components/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@shared/ui/components/dialog";
import { cn } from "@shared/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import React, { useCallback, useState } from "react";

import { InterviewActive } from "@/components/builder-screen/interview/interview-active";
import { InterviewLoading } from "@/components/builder-screen/interview/interview-loading";
import { InterviewResult } from "@/components/builder-screen/interview/interview-result";
import { InterviewSetupForm } from "@/components/builder-screen/interview/interview-setup-form";
import { useInterview } from "@/hooks/use-interview";
import type { InterviewConfig, InterviewState } from "@/types/interview.type";

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stateDescriptions: Record<InterviewState, string> = {
  idle: "Set up your mock interview with AI.",
  setup: "Set up your mock interview with AI.",
  connecting: "Connecting to interview session...",
  active: "Interview in progress — speak clearly into your microphone.",
  evaluating: "AI is evaluating your performance...",
  result: "Here's your interview performance analysis.",
  error: "Something went wrong. Please try again.",
};

const InterviewDialog = ({ open, onOpenChange }: InterviewDialogProps) => {
  const interview = useInterview();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (
        !nextOpen &&
        (interview.state === "active" || interview.state === "connecting")
      ) {
        setShowCloseConfirm(true);
        return;
      }

      if (!nextOpen) {
        interview.reset();
      }
      onOpenChange(nextOpen);
    },
    [interview, onOpenChange],
  );

  const handleConfirmClose = useCallback(() => {
    interview.stopInterview();
    interview.reset();
    setShowCloseConfirm(false);
    onOpenChange(false);
  }, [interview, onOpenChange]);

  const handleStartInterview = useCallback(
    async (config: InterviewConfig) => {
      await interview.startInterview(config);
    },
    [interview],
  );

  const handleRetry = useCallback(() => {
    interview.reset();
  }, [interview]);

  const currentState = interview.state === "idle" ? "setup" : interview.state;

  const isCompactState = currentState === "setup" || currentState === "error";

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            `
              flex max-h-[90vh] w-[95vw] flex-col overflow-hidden transition-all
              duration-300
            `,
            isCompactState ? "sm:max-w-lg" : "sm:max-w-4xl",
          )}
          onInteractOutside={(e) => {
            if (
              interview.state === "active" ||
              interview.state === "evaluating"
            ) {
              e.preventDefault();
            }
          }}
        >
          <div className="shrink-0 space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Mic size={20} className="text-primary" />
              Mock Interview
              <Sparkles size={16} className="text-amber-500" />
            </DialogTitle>
            <DialogDescription>
              {stateDescriptions[currentState]}
            </DialogDescription>
          </div>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {(currentState === "setup" || currentState === "error") && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InterviewSetupForm
                    onStart={handleStartInterview}
                    error={interview.error}
                    onRetry={handleRetry}
                  />
                </motion.div>
              )}

              {currentState === "connecting" && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <InterviewLoading text="Connecting to AI interviewer..." />
                </motion.div>
              )}

              {currentState === "active" && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <InterviewActive
                    isAISpeaking={interview.isAISpeaking}
                    isMuted={interview.isMuted}
                    questionProgress={interview.questionProgress}
                    elapsedTime={interview.elapsedTime}
                    analyserNode={interview.analyserNode}
                    playbackAnalyserNode={interview.playbackAnalyserNode}
                    onStop={interview.stopInterview}
                    onToggleMute={interview.toggleMute}
                  />
                </motion.div>
              )}

              {currentState === "evaluating" && (
                <motion.div
                  key="evaluating"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <InterviewLoading text="AI is evaluating your interview..." />
                </motion.div>
              )}

              {currentState === "result" && interview.feedback && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <InterviewResult
                    feedback={interview.feedback}
                    onReset={handleRetry}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Your interview is still in progress. Closing will end the session
              and you will lose your current progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Interview</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              End Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InterviewDialog;
