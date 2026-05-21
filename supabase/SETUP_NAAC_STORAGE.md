# NAAC Evidence Storage Setup

## Manual Setup Required in Supabase Dashboard

Since storage buckets and policies must be created through the Supabase Dashboard, follow these steps:

### Step 1: Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Bucket name: `naac-evidence`
4. Public bucket: **NO** (keep it private)
5. Click "Create bucket"

### Step 2: Set Storage Policies

Go to Storage → naac-evidence → Policies and add these policies:

#### Policy 1: Admins can upload evidence
```sql
CREATE POLICY "Admins can upload evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'naac-evidence'
  AND (storage.foldername(name))[1] = (SELECT college_id::text FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

#### Policy 2: Admins can view their college evidence
```sql
CREATE POLICY "Admins can view their college evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'naac-evidence'
  AND (storage.foldername(name))[1] = (SELECT college_id::text FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

#### Policy 3: Admins can delete their college evidence
```sql
CREATE POLICY "Admins can delete their college evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'naac-evidence'
  AND (storage.foldername(name))[1] = (SELECT college_id::text FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### Step 3: Configure File Size Limits

In Supabase Dashboard → Storage → naac-evidence → Settings:
- Maximum file size: 10 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `application/pdf`

### Step 4: Verify Setup

Test upload with this structure:
```
naac-evidence/
  └── {college_id}/
      ├── activity-photos/
      ├── certificates/
      ├── reports/
      └── meeting-minutes/
```

## File Organization

Files will be organized by college:
- Path format: `{college_id}/{category}/{filename}`
- Example: `abc-123-def/activity-photos/yoga-session-2026-05-17.jpg`

## Security Notes

- All files are private (not publicly accessible)
- Only admins from the same college can access files
- RLS policies enforce college-level isolation
- Files are automatically deleted when college is deleted (CASCADE)
