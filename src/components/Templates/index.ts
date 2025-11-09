import { type Format } from "@/stores/features/template.slice";
import { type Template } from "@/types/template.type";

export interface TemplateProp {
  templateFormat: Format;
  data: Template;
}
