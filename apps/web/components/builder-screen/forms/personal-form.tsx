"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/form";
import { Input } from "@shared/ui/components/input";
import { Label } from "@shared/ui/components/label";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import BuilderNavigation from "@/components/builder-screen/builder-navigation";
import { useService } from "@/hooks/use-http";
import { ResumeService } from "@/services/resume.service";
import {
  resumeSelector,
  setResume,
  updateResume,
} from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

interface PersonalFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const PersonalForm = ({ onNext, onBack }: PersonalFormProps) => {
  const dispatch = useAppDispatch();
  const { resume } = useAppSelector(resumeSelector);
  const resumeService = useService(ResumeService);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: resume?.title || "",
      subTitle: resume?.subTitle || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!resume) return;

    setIsSubmitting(true);
    try {
      const updatedResume = await resumeService.updateResume(resume.id, {
        title: values.title,
        subTitle: values.subTitle,
        information: resume.information.map(({ label, value }) => ({
          label,
          value,
        })),
      });
      dispatch(setResume(updatedResume));
      onNext?.();
    } catch {
      toast.error("Failed to update personal information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: "title" | "subTitle", value: string) => {
    dispatch(updateResume({ [field]: value }));
  };

  const contactItems = resume?.information || [];

  const updateContactItem = (
    id: string,
    field: "label" | "value",
    value: string,
  ) => {
    const newItems = contactItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    dispatch(updateResume({ information: newItems }));
  };

  const addContactItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      label: "Label",
      value: "Value",
      resumeId: resume?.id || "",
    };
    dispatch(updateResume({ information: [...contactItems, newItem] }));
  };

  const removeContactItem = (id: string) => {
    const newItems = contactItems.filter((item) => item.id !== id);
    dispatch(updateResume({ information: newItems }));
  };

  if (!resume) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 border-border/50 gap-0 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div
              className={`
                bg-primary/10 flex h-8 w-8 items-center justify-center
                rounded-lg
              `}
            >
              <User className="text-primary h-4 w-4" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                {/* Title & Subtitle */}
                <div
                  className={`
                    grid gap-4
                    sm:grid-cols-2
                  `}
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`
                            text-muted-foreground text-xs font-medium
                            tracking-wide uppercase
                          `}
                        >
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Senior Software Engineer"
                            className="bg-background/50 rounded-xl"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange("title", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`
                            text-muted-foreground text-xs font-medium
                            tracking-wide uppercase
                          `}
                        >
                          Subtitle
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Building scalable web applications"
                            className="bg-background/50 rounded-xl"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange("subTitle", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Items - Dynamic Key-Value List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    className={`
                      text-muted-foreground text-xs font-medium tracking-wide
                      uppercase
                    `}
                  >
                    Contact Information
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addContactItem}
                    className="h-7 gap-1 text-xs"
                    type="button"
                  >
                    <Plus className="h-3 w-3" />
                    Add Item
                  </Button>
                </div>

                {contactItems.length === 0 ? (
                  <div
                    className={`
                      border-border text-muted-foreground flex min-h-56
                      items-center justify-center rounded-lg border
                      border-dashed text-center
                    `}
                  >
                    <div>
                      <p className="text-sm">No contact items added yet</p>
                      <p className="mt-1 text-xs">
                        {`Click "Add Item" to add email, phone, location, etc.`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {contactItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`
                            bg-muted/30 border-border/50 flex items-center gap-4
                            rounded-lg border p-2
                          `}
                        >
                          <Input
                            value={item.label}
                            onChange={(e) =>
                              updateContactItem(
                                item.id,
                                "label",
                                e.target.value,
                              )
                            }
                            placeholder="Label (e.g. Email)"
                            className="bg-background/50 h-10 w-1/3 rounded-lg"
                          />
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              updateContactItem(
                                item.id,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder="Value"
                            className="bg-background/50 h-10 flex-1 rounded-lg"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-10 shrink-0 rounded-sm"
                            onClick={() => removeContactItem(item.id)}
                            type="button"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              <BuilderNavigation
                onBack={onBack}
                disableBack={!onBack}
                loading={isSubmitting}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalForm;
