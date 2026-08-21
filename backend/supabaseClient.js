require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('ueselfujrpnuwqlhilzg')) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
            global: { timeout: 3000 }
        });
        console.log('⚡ Supabase Client initialized successfully.');
    } catch (err) {
        console.warn('⚠️ Supabase Initialization warning:', err.message);
        supabase = null;
    }
} else {
    console.log('⚡ Using Ultra-Fast Local-First JSON & In-Memory Database Engine.');
}

module.exports = supabase;
