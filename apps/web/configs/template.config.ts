import Template01 from "@/components/templates/template-01";
import { type TemplateProp } from "@/components/templates/template-wrapper";

export const TemplateKey = {
  template01: "template01",
} as const;

export const TEMPLATES: Record<
  (typeof TemplateKey)[keyof typeof TemplateKey],
  React.FC<TemplateProp>
> = {
  [TemplateKey.template01]: Template01,
};
