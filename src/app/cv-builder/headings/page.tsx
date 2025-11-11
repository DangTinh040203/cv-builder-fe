"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { v4 as uuid } from "uuid";
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
import { DEFAULT_INFORMATION } from "@/constants";
import { resumeSelector } from "@/stores/features/resume.slice";
import { userSelector } from "@/stores/features/user.slice";
import { useAppSelector } from "@/stores/store";
import { type Information } from "@/types/template.type";

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
  const [information, setInformation] = useState<Array<Information>>([]);

  const { user } = useAppSelector(userSelector);
  const { resume } = useAppSelector(resumeSelector);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Your Name",
      subTitle: "Professional",
    },
  });

  useEffect(() => {
    if (resume) {
      form.reset({
        title: resume.title,
        subTitle: resume.subTitle,
      });

      setInformation(resume.information);
    }
  }, [form, resume]);

  const handleRemoveInformation = (order: number) => {
    setInformation((prev) => prev.filter((info) => info.order !== order));
  };

  const handleAddInformation = () => {
    const maxOrder = information.reduce(
      (max, info) => (info.order > max ? info.order : max),
      0,
    );

    setInformation((prev) => [
      ...prev,
      { order: maxOrder + 1, label: "Label", value: "Value" },
    ]);
  };

  const handleChangeLabel = (order: number, label: string) => {
    setInformation((prev) =>
      prev.map((info) =>
        info.order === order ? { ...info, label: label } : info,
      ),
    );
  };

  const handleChangeValue = (order: number, value: string) => {
    setInformation((prev) =>
      prev.map((info) =>
        info.order === order ? { ...info, value: value } : info,
      ),
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`
                      relative aspect-square w-full overflow-hidden rounded-md
                    `}
                  >
                    <Image
                      src={resume.avatar}
                      fetchPriority="high"
                      quality={100}
                      sizes="auto"
                      alt=""
                      fill
                      priority
                    />
                  </div>
                  <Button variant={"outline"} size={"sm"}>
                    <Upload /> Upload Photo
                  </Button>
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
                          <Input placeholder="Your Name" {...field} />
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
                          <Input placeholder="Professional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {information.length > 0 && (
                  <div className="col-span-12 space-y-2">
                    <Label className="font-bold">Information</Label>
                    <div className="space-y-4">
                      {information.map((info) => (
                        <div
                          key={info.order}
                          className="grid grid-cols-12 gap-4"
                        >
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
                              onClick={() =>
                                handleRemoveInformation(info.order)
                              }
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    className="min-w-32"
                    variant={"outline"}
                    onClick={() => setInformation(DEFAULT_INFORMATION)}
                  >
                    <RefreshCcw /> Reset to Default
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
