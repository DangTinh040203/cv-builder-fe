"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  ArrowRight,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
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

  const { user } = useAppSelector(userSelector);
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();

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
        ...resume,
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
        ...resume,
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
        ...resume,
        information: updatedInformation,
      }),
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return !resume ? (
    <div className="flex min-h-96 w-full items-center justify-center">
      <Loader2 className="animate-spin" />
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
                <div
                  className={`
                    group relative aspect-square overflow-hidden rounded-md
                    shadow-xl
                  `}
                >
                  <Label
                    htmlFor="avatar"
                    className={`
                      bg-background/80 absolute top-0 left-0 z-10 flex size-full
                      cursor-pointer items-center justify-center opacity-0
                      transition-all
                      group-hover:opacity-100
                    `}
                  >
                    <Upload size={16} />
                    <Input
                      hidden
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleSelectAvatar}
                    />
                  </Label>

                  <div className={`relative size-full`}>
                    <Image
                      src={
                        avatarSelected
                          ? URL.createObjectURL(avatarSelected)
                          : resume.avatar
                      }
                      fetchPriority="high"
                      quality={100}
                      sizes="auto"
                      className="object-cover"
                      alt=""
                      fill
                      priority
                    />
                  </div>
                </div>
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
                      <div key={info.order} className="grid grid-cols-12 gap-4">
                        <Input
                          placeholder={"Label"}
                          className="col-span-3"
                          value={info.label}
                          onChange={(e) =>
                            handleChangeLabel(info.order, e.target.value)
                          }
                        />

                        <Input
                          className="col-span-8"
                          placeholder={"Value"}
                          value={info.value}
                          onChange={(e) =>
                            handleChangeValue(info.order, e.target.value)
                          }
                        />

                        <div className="flex items-center justify-center">
                          <Button
                            size={"icon"}
                            variant={"secondary"}
                            onClick={() => handleRemoveInformation(info.order)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
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
                </div>

                <div className="col-span-12 flex justify-end">
                  <Button size={"lg"} className="h-12 min-w-40" type="submit">
                    Next Step <ArrowRight />
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
