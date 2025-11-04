"use client";

import Template1 from "@/components/Templates/1";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";

const HomePage = () => {
  return (
    <div className="container my-4 space-y-2">
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
