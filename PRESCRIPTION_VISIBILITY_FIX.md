# Prescription Visibility Fix - Complete Summary

## Issue
Prescribed resources were not showing in a separate section on the student resources page. They were mixed with browseable resources instead of appearing in a dedicated "Prescribed by Your Counsellor" section.

## Root Causes Identified

### 1. **Column Name Mismatch**
- **Problem**: The `resource_prescriptions` table uses `prescribed_at` as the timestamp column
- **Bug**: The query was trying to select `created_at` which doesn't exist
- **Impact**: Query was failing silently, returning no prescription data

### 2. **Non-Serializable Data Types**
- **Problem**: Next.js cannot serialize `Set` and `Map` objects when passing from Server Component to Client Component
- **Bug**: Passing `Set<string>` and `Map` directly from server to client
- **Impact**: Data was lost during serialization, resulting in empty prescribed resources

## Fixes Applied

### Fix 1: Corrected Column Names
**File**: `src/app/student/resources/page.tsx`

Changed from:
```typescript
.select(`
  id,
  created_at,  // ❌ Wrong column name
  resource_id,
  ...
`)
.order("created_at", { ascending: false });  // ❌ Wrong column name
```

To:
```typescript
.select(`
  id,
  prescribed_at,  // ✅ Correct column name
  resource_id,
  ...
`)
.order("prescribed_at", { ascending: false });  // ✅ Correct column name
```

### Fix 2: Serializable Data Structures
**File**: `src/app/student/resources/page.tsx`

Changed from:
```typescript
// ❌ Non-serializable
const prescribedResourceIds = new Set(prescriptions?.map(...) ?? []);
const prescriptionMap = new Map(prescriptions?.map(...) ?? []);
```

To:
```typescript
// ✅ Serializable arrays
const prescribedResourceIds = prescriptions?.map((p: any) => p.resource_id) ?? [];
const prescriptionMap = prescriptions?.map((p: any) => ({
  resourceId: p.resource_id,
  prescribedAt: p.prescribed_at,
  counsellorName: p.users?.full_name ?? "Counsellor",
})) ?? [];
```

### Fix 3: Client Component Data Conversion
**File**: `src/components/student/student-resources-client.tsx`

Added conversion logic in client component:
```typescript
// Convert arrays to Set and Map for efficient lookup
const prescribedIdsSet = new Set(prescribedResourceIds);
const prescriptionInfoMap = new Map(
  prescriptionMap.map(p => [p.resourceId, { 
    prescribedAt: p.prescribedAt, 
    counsellorName: p.counsellorName 
  }])
);
```

Updated type definitions:
```typescript
interface PrescriptionInfo {
  resourceId: string;
  prescribedAt: string;
  counsellorName: string;
}

// Props now accept arrays instead of Set/Map
prescribedResourceIds: string[];
prescriptionMap: PrescriptionInfo[];
```

## Debug Logging Added

### Server-Side Logging
Added comprehensive logging in `src/app/student/resources/page.tsx`:
- Student ID
- Resources query errors
- Total resources count
- Prescriptions data
- Prescription query errors
- Number of prescriptions
- Verification that prescribed resources exist in the resources table

### Client-Side Logging
Added logging in `src/components/student/student-resources-client.tsx`:
- Total resources received
- Prescribed resource IDs (both array and Set)
- Prescription info map
- Filtered prescribed resources count
- Non-prescribed resources count

## Verification Steps

### 1. Check Database
Run `DIAGNOSE_PRESCRIPTION_ISSUE.sql` to verify:
- Prescriptions exist in database
- Resource IDs in prescriptions match actual resources
- RLS policies are correct
- Student can see their prescriptions

### 2. Check Browser Console
After logging in as a student:
1. Navigate to Resources page
2. Open browser console (F12)
3. Look for "=== PRESCRIPTION DEBUG ===" logs
4. Verify:
   - `prescriptions` array has data
   - `prescriptionError` is null
   - `Prescribed Resource IDs` array is not empty
   - Resources exist for each prescribed ID

### 3. Visual Verification
On the student resources page, you should see:
1. **"Prescribed by Your Counsellor"** section (if prescriptions exist)
   - Green border on prescribed resource cards
   - Counsellor name displayed
   - These resources are NOT affected by category filter
2. **"Browse Resources"** section
   - All other resources
   - Filtered by selected category

## Files Modified

1. ✅ `src/app/student/resources/page.tsx`
   - Fixed column names (`prescribed_at` instead of `created_at`)
   - Changed to serializable arrays
   - Added comprehensive debug logging

2. ✅ `src/components/student/student-resources-client.tsx`
   - Updated type definitions
   - Added array-to-Set/Map conversion
   - Added client-side debug logging
   - Updated all references to use new variable names

## Files Created

1. ✅ `DIAGNOSE_PRESCRIPTION_ISSUE.sql` - Comprehensive database diagnostic queries
2. ✅ `TEST_PRESCRIPTION_FLOW.sql` - End-to-end prescription testing guide
3. ✅ `PRESCRIPTION_VISIBILITY_FIX.md` - This document

## Build Status

✅ **TypeScript Build**: Successful (0 errors)
✅ **All Routes**: Generated successfully (65 routes)

## Next Steps

1. **Test the fix**:
   - Log in as a counsellor
   - Create a custom resource
   - Prescribe it to a student
   - Log in as that student
   - Navigate to Resources page
   - Verify prescribed resource appears in separate section

2. **Remove debug logging** (after verification):
   - Remove console.log statements from both files
   - Keep the fix logic intact

3. **Monitor for issues**:
   - Check browser console for any errors
   - Verify RLS policies are working correctly
   - Ensure prescriptions are being created successfully

## Technical Notes

### Why Set/Map Don't Serialize
Next.js uses JSON serialization to pass data from Server Components to Client Components. JavaScript's `Set` and `Map` are not JSON-serializable:
```javascript
JSON.stringify(new Set([1, 2, 3])) // Returns: "{}"
JSON.stringify(new Map([["a", 1]])) // Returns: "{}"
```

### Solution Pattern
The correct pattern for Next.js 13+ App Router:
1. **Server Component**: Query data, transform to plain arrays/objects
2. **Pass to Client**: Only serializable data (arrays, objects, primitives)
3. **Client Component**: Convert arrays to Set/Map for efficient operations

This is a common pattern when working with Next.js Server/Client Components.
