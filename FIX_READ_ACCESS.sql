-- ⚠️ RUN THIS TO FIX "PREVIEW NOT SHOWING" (MISSING READ ACCESS)

-- 1. Enable Reading Gallery (So images appear in Admin & Site)
CREATE POLICY "Allow Public Select Gallery" 
ON gallery FOR SELECT 
USING (true);

-- 2. Enable Reading Packages
CREATE POLICY "Allow Public Select Packages" 
ON packages FOR SELECT 
USING (true);

-- 3. Enable Reading Inquiries (Optional, mostly for Admin)
CREATE POLICY "Allow Public Select Inquiries" 
ON inquiries FOR SELECT 
USING (true);
