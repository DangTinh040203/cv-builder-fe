# State Management

The application uses **Redux Toolkit** with **Redux Persist** for client-side state management.

---

## Architecture Overview

```text
┌─────────────────────────────────────────┐
│            StoreProvider                 │
│  ┌───────────────────────────────────┐  │
│  │  Redux Store (configureStore)     │  │
│  │  ┌─────────────┬───────────────┐  │  │
│  │  │   resume    │   template    │  │  │
│  │  │   slice     │   slice       │  │  │
│  │  └─────────────┴───────────────┘  │  │
│  │  + Redux Persist (PersistGate)    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Store Configuration (`stores/store.ts`)

- **Root reducer:** Combines `resume` + `template` slices
- **Reset action:** `root/reset` clears entire state
- **Persistence:** Redux Persist with AsyncStorage adapter
- **Middleware:** Serializable check configured to ignore persist actions and date paths
- **Typed hooks:** `useAppDispatch`, `useAppSelector`, `useAppStore`

---

## Resume Slice (`stores/features/resume.slice.ts`)

Manages the user's resume data.

### Actions

| Action         | Payload           | Description                    |
| -------------- | ----------------- | ------------------------------ |
| `setResume`    | `Resume \| null`  | Set or clear entire resume     |
| `updateResume` | `Partial<Resume>` | Partially update resume fields |

### Selector

- `resumeSelector` — Access `state.resume`

---

## Template Slice (`stores/features/template.slice.ts`)

Manages template selection and formatting configuration.

### Actions

| Action                       | Payload           | Description                |
| ---------------------------- | ----------------- | -------------------------- |
| `updatePreviewMode`          | `boolean`         | Toggle preview mode on/off |
| `updateTemplateConfigFormat` | `Partial<Format>` | Update formatting options  |
| `setTemplateSelected`        | `string \| null`  | Select active template     |

### Selectors

- `templateConfigSelector` — Full template config (format + previewMode)
- `templateFormatSelector` — Format settings only
- `templateSelectedSelector` — Selected template ID

---

## Format Configuration

The `Format` interface defines all customizable aspects of PDF output:

```typescript
interface Format {
  // Typography
  fontSize: number; // Default: 11
  titleSize: number; // Default: 30
  sectionTitleSize: number; // Default: 14
  subTitleSize: number; // Default: 14
  lineHeight: number; // Default: 1.8
  fontWeight: FontWeight; // "normal" | "medium" | "semibold" | "bold"
  letterSpacing: number; // Default: 0

  // Layout
  sectionSpacing: number; // Default: 10
  margin: number; // Default: 20
  pageFormat: "A4";
  columnLayout: ColumnLayout; // "single" | "double"
  sectionOrder: SectionType[];
  hiddenSections: SectionType[];
  headerStyle: HeaderStyle; // "left" | "center"

  // Appearance
  color: string; // Default: "blue"
  theme: Theme; // "light" | "dark" | "auto"
  borderStyle: BorderStyle; // "none" | "simple" | "double" | "accent"
  dateFormat: string; // Default: "MM/YYYY"
}
```

### Section Types

`personal`, `summary`, `skills`, `education`, `experience`, `projects`, `certifications`, `languages`

---

## Data Flow Pattern

```text
User Input (Forms) → dispatch(updateResume(...)) → Redux Store
                                                       │
User clicks "Save" → useSyncResume().sync() ──────────▼
                                                 API PUT /resumes/:id
                                                       │
                                                 dispatch(setResume(response))
                                                       │
                                           PDF Template re-renders from store
```

The Redux store is the **single source of truth** for both the form display and the PDF preview. When a user edits a form field, the change is dispatched to the store, and the PDF template component re-renders reactively.
