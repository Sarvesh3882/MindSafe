# Counsellor Dashboard UX Redesign

## Current State Analysis

### Current Color Scheme
- **Primary**: Green (#3DBE29) - Same as student dashboard
- **Background**: Light gray (#F4F7FB)
- **Cards**: White with subtle borders
- **Risk Levels**: 
  - Critical: Red (#FF6B6B)
  - Attention: Orange (#FF9F43)
  - Stable: Green (#3DBE29)

### Current Issues
1. **Color Identity**: Uses the same green theme as students, lacks professional counsellor identity
2. **Visual Hierarchy**: Stats cards don't stand out enough
3. **Emotional Tone**: Green is too cheerful for a clinical/professional environment
4. **Differentiation**: Hard to distinguish from student dashboard at a glance

---

## Proposed New Design

### New Color Palette - "Professional Teal & Calm Blue"

#### Primary Colors
- **Primary Teal**: `#00C9A7` (Calming, professional, trustworthy)
- **Deep Teal**: `#00A88E` (Hover states, emphasis)
- **Soft Teal**: `#E0F9F4` (Backgrounds, highlights)

#### Secondary Colors
- **Professional Blue**: `#3B82F6` (Accents, links)
- **Soft Blue**: `#EFF6FF` (Card backgrounds)
- **Navy**: `#1E3A8A` (Text, headers)

#### Status Colors (Keep existing for consistency)
- **Critical**: `#FF6B6B` (Red)
- **Attention**: `#FF9F43` (Orange)
- **Stable**: `#10B981` (Emerald green - slightly different from student green)

#### Neutral Colors
- **Background**: `#F8FAFB` (Lighter, more clinical)
- **Card Background**: `#FFFFFF` with subtle teal tint
- **Text Primary**: `#1E293B` (Darker, more professional)
- **Text Secondary**: `#64748B` (Softer gray)
- **Border**: `#E2E8F0` (Lighter borders)

---

## Design Improvements

### 1. **Enhanced Header Section**
```
┌─────────────────────────────────────────────────────────┐
│  👤 Good Morning, Dr. Sharma                            │
│  📅 Monday, 15th May 2026                               │
│  🔔 3 new alerts · 2 sessions today                     │
└─────────────────────────────────────────────────────────┘
```
- Add greeting with time of day
- Show quick summary stats
- Add notification bell with count

### 2. **Redesigned Stats Cards**
- **Gradient backgrounds** with teal theme
- **Larger icons** with subtle animations
- **Trend indicators** (↑ ↓ →) showing week-over-week changes
- **Quick action buttons** on hover

### 3. **Enhanced Triage List**
- **Color-coded left border** based on risk level
- **Last check-in timestamp** visible
- **Quick action menu** (Message, Schedule, View Profile)
- **Filter/Sort controls** at the top
- **Search bar** for quick student lookup

### 4. **Improved Right Panel**
- **Today's Sessions**: Timeline view with visual time blocks
- **Alerts**: Expandable cards with action buttons
- **Quick Stats**: Mini charts showing trends

### 5. **Visual Enhancements**
- **Subtle shadows** for depth
- **Rounded corners** (12px-16px) for modern feel
- **Micro-interactions**: Hover effects, smooth transitions
- **Empty states**: Friendly illustrations when no data

---

## Illustration Needs

### Required New Illustrations

1. **`counsellor_empty_state.svg`**
   - Scene: Counsellor at desk with empty clipboard
   - Use: When no students assigned yet
   - Style: Calm, professional, teal color scheme

2. **`counsellor_sessions_empty.svg`**
   - Scene: Calendar with checkmark
   - Use: When no sessions scheduled
   - Style: Minimalist, teal accents

3. **`counsellor_all_stable.svg`**
   - Scene: Peaceful garden or calm waves
   - Use: When all students are stable (positive state)
   - Style: Serene, teal and blue tones

4. **`counsellor_analytics.svg`**
   - Scene: Charts and graphs with insights
   - Use: Analytics/reports section
   - Style: Professional, data-focused

5. **`counsellor_student_profile.svg`**
   - Scene: Student profile card with wellness indicators
   - Use: Student detail pages
   - Style: Clean, informative

### Existing Illustrations to Use
- ✅ `counsellor_dashbaord.svg` - Main dashboard hero
- ✅ `counsellor_booksession.svg` - Session booking
- ✅ `Counsellor_login.svg` - Login page

---

## Component-Level Changes

### Stats Card Component
```tsx
<StatCard 
  label="Total Students"
  value={42}
  trend={{ direction: "up", value: 5, period: "week" }}
  color="teal"
  icon={<UsersIcon />}
  action={{ label: "View All", href: "/counsellor/students" }}
/>
```

### Triage List Item
```tsx
<TriageItem
  student={student}
  riskLevel="attention"
  lastCheckIn="2 hours ago"
  quickActions={[
    { icon: <MessageIcon />, label: "Message", onClick: handleMessage },
    { icon: <CalendarIcon />, label: "Schedule", onClick: handleSchedule },
    { icon: <EyeIcon />, label: "View", href: `/counsellor/students/${id}` }
  ]}
/>
```

### Session Timeline
```tsx
<SessionTimeline
  sessions={todaySessions}
  currentTime={new Date()}
  onSessionClick={handleSessionClick}
/>
```

---

## Implementation Priority

### Phase 1: Core Visual Updates (High Priority)
1. ✅ Update color variables in globals.css
2. ✅ Redesign stats cards with new colors
3. ✅ Update triage list styling
4. ✅ Add header improvements

### Phase 2: Enhanced Interactions (Medium Priority)
5. ⏳ Add quick action menus
6. ⏳ Implement search and filters
7. ⏳ Add trend indicators
8. ⏳ Create session timeline view

### Phase 3: Illustrations & Polish (Lower Priority)
9. ⏳ Add new illustrations
10. ⏳ Implement empty states
11. ⏳ Add micro-interactions
12. ⏳ Polish animations

---

## Color Usage Guide

### When to Use Each Color

**Teal (#00C9A7)**
- Primary buttons
- Active navigation items
- Important badges
- Success states
- Counsellor branding elements

**Blue (#3B82F6)**
- Links
- Secondary actions
- Information badges
- Chart accents

**Navy (#1E3A8A)**
- Headers
- Important text
- Professional emphasis

**Soft Teal (#E0F9F4)**
- Hover states
- Selected items
- Subtle backgrounds
- Highlights

---

## Accessibility Considerations

1. **Contrast Ratios**: All text meets WCAG AA standards
2. **Color Blindness**: Risk levels use icons + colors
3. **Focus States**: Clear keyboard navigation indicators
4. **Screen Readers**: Proper ARIA labels on all interactive elements

---

## Mobile Responsiveness

- Stats cards: 2 columns on mobile, 4 on desktop
- Triage list: Full width on mobile with collapsible details
- Right panel: Stacks below main content on mobile
- Touch-friendly: 44px minimum touch targets

---

## Next Steps

1. Review and approve color palette
2. Create/source new illustrations
3. Update global CSS variables
4. Implement Phase 1 changes
5. User testing with counsellors
6. Iterate based on feedback
