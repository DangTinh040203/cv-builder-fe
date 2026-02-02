import type { Resume, UpdateResumeDto } from "@/types/resume.type";

/**
 * Converts Redux resume state to UpdateResumeDto for backend sync.
 * Strips out id and resumeId from relation arrays.
 */
export function resumeToUpdateDto(resume: Resume): UpdateResumeDto {
  return {
    title: resume.title,
    subTitle: resume.subTitle,
    overview: resume.overview,
    avatar: resume.avatar,
    // Filter out empty information items
    information: resume.information
      .filter((item) => item.label.trim() && item.value.trim())
      .map(({ label, value }) => ({
        label,
        value,
      })),
    educations: resume.educations.map(
      ({ school, degree, major, startDate, endDate }) => ({
        school,
        degree,
        major,
        startDate,
        endDate,
      }),
    ),
    skills: resume.skills.map(({ label, value }) => ({
      label,
      value,
    })),
    workExperiences: resume.workExperiences.map(
      ({ company, position, description, startDate, endDate }) => ({
        company,
        position,
        description,
        startDate,
        endDate,
      }),
    ),
    projects: resume.projects.map(({ title, subTitle, details }) => ({
      title,
      subTitle,
      details,
    })),
  };
}
