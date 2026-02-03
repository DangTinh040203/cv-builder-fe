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
        style={{ ...style }}
        className="m-0 max-w-full p-0"
        dangerouslySetInnerHTML={{ __html: normalizedContent }}
      />
    );
  }

  // Reset default browser styles that react-pdf-html might apply
  const resetStylesheet = {
    p: { margin: 0, padding: 0 },
    h1: { margin: 0, padding: 0 },
    h2: { margin: 0, padding: 0 },
    h3: { margin: 0, padding: 0 },
    h4: { margin: 0, padding: 0 },
    h5: { margin: 0, padding: 0 },
    h6: { margin: 0, padding: 0 },
    ul: { margin: 0, padding: 0 },
    ol: { margin: 0, padding: 0 },
    li: { margin: 0, padding: 0 },
    div: { margin: 0, padding: 0 },
    body: { margin: 0, padding: 0 },
  };

  return (
    <Html stylesheet={resetStylesheet} style={{ ...style }}>
      {normalizedContent}
    </Html>
  );
};

export default HtmlToPdf;
