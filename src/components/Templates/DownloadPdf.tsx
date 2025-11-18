"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";

import DocumentPDF from "@/components/Templates/DocumentPDF";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeService } from "@/services/resume.service";
import { resumeSelector } from "@/stores/features/resume.slice";
import { userSelector } from "@/stores/features/user.slice";
import { useAppSelector } from "@/stores/store";

const DownloadPdf = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { isHTML, setHtml } = usePDFComponentsAreHTML();
  const { templateFormat, templateSelected, templates } = useGetTemplates();
  const { resume } = useAppSelector(resumeSelector);
  const { user } = useAppSelector(userSelector);

  const handleDownload = async () => {
    if (!resume) return;
    setHtml(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (isHTML) {
        setShouldRender(true);
        void resumeService.updateResume(resume._id, resume);
      }
    }, 0);
  };

  useEffect(() => {
    if (!shouldRender || !resume || !user || !templateSelected) return;

    const generate = async () => {
      try {
        const Template = templates[templateSelected];

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
      } finally {
        setHtml(true);
        setIsProcessing(false);
        setShouldRender(false);
      }
    };

    void generate();
  }, [
    shouldRender,
    resume,
    templateFormat,
    user,
    templateSelected,
    templates,
    setHtml,
  ]);

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
