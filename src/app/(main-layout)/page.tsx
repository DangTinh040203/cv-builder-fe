"use client";

import Template1 from "@/components/Templates/1";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { TEMPLATE_MOCK_DATA } from "@/constants";
import { templateFormatSelector } from "@/stores/features/template.slice";
import { useAppSelector } from "@/stores/store";

const HomePage = () => {
  const templateFormat = useAppSelector(templateFormatSelector);

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
        <TemplateWrapper
          document={
            <Template1
              templateFormat={templateFormat}
              data={TEMPLATE_MOCK_DATA}
            />
          }
        />
      </div>
    </div>
  );
};

export default HomePage;
