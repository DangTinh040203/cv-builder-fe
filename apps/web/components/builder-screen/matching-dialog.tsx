"use client";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui/components/tabs";
import { Textarea } from "@shared/ui/components/textarea";
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
import { toast } from "sonner";

import {
  getScoreColor,
  ScoreGauge,
} from "@/components/builder-screen/score-gauge";
import { useService } from "@/hooks/use-http";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { ResumeService } from "@/services/resume.service";
import { type MatchResult } from "@/types/resume.type";

const MatchingDialog = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [jdText, setJdText] = React.useState("");
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [matchResult, setMatchResult] = React.useState<MatchResult | null>(
    null,
  );

  const { resume, sync } = useSyncResume();
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
      await sync();
      const result = await resumeService.matchResume(
        resume.id,
        jdFile ? undefined : jdText,
        jdFile ?? undefined,
      );
      setMatchResult(result);
    } catch {
      toast.error("Analysis failed. Please try again.");
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
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <ScoreGauge score={matchResult.overallScore} />
                <p
                  className={`
                    text-muted-foreground max-w-md text-center text-sm
                  `}
                >
                  {matchResult.summary}
                </p>
              </div>

              <div
                className={`
                  grid grid-cols-1 gap-6
                  md:grid-cols-2
                `}
              >
                {/* Left Column: Criteria Breakdown */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <ScanSearch size={16} /> Scoring Breakdown
                  </h4>
                  <div className="space-y-3">
                    {matchResult.criteria.map((criterion) => {
                      const colors = getScoreColor(criterion.score);
                      return (
                        <div
                          key={criterion.name}
                          className="bg-muted/50 space-y-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {criterion.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
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
                          <Progress value={criterion.score} className="h-2" />
                          <p className="text-muted-foreground text-xs">
                            {criterion.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Missing Keywords & Suggestions */}
                <div className="space-y-6">
                  {/* Missing Keywords */}
                  {matchResult.missingKeywords.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">
                        🔑 Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingKeywords.map((keyword) => (
                          <Badge key={keyword} variant="destructive">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {matchResult.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4
                        className={`
                          flex items-center gap-2 text-sm font-semibold
                        `}
                      >
                        <Lightbulb size={16} /> Suggestions
                      </h4>
                      <ul className="space-y-1.5">
                        {matchResult.suggestions.map((suggestion, i) => (
                          <li
                            key={i}
                            className="text-muted-foreground flex gap-2 text-sm"
                          >
                            <span className="text-primary mt-0.5 shrink-0">
                              •
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Analyze Again */}
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  className={`
                    w-full
                    md:w-auto
                  `}
                  onClick={handleReset}
                >
                  <ArrowLeft size={16} /> Analyze Again
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <>
            <Tabs defaultValue="text" className="space-y-2">
              <TabsList
                className={`mx-auto flex items-center justify-center border`}
              >
                <TabsTrigger className="px-10" value="text">
                  <ClipboardList /> Text JD
                </TabsTrigger>
                <TabsTrigger className="px-10" value="file">
                  <Upload /> Upload JD
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Textarea
                  className="scrollbar-thin h-64 resize-none overflow-y-auto"
                  placeholder="Paste your JD here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="file">
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
                    items-center justify-center gap-2 rounded-lg border
                    border-dashed px-3 py-2 transition-colors
                    hover:bg-muted/50
                  `}
                >
                  <div
                    className={`
                      bg-primary/10 flex h-12 w-12 items-center justify-center
                      rounded-full
                    `}
                  >
                    <Upload className="text-primary h-6 w-6" />
                  </div>
                  <div className="text-center">
                    {jdFile ? (
                      <>
                        <p className="text-sm font-medium">{jdFile.name}</p>
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

            <Button onClick={handleAnalyze} disabled={!hasInput}>
              <ScanSearch /> Analyze Matching
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchingDialog;
