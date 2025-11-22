"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDownIcon,
  Plus,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import Editor from "@/components/ui/editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { EXPERIENCE_SEED_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { type WorkExperience } from "@/types/resume.type";

const workExperienceSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string({ error: "Please select a start date." }),
    endDate: z.string({ error: "Please select an end date." }).nullable(),
    checkedEndDate: z.boolean(),
    order: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!data.checkedEndDate && !data.endDate) {
      ctx.addIssue({
        code: "custom",
        message: "Please select an end date.",
        path: ["endDate"],
      });
    }

    if (data.endDate && !dayjs(data.endDate).isAfter(dayjs(data.startDate))) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after the start date.",
        path: ["endDate"],
      });
    }
  });

const workExperiencesSchema = z.object({
  workExperience: z.array(workExperienceSchema),
});

type WorkExperienceFormInput = z.infer<typeof workExperiencesSchema>;
type WorkExperienceFormValues = z.infer<typeof workExperiencesSchema>;

const Experience = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const defaultWorkExperience: WorkExperience[] =
    resume?.section.workExperiences?.content ?? [];

  const form = useForm<WorkExperienceFormInput, WorkExperienceFormValues>({
    resolver: zodResolver(workExperiencesSchema),
    defaultValues: { workExperience: defaultWorkExperience },
    mode: "onChange",
  });

  const { control, getValues, handleSubmit, setValue } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "workExperience",
  });

  const syncToRedux = (workExperience: WorkExperience[]) => {
    if (!resume || !resume.section.workExperiences) return;

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          workExperiences: {
            ...resume.section.workExperiences,
            content: workExperience,
          },
        },
      }),
    );
  };

  const handleAddExperience = () => {
    const currentExperiences = getValues("workExperience");

    const maxOrder = currentExperiences.reduce(
      (max, exp) => (exp.order > max ? exp.order : max),
      0,
    );

    const newItem: WorkExperience = EXPERIENCE_SEED_DATA[0];
    if (newItem) {
      append({ ...newItem, order: maxOrder + 1, checkedEndDate: true });
      syncToRedux([
        ...currentExperiences.map((exp) => ({ ...exp })),
        { ...newItem, order: maxOrder + 1, checkedEndDate: true },
      ]);
    }
  };

  const handleRemoveExperience = (idx: number) => {
    remove(idx);

    const currentExperiences = getValues("workExperience") ?? [];
    syncToRedux(currentExperiences.map((exp) => ({ ...exp })));
  };

  const handleResetExperience = () => {
    const payload = EXPERIENCE_SEED_DATA.map((exp, index) => ({
      ...exp,
      order: index + 1,
      checkedEndDate: true,
    }));

    replace(payload);
    syncToRedux(payload);
  };

  const onSubmit = async (data: WorkExperienceFormInput) => {
    if (!resume || !resume.section.workExperiences) return;

    try {
      setLoading(true);
      syncToRedux(data.workExperience.map((exp) => ({ ...exp })));

      await resumeService.updateResume(resume._id, {
        ...resume,
        section: {
          ...resume.section,
          workExperiences: {
            ...resume.section.workExperiences,
            content: data.workExperience.map((exp) => ({ ...exp })),
          },
        },
      });

      setLoading(false);
      router.push(Route.CvBuilderProjects);
    } catch {
      toast.error("Failed to update work experience. Please try again.");
    }
  };

  const onInvalid = (errors: FieldErrors<WorkExperienceFormInput>) => {
    const itemsWithError: string[] = [];

    if (Array.isArray(errors.workExperience)) {
      errors.workExperience.forEach((err, index) => {
        if (!err) return;
        const field = fields[index];
        if (!field) return;
        itemsWithError.push(`workExperience-${field.id}`);
      });
    }

    if (itemsWithError.length > 0) {
      setOpenItems(itemsWithError);
    }
  };

  /* Initialize form with resume data */
  useEffect(() => {
    if (!resume?.section.workExperiences) return;
    if (initialized) return;

    replace(
      resume?.section.workExperiences.content.map((exp) => ({
        ...exp,
        checkedEndDate: true,
      })) ?? [],
    );
    setInitialized(true);
  }, [resume, initialized, replace]);

  const handleFieldBlur = () => {
    const values = getValues("workExperience") ?? [];
    syncToRedux(values.map((exp) => ({ ...exp })));
  };

  if (!resume) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Tell us about your most recent job
        </h2>
        <p>We&apos;ll start there and work backward.</p>
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            onBlur={handleFieldBlur}
            className="space-y-8"
          >
            <Accordion
              type="multiple"
              className="space-y-6"
              value={openItems}
              onValueChange={(values) => setOpenItems(values)}
            >
              {fields.map((field, index) => {
                const workExperienceValues = getValues("workExperience") ?? [];
                const current = workExperienceValues?.[index];

                return (
                  <div className="flex items-start gap-4" key={field.id}>
                    <AccordionItem
                      value={`workExperience-${field.id}`}
                      className={`
                        flex-1 space-y-4 rounded-lg !border p-4 shadow-lg
                      `}
                    >
                      <AccordionTrigger
                        className={`m-0 w-full border-none! p-0 outline-none!`}
                      >
                        <div className="w-full">
                          <div
                            className={`
                              flex w-full items-center justify-between
                            `}
                          >
                            <p className="text-lg font-medium">
                              {field.company}
                            </p>
                            <p className="text-muted-foreground">
                              {field.startDate
                                ? dayjs(field.startDate).format("MMM YYYY")
                                : "Start"}{" "}
                              -{" "}
                              {field.endDate
                                ? dayjs(field.endDate).format("MMM YYYY")
                                : "Present"}
                            </p>
                          </div>
                          <p className="text-muted-foreground">
                            {field.position}
                          </p>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="grid grid-cols-2 items-start gap-6">
                          <FormField
                            control={form.control}
                            name={`workExperience.${index}.company`}
                            render={({ field: inputField }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Company Name"
                                    {...inputField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`workExperience.${index}.position`}
                            render={({ field: inputField }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Position"
                                    {...inputField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`workExperience.${index}.startDate`}
                            render={({ field: dateField }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        id="date"
                                        className={`
                                          border-border text-foreground h-12
                                          justify-between rounded-lg font-normal
                                        `}
                                      >
                                        {dateField.value
                                          ? dayjs(dateField.value).format(
                                              "MMM DD, YYYY",
                                            )
                                          : "Select date"}
                                        <ChevronDownIcon />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto overflow-hidden p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={
                                          new Date(dateField.value) ?? undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) =>
                                          dateField.onChange(
                                            date
                                              ? dayjs(date).format("YYYY-MM-DD")
                                              : null,
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`workExperience.${index}.endDate`}
                            render={({ field: dateField }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        id="date"
                                        disabled={current?.checkedEndDate}
                                        className={`
                                          border-border text-foreground h-12
                                          justify-between rounded-lg font-normal
                                        `}
                                      >
                                        {current?.checkedEndDate
                                          ? "Present"
                                          : dateField.value
                                            ? dayjs(dateField.value).format(
                                                "MMM DD, YYYY",
                                              )
                                            : "Select date"}
                                        <ChevronDownIcon />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto overflow-hidden p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={
                                          dateField.value
                                            ? new Date(dateField.value)
                                            : undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) =>
                                          dateField.onChange(
                                            date
                                              ? dayjs(date).format("YYYY-MM-DD")
                                              : null,
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />

                                <FormField
                                  control={form.control}
                                  name={`workExperience.${index}.checkedEndDate`}
                                  render={({ field: checkboxField }) => (
                                    <div
                                      className={`mt-2 flex items-center gap-3`}
                                    >
                                      <Checkbox
                                        id={`education-${index}-checkedEndDate`}
                                        checked={checkboxField.value}
                                        onCheckedChange={(val) => {
                                          const isChecked = !!val;
                                          checkboxField.onChange(isChecked);
                                          setValue(
                                            `workExperience.${index}.endDate`,
                                            isChecked
                                              ? null
                                              : getValues(
                                                  `workExperience.${index}.endDate`,
                                                ),
                                          );
                                        }}
                                      />
                                      <Label
                                        htmlFor={`education-${index}-checkedEndDate`}
                                      >
                                        I am currently studying here
                                      </Label>
                                    </div>
                                  )}
                                />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`workExperience.${index}.description`}
                            render={({ field: descField }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <div>
                                    <Editor
                                      value={descField.value}
                                      onChange={(val) => {
                                        descField.onChange(val);
                                        const updated = getValues(
                                          "workExperience",
                                        ).map((exp, idx) =>
                                          idx === index
                                            ? { ...exp, description: val }
                                            : { ...exp },
                                        );
                                        syncToRedux(updated);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <Button
                      variant="outline"
                      className="mt-2"
                      type="button"
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveExperience(index);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                );
              })}
            </Accordion>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                className="min-w-32"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddExperience();
                }}
              >
                <Plus /> Add More
              </Button>
              <Button
                type="button"
                className="min-w-28"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResetExperience();
                }}
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
                onClick={() => router.push(Route.CvBuilderEducation)}
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
      </div>
    </div>
  );
};

export default Experience;
