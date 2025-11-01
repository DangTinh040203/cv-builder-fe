"use client";
import { Document } from "@rawwee/react-pdf-html";
import { type DocumentProps } from "@react-pdf/renderer";
import { type ReactElement } from "react";

interface ExportPDFProps {
  document: ReactElement<DocumentProps>;
}

const DocumentPDF = ({ document }: ExportPDFProps) => {
  return <Document>{document}</Document>;
};

export default DocumentPDF;
