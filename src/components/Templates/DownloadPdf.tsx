"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { usePDF } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import Template1 from "@/components/Templates/1";
import DocumentPDF from "@/components/Templates/DocumentPDF";
import { Button } from "@/components/ui/button";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeSelector } from "@/stores/features/resume.slice";
import { useAppSelector } from "@/stores/store";

const DownloadPdf = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setHtml } = usePDFComponentsAreHTML();
  const [instance, update] = usePDF({});
  const { templateFormat } = useGetTemplates();
  const { resume } = useAppSelector(resumeSelector);

  const handleDownload = () => {
    if (resume) {
      setHtml(false);
      setIsProcessing(true);
      setTimeout(() => {
        const document = (
          <DocumentPDF
            document={
              <Template1 templateFormat={templateFormat} resume={resume} />
            }
          />
        );
        update(document);
      }, 0);
    }
  };

  useEffect(() => {
    if (isProcessing && !instance.loading && instance.url) {
      const a = document.createElement("a");
      a.href = instance.url;
      a.download = "document.pdf";
      a.click();

      setHtml(true);
      setIsProcessing(false);
    }
  }, [isProcessing, instance.loading, instance.url, setHtml]);

  return (
    <Button disabled={isProcessing} onClick={handleDownload} size={"lg"}>
      <Download /> Download
    </Button>
  );
};

export default DownloadPdf;
