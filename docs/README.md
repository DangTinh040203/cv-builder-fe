# CVCraft Frontend

> Frontend documentation for the CVCraft AI-powered CV Builder.

## Overview

**CVCraft** is an AI-powered CV/resume builder web application built with Next.js 16. It enables users to create professional resumes using customizable templates, parse existing resumes via AI, and match their resumes against job descriptions for optimization.

## Key Features

- 🤖 **AI-Powered Resume Parsing** — Upload a PDF/DOCX and auto-parse into structured data
- 📝 **Real-time CV Builder** — Step-by-step form-based builder with live PDF preview
- 🎨 **Multiple Templates** — "Classic" and "Modern" template designs with full customization
- 🎯 **JD Matching** — AI-powered job description matching with scoring and improvement suggestions
- 📄 **PDF Export** — High-quality PDF generation via `@react-pdf/renderer`
- 🔐 **Clerk Authentication** — Email/password auth with OTP verification
- 📱 **Responsive Design** — Mobile-first adaptive layouts

## Tech Stack

| Category | Technology | Version |
| -------- | ---------- | ------- |
| Framework | Next.js (App Router, Turbopack) | 16.0 |
| Language | TypeScript | 5.9 |
| UI Library | React | 19.2 |
| Monorepo | Turborepo + pnpm workspaces | 2.6 |
| State | Redux Toolkit + Redux Persist | 2.11 |
| Auth | Clerk (`@clerk/nextjs`) | 6.36 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix) | 4.x |
| PDF | @react-pdf/renderer | 4.3 |
| Forms | React Hook Form + Zod | 7.69 |
| Animation | Framer Motion | 12.23 |
| HTTP | Axios | 1.13 |
| Testing | Vitest + Testing Library | 4.0 |

## Quick Links

- [Project Structure](project-structure/folder-structure.md)
- [Routing & Layouts](project-structure/routing.md)
- [State Management](architecture/state-management.md)
- [API Integration](architecture/api-integration.md)
- [Authentication](architecture/authentication.md)
- [Template & PDF System](features/template-pdf-system.md)
- [CV Builder Feature](features/cv-builder.md)
- [Styling & Animations](development/styling.md)
- [Environment & Configuration](development/configuration.md)
