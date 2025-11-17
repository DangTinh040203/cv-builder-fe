export enum Route {
  Home = "/",
  SignIn = "/sign-in",
  SignUp = "/sign-up",
  VerifyOtp = "/verify-otp",

  CvBuilderHeadings = "/cv-builder/headings",
  CvBuilderSummary = "/cv-builder/summary",
  CvBuilderSkills = "/cv-builder/skills",
  CvBuilderExperience = "/cv-builder/experience",
  CvBuilderEducation = "/cv-builder/education",
  CvBuilderProjects = "/cv-builder/projects",
}

interface SidebarItem {
  label: string;
  href: Route;
}

export const SIDEBAR_ROUTES: SidebarItem[] = [
  {
    label: "Headings",
    href: Route.CvBuilderHeadings,
  },
  {
    label: "Summary",
    href: Route.CvBuilderSummary,
  },
  {
    label: "Skills",
    href: Route.CvBuilderSkills,
  },
  {
    label: "Education",
    href: Route.CvBuilderEducation,
  },
  {
    label: "Experience",
    href: Route.CvBuilderExperience,
  },
  {
    label: "Projects",
    href: Route.CvBuilderProjects,
  },
];
