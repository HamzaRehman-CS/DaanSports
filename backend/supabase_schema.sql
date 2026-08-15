-- Supabase Database Schema for DAAN Sports / GoCart E-Commerce Platform

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    new_price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    moq INTEGER DEFAULT 50,
    description TEXT,
    material TEXT DEFAULT '80% Combed Cotton / 20% Polyester',
    gsm TEXT DEFAULT '330 GSM',
    stitching TEXT DEFAULT 'Double-Needle Flatlock Reinforced',
    customization TEXT DEFAULT 'Custom Printing & Labels Available',
    lead_time TEXT DEFAULT '12 - 15 Business Days',
    colors TEXT[],
    sizes TEXT[],
    stock INTEGER DEFAULT 1000,
    image TEXT NOT NULL,
    images TEXT[],
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_units INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'Card',
    payment_status TEXT DEFAULT 'Paid',
    status TEXT DEFAULT 'Pending Review',
    tracking_number TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Users Sync Table (Clerk / Local Users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Public Read Access on Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Service Role Full Control on Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow Public Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Service Role Full Control on Orders" ON public.orders FOR ALL USING (true);
