"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@shared/ui/components/button";
import { Spinner } from "@shared/ui/components/spinner";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

import { MOCK_RESUMES } from "@/app/(main-layout)/templates/page";
import DocumentPDF from "@/components/templates/document-pdf";
import Template01 from "@/components/templates/Template01";
import { resumeSelector } from "@/stores/features/resume.slice";
import { templateFormatSelector } from "@/stores/features/template.slice";
import { useAppSelector } from "@/stores/store";

const DownloadPdf = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { isHTML, setHtml } = usePDFComponentsAreHTML();

  const { resume } = useAppSelector(resumeSelector);
  const templateFormat = useAppSelector(templateFormatSelector);

  const handleDownload = async () => {
    // if (!resume) return;
    setHtml(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (isHTML) {
        setShouldRender(true);
      }
    }, 0);
  };

  useEffect(() => {
    const resume = MOCK_RESUMES[0]!;

    if (!shouldRender || !resume) return;

    const generate = async () => {
      try {
        const doc = (
          <DocumentPDF
            document={
              <Template01 templateFormat={templateFormat} resume={resume} />
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
      } catch (error) {
        console.log(error);
        toast.error("Failed to download PDF");
      } finally {
        setHtml(true);
        setIsProcessing(false);
        setShouldRender(false);
      }
    };

    void generate();
  }, [shouldRender, resume, templateFormat, setHtml]);

  return (
    <Button
      disabled={isProcessing}
      onClick={handleDownload}
      className="shadow-xl"
      size="lg"
    >
      {isProcessing ? <Spinner /> : <Download />}
      Download
    </Button>
  );
};

export default DownloadPdf;
