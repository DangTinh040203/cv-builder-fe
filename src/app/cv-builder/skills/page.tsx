"use client";
import { ArrowLeft, ArrowRight, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SKILL_SEED_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { type Skill } from "@/types/resume.type";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const { resume } = useAppSelector(resumeSelector);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRemoveSkill = (order: number) => {
    if (!resume || !resume.section.skills) return;

    const updatedSkills = skills.filter((skill) => skill.order !== order);

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          skills: {
            ...resume.section.skills,
            content: updatedSkills,
          },
        },
      }),
    );
  };

  const handleResetSkills = () => {
    if (!resume || !resume.section.skills) return;

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          skills: {
            ...resume.section.skills,
            content: SKILL_SEED_DATA,
          },
        },
      }),
    );
  };

  const handleAddSkill = () => {
    if (!resume || !resume.section.skills) return;

    const maxOrder = skills.reduce(
      (max, skill) => (skill.order > max ? skill.order : max),
      0,
    );

    const newSkill: Skill = {
      order: maxOrder + 1,
      label: "Label",
      value: "Value",
    };

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          skills: {
            ...resume.section.skills,
            content: [...skills, newSkill],
          },
        },
      }),
    );
  };

  useEffect(() => {
    const skills = resume?.section.skills;
    if (skills) {
      setSkills(skills.content);
    }
  }, [resume]);

  return (
    resume && (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          What skills would you like to highlight?
        </h2>

        <div className="space-y-4">
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.order} className="grid grid-cols-12 gap-4">
                <Input
                  placeholder={"Label"}
                  className="col-span-3"
                  value={skill.label}
                />

                <Input
                  className="col-span-8"
                  placeholder={"Value"}
                  value={skill.value}
                />

                <div className="flex items-center justify-center">
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => handleRemoveSkill(skill.order)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="min-w-32"
              variant={"outline"}
              onClick={handleAddSkill}
            >
              <Plus /> Add More
            </Button>
            <Button
              type="button"
              className="min-w-28"
              variant={"outline"}
              onClick={handleResetSkills}
            >
              <RefreshCcw /> Reset
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              size={"lg"}
              className="h-12 min-w-40"
              type="button"
              variant={"outline"}
              onClick={() => router.push(Route.CvBuilderSummary)}
            >
              <ArrowLeft />
              Back Step
            </Button>

            <Button
              size={"lg"}
              className="h-12 min-w-40"
              type="submit"
              disabled={loading}
            >
              Next Step {loading ? <Spinner /> : <ArrowRight />}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default Skills;
