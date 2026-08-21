-- Supabase Complete Database Schema for DAAN Sports E-Commerce Platform
-- Run this in your Supabase SQL Editor if using Supabase

-- 1. Products Table
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

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    subcategories TEXT[],
    banner TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Promotional & Bento Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY DEFAULT 'current_banners',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Website CMS & Hero Slider Table
CREATE TABLE IF NOT EXISTS public.cms (
    id TEXT PRIMARY KEY DEFAULT 'current_cms',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Discount Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
    code TEXT PRIMARY KEY,
    type TEXT DEFAULT 'percent',
    discount NUMERIC(10, 2) NOT NULL DEFAULT 10,
    min_order NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_units INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    voucher_code TEXT DEFAULT '',
    payment_method TEXT DEFAULT 'Card',
    payment_status TEXT DEFAULT 'Paid',
    status TEXT DEFAULT 'Pending Review',
    tracking_number TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Users Sync Table (Clerk / Local Users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Public & Service Role Policies
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Service Role All Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Service Role All Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Service Role All Banners" ON public.banners FOR ALL USING (true);

CREATE POLICY "Public Read CMS" ON public.cms FOR SELECT USING (true);
CREATE POLICY "Service Role All CMS" ON public.cms FOR ALL USING (true);

CREATE POLICY "Public Read Vouchers" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Service Role All Vouchers" ON public.vouchers FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Role All Orders" ON public.orders FOR ALL USING (true);
