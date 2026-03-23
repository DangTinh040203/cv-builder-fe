# Routing & Layouts

The application uses the **Next.js App Router** with route groups and nested layouts.

---

## Route Map

| Path               | Page                   | Auth Required            | Layout                 |
| ------------------ | ---------------------- | ------------------------ | ---------------------- |
| `/`                | Home / Landing page    | No                       | Main (Header + Footer) |
| `/templates`       | Template selection     | No                       | Main                   |
| `/builder`         | CV Builder             | ✅ Yes                   | Main                   |
| `/auth/sign-in`    | Sign-in form           | No (redirects if authed) | Auth                   |
| `/auth/sign-up`    | Sign-up form           | No (redirects if authed) | Auth                   |
| `/auth/verify-otp` | OTP email verification | No                       | Auth                   |
| `/not-found`       | 404 page               | No                       | None                   |

---

## Layout Hierarchy

```text
RootLayout (app/layout.tsx)
│
├── ClerkProvider                    # Authentication context
├── StoreProvider                    # Redux store + PersistGate
├── Toaster                          # Toast notifications (sonner)
├── NextTopLoader                    # Page transition progress bar
├── ScrollToTop                      # Scroll restoration
│
├── (main-layout)/                   # Route group
│   └── MainLayout                   # Header + Footer wrapper
│       ├── /                        # Landing page
│       ├── /templates               # Template selection
│       └── /builder                 # CV Builder (protected)
│
├── auth/                            # Auth route group
│   └── AuthLayout                   # Split-screen auth design
│       ├── /sign-in
│       ├── /sign-up
│       └── /verify-otp
│
└── not-found/                       # 404 route
```

---

## Root Layout Features

| Feature          | Implementation                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| **Fonts**        | Plus Jakarta Sans (primary), Geist Mono (monospace)                       |
| **Providers**    | ClerkProvider → StoreProvider → children                                  |
| **Global CSS**   | Custom theme (`styles/theme.css`) + shared UI globals                     |
| **Clerk Config** | `signInFallbackRedirectUrl="/builder"`, `afterSignOutUrl="/auth/sign-in"` |

---

## Route Protection (`proxy.ts`)

The Clerk middleware handles route-level access control:

```text
Request → Clerk Middleware
  ├── Authenticated user on /auth/* → Redirect to /not-found
  ├── Unauthenticated user on /builder/* → Redirect to /auth/sign-in?callbackUrl=...
  └── Otherwise → Allow through
```

| Route Pattern    | Behavior                                       |
| ---------------- | ---------------------------------------------- |
| `/auth(.*)`      | Redirects authenticated users away             |
| `/builder(.*)`   | Requires authentication (redirects to sign-in) |
| All other routes | Public access                                  |

---

## Page Components

### Home Page (`/`)

A full marketing landing page composed of modular sections:

`Hero` → `Marquee` → `FeaturesSection` → `HowItWorks` → `TemplatePreview` → `WhyChooseUs` → `Benefits` → `Stats` → `Testimonials` → `FAQ` → `CTA`

### Template Page (`/templates`)

Displays template preview cards with mock data. Selection dialog offers:

- **Start from scratch** — Navigate to empty builder
- **Upload existing resume** — AI-parse and pre-populate the builder

### Builder Page (`/builder`)

Protected page with sidebar navigation through 7 form sections + live PDF preview. See [CV Builder Feature](../features/cv-builder.md) for details.

### Auth Pages

Split-screen layout with decorative `FloatingElements` on the left and the auth form on the right.
