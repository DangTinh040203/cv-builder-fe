"use client";
import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { Html } from "react-pdf-html";

interface HtmlToPdfProps {
  content?: string;
  style?: React.CSSProperties;
}

const HtmlToPdf = ({ content = "", style = {} }: HtmlToPdfProps) => {
  const { isHTML } = usePDFComponentsAreHTML();

  if (!content.trim()) return null;

  return isHTML ? (
    <div style={style} dangerouslySetInnerHTML={{ __html: content }} />
  ) : (
    <Html
      style={{
        ...style,
        a: { textDecoration: "underline" },
        marginTop: -6,
        marginBottom: -6,
      }}
    >
      {content}
    </Html>
  );
};

export default HtmlToPdf;
