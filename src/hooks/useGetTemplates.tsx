"use client";
import { type FC, useMemo } from "react";

import { type TemplateProp } from "@/components/Templates";
import Template1 from "@/components/Templates/1";
import {
  templateFormatSelector,
  templateSelectedSelector,
} from "@/stores/features/template.slice";
import { useAppSelector } from "@/stores/store";

const useGetTemplates = () => {
  const templateSelected = useAppSelector(templateSelectedSelector);
  const templateFormat = useAppSelector(templateFormatSelector);

  const templates = useMemo<{ [key: string]: FC<TemplateProp> }>(() => {
    return {
      1: Template1,
    };
  }, []);

  return { templates, templateSelected, templateFormat };
};

export default useGetTemplates;
