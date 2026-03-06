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
import {
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  RefreshCw,
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
    <div className="space-y-4 pb-4">
      {/* Overall Score */}
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

      {/* Per-Question Feedback */}
      {feedback.questionFeedbacks.length > 0 && (
        <div className="border-border/60 bg-background rounded-xl border p-5">
          <div
            className={`
              border-border/40 mb-4 flex items-center gap-2 border-b pb-4
            `}
          >
            <MessageSquare size={18} className="text-purple-500" />
            <h4 className="text-foreground text-base font-bold tracking-tight">
              Question-by-Question Feedback
            </h4>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {feedback.questionFeedbacks.map((qf) => {
              const colors = getScoreColor(qf.score);
              return (
                <AccordionItem
                  key={qf.questionNumber}
                  value={`q-${String(qf.questionNumber)}`}
                  className="border-border/40 rounded-lg border px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div
                      className={`
                        flex w-full items-center justify-between gap-3 pr-2
                      `}
                    >
                      <span
                        className={`
                          min-w-0 flex-1 truncate text-left text-sm font-medium
                        `}
                      >
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
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <Progress value={qf.score} className="h-1.5" />
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Feedback: </span>
                        <span className="text-muted-foreground">
                          {qf.feedback}
                        </span>
                      </div>
                      {qf.suggestions && (
                        <div>
                          <span className="font-semibold">Suggestion: </span>
                          <span className="text-muted-foreground">
                            {qf.suggestions}
                          </span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}

      {/* Strengths & Improvements Grid */}
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
          <ul className="space-y-2">
            {feedback.strengths.length > 0 ? (
              feedback.strengths.map((s, i) => (
                <li
                  key={i}
                  className={`
                    flex items-start gap-2 text-sm text-green-900
                    dark:text-green-200
                  `}
                >
                  <Badge
                    variant="secondary"
                    className={`
                      shrink-0 border-transparent bg-green-100 text-green-700
                      hover:bg-green-200
                      dark:bg-green-900/40 dark:text-green-300
                    `}
                  >
                    ✓
                  </Badge>
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
              Areas for Improvement
            </h4>
          </div>
          <ul className="space-y-2">
            {feedback.improvements.length > 0 ? (
              feedback.improvements.map((imp, i) => (
                <li
                  key={i}
                  className={`
                    flex items-start gap-2 text-sm text-amber-900
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
                  <span className="leading-tight">{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-amber-700/70 italic">
                No specific improvements suggested.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Try Again Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          className={`
            hover:bg-muted/50
            text-foreground w-full py-6 shadow-sm
          `}
          onClick={onReset}
        >
          <RefreshCw size={18} className="mr-2" />
          Interview Again
        </Button>
      </div>
    </div>
  );
};
