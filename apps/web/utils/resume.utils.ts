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
    educations: resume.educations
      .filter((edu) => edu.school.trim() || edu.degree.trim())
      .map(({ school, degree, major, startDate, endDate }) => ({
        school,
        degree,
        major,
        startDate,
        endDate,
      })),
    skills: resume.skills
      .filter((skill) => skill.label.trim() || skill.value.trim())
      .map(({ label, value }) => ({
        label,
        value,
      })),
    workExperiences: resume.workExperiences
      .filter((exp) => exp.company.trim() || exp.position.trim())
      .map(({ company, position, description, startDate, endDate }) => ({
        company,
        position,
        description,
        startDate,
        endDate,
      })),
    projects: resume.projects
      .filter((proj) => proj.title.trim() || proj.details.trim())
      .map(
        ({
          title,
          subTitle,
          details,
          technologies,
          position,
          responsibilities,
          domain,
          demo,
        }) => ({
          title,
          subTitle,
          details,
          technologies,
          position,
          responsibilities,
          domain,
          demo,
        }),
      ),
    certifications: resume.certifications
      .filter((cert) => cert.name.trim() || cert.issuer.trim())
      .map(({ name, issuer, date }) => ({
        name,
        issuer,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
      })),
    languages: resume.languages
      .filter((lang) => lang.name.trim() || lang.description.trim())
      .map(({ name, description }) => ({
        name,
        description,
      })),
  };
}
