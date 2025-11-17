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
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
    school: z.string().min(1, "School is required"),
    degree: z.string().min(1, "Degree is required"),
    major: z.string().min(1, "Major is required"),
    startDate: z.date(),
    endDate: z.date().nullable(),
    order: z.number(),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    message: "End date must be after start date",
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

  const defaultEducations: Education[] = normalizeEducationDates(
    resume?.section.educations?.content ?? EDUCATION_SEED_DATA,
  );

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: { education: defaultEducations },
    mode: "onChange",
  });

  const { control, getValues, handleSubmit } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
  });

  const syncToRedux = useCallback(
    (education: Education[]) => {
      if (!resume || !resume.section.educations) return;

      const serializableEducation: SerializableEducation[] = education.map(
        (edu) => ({
          ...edu,
          startDate:
            edu.startDate instanceof Date
              ? edu.startDate.toISOString()
              : edu.startDate,
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
    },
    [dispatch, resume],
  );

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
    const updatedEducations = [...currentEducations, newEducationItem];
    syncToRedux(updatedEducations);
  };

  const handleRemoveEducation = (idx: number) => {
    const currentEducations = getValues("education");

    const updatedEducations = currentEducations.filter(
      (_, index) => index !== idx,
    );

    remove(idx);
    syncToRedux(updatedEducations);
  };

  const handleResetEducation = () => {
    const cloned = normalizeEducationDates(EDUCATION_SEED_DATA);
    replace(cloned);
    syncToRedux(cloned);
  };

  const onSubmit = async (data: EducationFormValues) => {
    if (!resume || !resume.section.educations) return;

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

  useEffect(() => {
    if (!resume?.section.educations) return;
    if (initialized) return;

    const educationsFromResume = normalizeEducationDates(
      resume.section.educations.content ?? [],
    );

    replace(educationsFromResume);
    setInitialized(true);
  }, [resume, initialized, replace]);

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
          What skills would you like to highlight?
        </h2>
        <p>
          Include your higher education details-degree, courses, or institution.
        </p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Accordion type="multiple" className="space-y-4">
              {fields.map((field, index) => (
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
                          className={`flex w-full items-center justify-between`}
                        >
                          <p className="text-lg font-medium">{field.school}</p>
                          <p className="text-muted-foreground">
                            {dayjs(field.startDate).format("MMM YYYY")} -{" "}
                            {field.endDate
                              ? dayjs(field.endDate).format("MMM YYYY")
                              : "Present"}
                          </p>
                        </div>
                        <p className="text-muted-foreground">
                          {field.degree} in {field.major}
                        </p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="grid grid-cols-2 items-start gap-6">
                        <FormField
                          control={form.control}
                          name={`education.${index}.school`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="School Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.major`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Major</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Computer Science"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Major</FormLabel>
                              <FormControl>
                                <Select
                                  defaultValue={DegreeOptions[0]}
                                  value={field.value}
                                  onValueChange={field.onChange}
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
                            render={({ field }) => (
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
                                        {field.value
                                          ? dayjs(field.value).format(
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
                                        selected={field.value ?? undefined}
                                        captionLayout="dropdown"
                                        onSelect={field.onChange}
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
                            render={({ field }) => (
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
                                          justify-between rounded-lg font-normal
                                        `}
                                      >
                                        {field.value
                                          ? dayjs(field.value).format(
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
                                        selected={field.value ?? undefined}
                                        captionLayout="dropdown"
                                        onSelect={field.onChange}
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
              ))}
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
