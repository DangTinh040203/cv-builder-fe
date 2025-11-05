"use client";

import Link from "next/link";

import Template1 from "@/components/Templates/1";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { TEMPLATE_MOCK_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
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
        <div className="group relative">
          <TemplateWrapper
            document={
              <Template1
                templateFormat={templateFormat}
                data={TEMPLATE_MOCK_DATA}
              />
            }
          />

          <Link href={Route.CvBuilderHeadings}>
            <Button
              className={`
                absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full
                px-6 opacity-0 transition-all duration-500
                group-hover:opacity-100
              `}
            >
              Use this Template
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
