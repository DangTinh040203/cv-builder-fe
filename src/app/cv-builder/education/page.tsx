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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { EDUCATION_SEED_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { DegreeOptions, type Education } from "@/types/resume.type";

const educationSchema = z
  .object({
    school: z.string().min(1, "Please enter your school name."),
    degree: z.string().min(1, "Please select your degree."),
    major: z.string().min(1, "Please enter your major."),
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

const educationFormSchema = z.object({
  education: z.array(educationSchema),
});

type EducationFormInput = z.input<typeof educationFormSchema>;
type EducationFormValues = z.output<typeof educationFormSchema>;

const CvBuilderEducation = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const defaultEducations: Education[] =
    resume?.section.educations?.content ?? EDUCATION_SEED_DATA;

  const form = useForm<EducationFormInput, EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: { education: defaultEducations },
    mode: "onChange",
  });

  const { control, getValues, handleSubmit, setValue } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
  });

  const syncToRedux = (education: Education[]) => {
    if (!resume || !resume.section.educations) return;

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          educations: {
            ...resume.section.educations,
            content: education,
          },
        },
      }),
    );
  };

  const handleAddEducation = () => {
    const currentEducations = getValues("education");

    const maxOrder = currentEducations.reduce(
      (max, edu) => (edu.order > max ? edu.order : max),
      0,
    );

    const newItem = EDUCATION_SEED_DATA[0];
    if (newItem) {
      append({ ...newItem, order: maxOrder + 1, checkedEndDate: true });
    }
  };

  const handleRemoveEducation = (idx: number) => {
    remove(idx);

    const currentSkills = getValues("education") ?? [];
    syncToRedux(currentSkills.map((edu) => ({ ...edu })));
  };

  const handleResetEducation = () => {
    const payload = EDUCATION_SEED_DATA.map((edu) => ({
      ...edu,
      checkedEndDate: true,
    }));

    replace(payload);
    syncToRedux(payload);
  };

  const onSubmit = async (data: EducationFormInput) => {
    if (!resume || !resume.section.educations) return;

    try {
      syncToRedux(data.education.map((edu) => ({ ...edu })));

      setLoading(true);

      await resumeService.updateResume(resume._id, {
        ...resume,
        section: {
          ...resume.section,
          educations: {
            ...resume.section.educations,
            content: data.education.map((edu) => ({ ...edu })),
          },
        },
      });

      setLoading(false);
      router.push(Route.CvBuilderExperience);
    } catch {
      toast.error("Failed to update education. Please try again.");
    }
  };

  const onInvalid = (errors: FieldErrors<EducationFormInput>) => {
    const itemsWithError: string[] = [];

    if (Array.isArray(errors.education)) {
      errors.education.forEach((err, index) => {
        if (!err) return;
        const field = fields[index];
        if (!field) return;
        itemsWithError.push(`education-${field.id}`);
      });
    }

    if (itemsWithError.length > 0) {
      setOpenItems(itemsWithError);
    }
  };

  useEffect(() => {
    if (!resume?.section.educations) return;
    if (initialized) return;

    replace(
      resume?.section.educations.content.map((edu) => ({
        ...edu,
        checkedEndDate: true,
      })) ?? [],
    );
    setInitialized(true);
  }, [resume, initialized, replace]);

  const handleFieldBlur = () => {
    const values = getValues("education") ?? [];
    syncToRedux(values.map((edu) => ({ ...edu })));
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
        <h2 className="text-2xl font-bold">Tell us about your education</h2>
        <p>
          Enter your education experience so far, even if you are a current
          student or did not graduate.
        </p>
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
                const educationValues = getValues("education") ?? [];
                const current = educationValues?.[index];

                const school = current?.school ?? field.school ?? "School";
                const degree = current?.degree ?? field.degree ?? "Degree";
                const major = current?.major ?? field.major ?? "Major";

                return (
                  <div className="flex items-start gap-4" key={field.id}>
                    <AccordionItem
                      value={`education-${field.id}`}
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
                            <p className="text-lg font-medium">{school}</p>
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
                            {degree} in {major}
                          </p>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div>
                          <div className="grid grid-cols-2 items-start gap-6">
                            <FormField
                              control={form.control}
                              name={`education.${index}.school`}
                              render={({ field: inputField }) => (
                                <FormItem>
                                  <FormLabel>Institution</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="School Name"
                                      {...inputField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`education.${index}.major`}
                              render={({ field: inputField }) => (
                                <FormItem>
                                  <FormLabel>Major</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Computer Science"
                                      {...inputField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name={`education.${index}.degree`}
                                render={({ field: selectField }) => (
                                  <FormItem>
                                    <FormLabel>Degree</FormLabel>
                                    <FormControl>
                                      <Select
                                        value={selectField.value}
                                        onValueChange={selectField.onChange}
                                      >
                                        <SelectTrigger className="h-12! w-full">
                                          <SelectValue placeholder="Select Degree" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {DegreeOptions.map((deg) => (
                                            <SelectItem key={deg} value={deg}>
                                              {deg}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name={`education.${index}.startDate`}
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
                                            justify-between rounded-lg
                                            font-normal
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
                                            new Date(dateField.value) ??
                                            undefined
                                          }
                                          captionLayout="dropdown"
                                          onSelect={(date) =>
                                            dateField.onChange(
                                              date
                                                ? dayjs(date).format(
                                                    "YYYY-MM-DD",
                                                  )
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
                              name={`education.${index}.endDate`}
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
                                            justify-between rounded-lg
                                            font-normal
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
                                                ? dayjs(date).format(
                                                    "YYYY-MM-DD",
                                                  )
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
                                    name={`education.${index}.checkedEndDate`}
                                    render={({ field: checkboxField }) => (
                                      <div
                                        className={`
                                          mt-2 flex items-center gap-3
                                        `}
                                      >
                                        <Checkbox
                                          id={`education-${index}-checkedEndDate`}
                                          checked={checkboxField.value}
                                          onCheckedChange={(val) => {
                                            const isChecked = !!val;
                                            checkboxField.onChange(isChecked);
                                            setValue(
                                              `education.${index}.endDate`,
                                              isChecked
                                                ? null
                                                : getValues(
                                                    `education.${index}.endDate`,
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
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <Button
                      size="icon"
                      variant="outline"
                      className="mt-2"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveEducation(index);
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
                  handleAddEducation();
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
                  handleResetEducation();
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
                onClick={() => router.push(Route.CvBuilderSkills)}
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

export default CvBuilderEducation;
