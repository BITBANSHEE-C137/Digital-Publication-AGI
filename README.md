# When We Outsourced Thinking

**AGI, Oversight, and the Business of Artificial Intelligence**

By [Glenn Rowe](https://www.linkedin.com/in/gwrowe/) | [glenn@siliconstrategy.ai](mailto:glenn@siliconstrategy.ai)

Live at: [whenweoutsourcedthinking.siliconstrategy.ai](https://whenweoutsourcedthinking.siliconstrategy.ai)

---

## About the Paper

This paper argues that advancing AI capabilities and declining human cognitive oversight capacity are converging toward a critical failure condition: the **Safety Inversion**. Drawing on PIAAC, NAEP, and NAAL data, it documents sustained declines in foundational literacy and numeracy among U.S. adults and proposes a five-pillar operational definition of Artificial General Intelligence.

The thesis: The systems most requiring human oversight are increasingly evaluated by populations measurably less equipped to provide it. This is not a future risk — it is a present condition.

Written from 30 years inside the machine — from encrypted satellite communications in forward-deployed combat zones to enterprise cloud architecture.

## Features

- **Interactive Reading Experience** — Navigable sections with smooth page transitions, reading progress bar, and sidebar table of contents
- **Glossary Annotations** — Inline term definitions appear on hover for key concepts
- **Claim Verification** — Verifiable claims are highlighted; click to search for live evidence via Perplexity API
- **Text-to-Speech** — Embedded Speechify TTS audio playback per section (browser extension compatible)
- **PDF Download** — SSRN-formatted PDF available for offline reading
- **TL;DR Popup** — Six-paragraph summary accessible from the hero section

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend**: Express 5, Node.js, TypeScript
- **Database**: PostgreSQL (Drizzle ORM)
- **APIs**: Perplexity (claim verification), Speechify (text-to-speech)
- **Content Pipeline**: DOCX → Markdown → PostgreSQL → React rendering

## Project Structure

```
client/          # React frontend (Vite)
  src/
    components/  # UI components (sidebar, glossary, audio player, etc.)
    pages/       # Route pages (Home, SectionPage, About)
    hooks/       # Custom React hooks
    lib/         # Utilities, glossary definitions, query client
  public/        # Static assets (PDF, images, robots.txt)
server/          # Express backend
  routes.ts      # API endpoints
  storage.ts     # Database access layer
  seed-data.ts   # Section content for database seeding
shared/          # Shared types and schemas
  schema.ts      # Drizzle table definitions
  routes.ts      # API route contracts
```

## Running Locally

```bash
npm install
npm run db:push
npm run dev
```

Requires a PostgreSQL database (`DATABASE_URL`) and optional API keys for Perplexity (`PERPLEXITY_API_KEY`) and Speechify (`SPEECHIFY_API_KEY`).

## License

All rights reserved. Content and code are the intellectual property of the author.

## Contact

- LinkedIn: [linkedin.com/in/gwrowe](https://www.linkedin.com/in/gwrowe/)
- GitHub: [github.com/BITBANSHEE-C137](https://github.com/BITBANSHEE-C137)
- Email: [glenn@siliconstrategy.ai](mailto:glenn@siliconstrategy.ai)
