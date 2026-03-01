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
import { ArrowLeft, Key, Lightbulb, ScanSearch } from "lucide-react";
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
  return (
    <ScrollArea className="scrollbar-thin max-h-[80vh] pr-4">
      <div className="space-y-8 pb-4">
        {/* Overall Score */}
        <div
          className={`
            bg-muted/30 border-border/50 mt-2 flex flex-col items-center gap-6
            rounded-xl border p-6
            md:flex-row md:items-start md:gap-8
          `}
        >
          <div
            className={`
              flex shrink-0 flex-col items-center justify-center gap-2
            `}
          >
            <ScoreGauge score={matchResult.overallScore} />
            <span
              className={`
                text-muted-foreground text-xs font-semibold tracking-wider
                uppercase
              `}
            >
              Overall Match
            </span>
          </div>
          <div
            className={`
              flex flex-col space-y-3 pt-2 text-center
              md:text-left
            `}
          >
            <h3 className="text-lg font-semibold tracking-tight">
              Analysis Summary
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {matchResult.summary}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-8`}>
          {/* Left Column: Criteria Breakdown */}
          <div>
            <div
              className={`
                border-border/60 flex items-center gap-2 border-b pb-3
              `}
            >
              <ScanSearch size={20} className="text-primary" />
              <h4 className="text-base font-semibold tracking-tight">
                Scoring Breakdown
              </h4>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {matchResult.criteria.map((criterion, index) => {
                const colors = getScoreColor(criterion.score);
                return (
                  <AccordionItem
                    key={criterion.name}
                    value={`item-${index}`}
                    className={`
                      border-border/50 border-b px-2
                      last:border-0
                    `}
                  >
                    <AccordionTrigger
                      className={`
                        py-4
                        hover:no-underline hover:opacity-80
                      `}
                    >
                      <div
                        className={`
                          flex w-full items-center justify-between pr-4
                        `}
                      >
                        <span className="text-sm font-medium">
                          {criterion.name}
                        </span>
                        <div
                          className={`
                            flex flex-col items-end gap-1
                            sm:flex-row sm:items-center sm:gap-4
                          `}
                        >
                          <span
                            className={`
                              text-muted-foreground text-xs font-medium
                            `}
                          >
                            Weight: {criterion.weight}%
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
                    <AccordionContent className="pt-1 pb-5">
                      <div className="space-y-3.5">
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

          {/* Missing Keywords */}
          {matchResult.missingKeywords.length > 0 && (
            <div className="space-y-4">
              <div
                className={`
                  border-border/60 flex items-center gap-2 border-b pb-3
                `}
              >
                <Key size={18} className="text-destructive" />
                <h4 className="text-base font-semibold tracking-tight">
                  Missing Keywords
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className={`
                      bg-destructive/10 text-destructive border-transparent
                      transition-colors
                      hover:bg-destructive/20
                    `}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Missing Keywords & Suggestions */}
          <div className="space-y-8">
            {/* Suggestions */}
            {matchResult.suggestions.length > 0 && (
              <div className="space-y-4">
                <div
                  className={`
                    border-border/60 flex items-center gap-2 border-b pb-3
                  `}
                >
                  <Lightbulb size={18} className="text-amber-500" />
                  <h4 className="text-base font-semibold tracking-tight">
                    Actionable Suggestions
                  </h4>
                </div>
                <ul className="space-y-3.5">
                  {matchResult.suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className={`
                        text-muted-foreground flex items-start gap-3 text-sm
                      `}
                    >
                      <div
                        className={`
                          mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full
                          bg-amber-500/70
                        `}
                      />
                      <span className="leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Again */}
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            className={`
              w-full
              md:w-auto
            `}
            onClick={onReset}
          >
            <ArrowLeft size={16} className="mr-2" /> Analyze Again
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
