# MindSafe India — UI/UX Design System
> Version 1.0 | April 2026 | For Designers & Frontend Developers

---

## 🎯 Design Philosophy

MindSafe India serves two very different audiences. The design must speak to both without compromising either.

| Audience | Design Goal | Feeling |
|---|---|---|
| **Buyer (Dean/Admin/SWO)** | Trust, credibility, data clarity | "This is a serious institutional tool" |
| **End User (Student)** | Warmth, safety, zero stigma | "This feels like a friend, not a hospital" |

**Core Rule:** The same brand, two personalities. Green and dark gray everywhere — but used softly for students, sharply for admins.

---

## 🎨 Color System

### Primary Palette

| Name | Hex | Usage |
|---|---|---|
| Brand Green | `#3DBE29` | Primary CTAs, active states, positive indicators, logo match |
| Brand Dark | `#2D2D2D` | Headings, sidebar backgrounds, navbar text |
| Mint Accent | `#00C9A7` | Hover states, secondary actions, chart accents |
| Background Light | `#F5FFF5` | Student dashboard background — light green tint |
| Background Neutral | `#F8F9FF` | Counsellor & Admin dashboard background — cool white |

### Semantic / Status Colors

| Name | Hex | Usage |
|---|---|---|
| Stable / Green | `#3DBE29` | Green risk level, positive stats |
| Needs Attention / Orange | `#FF9F43` | Orange risk level, warnings |
| Critical / Red | `#FF6B6B` | Red risk level, crisis alerts |
| Success bg | `#F0FFF0` | Green badge backgrounds |
| Warning bg | `#FFF8F0` | Orange badge backgrounds |
| Alert bg | `#FFF0F0` | Red badge backgrounds |

### Neutral Palette

| Name | Hex | Usage |
|---|---|---|
| Text Primary | `#1E1E2E` | Body text, data values |
| Text Secondary | `#6B7280` | Subtitles, metadata, timestamps |
| Border | `#E5E7EB` | Card borders, dividers |
| White | `#FFFFFF` | Card backgrounds, modal backgrounds |

---

## 🔤 Typography

### Font Stack
```css
font-family: 'Inter', 'DM Sans', system-ui, sans-serif;
```
- **Student-facing:** DM Sans — rounder, friendlier
- **Counsellor/Admin-facing:** Inter — sharper, more professional

### Type Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| Display | 48px | 700 Bold | Landing page hero headline |
| H1 | 36px | 700 Bold | Page titles |
| H2 | 28px | 600 Semibold | Section headings |
| H3 | 22px | 600 Semibold | Card titles |
| H4 | 18px | 500 Medium | Subsection labels |
| Body Large | 16px | 400 Regular | Main body text |
| Body | 14px | 400 Regular | Secondary text, table rows |
| Small | 12px | 400 Regular | Timestamps, metadata, badges |
| Label | 12px | 600 Semibold | Form labels, nav items |

---

## 🖼️ Illustration System

### Style Definition
Flat 2D illustrations with soft organic shapes, flowing forms, and warm colors. Peaceful human figures surrounded by nature elements — flowers, leaves, soft waves. Emotionally expressive, never clinical or robotic.

**Reference styles:** Headspace, Calm, Blush Design "Wellness" pack, Storyset "Health" category

### Illustration Usage Rules

| Location | Use Illustration? | Type |
|---|---|---|
| Student dashboard hero | ✅ Yes | Large — peaceful person in nature |
| Student check-in flow | ✅ Yes | Medium — flowing mood waves |
| Resource cards | ✅ Yes | Small — creative/nature icons |
| Onboarding screens | ✅ Yes | Large — welcoming figure |
| Empty states (all screens) | ✅ Yes | Small — calm character |
| Landing page hero | ✅ Yes | Large — diverse students in nature |
| Landing page feature cards | ✅ Yes | Small icons only |
| Counsellor dashboard | ⚠️ Empty states only | Small — "All clear" character |
| Admin dashboard | ⚠️ Report section only | Small — person with document |
| Data tables | ❌ Never | — |
| Chart panels | ❌ Never | — |
| Alert/crisis panels | ❌ Never | — |

### Recommended Illustration Sources
- **Blush Design** — blush.design (Wellness pack — best match)
- **Storyset** — storyset.com (Health category, supports animation)
- **unDraw** — undraw.co (customizable brand color)
- **Humaaans** — humaaans.com (mix-and-match Indian-looking figures)

### Color Usage in Illustrations
Always pull `#3DBE29` and `#00C9A7` as accent colors within illustrations to maintain brand consistency. Warm earth tones (oranges, yellows, teals) are acceptable as supporting colors.

---

## 📐 Spacing & Layout

### Grid System
- **Desktop:** 12-column grid, 1280px max-width, 24px gutters
- **Content width:** 1280px container with 48px horizontal padding
- **Sidebar width:** 240px fixed
- **Main content:** Remaining width after sidebar

### Spacing Scale (Tailwind-aligned)
```
4px   = space-1   (tight inline spacing)
8px   = space-2   (icon-text gap)
12px  = space-3   (small internal padding)
16px  = space-4   (standard padding)
24px  = space-6   (card padding)
32px  = space-8   (section spacing)
48px  = space-12  (large section gaps)
64px  = space-16  (hero section padding)
```

### Border Radius
```
4px   = rounded-sm   (badges, tags)
8px   = rounded      (buttons, inputs)
12px  = rounded-xl   (cards)
16px  = rounded-2xl  (hero cards, illustration containers)
9999px = rounded-full (avatars, pills, streak counter)
```

---

## 🧩 Component Specifications

### Emotion Tiles (Student Check-in)
```
Size: 120px x 120px
Border radius: rounded-2xl (16px)
Background: Soft pastel per emotion
Shadow: shadow-sm
Hover: scale-105, shadow-md, border-2 border-brand-green
Emoji size: 40px
Label: 12px, semibold, text-secondary
Spacing between tiles: 16px gap
```

| Emotion | Background | Emoji |
|---|---|---|
| Great | `#F0FFF0` | 😄 |
| Good | `#F0F9FF` | 🙂 |
| Okay | `#FAFAFA` | 😐 |
| Low | `#FFF8F0` | 😔 |
| Stressed | `#FFF0F0` | 😟 |
| Tired | `#F5F0FF` | 😴 |

### Risk Level Badges
```
Border radius: rounded-full
Padding: 4px 12px
Font: 12px, semibold
```

| Level | Background | Text Color | Label |
|---|---|---|---|
| Stable | `#F0FFF0` | `#3DBE29` | 🟢 Stable |
| Needs Attention | `#FFF8F0` | `#FF9F43` | 🟠 Needs Attention |
| Critical | `#FFF0F0` | `#FF6B6B` | 🔴 Critical |

### Stat Cards
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border radius: rounded-xl (12px)
Padding: 24px
Shadow: shadow-sm
Value: 32px, bold, text-primary
Label: 14px, regular, text-secondary
Icon: 24px, top-right corner, brand color
```

### Primary Button
```
Background: #3DBE29
Text: #FFFFFF, 14px, semibold
Padding: 12px 24px
Border radius: rounded (8px)
Hover: background #32A822, shadow-md
Active: scale-95
```

### Secondary Button
```
Background: transparent
Border: 2px solid #3DBE29
Text: #3DBE29, 14px, semibold
Padding: 12px 24px
Border radius: rounded (8px)
Hover: background #F0FFF0
```

### Sidebar Navigation
```
Width: 240px
Background: #2D2D2D (dark)
Text: #FFFFFF
Active item: background #3DBE29, border-radius rounded-lg
Hover: background rgba(255,255,255,0.1)
Icon size: 20px
Item padding: 12px 16px
Logo area: 64px height, border-bottom 1px solid rgba(255,255,255,0.1)
```

### Data Table (Counsellor Triage)
```
Header: background #F8F9FF, 12px label, semibold, text-secondary
Row: background #FFFFFF, border-bottom 1px solid #E5E7EB
Row hover: background #F5FFF5
Cell padding: 16px
Font: 14px, text-primary
Action button: small, outline style, brand green
```

---

## 📱 Screen-by-Screen UX Rules

### 🟢 Landing Page (Buyer-Facing)

**Goal:** Convert a Dean/SWO into a demo booking in under 60 seconds.

- Above the fold must contain: headline, subheadline, CTA, hero illustration
- Never use student wellness language here — use institutional language
- Highlight NAAC compliance in the first scroll
- Pricing must be visible without scrolling past 2 sections
- Trust badges (DPDP, AES-256, 99.9% uptime) must appear before footer
- CTA button "Book a Demo" must appear minimum 3 times on page

**Copywriting rules for landing page:**
- ✅ Use: "campus wellness", "institutional dashboard", "compliance reports", "student welfare"
- ❌ Never use: "therapy", "diagnosis", "mental illness", "psychiatric"

---

### 🟢 Student Dashboard

**Goal:** Student opens app, completes check-in, closes app — in under 90 seconds.

- Greeting must be personal ("Good morning, [Name]")
- Streak counter must be visible immediately — above the fold
- Emotion tiles must be the largest interactive element on screen
- Check-in flow: maximum 3 taps before completion
- Never show score numbers, clinical terms, or risk levels to students
- Chatbot (ARIA) button stays in bottom-right corner — never prominent
- Progress/mood trend chart uses soft pastel colors, not clinical red/green

**Language rules:**
- ✅ Use: "check-in", "how are you feeling", "your wellness", "streak", "let's chat"
- ❌ Never use: "assessment", "screening", "diagnosis", "PHQ-9", "risk level", "test"

---

### 🟢 Counsellor Dashboard

**Goal:** Counsellor knows who needs help most within 5 seconds of opening.

- Red-flagged students always appear at top of triage list
- Risk badges must be color-coded and immediately scannable
- Session calendar visible without scrolling
- Smart alerts panel never hidden — always visible
- Student names are visible (counsellors have permission)
- One-tap escalation to admin for crisis cases
- Session notes editor opens in a side panel, not a new page

**Information hierarchy:**
1. Critical alerts (top priority)
2. Triage list (main panel)
3. Today's sessions (right panel)
4. Historical trends (second scroll)

---

### 🟢 Admin Dashboard

**Goal:** Admin understands campus wellness health in one glance.

- KPI stat cards always above the fold — no scrolling for top numbers
- Student names are NEVER shown — anonymized always (`Student #A12`)
- Charts use brand colors: green for stable, orange for attention, red for critical
- PDF report download button must be prominent — this is a key value prop
- Department breakdown helps admin identify problem areas
- Crisis alerts panel shows resolved vs unresolved status clearly

**Data display rules:**
- Always show percentages alongside raw numbers
- Trend direction arrows (↑↓) next to every changing metric
- Last updated timestamp on every data panel
- Empty state for crisis panel: small illustration + "All students stable today 🎉"

---

## 🔄 User Flows

### Student Check-in Flow
```
Open app → See greeting + streak
→ Tap emotion tile (1 tap)
→ See 2-3 follow-up quick-tap questions (ARIA)
→ See friendly completion message
→ Mood trend updates
→ Resource recommendation shown
Total: ~30-90 seconds
```

### Counsellor Triage Flow
```
Open dashboard → See stat cards
→ Scan triage list (red students first)
→ Click student name → Side panel opens
→ View trend graph + session history
→ Take action: book session / send resource / escalate
Total: ~2-3 minutes per student review
```

### Admin Report Flow
```
Open dashboard → View KPI cards
→ Check trend graph for anomalies
→ Review department breakdown
→ Download PDF report
→ Share with NAAC / management
Total: ~5-10 minutes per monthly review
```

---

## ⚡ Micro-interactions & Animation

| Element | Animation | Duration |
|---|---|---|
| Emotion tile hover | scale(1.05) + shadow increase | 150ms |
| Emotion tile select | scale(0.95) + green border flash | 100ms |
| Streak counter | Number count-up on load | 800ms |
| Mood chart | Line draws from left to right | 1000ms |
| Risk badge | Fade in with slight slide-up | 200ms |
| Page transition | Fade + slight slide | 250ms |
| Check-in completion | Confetti burst (student only) | 1500ms |
| Alert dismiss | Slide out to right | 200ms |

**Library:** Framer Motion (works natively with Next.js)

---

## ♿ Accessibility Rules

- All interactive elements minimum 44x44px touch target
- Color never used as sole indicator — always pair with icon or text
- Risk levels: badge color + icon + text label (never color alone)
- Focus states: 2px outline in brand green on all interactive elements
- Contrast ratio: minimum 4.5:1 for all text (WCAG 2.1 AA)
- All illustrations have descriptive alt text
- Emotion tiles keyboard navigable (arrow keys)

---

## 🚫 Design Anti-Patterns (Never Do These)

- ❌ Never use red for student-facing UI (stigma trigger)
- ❌ Never show clinical score numbers to students
- ❌ Never use stock photos of sad/depressed people anywhere
- ❌ Never make the chatbot the first thing a student sees
- ❌ Never put a "Mental Health Assessment" label on student screens
- ❌ Never show admin a student's individual name or identity
- ❌ Never use ALL CAPS for student-facing copy (feels aggressive)
- ❌ Never use more than 3 illustrations on a single screen
- ❌ Never animate crisis/alert elements (feels alarming)

---

*MindSafe India UI/UX Design System v1.0 | Confidential | April 2026*
