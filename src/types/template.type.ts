export interface Information {
  _id: string;
  label: string;
  value: string;
  order: number;
}

export interface Experience {
  _id: string;
  startDate: Date;
  endDate: Date | null;
  company: string;
  position: string;
  description: string;
  order: number;
}

export interface Education {
  _id: string;
  schoolName: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date | null;
  order: number;
}

export interface Skill {
  _id: string;
  label: string;
  value: string;
}

export interface Project {
  _id: string;
  title: string;
  subTitle: string;
  information: Information[];
  order: number;
}

export interface Template {
  title: string;
  subTitle: string;
  overview: string;

  information: Array<Information>;
  skills: Array<Skill>;
  educations: Array<Education>;
  experiences: Array<Experience>;
  projects: Array<Project>;
}
