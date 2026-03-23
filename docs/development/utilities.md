# Utilities & Helpers

Utility functions and helper modules used across the application.

---

## `resumeToUpdateDto` (`utils/resume.utils.ts`)

Transforms Redux resume state to an API-compatible DTO:

- Strips `id` and `resumeId` from all relation arrays (education, skills, etc.)
- Filters out empty/blank items
- Safely converts date strings to ISO format (handles `MM/YYYY`, `YYYY`, ISO strings)

```typescript
function resumeToUpdateDto(resume: Resume): UpdateResumeDto;
```

---

## `toastErrorMessage` (`utils/toast-error-message.util.ts`)

Displays API error messages as toast notifications:

```typescript
function toastErrorMessage(msg: string | string[]): void;
```

Handles both string and array `message` formats from `ErrorResponse`.

---

## Clerk Error Utilities (`libs/clerk-toast.ts`)

| Function                            | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| `isClerkAPIError(error)`            | Type guard for Clerk API errors               |
| `getClerkErrorMessage(error)`       | Extract first error message                   |
| `getClerkErrorMessages(error)`      | Extract all error messages                    |
| `showClerkError(error)`             | Display single error toast                    |
| `showClerkErrors(error)`            | Display all errors as toasts                  |
| `handleClerkError(error, options?)` | Unified handler with fallback message support |

---

## `cn()` (`@shared/ui/lib/utils`)

Tailwind class merging utility combining `clsx` and `tailwind-merge`:

```typescript
import { cn } from "@shared/ui/lib/utils";

cn("px-4 py-2", isActive && "bg-primary text-white", className);
```

---

## Mock Resume (`constants/resume.constant.ts`)

A comprehensive mock resume used for template previews on the template selection page. Contains sample data for all resume sections:

- Personal info
- 2 education entries
- 4 skill categories
- 2 work experiences
- 2 projects
