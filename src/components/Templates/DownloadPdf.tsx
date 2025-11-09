"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

import Template1 from "@/components/Templates/1";
import DocumentPDF from "@/components/Templates/DocumentPDF";
import { Button } from "@/components/ui/button";
import { TEMPLATE_MOCK_DATA } from "@/constants";
import useGetTemplates from "@/hooks/useGetTemplates";

const DownloadPdf = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setHtml } = usePDFComponentsAreHTML();
  const [instance, update] = usePDF({});
  const { templateFormat } = useGetTemplates();

  const handleDownload = () => {
    setHtml(false);
    setIsProcessing(true);
    setTimeout(() => {
      const document = (
        <DocumentPDF
          document={
            <Template1
              templateFormat={templateFormat}
              data={TEMPLATE_MOCK_DATA}
            />
          }
        />
      );
      update(document);
    }, 0);
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
    <Button className="px-6" disabled={isProcessing} onClick={handleDownload}>
      Download
    </Button>
  );
};

export default DownloadPdf;
