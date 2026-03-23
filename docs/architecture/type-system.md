# Type System

All TypeScript type definitions used across the frontend application.

---

## Resume Types (`types/resume.type.ts`)

### Core Model

```typescript
interface Resume {
  id: string;
  userId: string;
  title: string;
  subTitle: string;
  overview: string;
  avatar: string;
  information: ResumeInformation[];
  educations: Education[];
  skills: Skill[];
  workExperiences: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  createdAt: string;
  updatedAt: string;
}
```

### Related Models

| Model               | Key Fields                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `ResumeInformation` | `label`, `value`                                                                                 |
| `Education`         | `school`, `degree`, `major`, `startDate`, `endDate`                                              |
| `Skill`             | `label`, `value`                                                                                 |
| `WorkExperience`    | `company`, `position`, `description`, `startDate`, `endDate`                                     |
| `Project`           | `title`, `subTitle`, `details`, `technologies`, `position`, `responsibilities`, `domain`, `demo` |
| `Certification`     | `name`, `issuer`, `date`                                                                         |
| `Language`          | `name`, `description`                                                                            |

### DTO Types

| Type                  | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `UpdateResumeDto`     | API payload — omits `id` and `resumeId` from all relation arrays |
| `ParseResumeResponse` | AI parse result — same structure as `UpdateResumeDto`            |

### Match Types

```typescript
interface MatchResult {
  overallScore: number;
  summary: string;
  criteria: MatchCriterion[];
  missingKeywords: string[];
  strengths: string[];
  suggestions: string[];
}

interface MatchCriterion {
  name: string;
  weight: number;
  score: number;
  explanation: string;
}
```

---

## Error Types (`types/error.response.ts`)

```typescript
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string[] | string;
  error: string;
}
```

---

## Template Types

| Type           | Values                                                                                                | Description                |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------------------------- |
| `SectionType`  | `personal`, `summary`, `skills`, `education`, `experience`, `projects`, `certifications`, `languages` | Resume section identifiers |
| `FontWeight`   | `"normal"`, `"medium"`, `"semibold"`, `"bold"`                                                        | PDF font weight            |
| `ColumnLayout` | `"single"`, `"double"`                                                                                | PDF column layout          |
| `HeaderStyle`  | `"left"`, `"center"`                                                                                  | PDF header alignment       |
| `BorderStyle`  | `"none"`, `"simple"`, `"double"`, `"accent"`                                                          | PDF border style           |
| `Theme`        | `"light"`, `"dark"`, `"auto"`                                                                         | App theme preference       |

---

## Storage Constants

```typescript
enum StorageSliceName {
  User = "user",
  Template = "template",
  Resume = "resume",
}
```
