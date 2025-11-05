import type React from "react";
import { type PropsWithChildren } from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";

const CvBuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <CvBuilderSidebar />

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="container-full mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
};

export default CvBuilderLayout;
