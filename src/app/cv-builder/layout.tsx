"use client";
import type React from "react";
import { type PropsWithChildren } from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";
import { Button } from "@/components/ui/button";

const CvBuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <CvBuilderSidebar />

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="container-full mx-auto max-w-4xl">
          <div className="mt-10">
            <Button variant={"link"}>Go Back</Button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CvBuilderLayout;
