import type { Resume, UpdateResumeDto } from "@/types/resume.type";

/**
 * Safely converts a date value to ISO string.
 * Handles common CV date formats: "MM/YYYY", "YYYY", "Month YYYY", ISO strings, etc.
 */
function toISOSafe(value: string | null | undefined): string | null {
  if (!value) return null;

  // Already valid ISO or parseable date
  const direct = new Date(value);
  if (!isNaN(direct.getTime())) return direct.toISOString();

  // Handle "MM/YYYY" format (e.g., "01/2024", "12/2025")
  const mmYyyy = value.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyy?.[1] && mmYyyy?.[2]) {
    return new Date(Number(mmYyyy[2]), Number(mmYyyy[1]) - 1, 1).toISOString();
  }

  // Handle "YYYY" only
  const yyyy = value.match(/^(\d{4})$/);
  if (yyyy?.[1]) {
    return new Date(Number(yyyy[1]), 0, 1).toISOString();
  }

  // Fallback: return a default date to prevent Prisma crash
  return new Date().toISOString();
}

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
        startDate: toISOSafe(startDate) ?? startDate,
        endDate: toISOSafe(endDate),
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
        startDate: toISOSafe(startDate) ?? startDate,
        endDate: toISOSafe(endDate),
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
        date: toISOSafe(date) ?? new Date().toISOString(),
      })),
    languages: resume.languages
      .filter((lang) => lang.name.trim() || lang.description.trim())
      .map(({ name, description }) => ({
        name,
        description,
      })),
  };
}
