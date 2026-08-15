require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('⚡ Supabase Client initialized successfully.');
    } catch (err) {
        console.warn('⚠️ Supabase Initialization warning:', err.message);
    }
} else {
    console.log('ℹ️ Supabase environment variables not configured yet. Using JSON DB fallback engine.');
}

module.exports = supabase;
