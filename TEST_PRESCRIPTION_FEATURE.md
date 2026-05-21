# Testing Prescription Feature - Quick Guide

## Prerequisites
- Have at least one counsellor account
- Have at least one student account
- Both should be in the same college

## Step-by-Step Testing

### Step 1: Create a Custom Resource (as Counsellor)
1. Log in as counsellor
2. Navigate to **Resources** page
3. Click **"Create Resource"** button
4. Fill in the form:
   - **Resource Name**: e.g., "Stress Management Techniques"
   - **Tips & Description**: e.g., "Learn effective ways to manage stress through breathing exercises and mindfulness"
   - **Link Type**: Choose Video or Document
   - **URL** (optional): e.g., "https://www.youtube.com/watch?v=example"
5. Click **"Create Resource"**
6. Verify the resource appears in the list

### Step 2: Prescribe Resource to Student (as Counsellor)
1. Find the resource you just created
2. Click **"Prescribe to Student"** button
3. Select a student from the dropdown
4. Verify you see "Resource prescribed successfully!" message

### Step 3: View Prescribed Resource (as Student)
1. Log out from counsellor account
2. Log in as the student you prescribed to
3. Navigate to **Resources** page
4. **Expected Result**:
   - You should see a section titled **"Prescribed by Your Counsellor"**
   - The prescribed resource should appear with:
     - ✅ Green border (2px border-[#3DBE29])
     - ✅ Badge showing "Prescribed by [Counsellor Name]"
     - ✅ Resource title, description, and link
   - This section should appear ABOVE the category filter
   - Prescribed resources should NOT be affected by category filter

### Step 4: Verify Category Filter Works
1. Still logged in as student
2. Try different category filters (Stress, Sleep, Anxiety, etc.)
3. **Expected Result**:
   - Prescribed resources section remains unchanged
   - Only "Browse Resources" section changes based on filter
   - "All" category shows all non-prescribed resources

### Step 5: Check Browser Console (Debug)
1. Open browser console (F12)
2. Look for debug logs:
   ```
   === PRESCRIPTION DEBUG ===
   Student ID: [uuid]
   Total resources: [number]
   Prescriptions data: [array with data]
   Prescription error: null
   Number of prescriptions: [should be > 0]
   Prescribed Resource IDs: [array of uuids]
   === END DEBUG ===
   
   === CLIENT COMPONENT DEBUG ===
   Total resources: [number]
   Prescribed Resources (filtered): [should be > 0]
   === END CLIENT DEBUG ===
   ```

## Troubleshooting

### Issue: "Resource prescribed successfully!" but not showing on student page

**Check 1: Database**
Run this SQL in Supabase SQL Editor:
```sql
-- Replace with actual student ID
SELECT 
  rp.*,
  r.title as resource_title,
  c.full_name as counsellor_name
FROM resource_prescriptions rp
JOIN resources r ON r.id = rp.resource_id
JOIN users c ON c.id = rp.counsellor_id
WHERE rp.student_id = 'STUDENT_ID_HERE';
```

**Check 2: Browser Console**
- Look for `Prescription error:` in console logs
- If error is not null, there's an RLS or query issue

**Check 3: Resource Exists**
Run this SQL:
```sql
SELECT * FROM resources WHERE id = 'RESOURCE_ID_FROM_PRESCRIPTION';
```

### Issue: Prescribed resources showing in "Browse Resources" instead

**This was the bug we just fixed!** Make sure:
1. You've refreshed the page after the fix
2. Clear browser cache if needed
3. Check console logs to verify `Prescribed Resource IDs` array is not empty

### Issue: Cannot prescribe (error message)

**Check RLS Policies**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'resource_prescriptions';
```

Should show:
- "Students can see their prescriptions"
- "Counsellors can insert prescriptions for their students"
- "Counsellors can view prescriptions for their students"
- "Counsellors can delete prescriptions for their students"

## Database Diagnostic Queries

### Check all prescriptions
```sql
SELECT 
  rp.id,
  s.email as student_email,
  c.full_name as counsellor_name,
  r.title as resource_title,
  rp.prescribed_at
FROM resource_prescriptions rp
JOIN users s ON s.id = rp.student_id
JOIN users c ON c.id = rp.counsellor_id
JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC;
```

### Check resources by category
```sql
SELECT category, COUNT(*) as count
FROM resources
GROUP BY category
ORDER BY count DESC;
```

### Check custom resources
```sql
SELECT 
  r.*,
  u.full_name as created_by
FROM resources r
LEFT JOIN users u ON u.college_id = r.college_id AND u.role = 'counsellor'
WHERE r.category = 'Custom'
ORDER BY r.created_at DESC;
```

## Expected UI Layout

```
┌─────────────────────────────────────────────────┐
│ Resources                                        │
│ Mental health resources and tools for wellbeing  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 👤 Prescribed by Your Counsellor                │
├─────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐              │
│ │ 🎥 Resource  │ │ 📖 Resource  │              │
│ │ [GREEN]      │ │ [GREEN]      │              │
│ │ Prescribed   │ │ Prescribed   │              │
│ │ by Dr. Name  │ │ by Dr. Name  │              │
│ └──────────────┘ └──────────────┘              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ [All] [Stress] [Sleep] [Anxiety] [Focus] ...   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Browse Resources                                 │
├─────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│ │ 🎥 Resource  │ │ 📖 Resource  │ │ 🧘 Res.  ││
│ │              │ │              │ │          ││
│ └──────────────┘ └──────────────┘ └──────────┘│
└─────────────────────────────────────────────────┘
```

## Success Criteria

✅ Counsellor can create custom resources
✅ Counsellor can prescribe resources to students
✅ Student sees prescribed resources in separate section
✅ Prescribed resources have green border
✅ Counsellor name is displayed on prescribed resources
✅ Category filter does NOT affect prescribed resources
✅ Category filter ONLY affects "Browse Resources" section
✅ No TypeScript errors
✅ No console errors
✅ Build succeeds

## Clean Up After Testing

Once verified working, remove debug console.log statements from:
1. `src/app/student/resources/page.tsx`
2. `src/components/student/student-resources-client.tsx`

Keep the fix logic intact!
