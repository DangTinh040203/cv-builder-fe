# Styling & Animations

The styling stack combines Tailwind CSS 4, custom theme tokens, and Framer Motion animations.

---

## CSS Stack

```text
Tailwind CSS 4.x (utility-first)
    ├── @shared/ui/globals.css     (shared component styles)
    ├── styles/theme.css           (app theme tokens)
    └── Component-level classes    (Tailwind utilities)
```

---

## Theme System (`styles/theme.css`)

Custom CSS variables using the **oklch** color space:

### Colors

- **Primary:** Purple — `oklch(0.4919 0.2403 293.54)`
- Full palette with foreground/background variants for all UI states

### Custom Gradients

| Variable             | Usage                     |
| -------------------- | ------------------------- |
| `--gradient-primary` | Primary accent gradient   |
| `--gradient-hero`    | Hero section background   |
| `--gradient-card`    | Card hover effects        |
| `--gradient-subtle`  | Subtle background accents |

### Custom Shadows

| Variable        | Level                       |
| --------------- | --------------------------- |
| `--shadow-sm`   | Subtle elevation            |
| `--shadow-md`   | Card elevation              |
| `--shadow-lg`   | Modal elevation             |
| `--shadow-xl`   | Dropdown elevation          |
| `--shadow-glow` | Glow effect (purple tinted) |

### Utility Classes

- `.gradient-text` — Gradient text effect
- `.gradient-bg` — Gradient background
- Sidebar color tokens — Complete sidebar color system

---

## Animation System (`styles/animation.ts`)

Pre-defined Framer Motion animation variants:

| Variant                 | Effect                | Usage             |
| ----------------------- | --------------------- | ----------------- |
| `fadeInUp`              | Fade in + slide up    | Section entrances |
| `fadeInDown`            | Fade in + slide down  | Header animations |
| `fadeInLeft`            | Fade in + slide left  | Sidebar items     |
| `fadeInRight`           | Fade in + slide right | Content reveals   |
| `scaleIn`               | Fade in + scale up    | Cards, buttons    |
| `staggerContainer`      | Stagger children      | List containers   |
| `formContainerVariants` | Form-specific stagger | Builder forms     |
| `formItemVariants`      | Individual form field | Form inputs       |
| `buttonScaleVariants`   | Button entrance       | CTA buttons       |

### Usage Pattern

```tsx
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/styles/animation";

<motion.div variants={staggerContainer} initial="initial" animate="animate">
  <motion.p variants={fadeInUp}>Animated content</motion.p>
</motion.div>;
```

---

## Component Styling Approach

- **Utility-first:** Tailwind CSS classes in JSX
- **Class merging:** `cn()` from `@shared/ui/lib/utils` (clsx + tailwind-merge)
- **Responsive:** Mobile-first breakpoints (`sm`, `md`, `lg`, `xl`)
- **Dark mode:** Supported via `next-themes` + CSS custom properties
- **Scrollbar:** Custom scrollbar styles via `tailwind-scrollbar` plugin
