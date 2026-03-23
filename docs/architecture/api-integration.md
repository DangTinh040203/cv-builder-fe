# API Integration

The API layer uses a **class-based service pattern** with Axios for HTTP communication with the NestJS backend.

---

## Architecture

```text
HttpService (base)          ← Axios instance + auth interceptor
    └── ResumeService       ← Resume-specific API methods
```

---

## `HttpService` (Base Class)

Located at `services/http.service.ts`.

- Creates an Axios instance with config from `axiosConfig`
- **Request interceptor:** Injects `Authorization: Bearer <token>` via `getToken()` callback
- **Response interceptor:** Passes through (extensible for error handling)
- Generic methods: `get<T>()`, `post<T,R>()`, `put<T,R>()`, `patch<T,R>()`, `delete()`, `head<T>()`

---

## `ResumeService`

Located at `services/resume.service.ts`.

| Method                              | HTTP | Endpoint         | Description                                  |
| ----------------------------------- | ---- | ---------------- | -------------------------------------------- |
| `getResume()`                       | GET  | `/resumes`       | Fetch the authenticated user's resume        |
| `updateResume(id, payload)`         | POST | `/resumes/:id`   | Update resume data                           |
| `resumeParse(file)`                 | POST | `/resumes/parse` | Upload and AI-parse a resume file (PDF/DOCX) |
| `matchResume(resumeId, jd?, file?)` | POST | `/resumes/match` | Match resume against a job description       |

---

## `useService` Hook (Dependency Injection)

Located at `hooks/use-http.ts`.

```typescript
// Usage
const resumeService = useService(ResumeService);
```

- Integrates Clerk session for automatic token injection
- Memoized per service class + session
- Generic — works with any `HttpService` subclass
- Passes `getToken` callback from Clerk: `session?.getToken() ?? null`

---

## `useSyncResume` Hook

Located at `hooks/use-sync-resume.ts`.

A high-level hook that bridges Redux state and the API:

- Reads current resume from Redux store via `resumeSelector`
- Provides `sync()` function to persist to backend
- Uses `resumeToUpdateDto()` to transform Redux state → API DTO
- Handles error responses with toast notifications
- Supports **Ctrl+S / Cmd+S** keyboard shortcut for quick save
- Returns `{ sync, isSyncing, resume }`

---

## Request Flow

```text
Component
  │── calls resumeService.updateResume(id, dto)
  │
  ▼
HttpService
  │── Request Interceptor: getToken() → Bearer token
  │── Axios POST /api/v1/resumes/:id
  │
  ▼
Backend (NestJS)
  │── ClerkAuthGuard verifies JWT
  │── ResumeController → ResumeService → PrismaResumeRepository
  │
  ▼
Response
  │── Resume JSON returned
  │── Component dispatches setResume(response) to Redux
```

---

## Axios Configuration

```typescript
// configs/axios.config.ts
export const axiosConfig = {
  baseURL: Env.NEXT_PUBLIC_BASE_URL, // e.g., http://localhost:4000/api/v1
  withCredentials: true, // Include cookies
};
```
