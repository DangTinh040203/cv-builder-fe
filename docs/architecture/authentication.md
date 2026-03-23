# Authentication

Authentication is handled by **Clerk** with custom UI forms (not Clerk's hosted components).

---

## Overview

| Aspect           | Detail                                              |
| ---------------- | --------------------------------------------------- |
| Provider         | Clerk (`@clerk/nextjs`)                             |
| Strategy         | Email + Password with OTP email verification        |
| Route Protection | Clerk middleware in `proxy.ts`                      |
| Token Injection  | Via `useService` hook → Axios interceptor           |
| UI               | Custom sign-in/sign-up forms (not Clerk components) |

---

## Sign-Up Flow

```text
1. User fills sign-up form (email, password, confirm password)
2. Form validated with Zod schema
3. Clerk signUp.create() called
4. OTP sent via signUp.prepareEmailAddressVerification({ strategy: "email_code" })
5. Redirect to /auth/verify-otp?email=...
6. User enters 6-digit OTP code (InputOTP component)
7. signUp.attemptEmailAddressVerification() verifies code
8. On success → setActive() → redirect to /
```

---

## Sign-In Flow

```text
1. User fills sign-in form (email, password)
2. Form validated with Zod schema
3. Clerk signIn.create() called with { identifier, password }
4. On success → setActive() → redirect to callbackUrl or /
```

---

## Route Protection Middleware (`proxy.ts`)

```text
Request → Clerk Middleware
  ├── Authenticated user on /auth/* → Redirect to /not-found
  ├── Unauthenticated user on /builder/* → Redirect to /auth/sign-in?callbackUrl=...
  └── Otherwise → Allow through
```

---

## Token Management

Clerk session tokens are injected into every API request automatically:

```typescript
// hooks/use-http.ts
const service = new ServiceClass({
  getToken: async () => session?.getToken() ?? null,
});

// services/http.service.ts — Request Interceptor
this.axiosInstance.interceptors.request.use(async (config) => {
  const token = await this.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Error Handling (`libs/clerk-toast.ts`)

Dedicated utilities for handling Clerk API errors as toast notifications:

| Function                            | Description                           |
| ----------------------------------- | ------------------------------------- |
| `isClerkAPIError(error)`            | Type guard for Clerk API errors       |
| `getClerkErrorMessage(error)`       | Extract first error message           |
| `getClerkErrorMessages(error)`      | Extract all error messages            |
| `showClerkError(error)`             | Display single error as toast         |
| `showClerkErrors(error)`            | Display all errors as toasts          |
| `handleClerkError(error, options?)` | Unified handler with fallback support |

---

## Clerk Configuration

Set in the Root Layout (`app/layout.tsx`):

```typescript
<ClerkProvider
  signInFallbackRedirectUrl="/builder"
  afterSignOutUrl="/auth/sign-in"
>
```
