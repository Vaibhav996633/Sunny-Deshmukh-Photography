
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Node 18+ has global fetch, no import needed

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("🔍 Deep Diagnosing Storage Public Access...");

    const bucket = 'gallery-images';

    // 1. List files
    const { data: files, error } = await supabase.storage.from(bucket).list();

    if (error) {
        console.error(`❌ Failed to list files in '${bucket}':`, error.message);
        return;
    }

    if (!files || files.length === 0) {
        console.log(`⚠️ Bucket '${bucket}' is empty. Cannot test public URL.`);
        console.log("   -> Please upload at least one file via Admin page first.");
        return;
    }

    console.log(`✅ Found ${files.length} files in '${bucket}'.`);

    // 2. Pick the first file and test public URL
    const firstFile = files[0];
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(firstFile.name);
    const publicUrl = publicData.publicUrl;

    console.log(`\n🧪 Testing Public URL for: ${firstFile.name}`);
    console.log(`   URL: ${publicUrl}`);

    try {
        const response = await fetch(publicUrl);
        if (response.ok) {
            console.log("✅ Public URL is ACCESSIBLE (HTTP " + response.status + ")");
            console.log("   -> If images are broken in browser, check Cross-Origin (CORS) or AdBlockers.");
        } else {
            console.error("❌ Public URL is NOT ACCESSIBLE (HTTP " + response.status + ")");
            console.error("   -> PROBABLE CAUSE: Bucket 'gallery-images' is NOT set to Public.");
            console.error("   -> ACTION: Go to Supabase > Storage > bucket settings > Toggle 'Public' to ON.");
        }
    } catch (err) {
        console.error("❌ Network Error accessing URL:", err.message);
    }
}

check();
