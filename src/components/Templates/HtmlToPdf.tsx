"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

export interface HtmlToPdf {
  content: string;
  style: React.CSSProperties;
}

type HtmlToPdfProps = Partial<HtmlToPdf>;

const BUFFER_STYLE: React.CSSProperties = { marginTop: 4 };

const PDF_STYLE_OVERRIDES = {
  p: { margin: 0, padding: 0 },
  div: { margin: 0, padding: 0 },
  li: { margin: 0, padding: 0 },
  ul: { margin: 0, padding: 0 },
  ol: { margin: 0, padding: 0 },
  h1: { margin: 0, padding: 0 },
  h2: { margin: 0, padding: 0 },
  h3: { margin: 0, padding: 0 },
  h4: { margin: 0, padding: 0 },
  h5: { margin: 0, padding: 0 },
  h6: { margin: 0, padding: 0 },
  span: { margin: 0, padding: 0 },
};

const HtmlToPdf = ({ content = "", style = {} }: HtmlToPdfProps) => {
  const { isHTML } = usePDFComponentsAreHTML();

  if (!content.trim()) return null;

  const combinedStyle: React.CSSProperties = { ...BUFFER_STYLE, ...style };

  if (isHTML) {
    return (
      <div
        style={combinedStyle}
        className="no-tailwindcss"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <Html style={combinedStyle} stylesheet={PDF_STYLE_OVERRIDES}>
      {content}
    </Html>
  );
};

export default HtmlToPdf;
