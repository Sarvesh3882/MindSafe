# Student Dashboard Implementation Checklist
> Quick reference for implementing UI/UX improvements

---

## 📋 Phase 1: Critical Improvements (Week 1)

### 1. Sidebar Logo Integration
**File**: `src/components/shared/sidebar.tsx`

- [ ] Replace `/logo.png` with `/illustrations/Logo.svg`
- [ ] Update logo size to 40x40px
- [ ] Add hover effect (subtle scale transform)
- [ ] Ensure proper spacing (16px padding)
- [ ] Test logo visibility on dark sidebar background

**Code snippet**:
```typescript
<Image 
  src="/illustrations/Logo.svg" 
  alt="MindSafe India" 
  width={40} 
  height={40} 
  className="rounded transition-transform hover:scale-105" 
/>
```

---

### 2. Hero Banner Component
**File**: `src/components/student/hero-banner.tsx` (NEW)

- [ ] Create new component file
- [ ] Add two-column layout (text left, illustration right)
- [ ] Add gradient background with brand colors
- [ ] Integrate `student_dashboard.svg` illustration
- [ ] Add lazy loading for illustration
- [ ] Make responsive (stack on mobile)
- [ ] Add fade-in animation

**Component structure**:
```typescript
export function HeroBanner({ userName }: { userName: string }) {
  return (
    <div className="glass rounded-3xl p-6 bg-gradient-to-r from-[#3DBE29]/5 to-[#00C9A7]/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h1>Good {getGreeting()}, {userName} 👋</h1>
          <p>Ready for your daily check-in?</p>
          <Card>Wellness companion text...</Card>
        </div>
        <div className="relative h-64">
          <Image 
            src="/illustrations/student_dashboard.svg"
            alt="Student dashboard"
            fill
            loading="lazy"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Database Query Optimization
**File**: `src/app/student/page.tsx`

- [ ] Replace sequential queries with `Promise.all()`
- [ ] Combine related queries
- [ ] Add error handling for each query
- [ ] Test query performance

**Before**:
```typescript
const { data: profile } = await supabase.from("users").select("...").single();
const { data: assessments } = await supabase.from("assessments").select("...");
const { data: sessions } = await supabase.from("sessions").select("...");
```

**After**:
```typescript
const [profileResult, assessmentsResult, sessionsResult] = await Promise.all([
  supabase.from("users").select("...").single(),
  supabase.from("assessments").select("..."),
  supabase.from("sessions").select("...")
]);
```

---

### 4. React Suspense Boundaries
**File**: `src/app/student/page.tsx`

- [ ] Wrap dashboard client in Suspense
- [ ] Create dashboard skeleton component
- [ ] Add error boundary
- [ ] Test loading states

**Implementation**:
```typescript
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/student/dashboard-skeleton';

export default async function StudentDashboardPage() {
  // ... data fetching
  
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentDashboardClient {...props} />
    </Suspense>
  );
}
```

---

### 5. Dashboard Skeleton Component
**File**: `src/components/student/dashboard-skeleton.tsx` (NEW)

- [ ] Create skeleton component
- [ ] Match actual dashboard layout
- [ ] Use Tailwind's `animate-pulse`
- [ ] Add proper spacing and sizing
- [ ] Test skeleton appearance

**Component structure**:
```typescript
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded" />
      
      {/* Hero banner skeleton */}
      <div className="h-64 bg-gray-200 rounded-3xl" />
      
      {/* Check-in tiles skeleton */}
      <div className="grid grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      
      {/* Quick cards skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 Phase 2: High Priority (Week 2)

### 6. Lazy Load Heavy Components
**File**: `src/components/student/dashboard-client.tsx`

- [ ] Import `dynamic` from Next.js
- [ ] Lazy load `MoodTrendChart`
- [ ] Lazy load `CheckinCountdown`
- [ ] Add loading skeletons for each
- [ ] Test lazy loading behavior

**Implementation**:
```typescript
import dynamic from 'next/dynamic';

const MoodTrendChart = dynamic(
  () => import('@/components/student/mood-trend-chart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);

const CheckinCountdown = dynamic(
  () => import('@/components/student/checkin-countdown'),
  { 
    loading: () => <CountdownSkeleton />,
    ssr: false 
  }
);
```

---

### 7. Quick Cards with Illustrations
**File**: `src/components/student/dashboard-client.tsx`

- [ ] Update `QuickCard` component to accept illustration prop
- [ ] Add illustrations to each quick card:
  - Relax → `Student_using_laptop_welness.svg`
  - Talk to Counsellor → `counsellor_booksession.svg`
  - Resources → `Student_using_laptop_welness.svg`
- [ ] Add lazy loading for illustrations
- [ ] Add hover effects
- [ ] Test responsive behavior

**Updated component**:
```typescript
function QuickCard({ 
  emoji, 
  title, 
  desc, 
  href, 
  color,
  illustration 
}: { 
  emoji: string; 
  title: string; 
  desc: string; 
  href: string; 
  color: string;
  illustration?: string;
}) {
  return (
    <Link href={href}>
      <div className="glass rounded-3xl p-5 hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3">
          {emoji}
        </div>
        
        {illustration && (
          <div className="relative h-32 mb-3">
            <Image
              src={`/illustrations/${illustration}`}
              alt={title}
              fill
              loading="lazy"
              className="object-contain"
            />
          </div>
        )}
        
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">{desc}</p>
      </div>
    </Link>
  );
}
```

---

### 8. Empty State Component
**File**: `src/components/student/empty-state.tsx` (NEW)

- [ ] Create reusable empty state component
- [ ] Accept illustration, title, description, CTA props
- [ ] Add proper spacing and centering
- [ ] Make responsive
- [ ] Test with different illustrations

**Component structure**:
```typescript
export function EmptyState({
  illustration,
  title,
  description,
  ctaText,
  ctaHref
}: {
  illustration: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <div className="relative h-48 w-48 mx-auto mb-4">
        <Image
          src={`/illustrations/${illustration}`}
          alt={title}
          fill
          loading="lazy"
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {ctaText && ctaHref && (
        <Link href={ctaHref}>
          <button className="btn-primary">{ctaText}</button>
        </Link>
      )}
    </div>
  );
}
```

---

### 9. Optimize Framer Motion
**File**: `src/components/student/dashboard-client.tsx`

- [ ] Create `useReducedMotion` hook
- [ ] Conditionally apply animations
- [ ] Reduce animation complexity
- [ ] Test on slower devices

**Hook implementation**:
```typescript
// src/lib/hooks/use-reduced-motion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  
  return prefersReducedMotion;
}
```

**Usage**:
```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
>
```

---

### 10. Caching Strategy
**File**: `src/app/student/page.tsx`

- [ ] Add revalidation to page
- [ ] Implement cache headers
- [ ] Test cache behavior
- [ ] Monitor cache hit rates

**Implementation**:
```typescript
// Add at top of page component
export const revalidate = 60; // Revalidate every 60 seconds

// Or use dynamic caching
export const dynamic = 'force-dynamic'; // For real-time data
```

---

## 📋 Phase 3: Polish & Refinement (Week 3)

### 11. SVG Optimization
**Files**: All SVG files in `/public/illustrations/`

- [ ] Install SVGO tool: `npm install -g svgo`
- [ ] Optimize all SVG files: `svgo -f public/illustrations`
- [ ] Test optimized SVGs render correctly
- [ ] Measure file size reduction

**Command**:
```bash
svgo -f public/illustrations --multipass
```

---

### 12. Loading Skeletons for All Components
**Files**: Various skeleton components

- [ ] Create `ChartSkeleton` component
- [ ] Create `CountdownSkeleton` component
- [ ] Create `SessionCardSkeleton` component
- [ ] Create `InsightCardSkeleton` component
- [ ] Test all skeletons

---

### 13. Card Hover Effects
**File**: `src/components/student/dashboard-client.tsx`

- [ ] Add smooth transitions
- [ ] Add scale transform on hover
- [ ] Add shadow elevation on hover
- [ ] Test hover effects on all cards

**CSS**:
```css
.interactive-card {
  transition: all 0.3s ease;
}

.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}
```

---

### 14. Typography Consistency
**File**: `tailwind.config.ts`

- [ ] Define typography scale
- [ ] Update all headings to use scale
- [ ] Update all body text to use scale
- [ ] Test typography on all pages

**Config**:
```typescript
theme: {
  extend: {
    fontSize: {
      'h1': '2rem',      // 32px
      'h2': '1.5rem',    // 24px
      'h3': '1.25rem',   // 20px
      'h4': '1rem',      // 16px
      'body': '0.875rem', // 14px
      'small': '0.75rem', // 12px
    }
  }
}
```

---

### 15. Mobile Responsive Optimizations
**File**: `src/components/student/dashboard-client.tsx`

- [ ] Test on mobile devices (< 768px)
- [ ] Stack hero banner vertically on mobile
- [ ] Adjust emotion tiles to 3 columns on mobile
- [ ] Stack quick cards vertically on mobile
- [ ] Test sidebar collapse on mobile
- [ ] Add hamburger menu for mobile

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] Logo displays correctly in sidebar
- [ ] Hero banner renders with illustration
- [ ] All quick cards show illustrations
- [ ] Empty states display correctly
- [ ] Hover effects work smoothly
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts (CLS < 0.1)

### Performance Testing
- [ ] Initial page load < 1.5s
- [ ] Time to interactive < 2.0s
- [ ] Navigation < 300ms
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] No memory leaks

### Responsive Testing
- [ ] Desktop (1280px+) - all features visible
- [ ] Tablet (768px-1279px) - proper layout
- [ ] Mobile (< 768px) - stacked layout
- [ ] Touch interactions work on mobile
- [ ] Sidebar collapses on mobile

### Accessibility Testing
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

---

## 📊 Performance Metrics

### Before Implementation
- Initial page load: ~2.5s
- Time to interactive: ~3.0s
- Navigation speed: ~800ms
- Lighthouse score: ~75

### Target After Implementation
- Initial page load: <1.5s (40% improvement)
- Time to interactive: <2.0s (33% improvement)
- Navigation speed: <300ms (62% improvement)
- Lighthouse score: >90 (+15 points)

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Performance targets met
- [ ] Visual QA complete
- [ ] Accessibility audit passed

### Deployment
- [ ] Build production bundle: `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Deploy to staging environment
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor performance metrics

### Post-deployment
- [ ] Verify logo displays correctly
- [ ] Verify hero banner loads
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Gather user feedback

---

## 📝 Additional Notes

### Illustrations Needed
Based on the plan, we have:
- ✅ `Logo.svg` - Sidebar
- ✅ `student_dashboard.svg` - Hero banner
- ✅ `counsellor_booksession.svg` - Book session card
- ✅ `Student_using_laptop_welness.svg` - Resources card
- ✅ `Student_in_stress_need_help.svg` - Empty states

**Potentially missing**:
- ❓ Check-in success celebration
- ❓ Progress/achievement illustration
- ❓ Chat/Saathi illustration

### Performance Tips
1. Use `loading="lazy"` for all images below the fold
2. Use `priority={true}` only for hero banner illustration
3. Implement progressive image loading
4. Use WebP format for raster images (if any)
5. Minimize JavaScript bundle size

### Common Pitfalls
- ❌ Don't load all illustrations at once
- ❌ Don't use Framer Motion for simple animations
- ❌ Don't forget to add loading states
- ❌ Don't skip accessibility testing
- ❌ Don't deploy without performance testing

---

**Checklist Status**: ✅ Ready for Implementation
**Estimated Time**: 2-3 weeks
**Priority**: Phase 1 → Phase 2 → Phase 3

