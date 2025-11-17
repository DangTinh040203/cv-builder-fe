import {
  type Education,
  type Information,
  type Resume,
  SectionType,
  type Skill,
} from "@/types/resume.type";

export const RESUME_INFORMATION_SEED_DATA: Array<Information> = [
  {
    label: "Email",
    value: "your_email@example.com",
    order: 1,
  },
  {
    label: "Phone",
    value: "+123 456 7890",
    order: 2,
  },
  {
    label: "Address",
    value: "123 Main St, City, Country",
    order: 3,
  },
  {
    label: "LinkedIn",
    value: "www.linkedin.com/in/dang-tinh-18709528b",
    order: 4,
  },
  {
    label: "Website",
    value: "www.yourwebsite.com",
    order: 5,
  },
  {
    label: "GitHub",
    value: "github.com/yourusername",
    order: 6,
  },
];

export const SKILL_SEED_DATA: Array<Skill> = [
  {
    label: "Frontend",
    value: "React, Next.js, TailwindCSS",
    order: 0,
  },
  { label: "Backend", value: "NestJS, Fastify, Prisma, PostgreSQL", order: 1 },
  { label: "DevOps", value: "AWS, Docker, ECS Fargate, CI/CD", order: 2 },
  { label: "AI/ML", value: "OpenAI API, LangChain, HuggingFace", order: 3 },
];

export const EDUCATION_SEED_DATA: Array<Education> = [
  {
    school: "University of Information Technology - VNUHCM",
    degree: "Bachelor of Science",
    major: "Computer Science",
    startDate: new Date("2018-09-01"),
    endDate: new Date("2022-06-01"),
    order: 1,
  },
];

export const RESUME_MOCK_DATA: Resume = {
  _id: "resume-12345",
  userId: "user-12345",
  title: "Your Name",
  subTitle: "Web Developer",
  avatar: "https://avatars.githubusercontent.com/u/000000?v=4",
  overview:
    "A passionate software engineer with 3+ years of experience in building full-stack web applications, specializing in TypeScript, React, and AWS Cloud infrastructure. Proven track record of delivering scalable solutions and leading development teams to success. Seeking to leverage my expertise to contribute to innovative projects and drive technological advancements.",
  information: RESUME_INFORMATION_SEED_DATA,
  section: {
    educations: {
      order: 1,
      type: SectionType.EDUCATION,
      content: [
        {
          school: "University of Information Technology - VNUHCM",
          degree: "Bachelor of Science",
          major: "Computer Science",
          startDate: new Date("2018-09-01"),
          endDate: new Date("2022-06-01"),
          order: 1,
        },
      ],
    },
    workExperiences: {
      order: 2,
      type: SectionType.WORK_EXPERIENCE,
      content: [
        {
          company: "TechNova Solutions",
          position: "Web Developer",
          description:
            "Developed and maintained large-scale SaaS applications using React, Next.js, and NestJS. Led CI/CD automation with AWS ECS Fargate and GitHub Actions.",
          startDate: new Date("2022-08-01"),
          endDate: new Date("2025-01-01"),
          order: 1,
        },
        {
          company: "Freelance",
          position: "Frontend Engineer",
          description:
            "Built dynamic landing pages and dashboards using React, TailwindCSS, and TypeScript for various startup clients.",
          startDate: new Date("2021-01-01"),
          endDate: new Date("2022-07-01"),
          order: 2,
        },
      ],
    },
    projects: {
      order: 3,
      type: SectionType.PROJECTS,
      content: [
        {
          title: "Task Management System",
          subTitle: "Cloud-based productivity platform",
          information: [
            { label: "Tech Stack", value: "Next.js, NestJS, AWS", order: 1 },
            { label: "Role", value: "Lead Developer", order: 2 },
            {
              label: "Outcome",
              value: "Improved team productivity by 40%",
              order: 3,
            },
          ],
          order: 1,
        },
      ],
    },
    skills: {
      order: 4,
      type: SectionType.SKILLS,
      content: SKILL_SEED_DATA,
    },
  },
};
