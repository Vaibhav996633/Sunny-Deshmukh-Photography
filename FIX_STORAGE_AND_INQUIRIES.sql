-- ⚠️ RUN THIS IN SUPABASE SQL EDITOR TO FIX STORAGE PERMISSIONS

-- 1. Enable Storage RLS
-- (This might duplicate if already on/off, but ensures we start clean)

-- 2. Create Storage Policies for Public Uploads
-- WE NEED TO ALLOW INSERTS TO STORAGE OBJECTS BUCKET
CREATE POLICY "Allow Public Storage Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id IN ('gallery-images', 'gallery-videos') );

-- 3. Allow Public Read on Storage (so images load)
CREATE POLICY "Allow Public Storage Read"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('gallery-images', 'gallery-videos') );

-- 4. Fix Inquiry Table RLS (just in case)
DROP POLICY IF EXISTS "Public Insert" ON inquiries;
CREATE POLICY "Allow Public Inquiries" 
ON inquiries FOR INSERT 
WITH CHECK (true);
