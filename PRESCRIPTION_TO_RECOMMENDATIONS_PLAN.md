# Prescription → Counselor Recommendations Migration Plan

## Overview
Transform the existing "Prescription" module into a "Counselor Recommendations" system while maintaining the current architecture, database structure, and UI/UX flow.

---

## Core Terminology Changes

### Database Level (Minimal Changes)
- Keep table names: `prescriptions`, `prescription_messages`, `prescription_audit_log`
- Keep column names for backend compatibility
- Add new columns for categorization if needed

### Application Level (UI/UX Changes)
| Old Term | New Term |
|----------|----------|
| Prescription | Recommendation / Wellness Guidance |
| Add Prescription | Add Recommendation |
| My Prescriptions | My Recommendations |
| Medication Name | Recommendation Title / Focus Area |
| Dosage | Guidance Details |
| Frequency | Follow-up Schedule |
| Duration | Support Period |
| Prescribed by | Recommended by |
| Prescribe | Recommend |

---

## Recommendation Categories

Replace medication-focused fields with wellness categories:

1. **Academic Stress** - Study techniques, time management
2. **Anxiety Support** - Breathing exercises, grounding techniques
3. **Sleep Wellness** - Sleep hygiene, relaxation methods
4. **Emotional Wellbeing** - Journaling, self-care activities
5. **Burnout Prevention** - Work-life balance, breaks
6. **Social Support** - Campus groups, peer connections
7. **Professional Referral** - When to seek licensed help

---

## Files to Modify

### 1. Type Definitions
- `src/types/prescription.ts` → Add comments clarifying wellness use

### 2. Database Migrations
- `supabase/migrations/041_add_recommendation_categories.sql` → Add category field

### 3. UI Components
- `src/components/prescriptions/PrescriptionCard.tsx` → Update labels
- `src/components/prescriptions/MessageInput.tsx` → Update placeholder text
- `src/components/prescriptions/MessageThread.tsx` → Update empty state text
- `src/components/student/dashboard-client.tsx` → Update card title
- `src/components/shared/sidebar.tsx` → Update navigation label

### 4. Pages
- `src/app/student/prescriptions/page.tsx` → Update page title and content
- `src/app/student/prescriptions/[id]/page.tsx` → Update detail view
- `src/app/counsellor/prescriptions/page.tsx` → Update counselor view
- `src/app/counsellor/students/[id]/page.tsx` → Update "Add Prescription" form

### 5. API Routes (Minimal Changes)
- Keep existing endpoints for compatibility
- Update response messages and validation text

---

## Implementation Strategy

### Phase 1: Type Definitions & Constants ✅
1. Add recommendation categories enum
2. Update type comments
3. Create wellness guidance templates

### Phase 2: UI Component Updates ✅
1. Update all user-facing labels
2. Replace medical icons with wellness icons
3. Update placeholder text and help text
4. Add disclaimer text

### Phase 3: Form Updates ✅
1. Replace "Medication Name" with "Recommendation Title"
2. Replace "Dosage" with "Guidance Details"
3. Replace "Frequency" with "Follow-up Schedule"
4. Add category dropdown
5. Update validation messages

### Phase 4: Page Updates ✅
1. Update page titles and descriptions
2. Update empty states
3. Add wellness-focused copy
4. Add disclaimer banners

### Phase 5: Database Migration ✅
1. Add `category` column to prescriptions table
2. Add `recommendation_type` enum
3. Keep existing columns for backward compatibility

### Phase 6: Testing & Verification ✅
1. Test student view
2. Test counselor view
3. Test messaging functionality
4. Verify no medical terminology remains

---

## Safety & Ethical Constraints

### Disclaimer Text (Add to all prescription/recommendation pages)
```
⚠️ Wellness Support Notice
This platform provides counselor guidance and wellness support only. 
It is not a substitute for licensed medical diagnosis, psychiatric treatment, 
or emergency healthcare services. If you're experiencing a mental health 
emergency, please contact emergency services or your campus health center immediately.
```

### Validation Rules
- ❌ Block: medication names, drug names, dosage amounts
- ❌ Block: diagnostic terms (depression, anxiety disorder, PTSD, etc.)
- ❌ Block: prescription drug terminology
- ✅ Allow: wellness activities, coping strategies, campus resources
- ✅ Allow: emotional support language, self-care recommendations

### Form Constraints
- Remove any medical-looking dropdowns
- Use wellness-focused categories
- Emphasize "guidance" and "support" language
- Include referral option for professional help

---

## Example Transformations

### Before (Medical)
```
Medication: Fluoxetine 20mg
Dosage: 1 tablet
Frequency: Once daily
Duration: 3 months
Notes: For anxiety management
```

### After (Wellness)
```
Recommendation: Daily Mindfulness Practice
Guidance: 10-minute guided meditation each morning
Follow-up: Daily practice, check-in weekly
Support Period: 4 weeks
Notes: Focus on breathing exercises and grounding techniques. 
       If symptoms persist, consider referral to campus health services.
Category: Anxiety Support
```

---

## UI/UX Mockup Changes

### Student Dashboard Card
**Before:**
```
💊 My Prescriptions
View treatment plans and message counselor
```

**After:**
```
🌿 My Recommendations
View wellness guidance and message counselor
```

### Counselor Form
**Before:**
```
Add Prescription
Medication Name: [________]
Dosage: [________]
Frequency: [________]
```

**After:**
```
Add Recommendation
Recommendation Title: [________]
Category: [Dropdown: Academic Stress, Anxiety Support, etc.]
Guidance Details: [________]
Follow-up Schedule: [________]
```

---

## Database Schema (Minimal Changes)

### Keep Existing Structure
```sql
-- prescriptions table (keep as-is for compatibility)
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  counsellor_id UUID REFERENCES users(id),
  medication_name TEXT,  -- Now used for "Recommendation Title"
  dosage TEXT,           -- Now used for "Guidance Details"
  frequency TEXT,        -- Now used for "Follow-up Schedule"
  duration TEXT,         -- Now used for "Support Period"
  notes TEXT,
  prescribed_at TIMESTAMPTZ,
  is_suggestion BOOLEAN
);
```

### Add New Column
```sql
-- Add category for wellness recommendations
ALTER TABLE prescriptions 
ADD COLUMN category TEXT CHECK (category IN (
  'Academic Stress',
  'Anxiety Support',
  'Sleep Wellness',
  'Emotional Wellbeing',
  'Burnout Prevention',
  'Social Support',
  'Professional Referral'
));
```

---

## Testing Checklist

### Student View
- [ ] Dashboard shows "My Recommendations" instead of "My Prescriptions"
- [ ] Recommendation cards use wellness language
- [ ] No medical terminology visible
- [ ] Disclaimer is visible
- [ ] Messaging works correctly
- [ ] Categories display properly

### Counselor View
- [ ] "Add Recommendation" form uses wellness fields
- [ ] Category dropdown works
- [ ] Validation prevents medical terms
- [ ] Student list shows recommendations correctly
- [ ] Messaging works correctly

### Navigation
- [ ] Sidebar shows "Recommendations" instead of "Prescriptions"
- [ ] URLs remain unchanged (for compatibility)
- [ ] Icons updated to wellness theme

---

## Rollout Strategy

### Development
1. Create feature branch: `feature/wellness-recommendations`
2. Implement changes in phases
3. Test thoroughly in development

### Staging
1. Deploy to staging environment
2. Test with sample data
3. Verify no medical terminology
4. Check all user flows

### Production
1. Run database migration (add category column)
2. Deploy updated frontend
3. Monitor for issues
4. Provide user communication about changes

---

## Communication Plan

### For Students
```
📢 Update: We've enhanced our wellness support!

"Prescriptions" are now "Counselor Recommendations" - 
a better reflection of the personalized wellness guidance 
and support strategies your counselors provide.

Everything works the same way, just with clearer, 
more supportive language focused on your wellbeing journey.
```

### For Counselors
```
📢 Important Update: Prescription Module Renamed

To better align with our wellness-focused mission and 
ethical guidelines, the "Prescription" module is now 
"Counselor Recommendations."

Key changes:
- Use wellness-focused language
- Select from wellness categories
- Provide guidance, not medical prescriptions
- Include referral options when needed

All functionality remains the same - only the terminology 
has been updated to reflect our role as wellness supporters, 
not medical providers.
```

---

## Success Metrics

- ✅ Zero medical terminology in user-facing text
- ✅ All forms use wellness categories
- ✅ Disclaimer visible on all relevant pages
- ✅ No functionality broken
- ✅ Database structure maintained
- ✅ API endpoints unchanged
- ✅ User flows identical

---

## Status: Ready for Implementation

All planning complete. Ready to proceed with systematic implementation.
