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
    <div
      className={`
        [&_a]:mx-[1px] [&_a]:text-blue-600 [&_a]:underline
        [&_em]:italic
        [&_li]:mb-1
        [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-6
        [&_p]:mb-3
        [&_p:last-child]:mb-0
        [&_strong]:font-semibold
        [&_u]:underline
        [&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-6
      `}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : (
    <Html
      style={{
        ...style,
        a: { color: "blue", textDecoration: "underline" },
        ul: {
          listStyleType: "disc",
          paddingLeft: 16,
          marginBottom: 4,
        },
        li: { marginBottom: 2 },
      }}
    >
      {content}
    </Html>
  );
};

export default HtmlToPdf;
