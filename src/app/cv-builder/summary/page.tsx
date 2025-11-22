"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/editor";
import { Spinner } from "@/components/ui/spinner";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const Summary = () => {
  const [loading, setLoading] = useState(false);
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleChange = (value: string) => {
    dispatch(updateResume({ overview: value }));
  };

  const handleNextStep = async () => {
    if (!resume) return;

    try {
      setLoading(true);
      await resumeService.updateResume(resume._id, {
        ...resume,
        overview: resume.overview,
      });

      router.push(Route.CvBuilderSkills);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    resume && (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Briefly tell us about your background
        </h2>

        <div>
          <Editor value={resume.overview} onChange={handleChange} />

          <div className="mt-4 flex items-center justify-between">
            <Button
              size={"lg"}
              className="h-12 min-w-40"
              type="button"
              variant={"outline"}
              onClick={() => router.push(Route.CvBuilderHeadings)}
            >
              <ArrowLeft />
              Back Step
            </Button>

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
      </div>
    )
  );
};

export default Summary;
