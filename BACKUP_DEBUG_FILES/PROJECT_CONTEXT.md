# MindSafe India — Project Context Document

> **Purpose:** This document is the single source of truth for any AI agent, developer, or collaborator working on this codebase. It describes what has been built, what is pending, all architectural decisions, data flow rules, and conventions. Keep this file updated as new features are built.
>
> **Last updated:** April 2026 — after RBAC + Saathi agent integration

---

## 1. What Is MindSafe India

MindSafe India is a **B2B SaaS mental health platform** built exclusively for Indian colleges and universities. It is sold to institutions (not students) and digitises the entire student mental health workflow — from early detection to counsellor connect.

**Business model:** Monthly/annual institutional subscription  
**Primary buyer:** Dean of Students, Student Welfare Officer, College Management  
**End users:** Students, Counsellors, Admins  
**Key differentiator:** NAAC compliance reports + AI-powered early detection + anonymous mode + admin analytics — no competitor has all five.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.4 (App Router) | `src/` directory, TypeScript |
| Styling | Tailwind CSS v4 + custom theme | Theme defined via `@theme` in `globals.css` — NOT `tailwind.config.ts` |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage |
| Auth | Supabase Auth | Role stored in `user_metadata.role` |
| AI Chatbot | Mistral Agents API | Agent: Saathi (`MISTRAL_AGENT_ID`) via `client.agents.complete()` |
| Assessment Engine | Pure logic (no AI) | ARIA — hardcoded + Supabase queries only |
| Charts | Recharts | All chart components are `"use client"` |
| Animations | Framer Motion | Installed, not yet wired up |
| SMS Alerts | Twilio | Crisis notifications to guardians |
| Email | Resend | Session reminders, onboarding, alerts |
| Payments | Razorpay | B2B institutional billing (not yet implemented) |
| Deployment | Vercel | One-click Next.js deploy |
| Middleware | `src/proxy.ts` | Next.js 16 uses `proxy` not `middleware` convention |

### Key packages installed
```
@supabase/supabase-js  @supabase/ssr
@mistralai/mistralai   (v2 — uses agents.complete, NOT chat.complete)
recharts               framer-motion
lucide-react           clsx  tailwind-merge  class-variance-authority
twilio                 resend  razorpay
```

---

## 3. Environment Variables

File: `mindsafe-india/.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Used only in server-side API routes

# Mistral — Saathi agent
MISTRAL_API_KEY=
MISTRAL_AGENT_ID=ag:your-agent-id  # Custom Saathi agent from Mistral console

# Twilio (crisis SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@mindsafe.in

# Razorpay (payments — not yet wired)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Project Structure

```
mindsafe-india/
├── src/
│   ├── proxy.ts                    # Next.js 16 middleware (auth + role routing)
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Google Fonts: Inter + DM Sans)
│   │   ├── globals.css             # Tailwind v4 @import + @theme variables
│   │   ├── page.tsx                # Landing page (buyer-facing)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── demo/page.tsx           # Demo booking form
│   │   ├── student/
│   │   │   ├── layout.tsx          # Auth guard + sidebar
│   │   │   ├── page.tsx            # Dashboard (server — transforms data before client)
│   │   │   ├── checkin/page.tsx    # ARIA check-in flow
│   │   │   ├── chat/page.tsx       # Saathi AI companion + consent toggle
│   │   │   ├── progress/page.tsx   # 30-day wellness history (no clinical data)
│   │   │   ├── resources/page.tsx  # Wellness content library
│   │   │   └── sessions/
│   │   │       ├── page.tsx        # Session history
│   │   │       └── book/page.tsx   # Book a session
│   │   ├── counsellor/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Triage dashboard
│   │   │   ├── students/
│   │   │   │   ├── page.tsx        # All students list
│   │   │   │   └── [id]/page.tsx   # Student profile (clinical scores + severity)
│   │   │   ├── sessions/page.tsx
│   │   │   ├── alerts/page.tsx     # Open + resolved alerts with resolve button
│   │   │   └── resources/page.tsx  # Prescribe resources to students
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Campus KPI dashboard
│   │   │   ├── analytics/page.tsx  # 30-day trend charts
│   │   │   ├── counsellors/page.tsx
│   │   │   ├── alerts/page.tsx     # Anonymized crisis alerts
│   │   │   ├── resources/page.tsx  # Resource manager
│   │   │   ├── reports/page.tsx    # NAAC compliance report + PDF
│   │   │   └── settings/page.tsx   # College info + bulk CSV onboarding
│   │   └── api/
│   │       ├── chat/route.ts       # Saathi agent call + crisis detection
│   │       ├── alerts/trigger/route.ts  # Twilio SMS + Resend email
│   │       ├── auth/signout/route.ts
│   │       └── admin/onboard/route.ts   # Bulk user creation (service role)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx           # Includes RiskBadge (counsellor/admin only)
│   │   │   ├── input.tsx
│   │   │   └── stat-card.tsx
│   │   ├── shared/
│   │   │   └── sidebar.tsx         # Role-aware sidebar (student/counsellor/admin)
│   │   ├── student/
│   │   │   ├── dashboard-client.tsx  # Student dashboard (no clinical data)
│   │   │   ├── mood-trend-chart.tsx  # Emotion-based line chart (no score numbers)
│   │   │   └── mood-history.tsx      # 30-day bar chart (emotion colours only)
│   │   ├── counsellor/
│   │   │   ├── student-trend-chart.tsx   # Clinical trend (Depression/Anxiety/Stress/Sleep)
│   │   │   ├── session-notes-editor.tsx
│   │   │   ├── resolve-alert-button.tsx
│   │   │   └── prescribe-resource-button.tsx
│   │   └── admin/
│   │       ├── campus-trend-chart.tsx    # Area chart (stable/attention/critical)
│   │       ├── department-breakdown.tsx  # Bar chart by department
│   │       ├── add-resource-form.tsx
│   │       └── bulk-onboarding-form.tsx
│   ├── lib/
│   │   ├── aria/
│   │   │   ├── engine.ts           # ARIA algorithm (zero AI — pure logic)
│   │   │   └── insights.ts         # Data transformation layer (role-based views)
│   │   ├── mistral/
│   │   │   └── chat.ts             # Saathi agent wrapper (agents.complete only)
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server component client
│   │   │   └── middleware.ts       # Session refresh helper
│   │   └── utils.ts                # cn(), formatDate(), anonymizeStudent(), etc.
│   └── types/
│       └── index.ts                # All TypeScript interfaces
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Full schema + RLS + seed questions
│       └── 002_consent_and_rbac.sql # Consent table + chat access RLS
├── public/
│   └── logo.png
├── .env.local
├── tailwind.config.ts              # Minimal — theme is in globals.css for v4
└── PROJECT_CONTEXT.md              # ← This file
```

---

## 5. Database Schema

### Tables

| Table | Purpose | Key fields |
|---|---|---|
| `colleges` | Institutional accounts | `id, name, plan_tier, active, max_students` |
| `users` | All user accounts | `id, email, role, college_id, full_name, guardian_phone` |
| `questions` | ARIA question bank | `id, question, category, severity, options (JSONB), maps_to (JSONB)` |
| `assessments` | Daily check-in results | `id, user_id, date, scores (JSONB), risk_level, emotion, completed` |
| `sessions` | Counsellor bookings | `id, student_id, counsellor_id, date, time, type, status, notes` |
| `alerts` | Crisis escalation log | `id, student_id, counsellor_id, type, triggered_at, resolved` |
| `resources` | Wellness content | `id, title, type, category, url, college_id` |
| `chat_messages` | Saathi chat history | `id, user_id, role, content, counsellor_visible` |
| `consent_records` | Chat access consent | `id, student_id, counsellor_id, chat_access, is_active` |

### RLS Summary

| Role | assessments | chat_messages | users | alerts |
|---|---|---|---|---|
| Student | Own rows only | Own rows only | Own profile only | Insert only |
| Counsellor | All students in college | Only if consent granted | Students in college | Read + update |
| Admin | **NONE** (intentional) | **NONE** | College users | Read only |

> **Critical:** Admins have zero direct access to `assessments` rows. All admin analytics are served via `/api/admin/*` routes using the service role key, which return only aggregated counts — never individual data.

### Migrations
- `001_initial_schema.sql` — Run first. Creates all tables, RLS policies, seed questions.
- `002_consent_and_rbac.sql` — Run second. Adds `consent_records`, `counsellor_visible` column on `chat_messages`, drops any admin assessment policy.

---

## 6. Core Architecture — The Three Engines

### 6.1 ARIA (Assessment Engine) — `src/lib/aria/engine.ts`
- **Zero AI calls** — pure TypeScript logic + Supabase queries
- Runs PHQ-9, GAD-7, PSS-10, ISI, Maslach, UCLA, AUDIT scoring
- `classifyRisk(scores)` → `"stable" | "attention" | "critical"`
- `detectCrisisKeywords(text)` → hardcoded keyword list, never AI
- `emotionToInitialScore(emotion)` → maps emotion tile to initial score
- `findWeakestCategory(recentScores)` → drives ARIA question selection

### 6.2 Insights Layer — `src/lib/aria/insights.ts`
**This is the RBAC enforcement point for data.** All score-to-display transformations go through here.

| Function | Input | Output | Used by |
|---|---|---|---|
| `buildStudentInsight()` | scores + emotion | `StudentInsight` (human phrases, no numbers) | Student dashboard, progress page |
| `buildCounsellorView()` | scores + risk_level | `CounsellorStudentView` (PHQ-9 score + severity label) | Counsellor student profile |
| `buildSaathiContext()` | scores + emotion + risk_level | Plain English string (no numbers) | Chat API route → Saathi agent |

### 6.3 Saathi (AI Companion) — `src/lib/mistral/chat.ts`
- Uses `@mistralai/mistralai` SDK v2
- Calls `client.agents.complete({ agentId, messages })` — **never** `chat.complete()`
- `agentId` from `MISTRAL_AGENT_ID` env var
- Accepts `history` (last 10 turns) + `userMessage` + optional `context`
- Context is always from `buildSaathiContext()` — humanised phrases only
- Never receives raw scores, PHQ-9 numbers, or clinical labels

---

## 7. Role-Based Data Access Rules

### What each role sees

#### Student
- ✅ Emotion-based check-in (no clinical framing)
- ✅ Human-language insights ("You've been carrying some stress lately")
- ✅ Mood trend chart (emotion words on Y-axis, never numbers)
- ✅ Streak counter, check-in history (emotion only)
- ✅ Saathi chat (private by default, consent toggle to share with counsellor)
- ✅ Session booking, resources
- ❌ PHQ-9 / GAD-7 / PSS scores — never shown
- ❌ Risk level labels (Stable/Attention/Critical) — never shown
- ❌ Any clinical terminology

#### Counsellor
- ✅ Student names + full triage list (sorted critical first)
- ✅ Clinical scores with severity labels (PHQ-9: 14/27 — Moderate)
- ✅ 30-day trend charts (Depression, Anxiety, Stress, Sleep lines)
- ✅ Clinical summary (rule-based, not AI-generated)
- ✅ Risk badges (🟢🟠🔴)
- ✅ Session calendar, notes editor
- ✅ Alert management (resolve button)
- ✅ Resource prescription to students
- ✅ Chat access — **only if student has given explicit consent**

#### Admin
- ✅ Aggregated campus stats (% stable/attention/critical)
- ✅ 30-day trend charts (anonymized)
- ✅ Department breakdown (anonymized)
- ✅ Counsellor utilization stats
- ✅ Anonymized crisis alerts (`Student #A12F` — never real name)
- ✅ Resource manager, bulk onboarding, NAAC reports
- ❌ Individual student names — never
- ❌ Individual assessment scores — never
- ❌ Chat data — never

---

## 8. Key Design Decisions & Conventions

### Tailwind v4
- Theme is defined in `src/app/globals.css` using `@theme { --color-brand-green: #3DBE29; ... }`
- `tailwind.config.ts` is minimal (content paths only)
- Use `@import "tailwindcss"` not `@tailwind base/components/utilities`

### Next.js 16 Middleware
- File is `src/proxy.ts` (not `middleware.ts`) — Next.js 16 renamed the convention
- Exports `proxy` function and `config` matcher

### Supabase Joins
- Supabase returns joined relations as arrays, not single objects
- Always normalise: `Array.isArray(s.counsellor) ? s.counsellor[0] ?? null : s.counsellor`

### Student-Facing Language Rules
| Never use | Use instead |
|---|---|
| Assessment | Check-in |
| Screening | How are you feeling? |
| Diagnosis | Your wellness |
| PHQ-9, GAD-7 | (never mention) |
| Risk level | (never show) |
| Score | (never show) |
| Mental illness | Mental wellness |
| Test | Daily check-in |

### Color System
```
Brand Green:    #3DBE29   (CTAs, active states, positive)
Brand Dark:     #2D2D2D   (sidebar, headings)
Mint Accent:    #00C9A7   (hover, secondary)
Student BG:     #F5FFF5   (student dashboard background)
Neutral BG:     #F8F9FF   (counsellor/admin background)
Stable:         #3DBE29
Attention:      #FF9F43
Critical:       #FF6B6B
Text Primary:   #1E1E2E
Text Secondary: #6B7280
Border:         #E5E7EB
```

### Fonts
- Student-facing: `DM Sans` (class: `font-student`)
- Counsellor/Admin: `Inter` (default body font)

---

## 9. What Is Built ✅

### Pages (30 routes total)

#### Public
- [x] `/` — Landing page (buyer-facing, NAAC pitch, pricing, 3× CTA)
- [x] `/login` — Role-aware login with demo account shortcuts
- [x] `/signup` — Student self-registration
- [x] `/demo` — Demo booking form (sends to Resend in production)
- [x] `/forgot-password` — Password reset request form
- [x] `/reset-password` — Password reset completion form

#### Student Portal
- [x] `/student` — Dashboard: greeting, emotion tiles, insight card, mood trend, sessions, Saathi button
- [x] `/student/checkin` — ARIA check-in: emotion → 3 follow-up questions → save + alert trigger
- [x] `/student/chat` — Saathi AI companion with consent toggle (share with counsellor)
- [x] `/student/progress` — 30-day mood history, streak, insight, check-in log (no clinical data)
- [x] `/student/resources` — Wellness content library with category filter + Prescriptions display
- [x] `/student/sessions` — Session history (upcoming + past)
- [x] `/student/sessions/book` — Book a session (counsellor picker, date, time slots, type)

#### Counsellor Portal
- [x] `/counsellor` — Triage dashboard: stat cards, student list (critical first), today's sessions, alerts
- [x] `/counsellor/students` — Full student list with risk sorting
- [x] `/counsellor/students/[id]` — Student profile: clinical scores + severity, 30-day trend, session history, notes, escalate to admin button
- [x] `/counsellor/sessions` — Today / upcoming / past sessions
- [x] `/counsellor/alerts` — Open alerts with resolve button + resolved history
- [x] `/counsellor/resources` — Resource library with prescribe-to-student dropdown

#### Admin Portal
- [x] `/admin` — Campus KPI cards, 30-day area trend, department bar chart, anonymized alerts
- [x] `/admin/analytics` — Deep trend analysis, weekly comparison
- [x] `/admin/counsellors` — Team overview with session utilization rates
- [x] `/admin/alerts` — Anonymized crisis alerts (Student #XXXX only)
- [x] `/admin/resources` — Resource manager with add form
- [x] `/admin/reports` — NAAC compliance report with PDF download (window.print)
- [x] `/admin/settings` — College info, bulk CSV onboarding
- [x] `/admin/billing` — Manage subscription and upgrade via Razorpay

#### API Routes
- [x] `POST /api/chat` — Saathi agent call, crisis detection, context building, history save
- [x] `POST /api/alerts/trigger` — Twilio SMS + Resend email on critical flag
- [x] `POST /api/auth/signout` — Sign out handler
- [x] `POST /api/admin/onboard` — Bulk user creation via service role + welcome email

### Core Libraries
- [x] `lib/aria/engine.ts` — ARIA algorithm (risk classification, crisis detection, score mapping)
- [x] `lib/aria/insights.ts` — Role-based data transformation (student/counsellor/saathi views)
- [x] `lib/mistral/chat.ts` — Saathi agent wrapper using `agents.complete()`
- [x] `lib/supabase/client.ts` — Browser Supabase client
- [x] `lib/supabase/server.ts` — Server Supabase client
- [x] `lib/supabase/middleware.ts` — Session refresh
- [x] `lib/utils.ts` — `cn()`, `formatDate()`, `anonymizeStudent()`, `getRiskColor()`

### Database
- [x] `001_initial_schema.sql` — All tables, RLS policies, seed questions (9 questions from PHQ-9/GAD-7/PSS/ISI/Maslach/UCLA)
- [x] `002_consent_and_rbac.sql` — `consent_records` table, `counsellor_visible` on chat_messages, admin assessment block
- [x] `003_prescriptions.sql` — Resource prescriptions schema
- [x] `004_escalation_alert_type.sql` — Adds "escalation" alert type
- [x] `005_aria_clinical_seed.sql` — Full ARIA clinical assessment seed (PHQ-9, GAD-7, PSS-10, ISI)

### UI Components
- [x] `Button` (primary/secondary/ghost/danger/outline, loading state)
- [x] `Card`, `CardHeader`, `CardContent`, `CardFooter`
- [x] `Badge`, `RiskBadge` (counsellor/admin only)
- [x] `Input` (with label, error, icon)
- [x] `StatCard` (value, label, icon, trend arrow)
- [x] `Sidebar` (role-aware, dark, active state)
- [x] `MoodTrendChart` (emotion-based, no score numbers)
- [x] `MoodHistory` (30-day bar chart, emotion colours)
- [x] `StudentTrendChart` (clinical — Depression/Anxiety/Stress/Sleep lines)
- [x] `CampusTrendChart` (area chart — stable/attention/critical)
- [x] `DepartmentBreakdown` (grouped bar chart)
- [x] `SessionNotesEditor` (counsellor private notes)
- [x] `EscalateToAdminButton` (crisis escalation)
- [x] `ResolveAlertButton` (client-side alert resolution)
- [x] `PrescribeResourceButton` (dropdown to send resource to student)
- [x] `SessionStatusDropdown` (counsellor status update)
- [x] `AddResourceForm` (admin resource creation)
- [x] `BulkOnboardingForm` (CSV upload for mass account creation)
- [x] `BillingPlans` (Razorpay checkout initialization)

---

## 10. What Is NOT Built Yet ❌

### High Priority (needed for MVP launch)

#### Payments
- [x] Razorpay integration — institutional subscription billing
- [x] `/admin/billing` page — plan details, invoice history, upgrade
- [x] Webhook handler for payment events (`/api/payments/webhook`)
- [x] Plan-based feature gating (Basic: 1 counsellor, Growth: 5, Enterprise: unlimited)

#### Email flows
- [x] Session reminder emails (24h before session) — Resend + cron
- [x] Weekly wellness digest for counsellors
- [ ] Password reset flow (Supabase handles auth but UI needs a `/forgot-password` page)

#### Missing auth pages
- [x] `/forgot-password` — password reset request
- [x] `/reset-password` — password reset with token (Supabase redirect)

#### Counsellor features
- [x] Escalate to admin button on student profile (one-tap escalation for crisis)
- [x] Session status update (mark as completed/cancelled/no-show from sessions page)
- [x] Consecutive bad days alert trigger (currently only score_spike and crisis_keyword trigger alerts — consecutive_bad_days logic exists in engine but no cron/trigger wires it up)

#### Student features
- [x] Anonymous mode — allow check-in without login (limited view, no booking)
- [x] Push notifications / PWA manifest for desktop install
- [x] Resource prescription display — when counsellor prescribes a resource, student should see it highlighted in their resources page

### Medium Priority (Phase 2)

#### AI enhancements
- [ ] Saathi chat history persistence across sessions (currently loads fresh each page visit — needs to fetch `chat_messages` from Supabase on mount)
- [ ] Counsellor AI summary using actual Saathi agent (currently rule-based in `buildCounsellorView`)
- [ ] Consecutive bad days detection cron job (check daily, insert alert if threshold met)

#### Admin features
- [ ] Real PDF generation — replace `window.print()` with a proper PDF library (e.g. `@react-pdf/renderer` or server-side `puppeteer`)
- [ ] College onboarding wizard — guided setup flow for new colleges
- [ ] Custom branding per college (Enterprise plan) — logo upload, colour override
- [ ] Exam season correlation in analytics (tag assessments with exam period)

#### Counsellor features
- [ ] Video consultation integration (Jitsi or Daily.co embed)
- [ ] Bulk session scheduling
- [ ] Student search/filter on triage list (currently shows all, no search)

#### Student features
- [ ] Regional language support (Hindi + regional) — i18n setup needed
- [ ] Gamification — badges for streaks (7-day, 30-day, etc.)
- [ ] Breathing exercise interactive component (animated, not just a resource link)
- [ ] Mood journal — free-text daily note alongside emotion tile

### Low Priority / Nice to Have

- [ ] Dark mode
- [ ] Mobile responsive polish (currently desktop-first per PRD, but mobile improvements needed)
- [ ] Supabase Realtime — live alert notifications for counsellors without page refresh
- [ ] Question bank expansion — currently 9 seed questions, need 150+ for ARIA to work well
- [ ] Admin API access (Enterprise plan) — REST endpoints for college's own systems
- [ ] NAAC report customisation — college can add their own notes to the PDF
- [ ] Audit log — track all admin/counsellor actions for compliance

---

## 11. Known Issues & Technical Debt

| Issue | File | Severity | Notes |
|---|---|---|---|
| `window.print()` for PDF | `admin/reports/page.tsx` | Medium | Works but not ideal — replace with proper PDF generation |
| Consecutive bad days alert | `engine.ts` | Medium | Logic exists but no cron job wires it up |
| Question bank too small | `001_initial_schema.sql` | High | Only 9 seed questions — ARIA needs 150+ for proper rotation |
| Anonymous mode | Missing | Medium | PRD requires it — not built |

---

## 12. How to Run Locally

```bash
# 1. Install dependencies (already done)
cd mindsafe-india
npm install

# 2. Set up Supabase
# - Create project at supabase.com
# - Run supabase/migrations/001_initial_schema.sql in SQL editor
# - Run supabase/migrations/002_consent_and_rbac.sql in SQL editor
# - Copy URL + anon key + service role key to .env.local

# 3. Set up Mistral
# - Create account at console.mistral.ai
# - Create a new Agent (Saathi) with your system prompt
# - Copy agent ID (ag:xxxx) to MISTRAL_AGENT_ID in .env.local
# - Copy API key to MISTRAL_API_KEY in .env.local

# 4. Fill remaining .env.local values (Twilio, Resend, Razorpay optional for local dev)

# 5. Run dev server
npm run dev
# → http://localhost:3000

# 6. Build check
npm run build
```

### Demo accounts (after seeding Supabase)
Create these manually in Supabase Auth + users table:
- `student@demo.in` / `demo1234` — role: student
- `counsellor@demo.in` / `demo1234` — role: counsellor
- `admin@demo.in` / `demo1234` — role: admin

All three must be in the same `college_id` for the counsellor/admin to see student data.

---

## 13. Deployment

```bash
# Deploy to Vercel
vercel --prod

# Required environment variables in Vercel dashboard:
# All variables from .env.local (except NEXT_PUBLIC_APP_URL → set to production URL)
```

---

## 14. PRD Reference — Pricing Tiers

| Plan | Price | Students | Key limits |
|---|---|---|---|
| Basic | ₹15,000/month | Up to 500 | 1 counsellor account |
| Growth | ₹35,000/month | Up to 2,000 | 5 counsellor accounts |
| Enterprise | Custom | Unlimited | Custom branding, API access |

Feature gating by plan is **not yet implemented** in code.

---

## 15. Changelog

| Date | What changed |
|---|---|
| April 2026 | Initial full build — all 30 routes, ARIA engine, Supabase schema, RLS |
| April 2026 | Fixed: middleware→proxy, missing pages (12 routes added), SQL array syntax |
| April 2026 | Saathi: switched from raw fetch to Mistral SDK `agents.complete()`, added `MISTRAL_AGENT_ID` |
| April 2026 | RBAC hardening: `insights.ts` layer, student UI stripped of all clinical data, counsellor view gets severity labels, consent system for chat access, migration 002 |
| April 2026 | Added missing auth pages (`/forgot-password` and `/reset-password`) and updated `publicRoutes` in proxy middleware |
| April 2026 | Fixed 3 tech gaps: Chat history loads on mount, prescribe resource writes to DB (`003_prescriptions.sql`), session status updates via dropdown |
| April 2026 | Implemented Student Resource Prescriptions display (`/student/resources`) and Escalate to Admin button (`/counsellor/students/[id]`) |
| April 2026 | Added Razorpay Payments Integration (`/admin/billing`, `/api/payments/create-order`, `/api/payments/webhook`) |
| April 2026 | Added Resend Automated Flows (`/api/cron/reminders`, `/api/cron/digest`) and Vercel Cron configuration |
| April 2026 | Added Final 4 MVP Features: Anonymous Mode, PWA Manifest, Plan Feature Gating, and Consecutive Bad Days Cron |
| April 2026 | Comprehensive UI/UX overhaul (Premium design, dynamic animations), Auth role-based routing finalization, ARIA clinical assessment full DB seeding (PHQ-9, GAD-7, PSS-10, ISI) |

---

*Keep this file updated. Every time a feature is built, move it from ❌ to ✅ and add an entry to the changelog.*
