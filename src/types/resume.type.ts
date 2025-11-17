export interface Information {
  label: string;
  value: string;
  order: number;
}

export const DegreeOptions = [
  "Associate of Applied Science",
  "Associate of Arts",
  "Associate of Science",
  "BBA",
  "Bachelor of Arts",
  "Bachelor of Science",
  "Enter a different degree",
  "GED",
  "High School Diploma",
  "J.D.",
  "M.D.",
  "MBA",
  "Master of Arts",
  "Master of Science",
  "No Degree",
  "Ph.D.",
];

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date | null;
  order: number;
}

export interface WorkExperience {
  startDate: Date;
  endDate: Date;
  company: string;
  position: string;
  description: string;
  order: number;
}

export interface Project {
  title: string;
  subTitle: string;
  information: Information[];
  order: number;
}

export interface Skill {
  label: string;
  value: string;
  order: number;
}

export enum SectionType {
  WORK_EXPERIENCE = "WORK_EXPERIENCE",
  EDUCATION = "EDUCATION",
  SKILLS = "SKILLS",
  PROJECTS = "PROJECTS",
  CERTIFICATIONS = "CERTIFICATIONS",
  LANGUAGES = "LANGUAGES",
}

export interface ResumeSection<T> {
  order: number;
  type: SectionType;
  content: T;
}

export interface Section {
  educations: ResumeSection<Array<Education>>;
  workExperiences: ResumeSection<Array<WorkExperience>>;
  projects: ResumeSection<Array<Project>>;
  skills: ResumeSection<Array<Skill>>;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  subTitle: string;
  avatar: string | null;
  overview: string;
  information: Information[];
  section: Partial<Section>;
}
