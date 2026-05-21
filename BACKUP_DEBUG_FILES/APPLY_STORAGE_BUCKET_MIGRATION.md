# Fix Evidence Upload Error - Create Storage Bucket

## Error
**"File upload failed: Bucket not found"**

The `naac-evidence` storage bucket doesn't exist in your Supabase project.

---

## Solution - Manual Setup Required

Due to Supabase permissions, the storage bucket must be created manually through the dashboard.

### Step 1: Create Storage Bucket (Supabase Dashboard)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** (left sidebar)
4. Click **New bucket** button
5. Configure the bucket:
   - **Name**: `naac-evidence`
   - **Public bucket**: ✅ **YES** (check this box)
   - **File size limit**: `10485760` (10 MB in bytes)
   - **Allowed MIME types**: Leave empty or add:
     - `image/jpeg`
     - `image/png`
     - `application/pdf`
6. Click **Create bucket**

### Step 2: Apply RLS Policies (SQL Migration)

After creating the bucket, apply the migration to set up security policies:

**Option A - Using Supabase CLI:**
```bash
cd c:\Users\codex\OneDrive\Documents\MindSafe_India\mindsafe-india
npx supabase db push
```

**Option B - Using Supabase Dashboard:**
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the contents of `supabase/migrations/028_create_naac_evidence_storage_bucket.sql`
3. Click **Run**

---

## What the Migration Does

The migration creates 4 RLS (Row Level Security) policies:

1. **Upload Policy**: Only admins can upload files to their own college folder
2. **View Policy**: Admins can only view files from their college
3. **Delete Policy**: Admins can only delete files from their college
4. **Public Read Policy**: Anyone can view files (needed for displaying images)

---

## Folder Structure

Files will be organized by college:
```
naac-evidence/
├── {college_id_1}/
│   ├── activity/
│   │   └── document1.pdf
│   ├── criterion_v/
│   │   └── document2.jpg
│   └── ...
├── {college_id_2}/
│   └── ...
```

---

## Verification

After completing both steps:

1. **Check Bucket**:
   - Go to Supabase Dashboard → Storage
   - Verify `naac-evidence` bucket exists
   - Verify it's marked as **Public**

2. **Check Policies**:
   - Go to Storage → naac-evidence → Policies
   - Verify 4 policies are listed

3. **Test Upload**:
   - Log in as admin to your app
   - Go to `/admin/evidence`
   - Try uploading a test document
   - Should succeed without "Bucket not found" error

---

## Troubleshooting

### If upload still fails after creating bucket:

1. **Verify bucket is public**:
   - Storage → naac-evidence → Configuration
   - "Public bucket" should be enabled

2. **Check admin has college_id**:
   ```sql
   SELECT id, email, role, college_id FROM users WHERE role = 'admin';
   ```
   If `college_id` is NULL, set it:
   ```sql
   UPDATE users SET college_id = 'your-college-id' WHERE role = 'admin' AND email = 'admin@example.com';
   ```

3. **Verify policies exist**:
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

4. **Test direct upload via Dashboard**:
   - Storage → naac-evidence
   - Try uploading a file manually
   - If this fails, check bucket configuration

---

## Why Manual Creation?

The `storage.objects` table is owned by Supabase's internal system user. Regular database users (even with admin privileges) cannot run `ALTER TABLE` or `ENABLE ROW LEVEL SECURITY` on it. Therefore:

- ✅ Bucket creation: Must be done via Dashboard
- ✅ RLS policies: Can be created via SQL migration
- ❌ ALTER TABLE: Not allowed via migration

---

## Status

⚠️ **Action Required**: 
1. Create bucket manually (Step 1)
2. Apply migration (Step 2)

Once both steps are complete, evidence upload will work perfectly!
