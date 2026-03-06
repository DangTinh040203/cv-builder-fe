"use client";

import { Button } from "@shared/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/select";
import { Slider } from "@shared/ui/components/slider";
import { Textarea } from "@shared/ui/components/textarea";
import { AlertCircle, Loader2, Mic } from "lucide-react";
import React, { useState } from "react";

import {
  INTERVIEW_TYPE_DEFAULT,
  INTERVIEW_TYPE_OPTIONS,
  LANGUAGE_DEFAULT,
  LANGUAGE_OPTIONS,
  QUESTION_COUNT_DEFAULT,
  QUESTION_COUNT_MAX,
  QUESTION_COUNT_MIN,
  SPEECH_RATE_DEFAULT,
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  SPEECH_RATE_STEP,
  VOICE_DEFAULT,
  VOICE_OPTIONS,
} from "@/constants/interview.constant";
import { useSyncResume } from "@/hooks/use-sync-resume";
import {
  type InterviewConfig,
  type InterviewType,
} from "@/types/interview.type";

interface InterviewSetupFormProps {
  onStart: (config: InterviewConfig) => Promise<void>;
  error: string | null;
  onRetry: () => void;
}

export const InterviewSetupForm = ({
  onStart,
  error,
  onRetry,
}: InterviewSetupFormProps) => {
  const [jdText, setJdText] = useState("");
  const [questionCount, setQuestionCount] = useState(QUESTION_COUNT_DEFAULT);
  const [interviewType, setInterviewType] = useState<InterviewType>(
    INTERVIEW_TYPE_DEFAULT,
  );
  const [voiceName, setVoiceName] = useState(VOICE_DEFAULT);
  const [language, setLanguage] = useState(LANGUAGE_DEFAULT);
  const [speechRate, setSpeechRate] = useState(SPEECH_RATE_DEFAULT);
  const [isStarting, setIsStarting] = useState(false);

  const { sync, isSyncing } = useSyncResume();

  const handleStart = async () => {
    if (!jdText.trim()) return;

    setIsStarting(true);
    try {
      // Sync resume to backend first
      const synced = await sync();
      if (!synced) {
        setIsStarting(false);
        return;
      }

      await onStart({
        jobDescription: jdText,
        questionCount,
        interviewType,
        voiceName,
        language,
        speechRate,
      });
    } finally {
      setIsStarting(false);
    }
  };

  const isLoading = isStarting || isSyncing;
  const hasInput = jdText.trim().length > 0;

  return (
    <div className="space-y-6 pt-2">
      {/* Error Banner */}
      {error && (
        <div
          className={`
            flex items-start gap-3 rounded-lg border border-red-200 bg-red-50
            p-4
            dark:border-red-900/50 dark:bg-red-950/20
          `}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p
              className={`
                text-sm font-medium text-red-800
                dark:text-red-200
              `}
            >
              {error}
            </p>
            <Button
              variant="link"
              size="sm"
              className={`
                mt-1 h-auto p-0 text-red-600
                dark:text-red-400
              `}
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* Job Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Job Description</label>
        <Textarea
          className="scrollbar-thin h-48 resize-none overflow-y-auto"
          placeholder="Paste the job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-muted-foreground text-xs">
          The AI interviewer will tailor questions based on this JD and your
          resume.
        </p>
      </div>

      {/* Question Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Number of Questions</label>
          <span
            className={`
              bg-primary/10 text-primary rounded-md px-2.5 py-0.5 text-sm
              font-semibold
            `}
          >
            {questionCount}
          </span>
        </div>
        <Slider
          value={[questionCount]}
          onValueChange={(val) =>
            setQuestionCount(val[0] ?? QUESTION_COUNT_DEFAULT)
          }
          min={QUESTION_COUNT_MIN}
          max={QUESTION_COUNT_MAX}
          step={1}
          disabled={isLoading}
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{QUESTION_COUNT_MIN} questions</span>
          <span>{QUESTION_COUNT_MAX} questions</span>
        </div>
      </div>

      {/* Interview Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Interview Type</label>
        <Select
          value={interviewType}
          onValueChange={(val) => setInterviewType(val as InterviewType)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent align="start" side="bottom">
            {INTERVIEW_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Interview Language</label>
        <Select
          value={language}
          onValueChange={setLanguage}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent align="start" side="bottom">
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          The AI interviewer will speak in this language throughout the session.
        </p>
      </div>

      {/* Voice Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Interviewer Voice</label>
        <Select
          value={voiceName}
          onValueChange={setVoiceName}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent align="start" side="bottom" className="max-h-60">
            {VOICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speech Speed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Speech Speed</label>
          <span
            className={`
              bg-primary/10 text-primary rounded-md px-2.5 py-0.5 text-sm
              font-semibold
            `}
          >
            {speechRate.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={[speechRate]}
          onValueChange={(val) =>
            setSpeechRate(val[0] ?? SPEECH_RATE_DEFAULT)
          }
          min={SPEECH_RATE_MIN}
          max={SPEECH_RATE_MAX}
          step={SPEECH_RATE_STEP}
          disabled={isLoading}
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>0.5x (Slow)</span>
          <span>1.0x</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <Button
          onClick={handleStart}
          disabled={!hasInput || isLoading}
          className="w-full"
          variant="gradient"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mic className="mr-2 h-4 w-4" />
          )}
          {isSyncing
            ? "Saving Resume..."
            : isStarting
              ? "Starting..."
              : "Start Interview"}
        </Button>
      </div>
    </div>
  );
};
