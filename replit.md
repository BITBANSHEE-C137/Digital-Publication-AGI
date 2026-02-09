# replit.md

## Overview

This is a content-driven reading application called **"When We Outsourced Thinking"** — an editorial/academic-style web app that presents a long-form essay (or book-like document) broken into navigable sections. The content is stored in a PostgreSQL database as markdown, parsed from a `.docx` file, and rendered with an interactive reading experience including a sidebar table of contents, reading progress bar, glossary panel with inline term annotations, and smooth page transitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router) with two main routes: Home (`/`) and SectionPage (`/section/:slug`)
- **State Management**: `@tanstack/react-query` for server state (fetching sections from the API)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming. Editorial/academic design with serif fonts (Merriweather, Playfair Display) and warm paper-like palette. Home page hero section uses BitBanshee dark/teal imagery (background at `client/public/images/bitbanshee-bg.jpg`) with custom CSS classes in `index.css`
- **Animations**: Framer Motion for page transitions and reveal animations
- **Content Rendering**: `react-markdown` for rendering markdown content stored in the database
- **Interactive Features**: Inline glossary term annotations (defined in `client/src/lib/glossary.ts`), collapsible sections, reading progress bar

### Backend (Express)
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API**: Simple REST API with two endpoints:
  - `GET /api/sections` — returns all sections ordered by `order` field
  - `GET /api/sections/:slug` — returns a single section by slug
- **API Contract**: Shared route definitions in `shared/routes.ts` with Zod validation schemas, used by both client and server
- **Dev Server**: Vite dev server is integrated as middleware during development (see `server/vite.ts`), with HMR support
- **Production**: Client is built to `dist/public`, server is bundled with esbuild to `dist/index.cjs`

### Database (PostgreSQL + Drizzle ORM)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema**: Single table `sections` with fields: `id`, `slug`, `title`, `content` (markdown text), `order`, `published`
- **Connection**: `node-postgres` Pool using `DATABASE_URL` environment variable
- **Migrations**: Drizzle Kit with `db:push` command for schema sync
- **Seeding**: `server/parse-and-seed.ts` parses a `.docx` file (using `mammoth`) into markdown sections and inserts them into the database

### Shared Code (`shared/`)
- `schema.ts` — Drizzle table definitions and Zod insert schemas, shared types
- `routes.ts` — API route definitions with path constants, HTTP methods, and response schemas. Provides a `buildUrl` helper for parameterized routes

### Key Design Patterns
- **Monorepo-style structure**: `client/`, `server/`, and `shared/` directories with path aliases (`@/`, `@shared/`)
- **Type-safe API contracts**: Route definitions with Zod schemas shared between frontend and backend
- **Storage abstraction**: `IStorage` interface in `server/storage.ts` with `DatabaseStorage` implementation
- **Content pipeline**: DOCX → markdown conversion → database seeding → API → React rendering with interactive annotations

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Uses `connect-pg-simple` for session storage capability and `node-postgres` (`pg`) as the driver.

### Key npm Packages
- **Drizzle ORM + Drizzle Kit** — Database ORM and migration tooling
- **mammoth** — DOCX to markdown conversion (used in seeding script)
- **react-markdown** — Markdown rendering in the browser
- **framer-motion** — Animation library
- **wouter** — Lightweight React router
- **shadcn/ui + Radix UI** — Component library ecosystem
- **Zod** — Schema validation (shared between client and server)
- **@tanstack/react-query** — Async state management for API calls

### Fonts (External CDN)
- Google Fonts: Inter, Merriweather, Playfair Display, Fira Code, Geist Mono, Architects Daughter

### Build Tools
- **Vite** — Frontend bundler with React plugin
- **esbuild** — Server bundler (used in `script/build.ts`)
- **tsx** — TypeScript execution for development
- **Replit plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev only)