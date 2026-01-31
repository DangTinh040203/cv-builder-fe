"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { Label } from "@shared/ui/components/label";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

import BuilderNavigation from "@/components/builder-screen/builder-navigation";
import Editor from "@/components/builder-screen/editor";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

interface SummaryFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const SummaryForm = ({ onNext, onBack }: SummaryFormProps) => {
  const dispatch = useAppDispatch();
  const { resume } = useAppSelector(resumeSelector);
  const [value, setValue] = useState(resume?.overview || "");

  useEffect(() => {
    if (resume?.overview) {
      setValue(resume.overview);
    }
  }, [resume?.overview]);

  const handleChange = (content: string) => {
    setValue(content);
    dispatch(updateResume({ overview: content }));
  };

  return (
    <Card className="bg-card/80 border-border/50 gap-0 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div
            className={`
              bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg
            `}
          >
            <FileText className="text-primary h-4 w-4" />
          </div>
          Professional Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label
            className={`
              text-muted-foreground text-xs font-medium tracking-wide uppercase
            `}
          >
            Professional Summary
          </Label>

          <Editor value={value} onChange={handleChange} />

          <p className="text-muted-foreground text-xs">
            Use formatting to highlight key achievements and skills.
          </p>
        </div>

        <BuilderNavigation
          onBack={onBack}
          onNext={onNext}
          disableBack={!onBack}
          disableNext={!onNext}
        />
      </CardContent>
    </Card>
  );
};

export default SummaryForm;
