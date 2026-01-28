import Template01 from "@/components/templates/template-01";
import { type TemplateProp } from "@/components/templates/template-wrapper";

export enum TemplateKey {
  template01,
}

export const TEMPLATES: Record<TemplateKey, React.FC<TemplateProp>> = {
  [TemplateKey.template01]: Template01,
};
