"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@shared/ui/components/button";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

import DocumentPDF from "@/components/templates/document-pdf";
import { TEMPLATES } from "@/configs/template.config";
import {
  templateFormatSelector,
  templateSelectedSelector,
} from "@/stores/features/template.slice";
import { useAppSelector } from "@/stores/store";
import { type Resume } from "@/types/resume.type";

interface DownloadPdfProps {
  resume: Resume;
}

const DownloadPdf: React.FC<DownloadPdfProps> = ({ resume }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { isHTML, setHtml } = usePDFComponentsAreHTML();

  const templateSelected = useAppSelector(templateSelectedSelector);
  const templateFormat = useAppSelector(templateFormatSelector);

  const handleDownload = async () => {
    if (!templateSelected) {
      toast.error("Please select a template");
      return;
    }

    setHtml(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (isHTML) {
        setShouldRender(true);
      }
    }, 0);
  };

  useEffect(() => {
    if (!shouldRender || !resume || !templateSelected) return;

    const generate = async () => {
      try {
        const Template = TEMPLATES[templateSelected];
        if (!Template) return;

        const doc = (
          <DocumentPDF
            document={
              <Template templateFormat={templateFormat} resume={resume} />
            }
          />
        );

        const blob = await pdf(doc).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${slugify(`${resume.title} ${resume.subTitle}`)}-${dayjs(Date.now()).format("YYYY-MM-DD")}.pdf`;
        link.click();

        URL.revokeObjectURL(blobUrl);
      } catch {
        toast.error("Failed to download PDF");
      } finally {
        setHtml(true);
        setIsProcessing(false);
        setShouldRender(false);
      }
    };

    void generate();
  }, [shouldRender, templateFormat, setHtml, resume, templateSelected]);

  return (
    <Button
      disabled={isProcessing}
      onClick={handleDownload}
      variant="gradient"
      className="shrink-0 gap-2 shadow-xl"
    >
      <Download className="h-4 w-4" />
      Export PDF
    </Button>
  );
};

export default DownloadPdf;
