"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { Label } from "@shared/ui/components/label";
import { cn } from "@shared/ui/lib/utils";
import { FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import BuilderNavigation from "@/components/builder-screen/builder-navigation";
import Editor from "@/components/builder-screen/editor";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch } from "@/stores/store";

interface SummaryFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const SummaryForm = ({ onNext, onBack }: SummaryFormProps) => {
  const dispatch = useAppDispatch();
  const { sync, isSyncing, resume } = useSyncResume();
  const [value, setValue] = useState(resume?.overview || "");
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resume?.overview) {
      setValue(resume.overview);
    }
  }, [resume?.overview]);

  const handleChange = (content: string) => {
    setValue(content);
    dispatch(updateResume({ overview: content }));
  };

  // Simple submit: sync Redux state to backend
  const handleNext = async () => {
    const success = await sync();
    if (success) {
      onNext?.();
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-xl",
        `
          bg-white
          dark:bg-slate-900
        `,
        `
          ring-1 ring-slate-200/50
          dark:ring-slate-700/50
        `,
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {/* Decorative gradient orb */}
      <div
        className={`
          pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full
          bg-linear-to-br from-purple-400/20 to-pink-400/20 blur-3xl
        `}
      />
      <div
        className={`
          pointer-events-none absolute -bottom-10 -left-10 h-32 w-32
          rounded-full bg-linear-to-tr from-blue-400/10 to-purple-400/10
          blur-2xl
        `}
      />

      <CardHeader className="relative pb-6">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl",
              `
                bg-linear-to-br from-purple-500 to-purple-600 shadow-lg
                shadow-purple-500/25
              `,
              `
                transition-all duration-300
                hover:scale-110 hover:shadow-purple-500/40
              `,
              "group",
            )}
          >
            <FileText
              className={`
                h-5 w-5 text-white transition-transform duration-300
                group-hover:scale-110
              `}
            />
            <Sparkles
              className={`
                absolute -top-1 -right-1 h-3 w-3 text-yellow-400 opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              `}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={`
                bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text
                text-transparent
                dark:from-white dark:to-gray-400
              `}
            >
              Professional Summary
            </span>
            <span className="text-muted-foreground text-xs font-normal">
              Tell employers about your experience and skills
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6 pb-8">
        <div
          className={cn(
            "space-y-3 transition-all delay-100 duration-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <div className="flex items-center justify-between">
            <Label
              className={cn(
                `
                  flex items-center gap-2 text-xs font-semibold tracking-wider
                  uppercase
                `,
                `
                  text-gray-500 transition-colors duration-300
                  dark:text-gray-400
                `,
                isFocused && "text-purple-600 dark:text-purple-400",
              )}
            >
              <span
                className={cn(
                  `
                    inline-block h-1.5 w-1.5 rounded-full bg-gray-300
                    transition-all duration-300
                  `,
                  isFocused && "bg-purple-500 shadow-sm shadow-purple-500/50",
                )}
              />
              Professional Summary
            </Label>

            {value && (
              <span className="animate-fade-in text-muted-foreground text-xs">
                {value.replace(/<[^>]*>/g, "").length} characters
              </span>
            )}
          </div>

          <div
            className={cn(
              "relative rounded-xl transition-all duration-300",
              "ring-2 ring-transparent",
              isFocused && "ring-purple-500/20 shadow-lg shadow-purple-500/10",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div
              className={cn(
                `
                  absolute inset-0 rounded-xl bg-linear-to-r from-purple-500/10
                  via-pink-500/10 to-blue-500/10 opacity-0 transition-opacity
                  duration-300
                `,
                isFocused && "opacity-100",
              )}
            />
            <Editor
              value={value}
              onChange={handleChange}
              placeholder="Write a brief summary about yourself..."
            />
          </div>

          <div
            className={cn(
              `
                flex items-start gap-2 rounded-lg bg-linear-to-r from-amber-50
                to-orange-50 p-3
                dark:from-amber-950/30 dark:to-orange-950/30
              `,
              `
                border border-amber-200/50
                dark:border-amber-800/30
              `,
              "transition-all delay-200 duration-500",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0",
            )}
          >
            <span className="mt-0.5 text-amber-500">💡</span>
            <p
              className={`
                text-xs leading-relaxed text-amber-700
                dark:text-amber-300
              `}
            >
              <span className="font-medium">Pro tip:</span> Use formatting to
              highlight key achievements and skills. Keep your summary between
              2-4 sentences for maximum impact.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "transition-all delay-300 duration-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <BuilderNavigation
            onBack={onBack}
            onNext={handleNext}
            loading={isSyncing}
            disableBack={!onBack || isSyncing}
            disableNext={!onNext || isSyncing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryForm;
