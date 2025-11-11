"use client";
import OverviewEditor from "@/components/CvBuilder/OverviewEditor";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const Summary = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    dispatch(updateResume({ overview: value }));
  };

  return (
    resume && (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Briefly tell us about your background
        </h2>

        <OverviewEditor value={resume.overview} onChange={handleChange} />
      </div>
    )
  );
};

export default Summary;
