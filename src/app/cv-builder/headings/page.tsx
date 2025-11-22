"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Plus, RefreshCcw } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import UploadAvatar from "@/components/CvBuilderHeadingScreen/UploadAvatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InformationInput from "@/components/ui/information-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { RESUME_INFORMATION_SEED_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, updateResume } from "@/stores/features/resume.slice";
import { userSelector } from "@/stores/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { type Information } from "@/types/resume.type";

const formSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is too short")
    .max(200, "Title is too long, max 200 characters"),
  subTitle: z
    .string("Subtitle is required")
    .min(1, "Subtitle is too short")
    .max(200, "Subtitle is too long, max 200 characters"),
});

const CvBuilderHeading = () => {
  const [avatarSelected, setAvatarSelected] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector(userSelector);
  const { resume } = useAppSelector(resumeSelector);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subTitle: "",
    },
  });

  useEffect(() => {
    if (resume) {
      form.reset({
        title: resume.title,
        subTitle: resume.subTitle,
      });
    }
  }, [resume]);

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setAvatarSelected(file);
  };

  const handleRemoveInformation = (order: number) => {
    if (!resume) return;

    dispatch(
      updateResume({
        information: resume.information.filter((info) => info.order !== order),
      }),
    );
  };

  const handleAddInformation = () => {
    if (!resume) return;

    const newInformation: Information = {
      label: "Label",
      value: "Value",
      order:
        resume.information.length > 0
          ? Math.max(...resume.information.map((info) => info.order)) + 1
          : 1,
    };

    dispatch(
      updateResume({
        information: [...resume.information, newInformation],
      }),
    );
  };

  const handleChangeLabel = (order: number, label: string) => {
    if (!resume) return;

    const updatedInformation = resume.information.map((info) =>
      info.order === order ? { ...info, label } : info,
    );

    dispatch(
      updateResume({
        information: updatedInformation,
      }),
    );
  };

  const handleChangeValue = (order: number, value: string) => {
    if (!resume) return;

    const updatedInformation = resume.information.map((info) =>
      info.order === order ? { ...info, value } : info,
    );

    dispatch(
      updateResume({
        information: updatedInformation,
      }),
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resume) return;
    const existBlankInformation = resume.information.some(
      (info) => !info.label || !info.value,
    );

    if (existBlankInformation) {
      toast.error("Please fill in all information fields or remove them.");
      return;
    }

    try {
      setLoading(true);
      await resumeService.updateResume(resume._id, {
        ...resume,
        ...values,
        information: resume.information.filter(
          (info) => info.label && info.value,
        ),
      });

      router.push(Route.CvBuilderSummary);
    } catch {
      toast.error("Failed to update resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return !resume ? (
    <div className="flex min-h-96 w-full items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <>
      {user && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">
                What’s the best way for employers to contact you?
              </h2>
              <p>We suggest including an email and phone number.</p>
            </div>

            <div className="grid grid-cols-5 gap-8">
              {resume.avatar && (
                <UploadAvatar
                  handleSelectAvatar={handleSelectAvatar}
                  avatar={
                    avatarSelected
                      ? URL.createObjectURL(avatarSelected)
                      : resume.avatar
                  }
                />
              )}

              <div className="col-span-4 grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Resume Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (resume) {
                                dispatch(
                                  updateResume({
                                    title: e.target.value,
                                  }),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Resume Subtitle
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Professional"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (resume) {
                                dispatch(
                                  updateResume({
                                    subTitle: e.target.value,
                                  }),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-12 space-y-2">
                  <Label className="font-bold">Information</Label>
                  <div className="space-y-4">
                    {resume.information.map((info) => (
                      <InformationInput
                        key={info.order}
                        label={info.label}
                        value={info.value}
                        handleChangeLabel={(e) => {
                          handleChangeLabel(info.order, e.target.value);
                        }}
                        handleChangeValue={(e) => {
                          handleChangeValue(info.order, e.target.value);
                        }}
                        handleDelete={() => handleRemoveInformation(info.order)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    className="min-w-32"
                    variant={"outline"}
                    onClick={handleAddInformation}
                  >
                    <Plus /> Add More
                  </Button>
                  <Button
                    type="button"
                    className="min-w-28"
                    variant={"outline"}
                    onClick={() => {
                      dispatch(
                        updateResume({
                          information: RESUME_INFORMATION_SEED_DATA,
                        }),
                      );
                    }}
                  >
                    <RefreshCcw /> Reset
                  </Button>
                </div>

                <div className="col-span-12 flex justify-end">
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
          </form>
        </Form>
      )}
    </>
  );
};

export default CvBuilderHeading;
