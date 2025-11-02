"use client";

import { usePDFComponentsAreHTML } from "@rawwee/react-pdf-html";
import { usePDF } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

import Template1 from "@/components/Templates/1";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { isHTML, setHtml } = usePDFComponentsAreHTML();
  const [download, setDownload] = useState(false);

  return (
    <div className="container my-4">
      <Button>Download</Button>
      <div
        className={`
          grid grid-cols-2 gap-4
          md:grid-cols-3
          lg:grid-cols-4
          2xl:grid-cols-5
        `}
      >
        <TemplateWrapper document={<Template1 />} />
        <TemplateWrapper document={<Template1 />} />
        <TemplateWrapper document={<Template1 />} />
        <TemplateWrapper document={<Template1 />} />
        <TemplateWrapper document={<Template1 />} />
      </div>
    </div>
  );
};

export default HomePage;
