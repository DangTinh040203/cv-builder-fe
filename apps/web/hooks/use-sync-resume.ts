import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { resumeToUpdateDto } from "@/utils/resume.utils";

/**
 * Custom hook to sync Redux resume state to backend.
 * Use this in forms - dispatch changes to store, call sync() on submit/next.
 */
export function useSyncResume() {
  const dispatch = useAppDispatch();
  const { resume } = useAppSelector(resumeSelector);
  const resumeService = useService(ResumeService);
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = useCallback(async () => {
    if (!resume) {
      toast.error("No resume to save");
      return false;
    }

    setIsSyncing(true);
    try {
      const updatedResume = await resumeService.updateResume(
        resume.id,
        resumeToUpdateDto(resume),
      );
      dispatch(setResume(updatedResume));
      toast.success("Resume saved successfully");
      return true;
    } catch {
      toast.error("Failed to save. Please try again.");
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [dispatch, resume, resumeService]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        sync();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sync]);

  return { sync, isSyncing, resume };
}
