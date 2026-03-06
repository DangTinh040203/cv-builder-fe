# Testing

Testing setup and conventions for the frontend application.

---

## Stack

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| Vitest | 4.0.18 | Test runner |
| @testing-library/react | 16.3.2 | React component testing |
| @testing-library/jest-dom | — | DOM assertion matchers |
| @testing-library/user-event | — | User interaction simulation |
| jsdom | — | Browser environment simulation |

---

## Configuration

### `vitest.config.ts`

- **Environment:** jsdom
- **Setup file:** `vitest.setup.ts` (imports `@testing-library/jest-dom`)
- **Globals:** Enabled (no need to import `describe`, `it`, `expect`)

### TypeScript Support

Vitest globals are included in TypeScript via:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

---

## Running Tests

```bash
# From apps/web directory
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage
```

---

## Conventions

- Test files are colocated with source files or in `__tests__/` directories
- Use `@testing-library/react` for component rendering
- Use `@testing-library/user-event` for simulating user interactions
- Prefer querying by role, label, or text over test IDs
