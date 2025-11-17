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
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    startDate: z
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a start date.",
      }),
    endDate: z.date().nullable(),
    order: z.number(),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

const educationFormSchema = z.object({
  education: z.array(educationSchema),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

type SerializableEducation = Omit<Education, "startDate" | "endDate"> & {
  startDate: string;
  endDate: string | null;
};

const normalizeEducationDates = (educations: Education[]): Education[] =>
  educations.map((edu) => ({
    ...edu,
    startDate:
      edu.startDate instanceof Date ? edu.startDate : new Date(edu.startDate),
    endDate:
      edu.endDate === null
        ? null
        : edu.endDate instanceof Date
          ? edu.endDate
          : new Date(edu.endDate),
  }));

const CvBuilderEducation = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const defaultEducations: Education[] = normalizeEducationDates(
    resume?.section.educations?.content ?? EDUCATION_SEED_DATA,
  );

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: { education: defaultEducations },
    mode: "onChange",
  });

  const { control, getValues, handleSubmit, watch } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
  });

  const educationValues = watch("education");

  const syncToRedux = (education: Education[]) => {
    if (!resume || !resume.section.educations) return;

    const serializableEducation: SerializableEducation[] = education.map(
      (edu) => ({
        ...edu,
        startDate:
          edu.startDate instanceof Date
            ? edu.startDate.toISOString()
            : (edu.startDate as string),
        endDate:
          edu.endDate instanceof Date
            ? edu.endDate.toISOString()
            : (edu.endDate ?? null),
      }),
    );

    dispatch(
      updateResume({
        section: {
          ...resume.section,
          educations: {
            ...resume.section.educations,
            content: serializableEducation,
          } as typeof resume.section.educations & {
            content: SerializableEducation[];
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

    const newEducationItem: Education = {
      school: "Your School Name",
      degree: DegreeOptions[0],
      major: "Your Major",
      startDate: new Date(),
      endDate: null,
      order: maxOrder + 1,
    };

    append(newEducationItem);
  };

  const handleRemoveEducation = (idx: number) => {
    remove(idx);
  };

  const handleResetEducation = () => {
    const cloned = normalizeEducationDates(EDUCATION_SEED_DATA);
    replace(cloned);
  };

  const onSubmit = async (data: EducationFormValues) => {
    if (!resume || !resume.section.educations) return;

    syncToRedux(data.education as Education[]);

    setLoading(true);

    await resumeService.updateResume(resume._id, {
      ...resume,
      section: {
        ...resume.section,
        educations: {
          ...resume.section.educations,
          content: data.education,
        },
      },
    });

    setLoading(false);
    router.push(Route.CvBuilderExperience);
  };

  const onInvalid = (errors: FieldErrors<EducationFormValues>) => {
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

    const educationsFromResume = normalizeEducationDates(
      resume.section.educations.content ?? [],
    );

    replace(educationsFromResume);
    setInitialized(true);
  }, [resume, initialized, replace]);

  useEffect(() => {
    if (!initialized) return;
    if (!educationValues) return;

    syncToRedux(educationValues as Education[]);
  }, [educationValues, initialized]);

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
            className="space-y-4"
          >
            <Accordion
              type="multiple"
              className="space-y-4"
              value={openItems}
              onValueChange={(values) => setOpenItems(values)}
            >
              {fields.map((field, index) => {
                const current = educationValues?.[index];

                const school = current?.school ?? field.school ?? "School";
                const degree = current?.degree ?? field.degree ?? "Degree";
                const major = current?.major ?? field.major ?? "Major";

                const startDateValue =
                  current?.startDate ??
                  field.startDate ??
                  defaultEducations[index]?.startDate ??
                  null;
                const endDateValue =
                  current?.endDate ??
                  field.endDate ??
                  defaultEducations[index]?.endDate ??
                  null;

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
                              {startDateValue
                                ? dayjs(startDateValue).format("MMM YYYY")
                                : "Start"}{" "}
                              -{" "}
                              {endDateValue
                                ? dayjs(endDateValue).format("MMM YYYY")
                                : "Present"}
                            </p>
                          </div>
                          <p className="text-muted-foreground">
                            {degree} in {major}
                          </p>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
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
                          <div
                            className={`
                              col-span-2 grid grid-cols-2 items-start gap-6
                            `}
                          >
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
                                            dateField.value ?? undefined
                                          }
                                          captionLayout="dropdown"
                                          onSelect={(date) =>
                                            dateField.onChange(date ?? null)
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
                                            dateField.value ?? undefined
                                          }
                                          captionLayout="dropdown"
                                          onSelect={(date) =>
                                            dateField.onChange(date ?? null)
                                          }
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
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
                      onClick={() => {
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
                onClick={handleAddEducation}
              >
                <Plus /> Add More
              </Button>
              <Button
                type="button"
                className="min-w-28"
                variant="outline"
                onClick={handleResetEducation}
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
