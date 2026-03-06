# JD Matching Feature

AI-powered job description matching that analyzes a resume against a target job posting.

---

## Overview

The JD Matching feature is accessible from the CV Builder page via a dialog button. It sends the user's resume and a job description to the backend AI for analysis, returning a detailed match report with scoring and improvement suggestions.

---

## Three-Step Dialog Flow

```text
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Step 1       │     │ Step 2           │     │ Step 3           │
│ MatchingForm │ ──▶ │ MatchingLoading  │ ──▶ │ MatchingResult   │
│              │     │                  │     │                  │
│ Input JD     │     │ Loading spinner  │     │ Score, criteria, │
│ (text/file)  │     │ AI analyzing...  │     │ suggestions      │
└──────────────┘     └──────────────────┘     └──────────────────┘
```

### Step 1: `MatchingForm`

The user provides a job description via:
- **Text input** — Paste JD text directly
- **File upload** — Upload a JD file (PDF/DOCX)

### Step 2: `MatchingLoading`

A loading state displayed while the backend AI analyzes the resume against the JD.

### Step 3: `MatchingResult`

Displays the complete match report:

| Section | Description |
| ------- | ----------- |
| **Overall Score** | Percentage match (0–100) |
| **Summary** | Text summary of the match |
| **Criteria Breakdown** | Weighted scoring per criterion (name, weight, score, explanation) |
| **Missing Keywords** | Keywords from the JD not found in the resume |
| **Strengths** | Resume strengths relative to the JD |
| **Suggestions** | Actionable improvement recommendations |

---

## API Call

```typescript
// services/resume.service.ts
matchResume(resumeId: string, jd?: string, file?: File): Promise<MatchResult>
// POST /resumes/match (multipart/form-data)
```

---

## Response Type

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

## Component Files

| Component | File | Purpose |
| --------- | ---- | ------- |
| `MatchingForm` | `components/builder-screen/matching/matching-form.tsx` | JD input (text/file) |
| `MatchingLoading` | `components/builder-screen/matching/matching-loading.tsx` | Loading state |
| `MatchingResult` | `components/builder-screen/matching/matching-result.tsx` | Result display |
