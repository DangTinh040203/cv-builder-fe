"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

export interface HtmlToPdf {
  content: string;
  style: React.CSSProperties;
}

type HtmlToPdfProps = Partial<HtmlToPdf>;
const bufferStyle: React.CSSProperties = {
  marginTop: -8,
};

const HtmlToPdf = ({ content = "", style = {} }: HtmlToPdfProps) => {
  const { isHTML } = usePDFComponentsAreHTML();

  if (!content.trim()) return null;

  return isHTML ? (
    <div
      style={style}
      className="no-tailwindcss"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : (
    <Html style={{ ...style, ...bufferStyle }}>{content}</Html>
  );
};

export default HtmlToPdf;
