# Quick Fix: Evidence Upload "Bucket not found" Error

## Problem
Evidence upload fails with: **"File upload failed: Bucket not found"**

## Solution (2 Steps)

### Step 1: Create Bucket (Manual - 2 minutes)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to **Storage** → Click **New bucket**
3. Settings:
   - Name: `naac-evidence`
   - Public: ✅ **YES**
   - Size limit: `10485760` (10MB)
4. Click **Create bucket**

### Step 2: Apply Policies (SQL)

Run this in Supabase SQL Editor:

```sql
-- Policy: Allow admins to upload files to their college folder
CREATE POLICY IF NOT EXISTS "Admins can upload evidence for their college"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'naac-evidence' AND
  (storage.foldername(name))[1] IN (
    SELECT college_id::text
    FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Allow admins to view files from their college
CREATE POLICY IF NOT EXISTS "Admins can view evidence from their college"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'naac-evidence' AND
  (storage.foldername(name))[1] IN (
    SELECT college_id::text
    FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Allow admins to delete files from their college
CREATE POLICY IF NOT EXISTS "Admins can delete evidence from their college"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'naac-evidence' AND
  (storage.foldername(name))[1] IN (
    SELECT college_id::text
    FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Allow public read access
CREATE POLICY IF NOT EXISTS "Public can view evidence files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'naac-evidence');
```

## Test

1. Go to `/admin/evidence`
2. Upload a test file
3. Should work! ✅

## Troubleshooting

If still failing, check admin has `college_id`:

```sql
SELECT id, email, role, college_id FROM users WHERE role = 'admin';
```

If NULL, set it:

```sql
UPDATE users 
SET college_id = 'your-college-id' 
WHERE role = 'admin' AND email = 'your-admin-email@example.com';
```

Done! 🎉
