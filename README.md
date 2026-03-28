linkedin: www.linkedin.com/in/mayuri-dandekar-2a37ba299
portfolio: https://mays-portfolio1.vercel.app/

Coding Duo: Mayuri Dandekar
(My duo forgot to accept the invitation)

# ContentOps

> AI-powered content operations — from brief to multi-channel publication in under a minute.

ContentOps is a full-stack platform that runs a five-agent AI pipeline to draft, review, localise, and publish content across multiple channels. It ships with a companion Chrome extension that scores the relevance of any webpage you visit against your content niche.

---

## Screenshots

> Add screenshots here after deploying or recording a demo.

---

## Features

**Pipeline**
- Submit a brief (topic, tone, audience, channels) and five AI agents run in sequence — Drafter, Brand Reviewer, Compliance Officer, Localizer, Publisher
- Real-time step tracking with per-agent duration and status
- Human-in-the-loop approval gates built into the flow, not added on top

**Content Studio**
- One-form brief creation with tone selector and channel targeting
- Pre-fill from the Signal radar or Chrome extension capture with one click

**Signal Radar**
- Animated SVG radar showing trending topics scored by search heat
- Gap detection — highlights topics your competitors cover that you haven't
- One-click brief generation from any signal

**Compliance Engine**
- Flags violations at the sentence level, not as a bulk score
- Inline suggested rewrites for every flagged issue
- Tracks resolution history per output

**Localization**
- Adapts content across 14 languages with cultural context, not just translation
- Per-language quality scoring

**Analytics**
- Output volume, compliance rate, channel performance, engagement trends
- Content mix breakdown by format

**Content Library**
- Full archive of every pipeline run and its outputs
- Search by topic, copy any output, delete runs

**Muse — in-app AI assistant**
- Floating chat button on every page in the app
- Answers questions about any part of the platform in natural language
- Built to be replaced with a live LLM endpoint

**Chrome Extension**
- Reads any page you visit and marks content relevance with colored dots
- Green dot = on-topic, red dot = off-topic
- Works on YouTube thumbnails, Google Search, Google News, and generic news/article sites
- Text selection triggers a capture chip — sends the selected context directly into the brief form
- Popup with Quick Brief tab, Signals tab, and Recent pipeline runs

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Framer Motion, Recharts, Lucide React, Vite 8 |
| Backend | Node.js, Express 5, Prisma ORM, PostgreSQL |
| Vector DB | Weaviate (included, for future semantic search) |
| Validation | Zod |
| Extension | Chrome Manifest V3, content script, service worker |
| Infra | Docker Compose (PostgreSQL + Weaviate) |

---

## Project structure

```
/
├── src/
│   ├── pages/          # Dashboard, Studio, Pipeline, Analytics, Signal, Library, ...
│   ├── components/
│   │   ├── Layout/     # Sidebar, TopBar
│   │   ├── Muse/       # AI chat assistant
│   │   └── UI/         # Card, Button, Badge, Tabs, SectionHeader, ...
│   ├── api/            # Typed fetch client
│   └── hooks/          # useApi, useMutation
├── server/
│   ├── routes/         # briefs, pipeline, content, compliance, localization, distribution, analytics
│   ├── prisma/         # schema, migrations, seed data
│   └── index.js
├── extension/
│   ├── manifest.json
│   ├── content.js      # relevance scoring + dot injection
│   ├── background.js   # service worker, context menu, badge
│   ├── popup.*         # extension popup UI
│   └── icons/
└── docker-compose.yml
```

---

## Getting started

### Prerequisites

- Node.js 20+
- Docker

### 1. Clone

```bash
git clone https://github.com/your-username/contentops.git
cd contentops
```

### 2. Start the databases

```bash
docker-compose up -d
```

Starts PostgreSQL on `5432` and Weaviate on `8080`.

### 3. Backend

```bash
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Runs at `http://localhost:3001`.

### 4. Frontend

Open a new terminal from the project root:

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### 5. Chrome extension (optional)

1. Go to `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder

---

## Environment variables

`server/.env` (copy from `.env.example`):

```env
DATABASE_URL=postgresql://contentops:contentops@localhost:5432/contentops
WEAVIATE_URL=http://localhost:8080
PORT=3001
NODE_ENV=development
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Landing — features, pricing |
| `/app` | Dashboard |
| `/app/studio` | Content Studio |
| `/app/pipeline` | Agent Pipeline |
| `/app/compliance` | Compliance |
| `/app/localization` | Localization |
| `/app/distribution` | Distribution |
| `/app/analytics` | Analytics |
| `/app/signal` | Signal Radar |
| `/app/library` | Content Library |
| `/app/scenarios` | Scenarios |
| `/app/settings` | Settings |

---

## Pricing

| Plan | Price | Limits |
|---|---|---|
| Starter | Free | 3 runs/month, 2 agents |
| Pro | $49 / month | Unlimited runs, all agents, Signal, Chrome extension |
| Enterprise | Custom | Custom agents, SSO, API access, white-label |

---

## Development notes

- Vite proxies `/api/*` to `http://localhost:3001` — no CORS configuration needed in development.
- `db:seed` fills the database with realistic demo data so the UI has content on first run.
- Weaviate is not required for core functionality. The server starts without it.
- Trend signals in the Signal page and extension popup are hardcoded placeholder data. A real trends API would replace `ALL_SIGNALS` and `SIGNALS` in production.
- The Muse assistant uses keyword-matched responses. Swap `getReply()` in `src/components/Muse/Muse.jsx` for a fetch call to wire it to an LLM.

---

## License

MIT
