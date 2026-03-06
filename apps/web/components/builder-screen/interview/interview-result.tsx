"use client";

import { Button } from "@shared/ui/components/button";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";

import { ScoreGauge } from "@/components/builder-screen/score-gauge";
import type { InterviewFeedback } from "@/types/interview.type";

interface InterviewResultProps {
  feedback: InterviewFeedback;
  onReset: () => void;
}

const CRITERIA_LABELS: Record<string, { label: string; weight: string }> = {
  technicalKnowledge: { label: "Technical Knowledge", weight: "25%" },
  communicationSkills: { label: "Communication Skills", weight: "20%" },
  problemSolving: { label: "Problem Solving", weight: "20%" },
  relevanceToRole: { label: "Relevance to Role", weight: "15%" },
  interviewConduct: { label: "Interview Conduct", weight: "20%" },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getScoreBarColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

const getVerdictStyle = (verdict: string) => {
  switch (verdict) {
    case "PASS":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "BORDERLINE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "FAIL":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const InterviewResult = ({
  feedback,
  onReset,
}: InterviewResultProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  );

  const getScoreLabel = (score: number) => {
    if (score >= 80)
      return { label: "Excellent Performance", color: "text-green-500" };
    if (score >= 60)
      return { label: "Good Performance", color: "text-blue-500" };
    if (score >= 40)
      return { label: "Fair Performance", color: "text-yellow-500" };
    return { label: "Needs Improvement", color: "text-red-500" };
  };

  const toggleQuestion = (num: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const overallStatus = getScoreLabel(feedback.overallScore);

  return (
    <ScrollArea className="scrollbar-thin max-h-[80vh] pr-4">
      <div className="space-y-4 pb-4">
        {/* Overall Score + Verdict */}
        <div
          className={`
            border-border/50 bg-background flex flex-col items-center
            justify-center gap-4 rounded-xl border p-8 text-center
          `}
        >
          <ScoreGauge score={feedback.overallScore} />
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h3
                className={`text-lg font-bold tracking-tight ${overallStatus.color}`}
              >
                {overallStatus.label}
              </h3>
              {feedback.verdict && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getVerdictStyle(feedback.verdict)}`}
                >
                  {feedback.verdict}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mx-auto max-w-lg text-sm leading-relaxed">
              {feedback.summary}
            </p>
          </div>
        </div>

        {/* Criteria Breakdown */}
        {feedback.criteria && (
          <div className="border-border/50 bg-background rounded-xl border p-5">
            <div className="flex items-center gap-2 pb-4">
              <Award size={18} className="text-primary" />
              <h4 className="text-xs font-bold tracking-wider uppercase">
                Evaluation Criteria
              </h4>
            </div>
            <div className="space-y-3">
              {Object.entries(CRITERIA_LABELS).map(
                ([key, { label, weight }]) => {
                  const score =
                    feedback.criteria[
                      key as keyof typeof feedback.criteria
                    ] ?? 0;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          {label}{" "}
                          <span className="text-muted-foreground text-xs">
                            ({weight})
                          </span>
                        </span>
                        <span className={`font-bold ${getScoreColor(score)}`}>
                          {score}
                        </span>
                      </div>
                      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* Per-Question Feedback */}
        {feedback.questionFeedbacks?.length > 0 && (
          <div className="border-border/50 bg-background rounded-xl border p-5">
            <div className="flex items-center gap-2 pb-4">
              <MessageSquare size={18} className="text-primary" />
              <h4 className="text-xs font-bold tracking-wider uppercase">
                Per-Question Feedback
              </h4>
            </div>
            <div className="space-y-2">
              {feedback.questionFeedbacks.map((qf) => {
                const isExpanded = expandedQuestions.has(qf.questionNumber);
                return (
                  <div
                    key={qf.questionNumber}
                    className="border-border/30 rounded-lg border"
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestion(qf.questionNumber)}
                      className={`
                        hover:bg-muted/50 flex w-full items-center justify-between
                        rounded-lg px-4 py-3 text-left transition-colors
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex h-7 w-7 shrink-0 items-center justify-center
                            rounded-full text-xs font-bold text-white
                            ${getScoreBarColor(qf.score)}
                          `}
                        >
                          {qf.score}
                        </div>
                        <span className="text-foreground line-clamp-1 text-sm font-medium">
                          Q{qf.questionNumber}: {qf.question}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-border/30 space-y-2 border-t px-4 py-3">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {qf.feedback}
                        </p>
                        {qf.suggestions && (
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              Suggestion
                            </p>
                            <p className="text-foreground mt-1 text-sm leading-relaxed">
                              {qf.suggestions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column Grid: Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                className="text-green-600 dark:text-green-500"
              />
              <h4 className="text-xs font-bold tracking-wider text-green-700 uppercase dark:text-green-400">
                Strengths
              </h4>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.length > 0 ? (
                feedback.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-green-900 dark:text-green-200"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span className="leading-tight">{s}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-green-700/70 italic">
                  No specific strengths highlighted.
                </li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div
            className={`
              rounded-xl border border-red-200/60 bg-red-50/50 p-5
              dark:border-red-900/50 dark:bg-red-950/20
            `}
          >
            <div className="flex items-center gap-2 pb-4">
              <AlertCircle size={18} className="text-red-500" />
              <h4 className="text-xs font-bold tracking-wider text-red-700 uppercase dark:text-red-400">
                Areas for Improvement
              </h4>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.length > 0 ? (
                feedback.improvements.map((imp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-red-900 dark:text-red-200"
                  >
                    <div
                      className={`
                        flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-full bg-red-200/60 text-[10px] font-bold
                        text-red-700
                        dark:bg-red-900/60 dark:text-red-400
                      `}
                    >
                      {i + 1}
                    </div>
                    <span className="pt-0.5 leading-relaxed">{imp}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-red-700/70 italic">
                  No specific improvements suggested.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Try Again Action */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="text-foreground hover:bg-muted/50 w-full py-6 shadow-sm"
            onClick={onReset}
          >
            <RefreshCw size={18} className="mr-2" />
            Interview Again
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
