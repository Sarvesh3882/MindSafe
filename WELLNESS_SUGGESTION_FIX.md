# Wellness Suggestion Form — Fix Summary

## Issue Identified

**Error**: `POST http://localhost:3000/api/prescriptions/suggest 404 (Not Found)`

**Root Cause**: The API endpoint `/api/prescriptions/suggest` was missing. The form was trying to submit wellness suggestions, but the backend route didn't exist.

---

## What Was Fixed

### 1. Created Missing API Route ✅
**File**: `src/app/api/prescriptions/suggest/route.ts`

This API endpoint now handles:
- ✅ Authentication (counsellor only)
- ✅ Authorization (same college verification)
- ✅ Validation (required fields)
- ✅ Database insertion (prescriptions table)
- ✅ Audit logging (prescription_audit_log table)
- ✅ Error handling

### 2. Improved Form Validation ✅
**File**: `src/components/prescriptions/PrescriptionSuggestionForm.tsx`

Improvements:
- ✅ Better validation messages
- ✅ Minimum length requirements (5 chars for guidance details)
- ✅ Validation error summary at top of form
- ✅ Better placeholder text and helper text
- ✅ Real-time error clearing

---

## API Endpoint Details

### Endpoint
```
POST /api/prescriptions/suggest
```

### Authentication
- Requires authenticated user (counsellor role)
- Verifies counsellor and student are in same college

### Request Body
```json
{
  "studentId": "uuid",
  "parentPrescriptionId": "uuid (optional)",
  "medicationName": "string (2-200 chars)",
  "dosage": "string (5-100 chars)",
  "frequency": "string",
  "duration": "string (2-50 chars)",
  "notes": "string (optional, max 2000 chars)"
}
```

### Response (Success)
```json
{
  "success": true,
  "prescription": {
    "id": "uuid",
    "student_id": "uuid",
    "counsellor_id": "uuid",
    "medication_name": "string",
    "dosage": "string",
    "frequency": "string",
    "duration": "string",
    "status": "active",
    "prescribed_at": "timestamp"
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Error message"
}
```

### Status Codes
- `200` - Success
- `400` - Bad request (missing fields, invalid data)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not a counsellor, different college)
- `404` - Not found (student doesn't exist)
- `500` - Internal server error

---

## Validation Rules

### Suggestion Title (medicationName)
- ✅ Required
- ✅ Minimum 2 characters
- ✅ Maximum 200 characters
- ✅ Example: "Try journaling before bed"

### Guidance Details (dosage)
- ✅ Required
- ✅ Minimum 5 characters (more descriptive)
- ✅ Maximum 100 characters
- ✅ Example: "10 minutes of free writing each evening"

### Follow-up Schedule (frequency)
- ✅ Required
- ✅ Dropdown selection
- ✅ Options: Daily practice, Twice daily, Weekly check-in, As needed, Other

### Support Period (duration)
- ✅ Required
- ✅ Minimum 2 characters
- ✅ Maximum 50 characters
- ✅ Example: "2 weeks", "1 month", "4 weeks"

### Reason for Suggestion (notes)
- ⚪ Optional
- ✅ Maximum 2000 characters

---

## Database Tables Used

### 1. prescriptions
```sql
INSERT INTO prescriptions (
  student_id,
  counsellor_id,
  parent_prescription_id,
  medication_name,
  dosage,
  frequency,
  duration,
  notes,
  status,
  prescribed_at
)
```

### 2. prescription_audit_log
```sql
INSERT INTO prescription_audit_log (
  prescription_id,
  action,
  performed_by,
  details
)
```

---

## Security Features

### Authentication
- ✅ Verifies user is logged in
- ✅ Verifies user is a counsellor
- ✅ Uses Supabase auth

### Authorization
- ✅ Verifies student exists
- ✅ Verifies student is actually a student (not counsellor/admin)
- ✅ Verifies counsellor and student are in same college
- ✅ Prevents cross-college suggestions

### Data Validation
- ✅ Required fields checked
- ✅ Length limits enforced
- ✅ SQL injection prevention (Supabase parameterized queries)
- ✅ XSS prevention (React escaping)

### Audit Trail
- ✅ All suggestions logged in audit table
- ✅ Tracks who created what and when
- ✅ Includes details for compliance

---

## Testing

### Test Case 1: Valid Suggestion
**Input**:
```json
{
  "studentId": "valid-uuid",
  "medicationName": "Daily journaling practice",
  "dosage": "10 minutes of free writing each evening",
  "frequency": "Daily practice",
  "duration": "2 weeks",
  "notes": "To help process emotions and reduce stress"
}
```
**Expected**: ✅ Success, prescription created

### Test Case 2: Missing Required Field
**Input**:
```json
{
  "studentId": "valid-uuid",
  "medicationName": "Daily journaling",
  "dosage": "10",  // Too short (< 5 chars)
  "frequency": "Daily practice",
  "duration": "2 weeks"
}
```
**Expected**: ❌ Validation error

### Test Case 3: Unauthorized User
**Input**: Valid data, but user is not a counsellor
**Expected**: ❌ 403 Forbidden

### Test Case 4: Different College
**Input**: Valid data, but student is from different college
**Expected**: ❌ 403 Forbidden

---

## How to Test

### 1. Restart Dev Server
```bash
# Kill any existing servers
taskkill /PID 20556 /F

# Start fresh
npm run dev
```

### 2. Login as Counsellor
- Go to `/login/counsellor`
- Login with counsellor credentials

### 3. Open Student Profile
- Navigate to a student's profile
- Click "Send Wellness Suggestion"

### 4. Fill Form
- **Suggestion Title**: "Daily mindfulness practice"
- **Guidance Details**: "5 minutes of breathing exercises each morning"
- **Follow-up Schedule**: "Daily practice"
- **Support Period**: "2 weeks"
- **Reason**: "To help reduce morning anxiety"

### 5. Submit
- Click "Send Suggestion"
- Should see success toast
- Check database for new prescription

---

## Database Verification

### Check Prescription Created
```sql
SELECT 
  p.*,
  s.full_name AS student_name,
  c.full_name AS counsellor_name
FROM prescriptions p
JOIN users s ON p.student_id = s.id
JOIN users c ON p.counsellor_id = c.id
ORDER BY p.prescribed_at DESC
LIMIT 5;
```

### Check Audit Log
```sql
SELECT 
  pal.*,
  u.full_name AS performed_by_name
FROM prescription_audit_log pal
JOIN users u ON pal.performed_by = u.id
ORDER BY pal.created_at DESC
LIMIT 5;
```

---

## Next Steps

### Immediate
1. ✅ API route created
2. ✅ Form validation improved
3. ⏳ Test in browser
4. ⏳ Verify database entries

### Future Enhancements
1. **Notifications**: Send email/SMS to student when suggestion is created
2. **Student View**: Allow students to view and acknowledge suggestions
3. **Follow-up Tracking**: Track student compliance with suggestions
4. **Analytics**: Dashboard showing suggestion effectiveness
5. **Templates**: Pre-defined suggestion templates for common issues

---

## Troubleshooting

### Issue: Still getting 404
**Solution**: Restart dev server completely
```bash
taskkill /F /IM node.exe
npm run dev
```

### Issue: Unauthorized error
**Solution**: Verify you're logged in as a counsellor
```sql
SELECT id, email, role FROM users WHERE id = 'your-user-id';
```

### Issue: Different college error
**Solution**: Verify counsellor and student have same college_id
```sql
SELECT 
  u.id,
  u.full_name,
  u.role,
  u.college_id,
  c.name AS college_name
FROM users u
LEFT JOIN colleges c ON u.college_id = c.id
WHERE u.id IN ('counsellor-id', 'student-id');
```

### Issue: Validation errors
**Solution**: Check field lengths
- Guidance Details must be at least 5 characters
- Support Period must be at least 2 characters
- All required fields must be filled

---

## Files Modified/Created

### Created
- ✅ `src/app/api/prescriptions/suggest/route.ts` — API endpoint

### Modified
- ✅ `src/components/prescriptions/PrescriptionSuggestionForm.tsx` — Form validation

### Documentation
- ✅ `WELLNESS_SUGGESTION_FIX.md` — This document

---

## Status

✅ **FIXED** — API endpoint created and form validation improved

**Next Action**: Restart dev server and test the form

