# Prescription Suggestion Form - Validation Fix

## Issue
The prescription suggestion form was failing with validation errors because the form fields didn't match the API schema.

### Error
```
Validation failed
POST /api/prescriptions/suggest 400 (Bad Request)
```

## Root Cause
**Form was sending:**
- `studentId` ❌ (not in schema)
- `medicationName` ✅
- `suggestedDosage` ❌ (should be `dosage`)
- `reason` ❌ (should be `notes`)
- Missing: `frequency`, `duration`

**API expected:**
- `parentPrescriptionId` (required)
- `medicationName` ✅
- `dosage`
- `frequency`
- `duration`
- `notes` (optional)

## Solution Applied

### 1. Updated Validation Schema (`src/lib/prescriptions/validation.ts`)
Changed `suggestionSchema` to:
- Accept `studentId` (required)
- Make `parentPrescriptionId` optional (for standalone suggestions)
- Keep all other required fields

### 2. Updated API Route (`src/app/api/prescriptions/suggest/route.ts`)
- Now accepts `studentId` in request body
- Makes `parentPrescriptionId` optional
- If `parentPrescriptionId` provided, validates it exists and matches student
- If not provided, creates standalone suggestion

### 3. Updated Form Component (`src/components/prescriptions/PrescriptionSuggestionForm.tsx`)
**Added fields:**
- `dosage` (was `suggestedDosage`)
- `frequency` (dropdown with options: Once daily, Twice daily, Three times daily, As needed, Other)
- `duration` (text input, e.g., "30 days")

**Updated:**
- `reason` now maps to `notes` in API
- Made `reason` optional (not required)
- Updated validation to match API requirements
- Character limits: reason 2000 chars (was 500)

**Form now sends:**
```json
{
  "studentId": "uuid",
  "parentPrescriptionId": "uuid" (optional),
  "medicationName": "string",
  "dosage": "string",
  "frequency": "Once daily" | "Twice daily" | ...,
  "duration": "string",
  "notes": "string" (optional)
}
```

## Files Changed
1. ✅ `src/lib/prescriptions/validation.ts` - Updated suggestionSchema
2. ✅ `src/app/api/prescriptions/suggest/route.ts` - Updated API logic
3. ✅ `src/components/prescriptions/PrescriptionSuggestionForm.tsx` - Updated form fields

## Testing Instructions
1. **Hard refresh browser** (Ctrl+Shift+R)
2. Go to counsellor dashboard
3. Navigate to a student's prescriptions page
4. Click "Send Suggestion" button
5. Fill out the form:
   - Medication Name: "Sertraline"
   - Suggested Dosage: "50mg"
   - Frequency: Select from dropdown
   - Duration: "30 days"
   - Reason: Optional explanation
6. Click "Send Suggestion"

### Expected Results
- ✅ No validation errors
- ✅ Suggestion created successfully
- ✅ Toast notification shows success
- ✅ Form closes
- ✅ Suggestion appears in prescriptions list

## Status
- **Form Fields**: Fixed ✅
- **Validation Schema**: Fixed ✅
- **API Route**: Fixed ✅
- **TypeScript**: No errors ✅

## Notes
- Suggestions can now be created with or without a parent prescription
- All required fields from the prescription schema are now included
- Form validation matches API validation exactly
