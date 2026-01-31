"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

export interface HtmlToPdf {
  content: string;
  style: React.CSSProperties;
}

type HtmlToPdfProps = Partial<HtmlToPdf>;

const HtmlToPdf = ({ content = "", style = {} }: HtmlToPdfProps) => {
  const { isHTML } = usePDFComponentsAreHTML();

  if (!content.trim()) return null;

  // Replace &nbsp; with regular space to allow text wrapping
  const normalizedContent = content.replace(/&nbsp;/g, " ");

  if (isHTML) {
    return (
      <div
        style={style}
        className="prose m-0 max-w-full p-0"
        dangerouslySetInnerHTML={{ __html: normalizedContent }}
      />
    );
  }

  return <Html style={style}>{normalizedContent}</Html>;
};

export default HtmlToPdf;
