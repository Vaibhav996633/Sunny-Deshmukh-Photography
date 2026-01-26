
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: '../.env' }); // Load from root .env

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Verify connection on startup
supabase.from('gallery').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
        if (error) {
            console.error('❌ Supabase connection failed:', error.message);
        } else {
            console.log('✅ Connected to Supabase');
        }
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('Studio Backend Running');
});

// Example Route: Get Gallery Images
app.get('/api/gallery', async (req, res) => {
    const { type } = req.query;
    let query = supabase.from('gallery').select('*');

    if (type) {
        query = query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Example Route: Get Packages
app.get('/api/packages', async (req, res) => {
    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('is_popular', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Example Route: Submit Inquiry
app.post('/api/inquiries', async (req, res) => {
    const { name, email, event_date, message } = req.body;

    const { data, error } = await supabase
        .from('inquiries')
        .insert([{ name, email, event_date, message }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
