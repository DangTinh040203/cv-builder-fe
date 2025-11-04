"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

interface HtmlToPdfProps {
  content: string;
  style: React.CSSProperties;
}

const HtmlToPdf = ({ content, style }: HtmlToPdfProps) => {
  const { isHTML } = usePDFComponentsAreHTML();

  return isHTML ? (
    <div
      className="prose prose-sm list-inside list-disc"
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : (
    <Html style={style}>{content}</Html>
  );
};

export default HtmlToPdf;
