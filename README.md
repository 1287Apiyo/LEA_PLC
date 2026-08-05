# LEA Labs — Integrated Learning & Operations Platform

The digital operating system for LEA Labs: learning, operations, corporate training, technology services, partnerships, finance, reporting, and organizational workflows — in one production-ready SaaS platform.

## Repository layout

```
LEASYSTEM/
├── frontend/          # Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
├── backend/           # Laravel 12 (API-only) + Sanctum + MySQL
├── docs/              # Architecture, API contracts, deployment guides
├── composer.bat       # Composer wrapper (loads PHP zip extension on Windows)
└── composer.phar      # Local Composer binary (gitignored)
```

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Table, TanStack Query, Framer Motion, Recharts |
| Backend | Laravel 12 (API only), Laravel Sanctum, REST API, spatie/laravel-permission |
| Database | MySQL (normalized schema, UUIDs where appropriate) |
| Storage | Cloudflare R2 (S3-compatible, future-ready for AWS S3) |
| Payments | M-Pesa (STK Push), Stripe, bank |
| Notifications | Email (SMTP), SMS, WhatsApp |
| Deployment | Frontend → Vercel · Backend → VPS / Railway / Laravel Forge |

## Roles

- **Administrator** — full platform control
- **Instructor** — classes, grades, learner analytics
- **Learner** — portal: courses, assignments, certificates, portfolio

Permissions are granular and expandable (spatie RBAC registry).

## Getting started

### Prerequisites

- Node.js ≥ 20
- PHP ≥ 8.2 (with `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `zip` for Composer)
- Composer — use the workspace wrapper: `composer.bat` (Windows) or `php composer.phar` (any OS)
- MySQL ≥ 8

### Backend

```bash
cd backend
copy .env.example .env        # Windows
# set DB_* values, APP_URL, SANCTUM_STATEFUL_DOMAINS, frontend URL
..\composer.bat install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port 8000
```

### Frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 — sign in with the seeded demo accounts (see `backend/database/seeders`).

## Environment variables

See `.env.example` in each app. **No secrets are committed.** All configuration is environment-driven so the frontend deploys to Vercel unchanged and the API deploys to Railway / Forge / VPS unchanged.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full design: module map, data model, API conventions, security model, and deployment strategy.

## Module map

Dashboard · Learner Management · Instructor Management · Programmes & Courses (Course Builder, Content Library) · Class Management & Attendance · Assessments & Coding Playground · Certificates & Portfolio · Corporate Training · School Management · Partnerships · Technology Services · Finance (M-Pesa / Stripe) · HR · Events · CRM · Reporting · Learner Portal · Instructor Portal
