"use client";
import { Button } from "@shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/components/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui/components/tabs";
import { Textarea } from "@shared/ui/components/textarea";
import {
  Brain,
  ClipboardList,
  ScanSearch,
  Sparkles,
  Upload,
} from "lucide-react";
import React from "react";

const MatchingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="border-primary border shadow-xl"
        >
          <Brain /> JD Matching
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-2">
        <div className="space-y-2">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={20} /> JD Matching Analysis
          </DialogTitle>
          <DialogDescription>
            Provide a job description to see how well your CV matches.
          </DialogDescription>
        </div>

        <Tabs defaultValue="text" className="space-y-2">
          <TabsList className="mx-auto flex items-center justify-center border">
            <TabsTrigger className="px-10" value="text">
              <ClipboardList /> Text JD
            </TabsTrigger>
            <TabsTrigger className="px-10" value="file">
              <Upload /> Upload JD
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Textarea
              className="h-64 resize-none overflow-y-auto"
              placeholder="Paste your JD here..."
            />
          </TabsContent>

          <TabsContent value="file">
            <div
              className={`
                border-primary flex h-64 cursor-pointer flex-col items-center
                justify-center gap-2 rounded-lg border border-dashed px-3 py-2
              `}
            >
              <div
                className={`
                  bg-primary/10 flex h-12 w-12 items-center justify-center
                  rounded-full
                `}
              >
                <Upload className="text-primary h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload JD file</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  PDF, Word (.doc, .docx), or Text file • Max 10MB
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button>
          <ScanSearch /> Analyze Matching
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MatchingDialog;
