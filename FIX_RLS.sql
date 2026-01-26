-- ⚠️ RUN THIS IN SUPABASE SQL EDITOR TO FIX "VIOLATES RLS POLICY" ERRORS

-- 1. Enable INSERT (Adding images/videos)
CREATE POLICY "Allow Public Insert Gallery" 
ON gallery FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow Public Insert Packages" 
ON packages FOR INSERT 
WITH CHECK (true);

-- 2. Enable UPDATE (Editing details)
CREATE POLICY "Allow Public Update Gallery" 
ON gallery FOR UPDATE 
USING (true);

CREATE POLICY "Allow Public Update Packages" 
ON packages FOR UPDATE 
USING (true);

-- 3. Enable DELETE (Removing items)
CREATE POLICY "Allow Public Delete Gallery" 
ON gallery FOR DELETE 
USING (true);

CREATE POLICY "Allow Public Delete Packages" 
ON packages FOR DELETE 
USING (true);
