# LEA Labs — Architecture

## 1. System overview

LEA Labs is a modular, multi-tenant-ready SaaS platform with a decoupled architecture:

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  Frontend (Vercel)          │  HTTPS │  API (Railway / Forge / VPS) │
│  Next.js 15 App Router      │ ─────► │  Laravel 12 (API only)       │
│  Server Components + RSC    │  JSON  │  Sanctum token auth          │
│  TanStack Query cache       │        │  spatie RBAC                 │
└─────────────────────────────┘        └──────────────┬───────────────┘
                                                      │
                                          ┌───────────┼───────────┐
                                          ▼           ▼           ▼
                                      MySQL 8    R2 / S3     M-Pesa · Stripe
                                      (source    (files,     (payments, webhooks)
                                       of truth)  media)
```

- **Frontend**: Next.js 15 App Router, TypeScript strict, Tailwind + shadcn/ui design system. Server Components are the default; Client Components are used only for interactivity (forms, tables, charts, editor).
- **Backend**: Laravel 12 in API-only mode. Sanctum issues personal-access bearer tokens; `spatie/laravel-permission` provides roles and a granular, expandable permission registry.
- **Communication**: typed REST JSON. The frontend never talks to the database — every screen consumes an API resource.
- **Storage**: Administrator-uploaded documents are stored in Firebase Storage under organized `admin-documents/{administrator}/{destination}/...` paths, with searchable metadata in Firestore. The Laravel backend's existing R2/S3 disk remains available for legacy/general media until those flows are migrated.

## 2. Module layout (frontend)

The app is organized **by feature**, not by file type:

```
frontend/
├── app/                          # Next.js App Router (routes = features)
│   ├── (auth)/login|register|forgot-password|reset-password|verify-email
│   ├── (dashboard)/
│   │   ├── admin/                # guarded by role:admin
│   │   ├── instructor/           # guarded by role:instructor
│   │   └── learner/              # guarded by role:learner
├── components/
│   ├── ui/                       # shadcn/ui primitives (button, card, table, dialog…)
│   └── shared/                   # app-level primitives (data-table, page-header, empty-state…)
├── modules/
│   ├── dashboard/
│   ├── learners/
│   ├── instructors/
│   ├── programmes/
│   ├── courses/
│   ├── content-library/
│   ├── classes/
│   ├── attendance/
│   ├── assessments/
│   ├── coding-playground/
│   ├── certificates/
│   ├── portfolio/
│   ├── corporate/
│   ├── schools/
│   ├── partnerships/
│   ├── tech-services/
│   ├── finance/
│   ├── hr/
│   ├── events/
│   ├── crm/
│   └── reports/
├── services/                     # typed API layer (one client per module)
├── hooks/                        # React Query hooks per module
├── lib/                          # api client, auth store, utils, constants
├── types/                        # shared domain types (mirrors API resources)
└── validation/                   # Zod schemas (shared with React Hook Form)
```

Every feature module contains: `components/`, `api.ts`, `types.ts`, `hooks.ts`, `validation/`, and consumes `services/` + `lib/api-client`.

## 3. Backend layout

Laravel 12 uses the standard structure with feature-first organization inside `app/`:

```
backend/app/
├── Http/
│   ├── Controllers/Api/          # one controller per resource (V1)
│   ├── Middleware/               # EnsureRole, ForceJson, AuditLog…
│   ├── Requests/                 # FormRequest validation per operation
│   └── Resources/                # API Resources (shape contracts)
├── Models/                       # Eloquent models
├── Services/                     # business logic (payments, certificates, grading…)
├── Policies/                     # authorization policies
└── Enums/                        # shared enums (status, roles, programme types…)
```

## 4. Data model (core entities)

- **Identity & access**: `users` (UUID), `roles`, `permissions`, `model_has_roles`, `role_has_permissions`, `password_reset_tokens`, `personal_access_tokens`
- **Learning**: `programmes`, `courses`, `course_modules`, `lessons`, `lesson_assets`, `enrolments`, `assignments`, `assignment_submissions`, `quizzes`, `quiz_questions`, `quiz_attempts`, `attendance`, `assessments`, `assessment_submissions`, `rubrics`, `certificates`
- **Learner record**: `learner_profiles`, `guardians`, `institutions`, `progress_entries`, `portfolio_projects`, `portfolio_assets`, `learner_notes`
- **Operations**: `class_schedules`, `venues`, `content_assets`, `content_folders`, `tags`
- **Corporate & schools**: `companies`, `departments`, `employees`, `schools`, `teachers`, `students`, `computer_labs`, `lab_devices`, `lab_visits`
- **Partners & services**: `partners`, `mous`, `partner_meetings`, `funding`, `service_projects`, `support_tickets`
- **Finance**: `payments`, `invoices`, `invoice_items`, `expenses`, `scholarships`, `discounts`
- **People & org**: `staff`, `volunteers`, `contracts`, `payroll_entries`, `leave_requests`, `event_events`(events), `event_registrations`
- **Engagement**: `crm_leads`, `crm_meetings`, `follow_ups`, `messages`, `notifications`
- **Observability**: `audit_logs`

Key conventions: UUID primary keys on business entities, `bigint` identities on pure join/pivot tables; foreign keys indexed; soft deletes on master data; timestamps everywhere; JSON columns for flexible metadata (e.g. lesson `content`).

## 5. Auth & authorization

- **Authentication**: Sanctum bearer tokens (API). `POST /api/v1/auth/login` → token + user + roles/permissions. 401 handling on the client triggers a single silent re-login; sessions persist in an auth store.
- **Password flows**: forgot → emailed reset link → reset. Email verification on registration.
- **Authorization**: role-based (Administrator / Instructor / Learner) + permission-based granular checks via policies and the `EnsureRole` middleware for route groups.
- **Audit**: `AuditLog` middleware + service records mutating operations (who, what, when, diff).

## 6. API conventions

- Base path: `/api/v1`
- Resource style: `GET/POST /resources`, `GET/PUT|PATCH/DELETE /resources/{uuid}`
- List endpoints: `?page=`, `per_page`, `search`, `sort`, `filter[field]=`
- Responses: `{ "data": …, "meta": { "pagination": … } }` (Laravel API Resource conventions)
- Errors: `{ "message": …, "errors": { field: [] } }` with proper HTTP status codes
- Validation: FormRequests on the backend, matching Zod schemas on the frontend
- Versioned from day one (`/api/v1`) so breaking changes never strand clients

## 7. Frontend data flow

- `lib/api-client` — typed fetch wrapper: base URL from `NEXT_PUBLIC_API_URL`, bearer token injection, 401 refresh, error normalization.
- `services/*` — one module per domain, functions returning typed promises.
- `hooks/*` — TanStack Query hooks (queries + mutations) with stale-time defaults, optimistic updates for fast interactions, invalidations after mutations.
- Forms — React Hook Form + Zod (schema-first, shared validation).
- Tables — TanStack Table with server-side pagination/search/sort via URL search params.

## 8. Security

- Sanctum bearer auth, CORS locked to the frontend origin, `Accept: application/json` enforcement
- Role middleware + policies on every resource; input validation on every write
- Rate limiting ready (`throttle:api`), CSRF protection for stateful/cookie flows, audit logging
- No secrets in code; all config via environment variables
- Payments: M-Pesa STK Push + callback verification, Stripe webhook signature verification, idempotency keys

## 9. Performance

- Server Components + streaming; client islands only where needed
- Route-level code splitting via Next.js dynamic imports (charts, editors, QR)
- `next/image` optimization; Firebase Storage download routes for private administrator documents and R2/S3 URLs for legacy/general media
- Paginated APIs, memoized selectors, React Query caching & dedup
- Database indexes on all FK + frequently-filtered columns; eager loading to avoid N+1

## 10. Deployment

- **Frontend → Vercel**: zero-config. Env: `NEXT_PUBLIC_API_URL`. Optional rewrites proxy `/api/*` to the backend.
- **Backend → Railway / Forge / VPS**: `php artisan migrate --force`, scheduler + queue workers for notifications and exports.
- **Storage**: Firebase Storage must be configured with `FIREBASE_STORAGE_BUCKET` and Firebase Admin credentials in Vercel. Private administrator documents are downloaded through authenticated Next.js routes; no document bytes are written to the local filesystem.
- **CI guardrails**: `tsc --noEmit`, `eslint`, `next build` must pass with zero errors/warnings before deploy.

## 11. Future-proofing

- **AI features**: services layer isolates business logic (certificate generation, grading, analytics) so AI providers can slot in behind interfaces.
- **Mobile apps**: the REST API is the single client surface; the frontend is a consumer like any future app.
- **Multi-organization**: every org-scoped table carries `tenant_id`-style nullable ownership columns; RBAC + policies already support scoping by organization.
