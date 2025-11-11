"use client";

import { useRouter } from "nextjs-toploader/app";

import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { RESUME_MOCK_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import useGetTemplates from "@/hooks/useGetTemplates";
import { updateTemplateSelected } from "@/stores/features/template.slice";
import { useAppDispatch } from "@/stores/store";

const HomePage = () => {
  const { templates, templateFormat } = useGetTemplates();

  const router = useRouter();
  const dispatch = useAppDispatch();

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
        {Object.keys(templates).map((key) => {
          const Template = templates[key];

          return (
            <div className="group relative" key={key}>
              {
                <TemplateWrapper
                  document={
                    <Template
                      templateFormat={templateFormat}
                      resume={RESUME_MOCK_DATA}
                    />
                  }
                />
              }

              <Button
                onClick={() => {
                  dispatch(updateTemplateSelected(key));
                  router.push(Route.CvBuilderHeadings);
                }}
                size={"lg"}
                className={`
                  absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full
                  px-6 opacity-0 transition-all duration-500
                  group-hover:opacity-100
                `}
              >
                Use this Template
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
