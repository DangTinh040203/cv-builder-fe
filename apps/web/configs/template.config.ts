import Template01 from "@/components/templates/template-01";
import Template02 from "@/components/templates/template-02";
import { type TemplateProp } from "@/components/templates/template-wrapper";
import {
  defaultSectionOrder,
  type SectionType,
} from "@/stores/features/template.slice";

export const TemplateKey = {
  template01: "template-01",
  template02: "template-02",
} as const;

export interface TemplateProfile {
  id: string;
  name: string;
  component: React.FC<TemplateProp>;
  defaultSectionOrder: SectionType[];
}

export const TEMPLATES: Record<string, TemplateProfile> = {
  [TemplateKey.template01]: {
    id: TemplateKey.template01,
    name: "Classic",
    component: Template01,
    defaultSectionOrder: defaultSectionOrder,
  },
  [TemplateKey.template02]: {
    id: TemplateKey.template02,
    name: "Modern",
    component: Template02,
    defaultSectionOrder: defaultSectionOrder,
  },
};
