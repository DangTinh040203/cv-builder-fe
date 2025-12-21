# CV Builder - Frontend Monorepo

A Turborepo monorepo for CV Builder frontend applications using Next.js, shadcn/ui, and Tailwind CSS v4.

## 📁 Folder Structure

```
fe/
├── apps/                        # Applications
│   └── web/                     # Main Next.js web app
│       ├── app/                 # Next.js App Router
│       ├── components/          # App-specific components
│       └── eslint.config.js     # App ESLint (extends shared)
│
├── shared/                      # Shared packages
│   ├── eslint-config/           # Shared ESLint configurations
│   │   ├── base.js              # Base config (TypeScript, Prettier, imports)
│   │   ├── next.js              # Next.js specific config
│   │   └── react-internal.js    # React library config
│   │
│   ├── typescript-config/       # Shared TypeScript configurations
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── react-library.json
│   │
│   └── ui/                      # Shared UI components (shadcn/ui)
│       ├── src/
│       │   ├── components/      # shadcn components (47 components)
│       │   ├── hooks/           # Shared hooks
│       │   ├── lib/             # Utilities (cn, etc.)
│       │   └── styles/          # Global CSS
│       └── components.json      # shadcn configuration
│
├── eslint.config.mjs            # Root ESLint config
├── .prettierrc                  # Prettier config
├── turbo.json                   # Turborepo config
└── pnpm-workspace.yaml          # PNPM workspace config
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build all packages
pnpm build

# Lint and fix
pnpm lint:fix
```

## 📦 Adding shadcn Components

Add components to the shared UI package:

```bash
cd shared/ui
npx shadcn@latest add <component-name>
```

## 📥 Using Components

Import from `@shared/ui`:

```tsx
import { Button } from "@shared/ui/components/button";
import { Card, CardHeader, CardTitle } from "@shared/ui/components/card";
import { cn } from "@shared/ui/lib/utils";
```

Import global styles in your layout:

```tsx
import "@shared/ui/globals.css";
```

### Import Boundaries

> ⚠️ **Important**: Only import from `shared` into `apps`, never the reverse!

```tsx
// ✅ Allowed: apps importing from shared
import { Button } from "@shared/ui/components/button";

// ❌ Forbidden: shared importing from apps
import { Something } from "apps/web/..."; // ESLint error!
```

## 🎨 Styling

- **Tailwind CSS v4** with CSS variables
- **CSS file**: `shared/ui/src/styles/globals.css`
- **Theme**: New York style with neutral base color

### Utility Function

```tsx
import { cn } from "@shared/ui/lib/utils";

// Merge Tailwind classes conditionally
<div className={cn("base-class", isActive && "active-class")} />;
```

## 📝 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm dev`      | Start development server |
| `pnpm build`    | Build all packages       |
| `pnpm lint`     | Run ESLint               |
| `pnpm lint:fix` | Fix ESLint errors        |
| `pnpm format`   | Format with Prettier     |

## 🗂️ Packages

| Package                     | Name          | Description               |
| --------------------------- | ------------- | ------------------------- |
| `@shared/ui`                | UI Library    | shadcn/ui components      |
| `@shared/eslint-config`     | ESLint Config | Shared linting rules      |
| `@shared/typescript-config` | TS Config     | Shared TypeScript configs |
