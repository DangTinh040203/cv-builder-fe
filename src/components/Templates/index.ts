import { type Format } from "@/stores/features/template.slice";
import { type Resume } from "@/types/resume.type";

export interface TemplateProp {
  templateFormat: Format;
  resume: Resume;
}
