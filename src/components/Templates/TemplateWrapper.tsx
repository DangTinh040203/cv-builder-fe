"use client";
import { type DocumentProps } from "@react-pdf/renderer";
import type React from "react";
import { type ReactElement, useMemo } from "react";
import { useMeasure } from "react-use";

import DocumentPDF from "@/components/Templates/DocumentPDF";

export interface TemplateSize {
  width: number;
  height: number;
}

export const A4_SIZE: TemplateSize = {
  width: 21,
  height: 29.7,
} as const;

export const DEFAULT_DOCUMENT_SIZE: TemplateSize = {
  width: 500,
  height: (A4_SIZE.height * 500) / A4_SIZE.width,
};

interface TemplateWrapperProps {
  document: ReactElement<DocumentProps>;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ document }) => {
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  const size = useMemo(() => {
    return {
      height:
        (DEFAULT_DOCUMENT_SIZE.height * bounds.width) /
        DEFAULT_DOCUMENT_SIZE.width,
      scale: bounds.width / DEFAULT_DOCUMENT_SIZE.width,
    };
  }, [bounds.width]);

  return (
    <div
      className={`
        group scrollbar-none relative w-full overflow-y-scroll rounded
        shadow-xl
      `}
      ref={ref}
      style={{ height: size.height, maxHeight: size.height }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: DEFAULT_DOCUMENT_SIZE.width,
          height: DEFAULT_DOCUMENT_SIZE.height,
          transform: `scale(${size.scale})`,
        }}
      >
        <DocumentPDF document={document} />
      </div>
    </div>
  );
};

export default TemplateWrapper;
