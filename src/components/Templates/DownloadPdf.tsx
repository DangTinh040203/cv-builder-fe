"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import Template1 from "@/components/Templates/1";
import DocumentPDF from "@/components/Templates/DocumentPDF";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeSelector } from "@/stores/features/resume.slice";
import { useAppSelector } from "@/stores/store";

const DownloadPdf = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { setHtml } = usePDFComponentsAreHTML();
  const { templateFormat } = useGetTemplates();
  const { resume } = useAppSelector(resumeSelector);

  const handleDownload = () => {
    if (!resume) return;
    setHtml(false);
    setIsProcessing(true);

    setTimeout(() => {
      setShouldRender(true);
    }, 0);
  };

  useEffect(() => {
    if (!shouldRender || !resume) return;

    const generate = async () => {
      try {
        const doc = (
          <DocumentPDF
            document={
              <Template1 templateFormat={templateFormat} resume={resume} />
            }
          />
        );

        const blob = await pdf(doc).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `resume-${Date.now()}.pdf`;
        link.click();

        URL.revokeObjectURL(blobUrl);
      } catch {
      } finally {
        setHtml(true);
        setIsProcessing(false);
        setShouldRender(false);
      }
    };

    void generate();
  }, [shouldRender, resume, templateFormat, setHtml]);

  return (
    <Button disabled={isProcessing} onClick={handleDownload} size="lg">
      {isProcessing ? <Spinner /> : <Download />}
      Download
    </Button>
  );
};

export default DownloadPdf;
