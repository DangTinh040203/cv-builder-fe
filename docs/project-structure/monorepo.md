# Monorepo Architecture

The frontend uses **Turborepo + pnpm workspaces** for monorepo management.

---

## Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*" # Application packages
  - "shared/*" # Shared library packages
```

## Packages

| Package                     | Path                        | Description                                               |
| --------------------------- | --------------------------- | --------------------------------------------------------- |
| `web`                       | `apps/web/`                 | Main Next.js web application                              |
| `@shared/ui`                | `shared/ui/`                | Shared UI component library (48+ shadcn/Radix components) |
| `@shared/eslint-config`     | `shared/eslint-config/`     | Shared ESLint configurations                              |
| `@shared/typescript-config` | `shared/typescript-config/` | Shared TypeScript configurations                          |

---

## Turborepo Pipeline (`turbo.json`)

```text
┌──────────┐     ┌────────┐     ┌──────────────┐     ┌─────────┐
│  build   │ ──▶ │  lint  │ ──▶ │ check-types  │     │   dev   │
│ (cached) │     │        │     │              │     │(no cache│
│          │     │        │     │              │     │persistent│
└──────────┘     └────────┘     └──────────────┘     └─────────┘
```

| Task          | Caching     | Dependencies                 | Outputs                       |
| ------------- | ----------- | ---------------------------- | ----------------------------- |
| `build`       | ✅ Cached   | Depends on upstream `^build` | `.next/**`, `!.next/cache/**` |
| `lint`        | ✅ Cached   | Depends on upstream `^lint`  | —                             |
| `check-types` | ✅ Cached   | —                            | —                             |
| `dev`         | ❌ No cache | —                            | Persistent (dev server)       |

**Global env vars** affecting cache: `NODE_ENV`, `CLERK_SECRET_KEY`

---

## Package Dependency Graph

```text
apps/web
├── @shared/ui              (component library)
├── @shared/eslint-config   (linting rules)
└── @shared/typescript-config (TS compiler options)
```

---

## Commands

| Command          | Scope      | Description                              |
| ---------------- | ---------- | ---------------------------------------- |
| `pnpm dev`       | Root       | Start all apps in dev mode               |
| `pnpm build`     | Root       | Build all packages (cached by Turborepo) |
| `pnpm lint`      | Root       | Lint all packages                        |
| `pnpm format`    | Root       | Format with Prettier                     |
| `pnpm dev`       | `apps/web` | Start Next.js dev server with Turbopack  |
| `pnpm build`     | `apps/web` | Production build                         |
| `pnpm test`      | `apps/web` | Run Vitest tests                         |
| `pnpm typecheck` | `apps/web` | TypeScript type checking                 |

---

## Shared UI Package (`@shared/ui`)

A comprehensive component library built on **Radix UI** primitives with **shadcn/ui** patterns.

### Exports Map

```json
{
  "./globals.css": "./src/styles/globals.css",
  "./lib/*": "./src/lib/*.ts",
  "./components/*": "./src/components/*.tsx",
  "./hooks/*": "./src/hooks/*.ts"
}
```

### Available Components (48+)

`Accordion`, `AlertDialog`, `Alert`, `AspectRatio`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Card`, `Carousel`, `Chart`, `Checkbox`, `Collapsible`, `Command`, `ContextMenu`, `DatePicker`, `Dialog`, `Drawer`, `DropdownMenu`, `Form`, `HoverCard`, `InputOTP`, `Input`, `Label`, `Menubar`, `NavigationMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `Resizable`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Slider`, `Sonner`, `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea`, `ToggleGroup`, `Toggle`, `Tooltip`

### Shared Hooks

- `use-mobile` — Responsive breakpoint detection

### Utilities

- `cn()` — Tailwind class merging via `clsx` + `tailwind-merge`
