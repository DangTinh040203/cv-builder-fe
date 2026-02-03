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
import { PenLine, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface TemplateSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: "upload" | "scratch", file?: File) => void;
}

export const TemplateSelectionDialog = ({
  isOpen,
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              Are you uploading an existing resume?
            </DialogTitle>
            <DialogDescription className="text-lg">
              Just review, edit, and update it with new information
            </DialogDescription>
          </DialogHeader>

          <div
            className={`
              grid grid-cols-1 gap-6 py-8
              md:grid-cols-2
            `}
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
                    We&apos;ll give you expert guidance to fill out your info
                    and enhance your resume, from start to finish
                  </CardDescription>
                </div>
              </CardContent>
            </Card>

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
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectionType}
              className="px-8"
            >
              Next
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
