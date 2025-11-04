import { v4 as uuid } from "uuid";

import { type Template } from "@/types/template.type";

export const TEMPLATE_MOCK_DATA: Template = {
  title: "Your Name",
  subTitle: "Position",
  // overview: `
  //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
  //           aperiam quos voluptatem deserunt nam mollitia deleniti recusandae facere
  //           ipsum cum quidem fuga autem cupiditate quisquam praesentium consequuntur
  //           dicta labore iste.
  //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
  //           aperiam quos voluptatem deserunt nam mollitia deleniti recusandae facere
  //           ipsum cum quidem fuga autem cupiditate quisquam praesentium consequuntur
  //           dicta labore iste.
  //         `,
  overview: `
    Over 3 as a with strong communication skills and a quick ability to learn and adapt to
new technologies. Specializing in Front-end development and Back-end development
, with a solid understanding of modern web technologies. Passionate about building scalable, high-performance web
applications and continuously improving skills to stay up to date with the latest industry trends
  `,

  information: [
    {
      _id: uuid(),
      label: "Email",
      value: "your_email@example.com",
      order: 1,
    },
    {
      _id: uuid(),
      label: "Phone",
      value: "+123 456 7890",
      order: 2,
    },
    {
      _id: uuid(),
      label: "Address",
      value: "123 Main St, City, Country",
      order: 3,
    },
    {
      _id: uuid(),
      label: "LinkedIn",
      value: "www.linkedin.com/in/dang-tinh-18709528b",
      order: 4,
    },
    {
      _id: uuid(),
      label: "Website",
      value: "www.yourwebsite.com",
      order: 5,
    },
    {
      _id: uuid(),
      label: "GitHub",
      value: "github.com/yourusername",
      order: 6,
    },
  ],

  skills: [
    {
      _id: uuid(),
      label: "Language",
      value: "React, Vue, Angular, HTML, CSS, JavaScript, TypeScript...",
    },
    {
      _id: uuid(),
      label: "Framework",
      value: "React.js, Next.js, Node.js, Express.js, Nest.js, Spring Boot,...",
    },
    {
      _id: uuid(),
      label: "Database",
      value: "MySQL, PostgreSQL, MongoDB, Redis, Elasticsearch, Supabase, ...",
    },
    {
      _id: uuid(),
      label: "Deployment",
      value: "Docker, Kubernetes, AWS, Azure, GCP, CI/CD,...",
    },
  ],

  educations: [
    {
      _id: uuid(),
      schoolName: "City High School",
      degree: "High School Diploma",
      major: "Science Stream",
      startDate: new Date("2012-09-01"),
      endDate: null,
      order: 2,
    },
  ],

  experiences: [
    {
      _id: uuid(),
      startDate: new Date("2019-07-01"),
      endDate: null,
      company: "Tech Solutions Inc.",
      position: "Fullstack Developer",
      description:
        "Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.",
      order: 1,
    },
    {
      _id: uuid(),
      startDate: new Date("2018-06-01"),
      endDate: new Date("2019-06-30"),
      company: "Web Innovations Ltd.",
      position: "Frontend Developer Intern",
      description:
        "Assisted in the development of user interfaces using HTML, CSS, and JavaScript. Participated in code reviews and contributed to improving application performance.",
      order: 2,
    },
    {
      _id: uuid(),
      startDate: new Date("2017-06-01"),
      endDate: new Date("2017-08-31"),
      company: "Startup Hub",
      position: "Software Engineering Intern",
      description:
        "Worked on various projects, gaining experience in fullstack development and agile methodologies. Collaborated with senior developers to enhance coding skills.",
      order: 3,
    },
    {
      _id: uuid(),
      startDate: new Date("2016-06-01"),
      endDate: new Date("2016-08-31"),
      company: "IT Solutions Co.",
      position: "IT Intern",
      description:
        "Provided technical support and assisted in maintaining company IT infrastructure. Gained hands-on experience with networking and system administration.",
      order: 4,
    },
    {
      _id: uuid(),
      startDate: new Date("2015-06-01"),
      endDate: new Date("2015-08-31"),
      company: "Local Tech Firm",
      position: "Junior Developer Intern",
      description:
        "Contributed to small-scale projects and learned about software development life cycle. Worked closely with the development team to understand coding best practices.",
      order: 5,
    },
    {
      _id: uuid(),
      startDate: new Date("2014-06-01"),
      endDate: new Date("2014-08-31"),
      company: "Community IT Center",
      position: "IT Support Intern",
      description:
        "Assisted in providing IT support to community members. Gained experience in troubleshooting hardware and software issues.",
      order: 6,
    },
    {
      _id: uuid(),
      startDate: new Date("2013-06-01"),
      endDate: new Date("2013-08-31"),
      company: "Tech Education Program",
      position: "IT Trainee",
      description:
        "Participated in a summer program focused on IT skills development. Learned the basics of programming, networking, and computer hardware.",
      order: 7,
    },
  ],

  projects: [
    {
      _id: uuid(),
      title: "Personal Portfolio Website",
      subTitle:
        "A showcase of my skills and projects as a developer more details follow... ",
      information: [
        {
          _id: uuid(),
          label: "Technologies",
          value: "React, TypeScript, Tailwind CSS",
          order: 1,
        },
        {
          _id: uuid(),
          label: "Description",
          value:
            "Developed a personal portfolio website to showcase my skills, projects, and experience. Implemented responsive design and interactive features.",
          order: 2,
        },
        {
          _id: uuid(),
          label: "GitHub",
          value: "github.com/yourusername/portfolio-website",
          order: 3,
        },
      ],
      order: 1,
    },
    {
      _id: uuid(),
      title: "E-commerce Platform",
      subTitle:
        "An online marketplace for buying and selling products more details follow... ",
      information: [
        {
          _id: uuid(),
          label: "Technologies",
          value: "Node.js, Express, MongoDB, React",
          order: 1,
        },
        {
          _id: uuid(),
          label: "Description",
          value:
            "Built a full-featured e-commerce platform with user authentication, product listings, shopping cart, and payment integration.",
          order: 2,
        },
        {
          _id: uuid(),
          label: "GitHub",
          value: "github.com/yourusername/ecommerce-platform",
          order: 3,
        },
        {
          _id: uuid(),
          label: "Live Demo",
          value: "www.ecommerce-demo.com",
          order: 4,
        },
        {
          _id: uuid(),
          label: "Role",
          value: "Fullstack Developer",
          order: 5,
        },
      ],
      order: 2,
    },
    {
      _id: uuid(),
      title: "Task Management App",
      subTitle:
        "A productivity app to manage tasks and projects more details follow... ",
      information: [
        {
          _id: uuid(),
          label: "Technologies",
          value: "Vue.js, Firebase",
          order: 1,
        },
        {
          _id: uuid(),
          label: "Description",
          value:
            "Created a task management application that allows users to create, edit, and track tasks and projects with real-time collaboration features.",
          order: 2,
        },
        {
          _id: uuid(),
          label: "GitHub",
          value: "github.com/yourusername/task-management-app",
          order: 3,
        },
      ],
      order: 3,
    },
    {
      _id: uuid(),
      title: "Blog Platform",
      subTitle:
        "A content management system for blogging more details follow... ",
      information: [
        {
          _id: uuid(),
          label: "Technologies",
          value: "Django, PostgreSQL, Bootstrap",
          order: 1,
        },
        {
          _id: uuid(),
          label: "Description",
          value:
            "Developed a blog platform with features such as user authentication, post creation, commenting, and categorization.",
          order: 2,
        },
        {
          _id: uuid(),
          label: "GitHub",
          value: "github.com/yourusername/blog-platform",
          order: 3,
        },
      ],
      order: 4,
    },
  ],
};
