"use client";

import dynamic from "next/dynamic";

import Template1 from "@/components/Templates/1";
// import DownloadPdf from "@/components/Templates/DownloadPdf";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";

const DownloadPdf = dynamic(
  () => import("@/components/Templates/DownloadPdf"),
  { ssr: false },
);

const HomePage = () => {
  return (
    <div className="container my-4 space-y-2">
      <DownloadPdf />

      <div
        id="templates_list"
        className={`
          grid grid-cols-2 gap-4
          md:grid-cols-3
          lg:grid-cols-4
          2xl:grid-cols-5
        `}
      >
        <TemplateWrapper document={<Template1 />} />
      </div>
    </div>
  );
};

export default HomePage;
