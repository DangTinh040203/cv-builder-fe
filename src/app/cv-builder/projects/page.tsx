"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Route } from "@/constants/route.constant";
import { resumeSelector } from "@/stores/features/resume.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const Projects = () => {
  const { resume } = useAppSelector(resumeSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  if (!resume) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">
          Tell us about your most important project
        </h2>
        <p>We&apos;ll start with your latest project and work backward.</p>
      </div>

      <div>
        <Accordion
          type="multiple"
          className="space-y-6"
          value={openItems}
          onValueChange={(values) => setOpenItems(values)}
        >
          <AccordionItem
            value="item-1"
            className={`flex-1 space-y-4 rounded-lg !border p-4 shadow-lg`}
          >
            <AccordionTrigger
              className={`m-0 w-full border-none! p-0 outline-none!`}
            >
              <div className="w-full">
                <div className={`flex w-full items-center justify-between`}>
                  <p className="text-lg font-medium">
                    TestArchitect Cloud - AGEST VIETNAM
                  </p>
                  <p className="text-muted-foreground">22 Feb, 2025</p>
                </div>
                <p className="text-muted-foreground">Fullstack Developer</p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              consequuntur amet asperiores esse quo nesciunt deserunt iste,
              perspiciatis totam nostrum cupiditate expedita provident id natus
              eveniet fugiat rem incidunt quae!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          size="lg"
          className="h-12 min-w-40"
          type="button"
          variant="outline"
          onClick={() => router.push(Route.CvBuilderExperience)}
        >
          <ArrowLeft />
          Back Step
        </Button>

        <Button
          size="lg"
          className="h-12 min-w-40"
          type="submit"
          disabled={loading}
        >
          Next Step {loading ? <Spinner /> : <ArrowRight />}
        </Button>
      </div>
    </div>
  );
};

export default Projects;
