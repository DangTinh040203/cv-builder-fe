# Folder Structure

The frontend is a **Turborepo monorepo** with pnpm workspaces. This document describes the complete directory layout.

---

## Root Directory

```text
fe/
├── apps/
│   └── web/                          # Main Next.js application
├── shared/
│   ├── ui/                           # Shared component library (shadcn/ui)
│   ├── eslint-config/                # Shared ESLint configurations
│   └── typescript-config/            # Shared TypeScript configurations
├── package.json                      # Root dependencies
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml               # pnpm workspace definition
└── tsconfig.json                     # Root TypeScript config
```

---

## Web Application (`apps/web/`)

```text
apps/web/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Clerk, fonts, providers)
│   ├── icon.tsx                      # Dynamic favicon generation
│   ├── not-found.tsx                 # Global 404 page
│   ├── not-found/page.tsx            # Not-found route page
│   ├── (main-layout)/               # Route group — Header + Footer wrapper
│   │   ├── layout.tsx                # Main layout component
│   │   ├── page.tsx                  # Home / Landing page
│   │   ├── builder/page.tsx          # CV Builder page (protected)
│   │   └── templates/page.tsx        # Template selection page
│   └── auth/                         # Authentication routes
│       ├── layout.tsx                # Auth layout (split-screen design)
│       ├── sign-in/page.tsx          # Sign-in form
│       ├── sign-up/page.tsx          # Sign-up form
│       └── verify-otp/page.tsx       # OTP email verification
│
├── components/                       # React components
│   ├── auth-screens/                 # Auth page decorative components
│   │   └── floating-elements.tsx     # Animated floating UI elements
│   ├── builder-screen/               # CV Builder feature
│   │   ├── forms/                    # Section-specific form components
│   │   │   ├── personal-form.tsx     # Name, title, contact info
│   │   │   ├── summary-form.tsx      # Professional summary (rich text)
│   │   │   ├── skills-form.tsx       # Skills categories
│   │   │   ├── education-form.tsx    # Education entries
│   │   │   ├── experience-form.tsx   # Work experience entries
│   │   │   ├── projects-form.tsx     # Project portfolio
│   │   │   └── extra-form.tsx        # Certifications + languages
│   │   ├── matching/                 # JD Matching feature
│   │   │   ├── matching-form.tsx     # JD input form
│   │   │   ├── matching-loading.tsx  # Loading state
│   │   │   └── matching-result.tsx   # Result display
│   │   ├── resume-builder-sidebar.tsx # 7-step navigation sidebar
│   │   ├── resume-control.tsx        # Action bar (save, preview, download)
│   │   ├── editor.tsx                # Rich text editor (React Quill)
│   │   └── ...                       # Other builder UI components
│   ├── common/                       # Shared/reusable components
│   │   ├── not-found.tsx             # 404 component
│   │   ├── scroll-to-top.tsx         # Scroll restoration
│   │   ├── floating-particles.tsx    # Decorative particles
│   │   ├── animated-counter.tsx      # Number counter animation
│   │   └── type-writer.tsx           # Typewriter text effect
│   ├── home-screen/                  # Landing page sections
│   │   ├── hero.tsx                  # Hero section
│   │   ├── features-section.tsx      # Features showcase
│   │   ├── how-it-works.tsx          # How it works guide
│   │   ├── template-preview.tsx      # Template showcase
│   │   ├── why-choose-us.tsx         # Value propositions
│   │   ├── benefits.tsx              # Benefits list
│   │   ├── stats.tsx                 # Statistics counters
│   │   ├── testimonials.tsx          # User testimonials
│   │   ├── faq.tsx                   # FAQ accordion
│   │   ├── cta.tsx                   # Call-to-action section
│   │   └── marquee.tsx              # Scrolling marquee
│   ├── layout/                       # App-wide layout components
│   │   ├── header.tsx                # Navigation bar
│   │   └── footer.tsx                # Footer
│   ├── providers/                    # React context/store providers
│   │   └── store-provider.tsx        # Redux + PersistGate
│   └── templates/                    # PDF template components
│       ├── template-01/              # "Classic" template
│       ├── template-02/              # "Modern" template
│       ├── section-registry.tsx      # Section → renderer mapping
│       ├── template-wrapper.tsx      # PDF viewer wrapper
│       ├── document-pdf.tsx          # react-pdf Document wrapper
│       ├── download-pdf.tsx          # PDF export trigger
│       └── html-to-pdf.tsx           # HTML → react-pdf converter
│
├── configs/                          # Application configuration
│   ├── axios.config.ts               # Axios instance config
│   ├── env.config.ts                 # Environment variables (t3-env)
│   ├── template.config.ts            # Template registry
│   └── template-style.config.ts      # PDF style defaults
│
├── constants/                        # Application constants
│   ├── resume.constant.ts            # Mock resume for previews
│   └── storage.constant.ts           # Redux slice names
│
├── hooks/                            # Custom React hooks
│   ├── use-http.ts                   # Service DI with Clerk token (useService)
│   ├── use-sync-resume.ts            # Redux ↔ API sync + Ctrl+S
│   └── ...                           # Other hooks
│
├── libs/                             # Library integrations
│   └── clerk-toast.ts                # Clerk error → toast utilities
│
├── services/                         # API service classes
│   ├── http.service.ts               # Base Axios service (auth interceptor)
│   └── resume.service.ts             # Resume CRUD + AI endpoints
│
├── stores/                           # Redux store
│   ├── store.ts                      # Store config, typed hooks
│   └── features/
│       ├── resume.slice.ts           # Resume state slice
│       └── template.slice.ts         # Template config slice
│
├── styles/                           # CSS & animation
│   ├── theme.css                     # Custom theme (oklch colors)
│   └── animation.ts                  # Framer Motion presets
│
├── types/                            # TypeScript types
│   ├── resume.type.ts                # Resume data models & DTOs
│   └── error.response.ts             # API error response type
│
├── utils/                            # Utility functions
│   ├── resume.utils.ts               # Resume ↔ DTO conversion
│   └── toast-error-message.util.ts   # Error toast helper
│
├── public/                           # Static assets
├── next.config.mjs                   # Next.js configuration
├── proxy.ts                          # Clerk middleware (route protection)
├── tsconfig.json                     # TypeScript config
├── vitest.config.ts                  # Vitest configuration
└── package.json                      # App dependencies
```

---

## Shared Packages (`shared/`)

### `@shared/ui`

Shared component library built on Radix UI + shadcn/ui patterns.

```text
shared/ui/
└── src/
    ├── components/                   # 48+ pre-built components
    │   ├── accordion.tsx
    │   ├── button.tsx
    │   ├── dialog.tsx
    │   ├── form.tsx
    │   ├── input.tsx
    │   ├── select.tsx
    │   ├── table.tsx
    │   ├── tabs.tsx
    │   └── ... (40+ more)
    ├── hooks/
    │   └── use-mobile.ts             # Responsive breakpoint hook
    ├── lib/
    │   └── utils.ts                  # cn() — Tailwind class merging
    └── styles/
        └── globals.css               # Shared global styles
```

**Exports:** via `@shared/ui/components/*`, `@shared/ui/lib/*`, `@shared/ui/hooks/*`

### `@shared/eslint-config`

Shared ESLint configurations for different project types:

- `base.js` — Base rules
- `next.js` — Next.js specific rules
- `react-internal.js` — React library rules

### `@shared/typescript-config`

Shared TypeScript configurations:

- `base.json` — Base compiler options
- `nextjs.json` — Next.js specific options
- `react-library.json` — React library options

---

## Path Aliases

```json
{
  "paths": {
    "@/*": ["./*"],
    "@shared/ui/*": ["../../shared/ui/src/*"]
  }
}
```

**Usage:**

```typescript
// ✅ Good
import { Button } from "@shared/ui/components/button";
import { ResumeService } from "@/services/resume.service";

// ❌ Bad
import { Button } from "../../../shared/ui/src/components/button";
```
