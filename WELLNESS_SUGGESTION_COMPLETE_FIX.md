# Wellness Suggestion — Complete Fix

## Issues Identified

### Issue 1: Missing API Endpoint ✅ FIXED
**Error**: `POST /api/prescriptions/suggest 404 (Not Found)`  
**Fix**: Created `src/app/api/prescriptions/suggest/route.ts`

### Issue 2: Wrong Database Schema ✅ FIXED
**Error**: `Could not find the 'status' column of 'prescriptions' in the schema cache`  
**Root Cause**: API was trying to set `status: 'active'` but the prescriptions table doesn't have a `status` column  
**Fix**: Updated API to use correct schema fields (`is_deleted`, `is_suggestion`)

### Issue 3: Frequency Values Mismatch ✅ FIXED
**Error**: Database constraint violation  
**Root Cause**: Form uses "Daily practice" but database expects "Once daily"  
**Fix**: Created migration 042 to update database constraint

---

## What Was Fixed

### 1. API Route Created ✅
**File**: `src/app/api/prescriptions/suggest/route.ts`

**Correct Schema**:
```typescript
{
  student_id: UUID,
  counsellor_id: UUID,
  parent_prescription_id: UUID | null,
  medication_name: string,
  dosage: string,
  frequency: string,
  duration: string,
  notes: string | null,
  is_suggestion: boolean,      // ✅ Not 'status'
  is_deleted: boolean,          // ✅ Not 'status'
  prescribed_at: timestamp
}
```

### 2. Database Migration Created ✅
**File**: `supabase/migrations/042_fix_prescription_frequency_values.sql`

**Updated Frequency Values**:
- ✅ "Daily practice" (was "Once daily")
- ✅ "Twice daily" (unchanged)
- ✅ "Weekly check-in" (new)
- ✅ "As needed" (unchanged)
- ✅ "Other" (unchanged)

### 3. Form Validation Improved ✅
**File**: `src/components/prescriptions/PrescriptionSuggestionForm.tsx`

**Improvements**:
- ✅ Better validation messages
- ✅ Validation summary at top
- ✅ Minimum 5 characters for guidance details
- ✅ Helper text for all fields

---

## Database Schema (Correct)

### prescriptions Table
```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  counsellor_id UUID NOT NULL,
  parent_prescription_id UUID,
  
  -- Wellness Details
  medication_name TEXT NOT NULL,  -- "Suggestion Title"
  dosage TEXT NOT NULL,            -- "Guidance Details"
  frequency TEXT NOT NULL,         -- "Follow-up Schedule"
  duration TEXT NOT NULL,          -- "Support Period"
  notes TEXT,                      -- "Reason for Suggestion"
  wellness_tips TEXT,
  
  -- Flags (NOT 'status')
  is_suggestion BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  prescribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Points**:
- ❌ NO `status` column
- ✅ Uses `is_deleted` for soft deletes
- ✅ Uses `is_suggestion` to mark follow-up suggestions
- ✅ Wellness-friendly field names

---

## How to Apply Fixes

### Step 1: Run Database Migration
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/042_fix_prescription_frequency_values.sql
```

This will:
1. Drop old frequency constraint
2. Add new constraint with wellness values
3. Update any existing records

### Step 2: Restart Dev Server
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
cd mindsafe-india
npm run dev
```

### Step 3: Test the Form
1. Login as counsellor
2. Navigate to student profile
3. Click "Send Wellness Suggestion"
4. Fill form:
   - **Suggestion Title**: "Daily journaling practice"
   - **Guidance Details**: "10 minutes of free writing each evening"
   - **Follow-up Schedule**: "Daily practice"
   - **Support Period**: "2 weeks"
   - **Reason**: "To help process emotions"
5. Click "Send Suggestion"
6. Should work! ✅

---

## API Endpoint Details

### POST /api/prescriptions/suggest

**Request Body**:
```json
{
  "studentId": "uuid",
  "parentPrescriptionId": "uuid (optional)",
  "medicationName": "Daily journaling practice",
  "dosage": "10 minutes of free writing each evening",
  "frequency": "Daily practice",
  "duration": "2 weeks",
  "notes": "To help process emotions and reduce stress"
}
```

**Success Response**:
```json
{
  "success": true,
  "prescription": {
    "id": "uuid",
    "student_id": "uuid",
    "counsellor_id": "uuid",
    "medication_name": "Daily journaling practice",
    "dosage": "10 minutes of free writing each evening",
    "frequency": "Daily practice",
    "duration": "2 weeks",
    "notes": "To help process emotions and reduce stress",
    "is_suggestion": false,
    "is_deleted": false,
    "prescribed_at": "2026-05-21T..."
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Validation Rules

### Suggestion Title (medication_name)
- ✅ Required
- ✅ 2-200 characters
- ✅ Example: "Daily journaling practice"

### Guidance Details (dosage)
- ✅ Required
- ✅ 5-100 characters (min 5 for descriptive text)
- ✅ Example: "10 minutes of free writing each evening"

### Follow-up Schedule (frequency)
- ✅ Required
- ✅ Must be one of:
  - "Daily practice"
  - "Twice daily"
  - "Weekly check-in"
  - "As needed"
  - "Other"

### Support Period (duration)
- ✅ Required
- ✅ 2-50 characters
- ✅ Example: "2 weeks", "1 month"

### Reason (notes)
- ⚪ Optional
- ✅ Max 2000 characters

---

## Testing Checklist

### Database
- [ ] Run migration 042
- [ ] Verify frequency constraint updated
- [ ] Check existing prescriptions migrated

### API
- [ ] Restart dev server
- [ ] Test POST /api/prescriptions/suggest
- [ ] Verify no 404 error
- [ ] Verify no schema cache error

### Form
- [ ] Login as counsellor
- [ ] Open wellness suggestion form
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Verify success toast
- [ ] Check database for new record

### Verification Queries
```sql
-- Check prescription created
SELECT * FROM prescriptions 
ORDER BY created_at DESC 
LIMIT 1;

-- Check frequency values
SELECT DISTINCT frequency 
FROM prescriptions;

-- Check audit log
SELECT * FROM prescription_audit_log 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## Common Errors & Solutions

### Error: "Could not find the 'status' column"
**Solution**: ✅ Fixed in API route - now uses `is_deleted` and `is_suggestion`

### Error: "violates check constraint prescriptions_frequency_check"
**Solution**: ✅ Run migration 042 to update frequency values

### Error: "404 Not Found"
**Solution**: ✅ API route created - restart dev server

### Error: "Validation failed"
**Solution**: ✅ Ensure guidance details is at least 5 characters

---

## Files Modified/Created

### Created
- ✅ `src/app/api/prescriptions/suggest/route.ts` — API endpoint
- ✅ `supabase/migrations/042_fix_prescription_frequency_values.sql` — DB fix

### Modified
- ✅ `src/components/prescriptions/PrescriptionSuggestionForm.tsx` — Validation

### Documentation
- ✅ `WELLNESS_SUGGESTION_COMPLETE_FIX.md` — This document

---

## Summary

**All Issues Fixed**:
1. ✅ API endpoint created
2. ✅ Database schema corrected (no `status` column)
3. ✅ Frequency values aligned (wellness terminology)
4. ✅ Form validation improved

**Next Steps**:
1. Run migration 042 in Supabase
2. Restart dev server
3. Test the form
4. Verify database entries

**Status**: ✅ READY TO TEST

