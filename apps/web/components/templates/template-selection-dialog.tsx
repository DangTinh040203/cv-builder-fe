"use client";

import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@shared/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/components/dialog";
import { cn } from "@shared/ui/lib/utils";
import { motion } from "framer-motion";
import { PenLine, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface TemplateSelectionDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: "upload" | "scratch", file?: File) => void;
}

export const TemplateSelectionDialog = ({
  isOpen,
  isLoading = false,
  onOpenChange,
  onSelect,
}: TemplateSelectionDialogProps) => {
  const [selectionType, setSelectionType] = useState<
    "upload" | "scratch" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContinue = () => {
    if (selectionType === "scratch") {
      onSelect("scratch");
    } else if (selectionType === "upload") {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect("upload", file);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={`
            w-[90vw] overflow-hidden rounded-xl
            sm:max-w-4xl
          `}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Are you uploading an existing resume?
              </DialogTitle>
              <DialogDescription className="text-lg">
                Just review, edit, and update it with new information
              </DialogDescription>
            </DialogHeader>
          </motion.div>

          {isLoading ? (
            <div
              className={`
                flex min-h-[400px] flex-col items-center justify-center py-8
              `}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mb-8"
              >
                <motion.div
                  className={`
                    absolute inset-0 rounded-full bg-blue-500/20 blur-xl
                  `}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className={`
                    absolute inset-0 rounded-full bg-purple-500/20 blur-xl
                  `}
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
                <div
                  className={`
                    relative flex h-24 w-24 items-center justify-center
                    rounded-2xl border border-white/10 bg-linear-to-br
                    from-blue-500/10 to-purple-500/10 shadow-2xl
                    backdrop-blur-sm
                  `}
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`
                      absolute inset-0 rounded-2xl border-t border-l
                      border-white/20
                    `}
                  />
                  <Upload className="text-primary h-10 w-10 animate-pulse" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 text-center"
              >
                <h3
                  className={`
                    bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text
                    text-2xl font-bold text-transparent
                  `}
                >
                  Analyzing your resume...
                </h3>
                <p className="text-muted-foreground max-w-[300px]">
                  Our AI is extracting your skills, experience, and achievements
                  to build your perfect profile.
                </p>
              </motion.div>

              <div className="mt-8 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-primary h-2 w-2 rounded-full"
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`
                grid grid-cols-1 gap-6 py-8
                md:grid-cols-2
              `}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card
                  className={cn(
                    `
                      hover:border-primary hover:bg-muted/50
                      cursor-pointer transition-all
                    `,
                    selectionType === "upload" &&
                      "bg-primary/5 border-primary ring-1 ring-primary",
                  )}
                  onClick={() => setSelectionType("upload")}
                >
                  <CardContent
                    className={`
                      flex flex-col items-center justify-center gap-4 p-8
                      text-center
                    `}
                  >
                    <div
                      className={`
                        bg-primary/10 flex h-16 w-16 items-center justify-center
                        rounded-full
                      `}
                    >
                      <Upload className="text-primary h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle>Yes, upload from my resume</CardTitle>
                      <CardDescription>
                        We&apos;ll give you expert guidance to fill out your
                        info and enhance your resume, from start to finish
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card
                  className={cn(
                    `
                      hover:border-primary hover:bg-muted/50
                      cursor-pointer transition-all
                    `,
                    selectionType === "scratch" &&
                      "bg-primary/5 border-primary ring-1 ring-primary",
                  )}
                  onClick={() => setSelectionType("scratch")}
                >
                  <CardContent
                    className={`
                      flex flex-col items-center justify-center gap-4 p-8
                      text-center
                    `}
                  >
                    <div
                      className={`
                        bg-primary/10 flex h-16 w-16 items-center justify-center
                        rounded-full
                      `}
                    >
                      <PenLine className="text-primary h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle>No, start from scratch</CardTitle>
                      <CardDescription>
                        We&apos;ll guide you through the whole process so your
                        skills can shine
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectionType || isLoading}
              className="px-8"
            >
              {isLoading ? "Processing..." : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
    </>
  );
};
