"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SKILL_SEED_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import type { Skill } from "@/types/resume.type";

const skillSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number(),
});

const skillsFormSchema = z.object({
  skills: z.array(skillSchema),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

const Skills = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const defaultSkills: Skill[] = (
    resume?.section.skills?.content ?? SKILL_SEED_DATA
  ).map((s) => ({ ...s }));

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skills: defaultSkills,
    },
    mode: "onChange",
  });

  const { control, handleSubmit, getValues } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    if (!resume?.section.skills) return;
    if (initialized) return;

    const skillsFromResume: Skill[] = (resume.section.skills.content ?? []).map(
      (s) => ({ ...s }),
    );

    replace(skillsFromResume);
    setInitialized(true);
  }, [resume, initialized, replace]);

  const syncToRedux = useCallback(
    (skills: Skill[]) => {
      if (!resume || !resume.section.skills) return;

      dispatch(
        updateResume({
          section: {
            ...resume.section,
            skills: {
              ...resume.section.skills,
              content: skills,
            },
          },
        }),
      );
    },
    [dispatch, resume],
  );

  const handleAddSkill = () => {
    const currentSkills = getValues("skills") ?? [];
    const maxOrder =
      currentSkills.reduce(
        (max, skill) => (skill.order > max ? skill.order : max),
        0,
      ) || 0;

    const newSkill: Skill = {
      order: maxOrder + 1,
      label: "",
      value: "",
    };

    append(newSkill);
    const updatedSkills = [...currentSkills, newSkill].map((s) => ({ ...s }));
    syncToRedux(updatedSkills);
  };

  const handleRemoveSkill = (idx: number) => {
    const currentSkills = getValues("skills") ?? [];
    const updatedSkills = currentSkills
      .filter((_, i) => i !== idx)
      .map((s) => ({ ...s }));
    remove(idx);
    syncToRedux(updatedSkills);
  };

  const handleResetSkills = () => {
    const cloned = SKILL_SEED_DATA.map((s) => ({ ...s }));
    replace(cloned);
    syncToRedux(cloned);
  };

  const onSubmit = async (data: SkillsFormValues) => {
    if (!resume || !resume.section.skills) return;

    setLoading(true);

    await resumeService.updateResume(resume._id, {
      ...resume,
      section: {
        ...resume.section,
        skills: {
          ...resume.section.skills,
          content: data.skills,
        },
      },
    });

    setLoading(false);
    router.push(Route.CvBuilderEducation);
  };

  if (!resume) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold">
          What skills would you like to highlight?
        </h2>

        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 items-start gap-4">
              <FormField
                control={control}
                name={`skills.${idx}.label`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Label"
                        {...field}
                        onBlur={() => {
                          field.onBlur?.();
                          const currentSkills = getValues("skills") ?? [];
                          syncToRedux(currentSkills.map((s) => ({ ...s })));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`skills.${idx}.value`}
                render={({ field }) => (
                  <FormItem className="col-span-8">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Value"
                        {...field}
                        onBlur={() => {
                          field.onBlur?.();
                          const currentSkills = getValues("skills") ?? [];
                          syncToRedux(currentSkills.map((s) => ({ ...s })));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 flex justify-center self-start pt-6">
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
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
            variant="outline"
            onClick={handleAddSkill}
          >
            <Plus /> Add More
          </Button>
          <Button
            type="button"
            className="min-w-28"
            variant="outline"
            onClick={handleResetSkills}
          >
            <RefreshCcw /> Reset
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button
            size="lg"
            className="h-12 min-w-40"
            type="button"
            variant="outline"
            onClick={() => router.push(Route.CvBuilderSummary)}
          >
            <ArrowLeft />
            Back Step
          </Button>

          <Button
            size="lg"
            className="h-12 min-w-40"
            type="submit"
            disabled={loading}
          >
            Next Step {loading ? <Spinner /> : <ArrowRight />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Skills;
