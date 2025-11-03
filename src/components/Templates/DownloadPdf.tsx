"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

import Template1 from "@/components/Templates/1";
import DocumentPDF from "@/components/Templates/DocumentPDF";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DownloadPdf = () => {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { setHtml } = usePDFComponentsAreHTML();
  const [instance, update] = usePDF({});

  const handleOnClick = () => {
    setIsProcessing(true);

    const document = <DocumentPDF document={<Template1 />} />;
    update(document);
  };

  useEffect(() => {
    if (open) {
      setHtml(false);
    }
  }, [open, setHtml]);

  useEffect(() => {
    if (isProcessing && !instance.loading && instance.url) {
      const a = window.document.createElement("a");
      a.href = instance.url;
      a.download = "document.pdf";
      a.click();

      setIsProcessing(false);
    }
  }, [isProcessing, instance.loading, instance.url]);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button
          className="px-6"
          onClick={() => {
            setOpen(true);
          }}
        >
          Download
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={() => {
          setHtml(true);
          setOpen(false);
        }}
      >
        <Button onClick={handleOnClick}>Download now</Button>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadPdf;
