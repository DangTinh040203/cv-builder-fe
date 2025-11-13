"use client";
import "react-quill-new/dist/quill.snow.css";

import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useState } from "react";
import type { QuillOptionsStatic } from "react-quill-new";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector } from "@/stores/features/resume.slice";
import { useAppSelector } from "@/stores/store";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface OverviewEditorProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

type MinimalEditor = {
  getText: () => string;
  getSelection: () => { index: number; length: number } | null;
};

export default function OverviewEditor({
  value,
  onChange,
  maxLength = 1000,
}: OverviewEditorProps) {
  const [loading, setLoading] = useState(false);
  const { resume } = useAppSelector(resumeSelector);
  const router = useRouter();

  const modules: QuillOptionsStatic["modules"] = {
    toolbar: [["bold", "italic", "underline"], ["link"], [{ color: [] }]],
  };

  const formats: QuillOptionsStatic["formats"] = [
    "bold",
    "italic",
    "underline",
    "link",
    "color",
  ];

  const handleChange = useCallback(
    (
      content: string,
      _delta: unknown,
      _source: "api" | "user",
      editor: MinimalEditor,
    ) => {
      const plainText = editor.getText().trim();
      if (plainText.length > maxLength) return;
      onChange(content);
    },
    [onChange, maxLength],
  );

  const charCount = value.replace(/<[^>]*>?/gm, "").trim().length;

  const handleNextStep = async () => {
    if (!resume) return;

    try {
      setLoading(true);
      await resumeService.updateResume(resume._id, {
        ...resume,
        overview: value,
      });

      router.push(Route.CvBuilderSkills);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Write a brief summary about yourself..."
      />

      <div className={`mt-4 flex items-center justify-end gap-8`}>
        <p
          className={`
            text-sm
            ${
              charCount > maxLength * 0.9
                ? "text-red-500"
                : "text-muted-foreground"
            }
          `}
        >
          {charCount}/{maxLength}
        </p>
        <Button
          size={"lg"}
          className="h-12 min-w-40"
          type="submit"
          disabled={loading}
          onClick={handleNextStep}
        >
          Next Step {loading ? <Spinner /> : <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}
