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
  Key,
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
          <div className="flex flex-col items-center justify-center gap-8 py-24">
            <div className="relative flex h-32 w-32 items-center justify-center">
              {/* Animated glowing rings */}
              <div
                className={`
                  bg-primary/5 absolute inset-0 animate-ping rounded-full
                `}
                style={{ animationDuration: "3s" }}
              />
              <div
                className={`
                  bg-primary/10 absolute inset-2 animate-ping rounded-full
                `}
                style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
              />
              <div
                className={`
                  bg-primary/20 absolute inset-4 animate-ping rounded-full
                `}
                style={{ animationDuration: "2s", animationDelay: "1s" }}
              />

              {/* Core Icon wrapper */}
              <div
                className={`
                  border-primary/30 bg-background/90 shadow-primary/20 relative
                  z-10 flex h-20 w-20 items-center justify-center rounded-full
                  border-2 shadow-[0_0_40px_hsl(var(--primary)/0.4)]
                  backdrop-blur-xl
                `}
              >
                <Brain className="text-primary h-10 w-10 animate-pulse" />
                <Sparkles
                  className={`
                    absolute -top-2 -right-2 h-6 w-6 animate-bounce
                    text-amber-500
                  `}
                />
              </div>
            </div>

            {/* Text elements */}
            <div className="flex flex-col items-center gap-3 text-center">
              <h3
                className={`
                  from-primary to-primary/50 bg-linear-to-r bg-clip-text
                  text-2xl font-bold tracking-tight text-transparent
                `}
              >
                AI Engines Processing
              </h3>
              <div className="text-muted-foreground flex items-center gap-2">
                <ScanSearch
                  className="text-primary/70 h-5 w-5 animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                <p className="animate-pulse text-sm font-medium">
                  Deep scanning CV against Job Details...
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`
                    bg-primary/80 h-1.5 w-1.5 animate-bounce rounded-full
                  `}
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className={`
                    bg-primary/80 h-1.5 w-1.5 animate-bounce rounded-full
                  `}
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className={`
                    bg-primary/80 h-1.5 w-1.5 animate-bounce rounded-full
                  `}
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        ) : matchResult ? (
          <ScrollArea className="scrollbar-thin max-h-[80vh] pr-4">
            <div className="space-y-8 pb-4">
              {/* Overall Score */}
              <div
                className={`
                  bg-muted/30 border-border/50 mt-2 flex flex-col items-center
                  gap-6 rounded-xl border p-6
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

              <div
                className={`
                  grid grid-cols-1 gap-8
                  lg:grid-cols-[1fr_350px]
                  xl:grid-cols-[1fr_400px]
                `}
              >
                {/* Left Column: Criteria Breakdown */}
                <div className="space-y-6">
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
                              <Progress
                                value={criterion.score}
                                className="h-2"
                              />
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

                {/* Right Column: Missing Keywords & Suggestions */}
                <div className="space-y-8">
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
                              bg-destructive/10 text-destructive
                              border-transparent transition-colors
                              hover:bg-destructive/20
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
                              text-muted-foreground flex items-start gap-3
                              text-sm
                            `}
                          >
                            <div
                              className={`
                                mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full
                                bg-amber-500/70
                              `}
                            />
                            <span className="leading-relaxed">
                              {suggestion}
                            </span>
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
