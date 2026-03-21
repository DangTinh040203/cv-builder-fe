"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/components/accordion";
import { Badge } from "@shared/ui/components/badge";
import { Button } from "@shared/ui/components/button";
import { Progress } from "@shared/ui/components/progress";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import { toast } from "@shared/ui/components/sonner";
import { AxiosError } from "axios";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import React from "react";

import { EmailPreviewDialog } from "@/components/builder-screen/matching/email-preview-dialog";
import {
  getScoreColor,
  ScoreGauge,
} from "@/components/builder-screen/score-gauge";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { type ErrorResponse } from "@/types/error.response";
import {
  type GenerateEmailResponse,
  type MatchResult,
} from "@/types/resume.type";
import { toastErrorMessage } from "@/utils/toast-error-message.util";

interface MatchingResultProps {
  matchResult: MatchResult;
  onReset: () => void;
  jdText: string;
  resumeId: string;
}

export const MatchingResult = ({
  matchResult,
  onReset,
  jdText,
  resumeId,
}: MatchingResultProps) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSubjectCopied, setIsSubjectCopied] = React.useState(false);
  const [emailResult, setEmailResult] =
    React.useState<GenerateEmailResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const resumeService = useService(ResumeService);

  const getScoreLabel = (score: number) => {
    if (score >= 80) {
      return { label: "Excellent Match", color: "text-green-500" };
    }
    if (score >= 60) return { label: "Good Match", color: "text-blue-500" };
    if (score >= 40) return { label: "Fair Match", color: "text-yellow-500" };
    return { label: "Needs Improvement", color: "text-red-500" };
  };

  const overallStatus = getScoreLabel(matchResult.overallScore);

  const handleGenerateEmail = async () => {
    setIsDialogOpen(false);
    setIsGenerating(true);
    try {
      const result = await resumeService.generateEmail(
        resumeId,
        jdText,
        matchResult,
      );
      setEmailResult(result);
      setIsDialogOpen(true);
    } catch (e) {
      if (e instanceof AxiosError) {
        const error = e.response?.data as ErrorResponse;
        toastErrorMessage(error.message);
      } else {
        toast.error("Failed to generate email. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!emailResult) return;

    try {
      await navigator.clipboard.writeText(emailResult.body);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please select and copy manually.");
    }
  };

  const handleCopySubject = async () => {
    if (!emailResult) return;

    try {
      await navigator.clipboard.writeText(emailResult.subject);
      setIsSubjectCopied(true);
      toast.success("Subject copied to clipboard!");
      setTimeout(() => setIsSubjectCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please select and copy manually.");
    }
  };

  return (
    <ScrollArea className="scrollbar-thin max-h-[80vh] pr-4">
      <div className="space-y-4 pb-4">
        {/* Overall Score Summary */}
        <div
          className={`
            border-border/50 bg-background flex flex-col items-center
            justify-center gap-4 rounded-xl border p-8 text-center
          `}
        >
          <ScoreGauge score={matchResult.overallScore} />
          <div className="space-y-2">
            <h3
              className={`
                text-lg font-bold tracking-tight
                ${overallStatus.color}
              `}
            >
              {overallStatus.label}
            </h3>
            <p
              className={`
                text-muted-foreground mx-auto max-w-lg text-sm leading-relaxed
              `}
            >
              {matchResult.summary}
            </p>
          </div>
        </div>

        {/* Score Breakdown List */}
        <div className="border-border/60 bg-background rounded-xl border p-5">
          <div
            className={`
              border-border/40 mb-5 flex items-center gap-2 border-b pb-5
            `}
          >
            <TrendingUp size={20} className="text-purple-500" />
            <h4 className="text-foreground text-base font-bold tracking-tight">
              Score Breakdown
            </h4>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {matchResult.criteria.map((criterion) => {
              const colors = getScoreColor(criterion.score);
              return (
                <AccordionItem
                  key={criterion.name}
                  value={criterion.name}
                  className={`
                    border-border/50 bg-background/50 rounded-xl border px-2
                    shadow-sm
                  `}
                >
                  <AccordionTrigger
                    className={`
                      px-3 py-4
                      hover:no-underline
                    `}
                  >
                    <div
                      className={`flex w-full items-center justify-between pr-4`}
                    >
                      <span className="text-foreground text-[15px] font-bold">
                        {criterion.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                            text-muted-foreground text-[13px] font-medium
                          `}
                        >
                          wt. {criterion.weight}%
                        </span>
                        <span
                          className={`
                            text-sm font-bold
                            ${colors.text}
                          `}
                        >
                          {criterion.score}%
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pt-1 pb-5">
                    <div className="space-y-4">
                      <Progress value={criterion.score} className="h-2" />
                      <p
                        className={`
                          text-muted-foreground text-sm leading-relaxed
                        `}
                      >
                        {criterion.explanation}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* 2-Column Grid: Strengths & Missing Keywords */}
        <div
          className={`
            grid grid-cols-1 gap-4
            md:grid-cols-2
          `}
        >
          {/* Strengths */}
          <div
            className={`
              rounded-xl border border-green-200/60 bg-green-50/50 p-5
              dark:border-green-900/50 dark:bg-green-950/20
            `}
          >
            <div className="flex items-center gap-2 pb-4">
              <CheckCircle2
                size={18}
                className={`
                  text-green-600
                  dark:text-green-500
                `}
              />
              <h4
                className={`
                  text-xs font-bold tracking-wider text-green-700 uppercase
                  dark:text-green-400
                `}
              >
                Strengths
              </h4>
            </div>
            <ul className="space-y-3">
              {(matchResult.strengths || []).length > 0 ? (
                matchResult.strengths!.map((strength, i) => (
                  <li
                    key={i}
                    className={`
                      flex items-start gap-2 text-sm text-green-900
                      dark:text-green-200
                    `}
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span className="leading-tight">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-green-700/70 italic">
                  No specific strengths highlighted.
                </li>
              )}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div
            className={`
              rounded-xl border border-red-200/60 bg-red-50/50 p-5
              dark:border-red-900/50 dark:bg-red-950/20
            `}
          >
            <div className="flex items-center gap-2 pb-4">
              <AlertCircle size={18} className="text-red-500" />
              <h4
                className={`
                  text-xs font-bold tracking-wider text-red-700 uppercase
                  dark:text-red-400
                `}
              >
                Missing Keywords
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchResult.missingKeywords.length > 0 ? (
                matchResult.missingKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className={`
                      border-transparent bg-red-100 font-normal text-red-700
                      hover:bg-red-200
                      dark:bg-red-900/40 dark:text-red-300
                    `}
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-red-100 font-normal text-red-700"
                >
                  N/A - Job Description is Invalid
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {matchResult.suggestions.length > 0 && (
          <div
            className={`
              rounded-xl border border-amber-200/60 bg-amber-50/50 p-5
              dark:border-amber-900/50 dark:bg-amber-950/20
            `}
          >
            <div className="flex items-center gap-2 pb-4">
              <Lightbulb size={18} className="text-amber-500" />
              <h4
                className={`
                  text-xs font-bold tracking-wider text-amber-700 uppercase
                  dark:text-amber-400
                `}
              >
                Suggestions To Improve
              </h4>
            </div>
            <ul className="space-y-3">
              {matchResult.suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className={`
                    flex items-start gap-3 text-sm text-amber-900
                    dark:text-amber-200
                  `}
                >
                  <div
                    className={`
                      flex h-5 w-5 shrink-0 items-center justify-center
                      rounded-full bg-amber-200/60 text-[10px] font-bold
                      text-amber-700
                      dark:bg-amber-900/60 dark:text-amber-400
                    `}
                  >
                    {i + 1}
                  </div>
                  <span className="pt-0.5 leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <EmailPreviewDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          emailResult={emailResult}
          isGenerating={isGenerating}
          onRegenerate={handleGenerateEmail}
          onCopy={handleCopyEmail}
          isCopied={isCopied}
          onCopySubject={handleCopySubject}
          isSubjectCopied={isSubjectCopied}
        />

        {/* Action Buttons */}
        <div
          className={`
            flex flex-col gap-3 pt-2
            sm:flex-row
          `}
        >
          <Button
            variant="outline"
            className={`
              text-foreground group h-12 flex-1 gap-2.5 rounded-xl border
              shadow-sm transition-all duration-200
              hover:border-border hover:bg-muted/50 hover:shadow-md
            `}
            onClick={onReset}
          >
            <Search
              size={17}
              className={`
                text-muted-foreground transition-colors
                group-hover:text-foreground
              `}
            />
            <span className="text-sm font-medium">Analyze Another JD</span>
          </Button>

          <Button
            className={`
              group relative h-12 flex-1 gap-2.5 overflow-hidden rounded-xl
              shadow-md transition-all duration-200
              hover:shadow-lg
              active:scale-[0.98]
            `}
            onClick={() => {
              if (emailResult) {
                setIsDialogOpen(true);
              } else {
                handleGenerateEmail();
              }
            }}
            disabled={isGenerating || matchResult.overallScore === 0}
          >
            {/* Shimmer effect on initial state */}
            {!emailResult && !isGenerating && (
              <span
                className={`
                  pointer-events-none absolute inset-0 -translate-x-full
                  animate-[btn-shine_3s_ease-in-out_infinite] bg-linear-to-r
                  from-transparent via-white/15 to-transparent
                `}
              />
            )}
            {isGenerating ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span className="text-sm font-medium">Generating...</span>
              </>
            ) : emailResult ? (
              <>
                <Mail
                  size={17}
                  className={`
                    mt-0.5 transition-transform
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                  `}
                />
                <span className="text-sm font-medium">
                  View Application Email
                </span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span className="text-sm font-medium">
                  Generate Application Email
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
