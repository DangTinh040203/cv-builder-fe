# Template & PDF System

The PDF generation pipeline that transforms Redux state into downloadable PDF resumes.

---

## Architecture

```text
Format Config (Redux) ──┐
Resume Data (Redux) ────┤
                        ▼
        ┌──────────────────────────┐
        │   Template Component     │
        │  (Template01/Template02) │
        │         │                │
        │         ▼                │
        │   SectionRegistry       │
        │   (renders sections)     │
        │         │                │
        │         ▼                │
        │   @react-pdf/renderer   │
        │   <Document>/<Page>     │
        └──────────────────────────┘
                   │
        ┌──────────▼───────────────┐
        │   TemplateWrapper        │
        │   (PDF viewer / preview) │
        └──────────┬───────────────┘
                   │
        ┌──────────▼───────────────┐
        │   DownloadPdf            │
        │   (PDF file export)      │
        └──────────────────────────┘
```

---

## Templates

| Template | ID            | Style        | Key Characteristics                                                                                                             |
| -------- | ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Classic  | `template-01` | Traditional  | Left-aligned header, full-width separator lines, bordered project tables                                                        |
| Modern   | `template-02` | Contemporary | Centered header, uppercase titles, wide letter-spacing, accent bar separators, borderless project cards, soft background colors |

### Template Configuration (`configs/template.config.ts`)

Templates are registered in a configuration map:

```typescript
export const TEMPLATES: Record<string, TemplateProfile> = {
  "template-01": { id: "template-01", name: "Classic", component: Template01 },
  "template-02": { id: "template-02", name: "Modern", component: Template02 },
};
```

---

## Template Style Hooks

Each template has a dedicated style hook that generates `@react-pdf/renderer` `StyleSheet` objects based on the current `Format` configuration:

| Hook                         | Template     | Located In            |
| ---------------------------- | ------------ | --------------------- |
| `useTemplateStyle(format)`   | Classic (01) | Template 01 directory |
| `useTemplate02Style(format)` | Modern (02)  | Template 02 directory |

Both hooks return:

- `styles` — Complete `StyleSheet` object for react-pdf
- `TableRow` — A React component for rendering table rows

---

## Section Registry (`section-registry.tsx`)

A centralized registry that maps `SectionType` to render functions:

```typescript
interface SectionRendererProps {
  resume: Resume;
  styles: Record<string, any>;
  TableRow: React.FC<...>;
  formatDate: (date: string) => string;
  format: Format;
}
```

Registered sections: `personal`, `summary`, `skills`, `education`, `experience`, `projects`, `certifications`, `languages`

The registry enables:

- **Section ordering** — Rendered in the order defined by `format.sectionOrder`
- **Section hiding** — Sections in `format.hiddenSections` are skipped
- **Template agnostic** — Both templates use the same registry interface

---

## PDF Components

| Component         | File                   | Purpose                                                                      |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------- |
| `DocumentPDF`     | `document-pdf.tsx`     | Wraps template in `<Document>` for react-pdf rendering                       |
| `TemplateWrapper` | `template-wrapper.tsx` | Responsive PDF viewer with A4 aspect ratio scaling                           |
| `DownloadPdf`     | `download-pdf.tsx`     | Triggers PDF generation and file download via `file-saver`                   |
| `HtmlToPdf`       | `html-to-pdf.tsx`      | Converts HTML content (from rich text editor) to react-pdf `<Text>` elements |

---

## A4 Dimensions

```typescript
const A4_SIZE = { width: 21, height: 29.7 }; // cm
const A4_PX_SIZE = { width: 595.28, height: 841.89 }; // px at 72 DPI
```

---

## Style Configuration (`configs/template-style.config.ts`)

Global PDF style defaults for `@react-pdf/renderer`:

| Category       | Available Options                            |
| -------------- | -------------------------------------------- |
| Gap spacing    | `gapSm`, `gapMd`, `gapLg`, `gapXl`, `gap2xl` |
| Font weights   | 300–900, with italic variants                |
| Heading sizes  | h1–h5                                        |
| Text alignment | left, center, right, justify                 |
| Page layout    | Default margins, padding                     |

---

## Rendering Pipeline

```text
1. User selects template → dispatch(setTemplateSelected("template-01"))
2. Builder page loads → look up template component from TEMPLATES map
3. Resume data + Format config read from Redux store
4. Template component renders with <Document><Page>...</Page></Document>
5. SectionRegistry iterates format.sectionOrder, skipping hiddenSections
6. Each section renders using styles from the template's style hook
7. HTML fields (description, summary) converted via HtmlToPdf
8. TemplateWrapper displays live preview with A4 aspect ratio
9. DownloadPdf generates blob via @react-pdf/renderer and triggers download
```
