"use client";
import { Button } from "@shared/ui/components/button";
import { Label } from "@shared/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/select";
import { Slider } from "@shared/ui/components/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui/components/tabs";
import { Textarea } from "@shared/ui/components/textarea";
import { ClipboardList, Mic, Upload } from "lucide-react";
import React from "react";

export type InterviewType = "technical" | "behavioral" | "both";

interface InterviewFormProps {
  jdText: string;
  jdFile: File | null;
  questionCount: number;
  interviewType: InterviewType;
  setJdText: (text: string) => void;
  setJdFile: (file: File | null) => void;
  setQuestionCount: (count: number) => void;
  setInterviewType: (type: InterviewType) => void;
  onStart: () => void;
}

export const InterviewForm = ({
  jdText,
  setJdText,
  jdFile,
  setJdFile,
  questionCount,
  setQuestionCount,
  interviewType,
  setInterviewType,
  onStart,
}: InterviewFormProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJdFile(file);
    }
  };

  const hasInput = jdText.trim().length > 0 || jdFile !== null;

  return (
    <div>
      {/* JD Input Tabs */}
      <Tabs defaultValue="text" className="space-y-4 pt-4">
        <TabsList
          className={`mx-auto flex w-fit items-center justify-center border`}
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
            className="scrollbar-thin h-40 resize-none overflow-y-auto"
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
              border-primary flex h-40 cursor-pointer flex-col items-center
              justify-center gap-3 rounded-lg border-2 border-dashed px-3 py-2
              transition-all
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
                  <p className="text-sm font-medium">Click to upload JD file</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    PDF file • Max 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Interview Configuration */}
      <div className={`bg-muted/30 mt-2 space-y-5 rounded-lg border p-4`}>
        <h4 className="text-sm font-semibold">Interview Configuration</h4>

        <div>
          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Number of Questions</Label>
              <span
                className={`
                  bg-primary/10 text-primary rounded-md px-2.5 py-0.5 text-sm
                  font-semibold
                `}
              >
                {questionCount}
              </span>
            </div>
            <Slider
              min={5}
              max={10}
              step={1}
              value={[questionCount]}
              onValueChange={(values) => setQuestionCount(values[0] ?? 5)}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>5 questions</span>
              <span>10 questions</span>
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <Label className="text-sm">Interview Type</Label>
            <Select
              value={interviewType}
              onValueChange={(val) => setInterviewType(val as InterviewType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">🛠 Technical</SelectItem>
                <SelectItem value="behavioral">🗣 Behavioral</SelectItem>
                <SelectItem value="both">🎯 Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <Button onClick={onStart} disabled={!hasInput} className="w-full">
          <Mic className="mr-2" /> Start Interview
        </Button>
      </div>
    </div>
  );
};
