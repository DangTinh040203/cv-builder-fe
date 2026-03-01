import { Badge } from "@shared/ui/components/badge";
import { Button } from "@shared/ui/components/button";
import { Progress } from "@shared/ui/components/progress";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Lightbulb,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";

import {
  getScoreColor,
  ScoreGauge,
} from "@/components/builder-screen/score-gauge";
import { type MatchResult } from "@/types/resume.type";

interface MatchingResultProps {
  matchResult: MatchResult;
  onReset: () => void;
}

export const MatchingResult = ({
  matchResult,
  onReset,
}: MatchingResultProps) => {
  const getScoreLabel = (score: number) => {
    if (score >= 80) {
      return { label: "Excellent Match", color: "text-green-500" };
    }
    if (score >= 60) return { label: "Good Match", color: "text-blue-500" };
    if (score >= 40) return { label: "Fair Match", color: "text-yellow-500" };
    return { label: "Needs Improvement", color: "text-red-500" };
  };

  const overallStatus = getScoreLabel(matchResult.overallScore);

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

          <div className="space-y-6">
            {matchResult.criteria.map((criterion) => {
              const colors = getScoreColor(criterion.score);
              return (
                <div key={criterion.name} className="space-y-2.5">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-foreground text-sm font-bold">
                      {criterion.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-muted-foreground text-xs font-medium`}
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
                  <Progress value={criterion.score} className="h-2" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {criterion.explanation}
                  </p>
                </div>
              );
            })}
          </div>
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

        {/* Analyze Again Action */}
        <div className="pt-2">
          <Button
            variant="outline"
            className={`
              text-foreground w-full py-6 shadow-sm
              hover:bg-muted/50
            `}
            onClick={onReset}
          >
            <Search size={18} className="mr-2" />
            Analyze Another JD
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
