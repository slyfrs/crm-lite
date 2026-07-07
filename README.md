# CRM-lite

Local educational CRM.

| Leads | Accounts |
|------|----------|
| ![Leads](public/leads.png) | ![Accounts](public/accounts.png) |
| **Pipeline** | **Dashboard** |
| ![Deals](public/deals.png) | ![Dashboard](public/dashboard.png) |

## Stack

- Next.js 16 (App Router, React 19)
- TypeScript
- PostgreSQL
- Prisma 6.19.3
- Zod
- Tailwind CSS 4
- Chart.js 4.5.1 + react-chartjs-2 5.3.1

## Quick Start

### 1. Install dependencies

```bash
npm install
```

Prisma Client is generated automatically (`postinstall`). Type check: `npm run typecheck`.

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — set your PostgreSQL connection parameters:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/crm_lite_db?schema=public"
```

Create the database if it doesn't exist yet:

```bash
createdb crm_lite_db
```

### 3. Apply migrations

```bash
npm run db:migrate
```

### 4. Seed demo data

```bash
npm run db:seed
```

### 5. Start dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Reset & Restart Data

```bash
npm run db:reset
```

Drops the database, re-applies migrations and runs the seed.

## Safe Schema Changes

1. Edit `prisma/schema.prisma`.
2. Create a migration: `npx prisma migrate dev --name <description>`.
3. If data is incompatible — `npm run db:reset`.

## CRM Entities

| Entity         | Description                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lead**       | Inbound request. Required field `source`: site, email, phone, referral, manual. Status: `new` or `converted`.                                        |
| **Account**    | Client company. Created when converting a lead or picked from existing ones. A company may have multiple contacts.                                    |
| **Contact**    | Contact person. Created when converting a lead. Linked to a company.                                                                                  |
| **Opportunity**| Deal. Can be created during conversion or separately for a converted lead. Linked to lead, company, contact.                                          |
| **Stage**      | Pipeline stage: New, Won, Lost.                                                                                                                       |
| **Activity**   | Activity: note or task (with dueDate and done). Linked to an opportunity. For tasks, due date is required on creation.                                |

## Business Rules

- **Lead conversion** — creates a contact; creates a new company or picks an existing one; a deal can be created during conversion or separately for a converted lead.
- Conversion requires: email and phone; when creating a new company — also its name.
- A non-converted lead has no related contact, company, deals or activities.
- A converted lead gets status `converted`; repeated conversion is forbidden.
- Deals can only be moved between stages if they are linked to a converted lead.
- Moving to "Won" requires an amount and a linked contact.
- Moving to "Lost" requires a loss reason.

## Quick Actions

- Convert a lead
- Create a deal (for a converted lead)
- Change deal stage (in card or on pipeline)
- Add a note or task to a deal
- Mark a task as done

## Dashboard

Separate `/dashboard` page with data from the current database (Prisma aggregate/groupBy):

- **KPI**: total leads, total deals, open deals amount (stage "New"), overdue tasks
- **Chart.js charts**: leads by status, leads by source, deals by pipeline stage
- **Lists**: recent leads, overdue tasks

## Pipeline

Stages: **New** → **Won** / **Lost**

## Project Structure

```
app/
  leads/          — list, card, create, edit leads
  accounts/       — list, card, edit accounts
  contacts/       — list, card, edit contacts
  opportunities/  — list, card, pipeline, edit deals
  dashboard/      — KPI cards, charts, lists
  actions/        — server actions (CRUD, conversion, stages, delete)
components/       — UI components (Badge, Card, Form, Chart, Sidebar, etc.)
lib/              — Prisma client, validation schemas, Dashboard data
prisma/           — schema.prisma, migrations, seed.ts
```

## Seed Data

The seed creates 6 leads, 4 companies, 5 contacts, 6 deals, 8 activities:

- **Leads**: 5 converted (Elena, Igor, Kira, Leonid, Nikita), 1 new (Marina); sources site, email, phone, referral, manual
- **Companies**: TechCorp (2 contacts: Elena, Igor), DesignLab, MediaGroup, BuildExpo
- **Deals**: all linked to converted leads — 4 in "New" (1 without amount), 1 in "Won", 1 in "Lost" with a loss reason
- **Activities**: 2 overdue tasks, 2 due today, 2 notes, 2 future tasks

## Demo Walkthrough

1. Start: `npm run dev` → http://localhost:3000
2. Leads list — cards with Source and Status labels, filters by source and status.
3. Open a non-converted lead (Marina Zaitseva) — conversion hint.
4. Click "Convert Lead" — create a new company or pick an existing one (e.g., TechCorp).
5. After conversion — lead card, contact and company each show separate "Relations" and "Deals" sections.
6. Go to "Deals" — cards with stage names.
7. Open a deal — add a task with a due date, mark as "Done".
8. "Pipeline" — 3 columns (New, Won, Lost), drag-and-drop stage change.
9. Try moving to "Won" without an amount — validation error.
10. Dashboard — KPI, charts by status/source/stage, lists.

## Known Limitations

- No authentication and roles.
- No realtime/websocket updates.
- No file attachments.
- No data export.