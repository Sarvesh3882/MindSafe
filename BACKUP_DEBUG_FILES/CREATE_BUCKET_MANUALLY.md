# Create Storage Bucket Manually - Step by Step

## Error: "File upload failed: Bucket not found"

The `naac-evidence` storage bucket doesn't exist. Let's create it manually.

---

## Step-by-Step Instructions

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Sign in to your account
3. Select your **MindSafe India** project

### Step 2: Create Storage Bucket

1. Click **Storage** in the left sidebar
2. Click the **New bucket** button (green button, top right)
3. Fill in the form:

   **Bucket name**: `naac-evidence`
   
   **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
   
   **File size limit**: `10485760` (this is 10MB in bytes)
   
   **Allowed MIME types**: Leave empty OR add these (optional):
   - `image/jpeg`
   - `image/png`
   - `application/pdf`

4. Click **Create bucket**

### Step 3: Verify Bucket Was Created

1. You should see `naac-evidence` in the list of buckets
2. Click on it
3. You should see an empty folder view
4. Check that it says **Public** next to the bucket name

### Step 4: Set Up RLS Policies

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste this SQL:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can upload evidence for their college" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view evidence from their college" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete evidence from their college" ON storage.objects;
DROP POLICY IF EXISTS "Public can view evidence files" ON storage.objects;

-- Policy: Allow admins to upload files to their college folder
CREATE POLICY "Admins can upload evidence for their college"
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
CREATE POLICY "Admins can view evidence from their college"
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
CREATE POLICY "Admins can delete evidence from their college"
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
CREATE POLICY "Public can view evidence files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'naac-evidence');
```

4. Click **Run** (or press F5)
5. Should see: "Success. No rows returned"

### Step 5: Verify Admin Has college_id

1. In SQL Editor, run this query:

```sql
SELECT id, email, role, college_id, full_name
FROM users
WHERE role = 'admin';
```

2. Check the `college_id` column
3. If it's **NULL**, you need to set it:

```sql
-- Replace with your actual values
UPDATE users
SET college_id = 'your-actual-college-id-here'
WHERE role = 'admin' AND email = 'codex5622@gmail.com';
```

To find your college_id:
```sql
SELECT id, name FROM colleges;
```

### Step 6: Test Upload

1. Go back to your app: `http://localhost:3000/admin/evidence`
2. Try uploading the screenshot again
3. Should work now! ✅

---

## Troubleshooting

### If upload still fails:

**Check 1: Bucket is Public**
- Storage → naac-evidence → Configuration
- "Public bucket" should be ON

**Check 2: Policies Exist**
- Storage → naac-evidence → Policies
- Should see 4 policies listed

**Check 3: Admin has college_id**
```sql
SELECT college_id FROM users WHERE email = 'codex5622@gmail.com';
```
Should NOT be NULL

**Check 4: Test Direct Upload**
- Storage → naac-evidence
- Try uploading a file directly through dashboard
- If this fails, bucket configuration is wrong

---

## Quick Checklist

- [ ] Bucket `naac-evidence` created
- [ ] Bucket is marked as **Public**
- [ ] 4 RLS policies created
- [ ] Admin user has `college_id` set
- [ ] Test upload works

---

## Expected Result

After completing all steps:
- ✅ Upload button works
- ✅ File appears in gallery
- ✅ Can view/download file
- ✅ Can delete file
- ✅ No "Bucket not found" error

---

## Need Help?

If you're stuck on any step, let me know which step and I'll help you through it!
