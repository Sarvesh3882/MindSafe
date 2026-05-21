# MindSafe India — Brand Guidelines
> Version 1.0 | April 2026 | Confidential

---

## 🧠 Brand Identity

### Mission
To make mental health support accessible, affordable, and stigma-free for every college student in India — through technology that feels like a friend, not a hospital.

### Brand Personality

| Trait | What It Means |
|---|---|
| **Trustworthy** | Institutions must feel safe handing us their students' data |
| **Warm** | Students must feel zero judgment, zero stigma |
| **Intelligent** | AI-powered, data-driven — not a simple chatbot |
| **Indian** | Built for India, understands Indian college culture |
| **Non-clinical** | Wellness companion, never a hospital portal |

### Brand Voice

**To Buyers (Deans/Admins):**
Confident, professional, data-backed. Speaks the language of compliance, ROI, and institutional responsibility.
> *"MindSafe India gives you complete visibility into your campus's mental wellness — with zero manual effort."*

**To Students:**
Warm, casual, encouraging. Like a supportive friend who checks in on you.
> *"Hey! How are you feeling today? Let's do your quick check-in 🌿"*

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|---|---|---|---|
| Brand Green | `#3DBE29` | rgb(61, 190, 41) | Logo, CTAs, active states, positive indicators |
| Brand Dark | `#2D2D2D` | rgb(45, 45, 45) | Logo text, headings, dark sidebar |

### Secondary Colors

| Name | Hex | Usage |
|---|---|---|
| Mint Accent | `#00C9A7` | Hover states, secondary actions, chart lines |
| Student BG | `#F5FFF5` | Student dashboard background |
| Neutral BG | `#F8F9FF` | Admin/Counsellor dashboard background |

### Status Colors

| Name | Hex | Usage |
|---|---|---|
| Stable Green | `#3DBE29` | Green risk badge |
| Attention Orange | `#FF9F43` | Orange risk badge |
| Critical Red | `#FF6B6B` | Red risk badge, crisis alerts |

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#3DBE29',
          dark: '#2D2D2D',
          mint: '#00C9A7',
        },
        status: {
          stable: '#3DBE29',
          attention: '#FF9F43',
          critical: '#FF6B6B',
        },
        bg: {
          student: '#F5FFF5',
          neutral: '#F8F9FF',
        }
      }
    }
  }
}
```

---

## 🔤 Typography

### Primary Font
**Inter** — for counsellor and admin dashboards (professional, sharp)
```
https://fonts.google.com/specimen/Inter
```

### Secondary Font
**DM Sans** — for student-facing screens (rounded, friendly)
```
https://fonts.google.com/specimen/DM+Sans
```

### Font Usage Rules
- Headlines: Bold (700), Brand Dark `#2D2D2D`
- Body text: Regular (400), `#1E1E2E`
- CTA buttons: Semibold (600), White on green background
- Badges/labels: Semibold (600), status colors
- Never use more than 2 font weights on a single screen

---

## 🏷️ Logo

### Logo Concept
Human head silhouette (facing left) with a green checkmark inside — communicating "minds verified safe." The word "Mind" in Brand Dark, "Safe" in Brand Green.

### Logo Variants

| Variant | Usage |
|---|---|
| Full logo (icon + wordmark) | Navbar, landing page, documents |
| Icon only (head + checkmark) | Favicon, app icon, small spaces |
| Dark background version | Dark sidebars, dark footers |
| Single color (all dark) | Print, black & white documents |

### Logo Sizing

| Context | Minimum Size |
|---|---|
| Navbar | 120px wide |
| Favicon | 32x32px (icon only) |
| App icon | 192x192px (icon only) |
| Documents/reports | 160px wide |
| Landing page hero | 180px wide |

### Logo Clear Space
Always maintain clear space equal to the height of the "M" in "MindSafe" on all sides. Never place other elements inside this zone.

### Logo Do's & Don'ts

✅ **Do:**
- Use on white or very light backgrounds
- Use dark version on dark backgrounds
- Keep proportions locked — never stretch
- Use brand green for "Safe" text always

❌ **Don't:**
- Change the green checkmark to any other color
- Add drop shadows or effects to the logo
- Place on busy photographic backgrounds
- Recreate the logo in different fonts
- Use the wordmark without the icon
- Rotate or flip the logo

---

## 🖼️ Illustration Guidelines

### Style
Flat 2D, soft organic shapes, flowing forms, warm colors. Peaceful human figures in natural settings. Emotionally expressive. Never clinical, robotic, or stock-photo realistic.

### Color Usage in Illustrations
- Always include `#3DBE29` (brand green) as an accent
- `#00C9A7` (mint) acceptable as secondary accent
- Warm earth tones (oranges, yellows, teals) as supporting palette
- Never use dark gray `#2D2D2D` as a dominant illustration color

### Approved Illustration Sources
1. **Blush Design** — blush.design → "Wellness" collection
2. **Storyset** — storyset.com → "Health" category
3. **unDraw** — undraw.co → set primary color to `#3DBE29`
4. **Humaaans** — humaaans.com → for people/student figures

### What to Illustrate

| Scene | Where Used |
|---|---|
| Peaceful student in nature, eyes closed | Student dashboard hero |
| Person walking through colorful flowing waves | Check-in flow |
| Two people in gentle conversation | "Talk to counsellor" card |
| Person reading surrounded by plants | Resources section |
| Diverse group of students together | Landing page hero |
| Person holding green-checked document | Admin report section |
| Person resting under tree | Empty state — "All clear" |
| Person with phone, soft glow around them | Onboarding |

### What NOT to Illustrate
- ❌ Sad, crying, or distressed figures (stigma trigger)
- ❌ Clinical settings (hospitals, therapy rooms, doctors)
- ❌ Brains, medical symbols, pills
- ❌ Isolated lonely figures
- ❌ Realistic photographic style

---

## 📣 Messaging Framework

### Taglines

**Primary (B2B / Buyer-facing):**
> *"Your Students' Minds. Safe. Always."*

**Secondary options:**
> *"Safe minds build stronger institutions."*
> *"Every student. Checked in. Looked after."*
> *"Your campus. Their minds. Our responsibility."*

**Student-facing:**
> *"Your wellness, your way."*
> *"Check in. Feel better. Keep going."*

### Key Messages by Audience

**For Deans / Student Welfare Officers:**
- NAAC compliance made simple
- Complete campus wellness visibility
- Early detection before crises happen
- Zero manual effort for your counsellors
- Trusted by Indian colleges

**For Students:**
- No judgment, no labels
- Your data is private — always
- Takes less than 2 minutes a day
- Talk when you want to, how you want to
- You're not alone

---

## 🚫 Brand Anti-Patterns

### Words to NEVER Use (Student-Facing)
| Avoid | Use Instead |
|---|---|
| Assessment | Check-in |
| Screening | How are you feeling? |
| Diagnosis | Your wellness |
| Mental illness | Mental wellness |
| Test | Daily check-in |
| Therapy | Support |
| PHQ-9 / GAD-7 | (never mention) |
| Risk level | (never show to students) |
| Score | (never show to students) |

### Visual Anti-Patterns
- ❌ Stock photos of visibly distressed people
- ❌ Brain imagery (feels clinical/medical)
- ❌ Red color in student-facing UI
- ❌ Cluttered, information-dense student screens
- ❌ Dark or heavy color schemes for students
- ❌ Corporate stock photography anywhere

---

## 📄 Document & Report Branding

For NAAC reports and admin PDFs:

- Header: MindSafe logo (full) left + College name right
- Footer: "Powered by MindSafe India" + page number
- Accent color: Brand Green `#3DBE29` for headings and chart colors
- Font: Inter, professional
- Cover page: Dark gray `#2D2D2D` background, white text, green accent line
- Data tables: Green header row, alternating white/#F5FFF5 rows

---

*MindSafe India Brand Guidelines v1.0 | Confidential | April 2026*
