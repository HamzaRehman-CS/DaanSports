require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  console.error("No DATABASE_URL found in environment");
  process.exit(1);
}

const sql = neon(connectionString);

async function initNeon() {
  console.log("Connecting to Neon PostgreSQL...");

  // 1. Products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      new_price NUMERIC DEFAULT 0,
      old_price NUMERIC DEFAULT 0,
      moq INTEGER DEFAULT 50,
      description TEXT,
      colors JSONB DEFAULT '[]'::jsonb,
      sizes JSONB DEFAULT '[]'::jsonb,
      materials JSONB DEFAULT '[]'::jsonb,
      customization JSONB DEFAULT '[]'::jsonb,
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'products' table ready");

  // 2. Categories table
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      subcategories JSONB DEFAULT '[]'::jsonb,
      banner TEXT,
      icon TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'categories' table ready");

  // 3. Banners table
  await sql`
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      tall_vertical JSONB,
      wide_feature JSONB,
      compact_a JSONB,
      compact_b JSONB,
      oem_strip JSONB,
      promo_section1 JSONB,
      promo_section2 JSONB,
      custom_banners JSONB,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'banners' table ready");

  // 4. CMS table
  await sql`
    CREATE TABLE IF NOT EXISTS cms (
      id TEXT PRIMARY KEY,
      hero_slides JSONB,
      announcement_bar TEXT,
      site_title TEXT,
      site_tagline TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'cms' table ready");

  // 5. Orders table
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT,
      customer_name TEXT,
      phone TEXT,
      items JSONB DEFAULT '[]'::jsonb,
      total_units INTEGER DEFAULT 1,
      total_amount NUMERIC DEFAULT 0,
      discount_amount NUMERIC DEFAULT 0,
      shipping_address JSONB,
      status TEXT DEFAULT 'Pending Review',
      tracking_number TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'orders' table ready");

  // 6. Vouchers table
  await sql`
    CREATE TABLE IF NOT EXISTS vouchers (
      code TEXT PRIMARY KEY,
      discount_percent NUMERIC DEFAULT 10,
      min_order_units INTEGER DEFAULT 50,
      expiry_date TEXT,
      description TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ 'vouchers' table ready");

  // Check product count
  const [{ count }] = await sql`SELECT count(*)::int FROM products;`;
  console.log(`Current products in Neon: ${count}`);

  console.log("🎉 Neon Database Schema successfully created and initialized!");
}

initNeon().catch(err => {
  console.error("Neon init error:", err);
  process.exit(1);
});

