"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/components/accordion";
import { Badge } from "@shared/ui/components/badge";
import { Button } from "@shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/components/dialog";
import { Progress } from "@shared/ui/components/progress";
import { ScrollArea } from "@shared/ui/components/scroll-area";
import { toast } from "@shared/ui/components/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui/components/tabs";
import { Textarea } from "@shared/ui/components/textarea";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Brain,
  ClipboardList,
  Lightbulb,
  ScanSearch,
  Sparkles,
  Upload,
} from "lucide-react";
import React from "react";

import {
  getScoreColor,
  ScoreGauge,
} from "@/components/builder-screen/score-gauge";
import { useService } from "@/hooks/use-http";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { ResumeService } from "@/services/resume.service";
import { type ErrorResponse } from "@/types/error.response";
import { type MatchResult } from "@/types/resume.type";
import { toastErrorMessage } from "@/utils/toast-error-message.util";

const MatchingDialog = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [jdText, setJdText] = React.useState("");
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [matchResult, setMatchResult] = React.useState<MatchResult | null>(
    null,
  );

  const { resume } = useSyncResume();
  const resumeService = useService(ResumeService);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJdFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) {
      toast.error("No resume found. Please create a resume first.");
      return;
    }

    if (!jdText.trim() && !jdFile) {
      toast.error("Please provide a Job Description (text or file).");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await resumeService.matchResume(
        resume.id,
        jdFile ? undefined : jdText,
        jdFile ?? undefined,
      );
      setMatchResult(result);
    } catch (e) {
      if (e instanceof AxiosError) {
        const error = e.response?.data as ErrorResponse;
        toastErrorMessage(error.message);
      } else {
        toast.error("Something went wrong, please try again.");
      }

      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setJdText("");
    setJdFile(null);
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      handleReset();
      setIsAnalyzing(false);
    }
  };

  const hasInput = jdText.trim().length > 0 || jdFile !== null;

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="border-primary border shadow-xl"
        >
          <Brain /> JD Matching
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
            <Sparkles size={20} /> JD Matching Analysis
          </DialogTitle>
          <DialogDescription>
            {matchResult
              ? "Here's how well your CV matches the job description."
              : "Provide a job description to see how well your CV matches."}
          </DialogDescription>
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Brain className="text-primary h-16 w-16 animate-pulse" />
            <p className="text-lg font-medium">Analyzing...</p>
          </div>
        ) : matchResult ? (
          <ScrollArea className="max-h-[80vh] pr-4">
            <div className="space-y-8 pb-4">
              {/* Overall Score */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <ScoreGauge score={matchResult.overallScore} />
                <p
                  className={`
                    text-muted-foreground max-w-2xl text-center text-sm
                    leading-relaxed
                  `}
                >
                  {matchResult.summary}
                </p>
              </div>

              <div
                className={`
                  grid grid-cols-1 gap-8
                  md:grid-cols-2
                `}
              >
                {/* Left Column: Criteria Breakdown (Using Accordion) */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <ScanSearch size={16} /> Scoring Breakdown
                  </h4>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                  >
                    {matchResult.criteria.map((criterion, index) => {
                      const colors = getScoreColor(criterion.score);
                      return (
                        <AccordionItem
                          key={criterion.name}
                          value={`item-${index}`}
                          className={`
                            bg-muted/30 rounded-lg border px-4 py-1 shadow-sm
                          `}
                        >
                          <AccordionTrigger
                            className={`
                              py-3
                              hover:no-underline
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
                              <div className="flex items-center gap-3">
                                <span
                                  className={`
                                    text-muted-foreground text-xs font-normal
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
                          <AccordionContent className="pt-2 pb-3">
                            <div className="space-y-3">
                              <Progress
                                value={criterion.score}
                                className="h-1.5"
                              />
                              <p
                                className={`
                                  text-muted-foreground text-xs leading-relaxed
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

                {/* Right Column: Missing Keywords & Suggestions */}
                <div className="space-y-6">
                  {/* Missing Keywords */}
                  {matchResult.missingKeywords.length > 0 && (
                    <div className="space-y-3">
                      <h4
                        className={`
                          flex items-center gap-2 text-sm font-semibold
                        `}
                      >
                        🔑 Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingKeywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className={`
                              bg-red-100 text-red-700
                              hover:bg-red-200
                              dark:bg-red-900/30 dark:text-red-400
                            `}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {matchResult.suggestions.length > 0 && (
                    <div className="space-y-3">
                      <h4
                        className={`
                          flex items-center gap-2 text-sm font-semibold
                        `}
                      >
                        <Lightbulb size={16} /> Suggestions
                      </h4>
                      <div
                        className={`bg-muted/30 rounded-lg border p-4 shadow-sm`}
                      >
                        <ul className="space-y-2.5">
                          {matchResult.suggestions.map((suggestion, i) => (
                            <li
                              key={i}
                              className={`
                                text-muted-foreground flex gap-3 text-sm
                              `}
                            >
                              <span
                                className={`
                                  text-primary mt-0.5 shrink-0 text-lg
                                  leading-none
                                `}
                              >
                                •
                              </span>
                              <span className="leading-relaxed">
                                {suggestion}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                  onClick={handleReset}
                >
                  <ArrowLeft size={16} className="mr-2" /> Analyze Again
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <>
            {/* ... Phần Input Files/Text giữ nguyên ... */}
            <Tabs defaultValue="text" className="space-y-4 pt-4">
              <TabsList
                className={`
                  mx-auto flex w-fit items-center justify-center border
                `}
              >
                <TabsTrigger className="px-10" value="text">
                  <ClipboardList className="mr-2 h-4 w-4" /> Text JD
                </TabsTrigger>
                <TabsTrigger className="px-10" value="file">
                  <Upload className="mr-2 h-4 w-4" /> Upload JD
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-4">
                <Textarea
                  className="scrollbar-thin h-64 resize-none overflow-y-auto"
                  placeholder="Paste your JD here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="file" className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-primary flex h-64 cursor-pointer flex-col
                    items-center justify-center gap-3 rounded-lg border-2
                    border-dashed px-3 py-2 transition-all
                    hover:bg-muted/50
                  `}
                >
                  <div
                    className={`
                      bg-primary/10 flex h-14 w-14 items-center justify-center
                      rounded-full
                    `}
                  >
                    <Upload className="text-primary h-6 w-6" />
                  </div>
                  <div className="text-center">
                    {jdFile ? (
                      <>
                        <p className="text-primary text-sm font-medium">
                          {jdFile.name}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">
                          Click to upload JD file
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          PDF file • Max 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-2">
              <Button
                onClick={handleAnalyze}
                disabled={!hasInput}
                className="w-full"
              >
                <ScanSearch className="mr-2" /> Analyze Matching
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchingDialog;
