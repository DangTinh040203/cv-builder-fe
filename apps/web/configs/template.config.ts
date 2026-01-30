import Template01 from "@/components/templates/template-01";
import { type TemplateProp } from "@/components/templates/template-wrapper";

export const TemplateKey = {
  template01: "template-01",
} as const;

export const TEMPLATES: Record<string, React.FC<TemplateProp>> = {
  [TemplateKey.template01]: Template01,
};
