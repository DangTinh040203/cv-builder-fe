export interface ResumeInformation {
  id: string;
  label: string;
  value: string;
  resumeId: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date | null;
  resumeId: string;
}

export interface Skill {
  id: string;
  label: string;
  value: string;
  resumeId: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  resumeId: string;
}

export interface Project {
  id: string;
  title: string;
  subTitle: string;
  details: string;
  resumeId: string;
}

export interface Resume {
  id: string;
  userId: string;

  title: string;
  subTitle: string;
  overview: string;
  avatar: string | null;

  information: Array<ResumeInformation>;
  educations: Array<Education>;
  skills: Array<Skill>;
  workExperiences: Array<WorkExperience>;
  projects: Array<Project>;

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateResumeDto {
  title?: string;
  subTitle?: string;
  overview?: string;
  avatar?: string | null;
  information?: Array<Omit<ResumeInformation, "id" | "resumeId">>;
  educations?: Array<Omit<Education, "id" | "resumeId">>;
  skills?: Array<Omit<Skill, "id" | "resumeId">>;
  workExperiences?: Array<Omit<WorkExperience, "id" | "resumeId">>;
  projects?: Array<Omit<Project, "id" | "resumeId">>;
}
