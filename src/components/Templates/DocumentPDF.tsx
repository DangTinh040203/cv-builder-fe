"use client";
import { type ReactElement } from "react";
import { Document } from "@rawwee/react-pdf-html";
import { type DocumentProps } from "@react-pdf/renderer";

interface ExportPDFProps {
  document: ReactElement<DocumentProps>;
}

const DocumentPDF = ({ document }: ExportPDFProps) => {
  return <Document>{document}</Document>;
};

export default DocumentPDF;
