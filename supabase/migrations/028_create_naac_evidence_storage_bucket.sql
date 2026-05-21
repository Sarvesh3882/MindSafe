-- Create storage bucket for NAAC evidence documents
-- Note: The bucket itself should be created via Supabase Dashboard
-- This migration only creates the RLS policies

-- Drop existing policies if they exist
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

-- Policy: Allow public read access (since bucket is public)
CREATE POLICY "Public can view evidence files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'naac-evidence');
