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

  if (isHTML) {
    return (
      <div
        style={style}
        className="prose m-0 p-0"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <Html style={style}>{content}</Html>;
};

export default HtmlToPdf;
