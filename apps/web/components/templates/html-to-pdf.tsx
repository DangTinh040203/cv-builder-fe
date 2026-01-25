"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

export interface HtmlToPdf {
  content: string;
  style: React.CSSProperties;
}

const HtmlToPdf = ({ content = "" }: HtmlToPdf) => {
  const { isHTML } = usePDFComponentsAreHTML();

  if (!content.trim()) return null;

  if (isHTML) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose m-0 p-0"
      />
    );
  }

  return <Html>{content}</Html>;
};

export default HtmlToPdf;
