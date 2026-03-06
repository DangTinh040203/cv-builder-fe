"use client";

import { Button } from "@shared/ui/components/button";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import { AlertCircle, Check, CheckCircle2, RefreshCw } from "lucide-react";
import React from "react";

import { ScoreGauge } from "@/components/builder-screen/score-gauge";
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
