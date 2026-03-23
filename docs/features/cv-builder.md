# CV Builder Feature

The main application feature — a step-by-step resume builder with live PDF preview.

**Route:** `/builder` (protected — requires authentication)

---

## Overview

The builder page consists of three main areas:

```text
┌─────────────────────────────────────────────────────┐
│                  Resume Control Bar                  │
│  [Save (Ctrl+S)]  [Preview Mode]  [Download]  [JD]  │
├───────────┬─────────────────────────────────────────┤
│  Sidebar  │              Main Content               │
│           │                                          │
│  1. Personal  │  ┌──── Form ────┐  ┌── PDF ──┐     │
│  2. Summary   │  │              │  │ Preview  │     │
│  3. Skills    │  │  Active      │  │          │     │
│  4. Education │  │  Section     │  │ (live    │     │
│  5. Experience│  │  Form        │  │  render) │     │
│  6. Projects  │  │              │  │          │     │
│  7. Extra     │  └──────────────┘  └──────────┘     │
│               │                                      │
└───────────┴──────────────────────────────────────────┘
```

---

## Builder Sidebar (`resume-builder-sidebar.tsx`)

Navigation through 7 sections:

| #   | Section    | Icon          | Description                      |
| --- | ---------- | ------------- | -------------------------------- |
| 1   | Personal   | User          | Name, title, contact information |
| 2   | Summary    | FileText      | Professional overview/summary    |
| 3   | Skills     | Code          | Technical and soft skills        |
| 4   | Education  | GraduationCap | Educational background           |
| 5   | Experience | Briefcase     | Work experience history          |
| 6   | Projects   | FolderGit2    | Project portfolio                |
| 7   | Extra      | Plus          | Certifications & languages       |

---

## Section Forms

Each section has a dedicated form component in `components/builder-screen/forms/`:

| Form       | File                  | Field Types                                                                       |
| ---------- | --------------------- | --------------------------------------------------------------------------------- |
| Personal   | `personal-form.tsx`   | Name, title, avatar, dynamic key-value contact info                               |
| Summary    | `summary-form.tsx`    | Rich text editor (React Quill)                                                    |
| Skills     | `skills-form.tsx`     | Dynamic list of skill categories with values                                      |
| Education  | `education-form.tsx`  | Repeatable entries: school, degree, major, dates                                  |
| Experience | `experience-form.tsx` | Repeatable entries: company, position, description (rich text), dates             |
| Projects   | `projects-form.tsx`   | Repeatable entries: title, subtitle, technologies, responsibilities, domain, demo |
| Extra      | `extra-form.tsx`      | Certifications (name, issuer, date) + Languages (name, description) combined      |

### Form Architecture

- **Validation:** React Hook Form + Zod schemas
- **State sync:** Form changes → `dispatch(updateResume(...))` → Redux store
- **Rich text:** Summary and experience descriptions use the `Editor` component (React Quill, dynamically imported, SSR-disabled)
- **Dynamic fields:** Personal info, skills, and repeatable sections use `useFieldArray`

---

## Builder Controls (`resume-control.tsx`)

Action bar at the top of the builder:

| Control          | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| **Save**         | Persists resume to backend via `useSyncResume().sync()`. Keyboard shortcut: `Ctrl+S` / `Cmd+S` |
| **Preview Mode** | Toggles full-screen PDF preview (hides form). Dispatches `updatePreviewMode()`                 |
| **Download PDF** | Triggers PDF generation and file download via `DownloadPdf` component                          |
| **JD Matching**  | Opens the JD Matching dialog. See [JD Matching](jd-matching.md)                                |

---

## Rich Text Editor (`editor.tsx`)

Powered by **React Quill** (dynamically imported to disable SSR):

- **Toolbar:** Bold, italic, underline, ordered list, bullet list, links, text color
- **Usage:** Description fields in Experience, Summary sections
- **HTML output:** Stored as HTML string, converted to PDF elements via `HtmlToPdf` component

---

## Data Flow

```text
1. User opens /builder (authenticated)
2. App fetches resume from API → dispatches setResume()
3. Redux store populates forms via useAppSelector(resumeSelector)
4. User edits form fields → dispatch(updateResume({ field: value }))
5. PDF template re-renders reactively from Redux store
6. User clicks Save → useSyncResume().sync() → API PUT /resumes/:id
7. Backend response → dispatch(setResume(updatedResume))
```
