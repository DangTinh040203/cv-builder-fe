# Configuration

Application configuration, environment variables, and build setup.

---

## Environment Variables

| Variable | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | ✅ | Clerk authentication publishable key |
| `NEXT_PUBLIC_BASE_URL` | Client | ✅ | Backend API base URL (e.g., `http://localhost:4000/api/v1`) |
| `CLERK_SECRET_KEY` | Server | ✅ | Clerk server-side secret key |
| `NODE_ENV` | Global | — | Environment mode (`development`, `production`) |

### Validation

All client variables are validated at build time using `@t3-oss/env-nextjs` with Zod schemas:

```typescript
// configs/env.config.ts
export const Env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  server: {},
});
```

---

## Next.js Configuration (`next.config.mjs`)

```javascript
const nextConfig = {
  transpilePackages: ["@shared/ui"],           // Transpile shared UI package
  serverExternalPackages: [                     // Exclude from server bundle
    "@react-pdf/renderer",
    "@rawwee/react-pdf-html"
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
};
```

### Key Decisions

| Config | Reason |
| ------ | ------ |
| `transpilePackages` | Shared UI package uses JSX/TS that needs transpilation |
| `serverExternalPackages` | PDF libraries are client-only, must be excluded from SSR |
| `images.remotePatterns` | Allow all HTTPS images for user avatars |

---

## TypeScript Configuration (`tsconfig.json`)

- Extends `@shared/typescript-config/nextjs.json`
- Path aliases: `@/*` → `./*`, `@shared/ui/*` → `../../shared/ui/src/*`
- Includes Vitest globals type (`types: ["vitest/globals"]`)

---

## Axios Configuration (`configs/axios.config.ts`)

```typescript
export const axiosConfig = {
  baseURL: Env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
};
```

---

## Build & Development Commands

| Command | Scope | Description |
| ------- | ----- | ----------- |
| `pnpm dev` | Root | Start all apps with Turborepo |
| `pnpm build` | Root | Build all packages (cached) |
| `pnpm lint` | Root | Lint all packages |
| `pnpm format` | Root | Format with Prettier |
| `pnpm dev` | `apps/web` | Next.js dev server with Turbopack |
| `pnpm build` | `apps/web` | Production build → `.next/` |
| `pnpm test` | `apps/web` | Run Vitest tests |
| `pnpm typecheck` | `apps/web` | TypeScript type checking |

---

## Deployment

- **Platform:** Vercel (config in `vercel.json`)
- **Build output:** `.next/` directory (excluding `.next/cache/`)
- **Dev server:** Turbopack-powered (`next dev --turbopack`)
