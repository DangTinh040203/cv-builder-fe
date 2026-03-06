"use client";

import { Button } from "@shared/ui/components/button";
import { Progress } from "@shared/ui/components/progress";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import React from "react";

import {
  getScoreColor,
  ScoreGauge,
} from "@/components/builder-screen/score-gauge";
import type { InterviewFeedback } from "@/types/interview.type";

interface InterviewResultProps {
  feedback: InterviewFeedback;
  onReset: () => void;
}

export const InterviewResult = ({
  feedback,
  onReset,
}: InterviewResultProps) => {
  const getScoreLabel = (score: number) => {
    if (score >= 80) {
      return { label: "Excellent Performance", color: "text-green-500" };
    }
    if (score >= 60) {
      return { label: "Good Performance", color: "text-blue-500" };
    }
    if (score >= 40) {
      return { label: "Fair Performance", color: "text-yellow-500" };
    }
    return { label: "Needs Improvement", color: "text-red-500" };
  };

  const overallStatus = getScoreLabel(feedback.overallScore);

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
          <ScoreGauge score={feedback.overallScore} />
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
              {feedback.summary}
            </p>
          </div>
        </div>

        {/* Score Breakdown — Per-Question */}
        {feedback.questionFeedbacks.length > 0 && (
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

            <div className="space-y-6">
              {feedback.questionFeedbacks.map((qf) => {
                const colors = getScoreColor(qf.score);
                return (
                  <div key={qf.questionNumber} className="space-y-2.5">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-foreground text-sm font-bold">
                        Q{qf.questionNumber}: {qf.question}
                      </span>
                      <span
                        className={`
                          shrink-0 text-sm font-bold
                          ${colors.text}
                        `}
                      >
                        {qf.score}%
                      </span>
                    </div>
                    <Progress value={qf.score} className="h-2" />
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {qf.feedback}
                    </p>
                    {qf.suggestions && (
                      <div
                        className={`
                          flex items-start gap-2 rounded-lg border
                          border-blue-200/60 bg-blue-50/50 px-3 py-2
                          dark:border-blue-900/50 dark:bg-blue-950/20
                        `}
                      >
                        <Lightbulb
                          size={14}
                          className="mt-0.5 shrink-0 text-blue-500"
                        />
                        <span
                          className={`
                            text-xs leading-relaxed text-blue-900
                            dark:text-blue-200
                          `}
                        >
                          {qf.suggestions}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column Grid: Strengths & Areas for Improvement */}
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
              {feedback.strengths.length > 0 ? (
                feedback.strengths.map((s, i) => (
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
              <h4
                className={`
                  text-xs font-bold tracking-wider text-red-700 uppercase
                  dark:text-red-400
                `}
              >
                Areas for Improvement
              </h4>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.length > 0 ? (
                feedback.improvements.map((imp, i) => (
                  <li
                    key={i}
                    className={`
                      flex items-start gap-3 text-sm text-red-900
                      dark:text-red-200
                    `}
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
            className={`
              text-foreground w-full py-6 shadow-sm
              hover:bg-muted/50
            `}
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
