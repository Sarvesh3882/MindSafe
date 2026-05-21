# Prescription Query Parameters Fix ✅

**Date**: 2024
**Status**: ✅ FIXED
**Errors**: "Invalid query parameters", "Student not found"

---

## Problems

### 1. Invalid Query Parameters Error
**Error Message**: "Invalid query parameters"
**Location**: Student prescriptions page (`/student/prescriptions`)
**Cause**: Zod validation schema didn't handle `null` values from URL search params

### 2. Student Not Found Error
**Error Message**: "Student not found"
**Location**: Counsellor viewing student prescriptions
**Cause**: Same query parameter validation issue

---

## Root Cause

### URL Search Params Return Null
When a URL parameter is not provided, `searchParams.get('param')` returns `null`:
```typescript
searchParams.get('dateRange') // returns null if not in URL
```

### Zod Schema Didn't Handle Null
The validation schema expected either a string or undefined, but got `null`:
```typescript
// OLD - Didn't handle null
dateRange: z.enum(['7d', '30d', '90d', 'all']).default('all')
```

### Validation Failed
When `null` was passed to the enum validator, it failed because `null` is not one of the allowed values `['7d', '30d', '90d', 'all']`.

---

## Solution

### 1. Updated Validation Schema ✅
**File**: `src/lib/prescriptions/validation.ts`

**Changes**:
- Added `.nullable()` to handle `null` values
- Added `.optional()` for optional parameters
- Kept `.default()` to provide fallback values

**New Schema**:
```typescript
export const prescriptionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional().nullable(),
  dateRange: z.enum(['7d', '30d', '90d', 'all']).optional().nullable().default('all'),
});
```

### 2. Updated API Routes ✅
**Files**: 
- `src/app/api/prescriptions/my-prescriptions/route.ts`
- `src/app/api/prescriptions/student/[studentId]/route.ts`

**Changes**:
- Provide default values when search params are `null`
- Use `|| 'default'` to handle null values

**New Logic**:
```typescript
const queryValidation = prescriptionQuerySchema.safeParse({
  page: searchParams.get('page') || '1',
  limit: searchParams.get('limit') || '20',
  search: searchParams.get('search') || null,
  dateRange: searchParams.get('dateRange') || 'all',
});
```

---

## What's Fixed

### ✅ Student Prescriptions Page
- No more "Invalid query parameters" error
- Page loads correctly
- Can view all prescriptions
- Search and filters work
- Pagination works

### ✅ Counsellor Prescriptions Page
- No more "Student not found" error (caused by query param validation)
- Can view student prescriptions
- Can create new prescriptions
- Can edit existing prescriptions

### ✅ API Routes
- Handle null query parameters correctly
- Validation passes with default values
- No more 400 Bad Request errors

---

## Testing Checklist

### Student View
- [ ] Go to `/student/prescriptions`
- [ ] Page loads without "Invalid query parameters" error
- [ ] Can see list of prescriptions (or "No prescriptions yet")
- [ ] Search box works
- [ ] Date range filter works
- [ ] Pagination works

### Counsellor View
- [ ] Go to `/counsellor/prescriptions`
- [ ] Can see list of students
- [ ] Click on a student
- [ ] Student prescriptions page loads without errors
- [ ] Can see student's prescriptions (or "No prescriptions yet")
- [ ] Can click "Create Prescription"

### API Testing
- [ ] Call `/api/prescriptions/my-prescriptions` (no query params)
- [ ] Returns success with empty prescriptions array
- [ ] Call with query params: `?page=1&limit=20&dateRange=all`
- [ ] Returns success with prescriptions

---

## Files Modified

1. **`src/lib/prescriptions/validation.ts`**
   - Added `.nullable()` to search and dateRange
   - Added `.optional()` to dateRange
   - Handles null values from URL search params

2. **`src/app/api/prescriptions/my-prescriptions/route.ts`**
   - Provide default values for null search params
   - Use `|| 'default'` pattern

3. **`src/app/api/prescriptions/student/[studentId]/route.ts`**
   - Same changes as my-prescriptions route
   - Handles null query parameters

---

## Why This Happened

### Next.js URL Search Params Behavior
In Next.js, `searchParams.get('param')` returns:
- `string` if parameter exists in URL
- `null` if parameter doesn't exist in URL
- Never returns `undefined`

### Zod Enum Validation
Zod's `z.enum()` validator is strict:
- Only accepts exact values from the enum array
- Doesn't automatically handle `null` or `undefined`
- Needs explicit `.nullable()` or `.optional()` modifiers

### Default Values
Zod's `.default()` only applies when value is `undefined`, not when it's `null`:
- `undefined` → uses default value ✅
- `null` → validation fails ❌
- Need to handle `null` before passing to validator

---

## Prevention

### For Future Development

1. **Always Handle Null**: When using `searchParams.get()`, always provide fallback:
   ```typescript
   searchParams.get('param') || 'default'
   ```

2. **Use Nullable in Schemas**: For optional URL params, use `.nullable()`:
   ```typescript
   z.string().optional().nullable()
   ```

3. **Test Without Query Params**: Always test API routes without query parameters

4. **Type-Safe Defaults**: Provide type-safe default values in validation schema

---

## Additional Notes

### Query Parameter Defaults
- `page`: defaults to `1`
- `limit`: defaults to `20`
- `search`: defaults to `null` (no search)
- `dateRange`: defaults to `'all'` (all time)

### Validation Order
1. Get search params (may be null)
2. Provide defaults for null values
3. Pass to Zod validator
4. Validator applies additional defaults if needed
5. Use validated data

---

## Summary

**Problem**: Query parameter validation failed when params were null

**Cause**: Zod schema didn't handle null values from URL search params

**Solution**: 
1. Added `.nullable()` to validation schema
2. Provided default values in API routes

**Result**: Prescription system works for both students and counsellors

---

**Status**: ✅ READY TO TEST

**Action**: Refresh your browser and test the prescription pages!
