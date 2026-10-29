require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

let sql = null;
if (connectionString) {
  try {
    sql = neon(connectionString);
    console.log("⚡ Neon PostgreSQL Client initialized successfully.");
  } catch (err) {
    console.warn("⚠️ Neon PostgreSQL Client initialization warning:", err.message);
    sql = null;
  }
} else {
  console.log("ℹ️ No DATABASE_URL provided for Neon.");
}

// Helper: safe query runner with error logging
const safeQuery = async (queryFn) => {
  if (!sql) return null;
  try {
    return await queryFn(sql);
  } catch (err) {
    console.warn("Neon Query Warning:", err.message);
    return null;
  }
};

// ---------------- PRODUCTS ----------------
const getNeonProducts = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM products ORDER BY id ASC;`;
    if (!rows) return null;
    return rows.map(r => ({
      ...r,
      id: Number(r.id),
      new_price: Number(r.new_price || 0),
      old_price: Number(r.old_price || 0),
      moq: Number(r.moq || 50),
      colors: Array.isArray(r.colors) ? r.colors : (r.colors ? (typeof r.colors === 'string' && r.colors.startsWith('[') ? JSON.parse(r.colors) : [r.colors]) : []),
      sizes: Array.isArray(r.sizes) ? r.sizes : (r.sizes ? (typeof r.sizes === 'string' && r.sizes.startsWith('[') ? JSON.parse(r.sizes) : [r.sizes]) : []),
      images: Array.isArray(r.images) ? r.images : (r.images ? (typeof r.images === 'string' && r.images.startsWith('[') ? JSON.parse(r.images) : [r.images]) : [])
    }));
  });
};

const saveNeonProduct = async (p) => {
  return safeQuery(async (db) => {
    const id = Number(p.id);
    const name = String(p.name || '');
    const category = String(p.category || 'Tracksuits');
    const image = String(p.image || '');
    const images = JSON.stringify(Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []));
    const new_price = Number(p.new_price || 0);
    const old_price = Number(p.old_price || 0);
    const moq = Number(p.moq || 50);
    const description = String(p.description || '');
    const colors = JSON.stringify(Array.isArray(p.colors) ? p.colors : []);
    const sizes = JSON.stringify(Array.isArray(p.sizes) ? p.sizes : []);
    const materials = JSON.stringify(Array.isArray(p.materials) ? p.materials : (p.material ? [p.material] : []));
    const customization = JSON.stringify(Array.isArray(p.customization) ? p.customization : (p.customization ? [p.customization] : []));
    const available = p.available !== false;

    await db`
      INSERT INTO products (
        id, name, category, image, images, new_price, old_price, moq, description, colors, sizes, materials, customization, available
      ) VALUES (
        ${id}, ${name}, ${category}, ${image}, ${images}::jsonb, ${new_price}, ${old_price}, ${moq}, ${description}, ${colors}::jsonb, ${sizes}::jsonb, ${materials}::jsonb, ${customization}::jsonb, ${available}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        image = EXCLUDED.image,
        images = EXCLUDED.images,
        new_price = EXCLUDED.new_price,
        old_price = EXCLUDED.old_price,
        moq = EXCLUDED.moq,
        description = EXCLUDED.description,
        colors = EXCLUDED.colors,
        sizes = EXCLUDED.sizes,
        materials = EXCLUDED.materials,
        customization = EXCLUDED.customization,
        available = EXCLUDED.available;
    `;
    return true;
  });
};

const deleteNeonProduct = async (id) => {
  return safeQuery(async (db) => {
    await db`DELETE FROM products WHERE id = ${Number(id)};`;
    return true;
  });
};

// ---------------- CATEGORIES ----------------
const getNeonCategories = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM categories ORDER BY id ASC;`;
    if (!rows) return null;
    return rows.map(r => ({
      ...r,
      id: Number(r.id),
      subcategories: Array.isArray(r.subcategories) ? r.subcategories : (r.subcategories ? (typeof r.subcategories === 'string' && r.subcategories.startsWith('[') ? JSON.parse(r.subcategories) : [r.subcategories]) : [])
    }));
  });
};

const saveNeonCategories = async (categoriesList) => {
  return safeQuery(async (db) => {
    for (const c of categoriesList) {
      const id = Number(c.id);
      const name = String(c.name || '');
      const slug = String(c.slug || name.toLowerCase().replace(/\s+/g, '-'));
      const description = String(c.description || '');
      const subcategories = JSON.stringify(Array.isArray(c.subcategories) ? c.subcategories : []);
      const banner = String(c.banner || '');
      const icon = String(c.icon || '');

      await db`
        INSERT INTO categories (id, name, slug, description, subcategories, banner, icon)
        VALUES (${id}, ${name}, ${slug}, ${description}, ${subcategories}::jsonb, ${banner}, ${icon})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          subcategories = EXCLUDED.subcategories,
          banner = EXCLUDED.banner,
          icon = EXCLUDED.icon;
      `;
    }
    return true;
  });
};

// ---------------- BANNERS ----------------
const getNeonBanners = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM banners WHERE id = 'singleton_banners' LIMIT 1;`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      tallVertical: r.tall_vertical || {},
      wideFeature: r.wide_feature || {},
      compactA: r.compact_a || {},
      compactB: r.compact_b || {},
      oemStrip: r.oem_strip || {},
      promoSection1: r.promo_section1 || {},
      promoSection2: r.promo_section2 || {},
      customBanners: r.custom_banners || []
    };
  });
};

const saveNeonBanners = async (b) => {
  return safeQuery(async (db) => {
    const tall_vertical = JSON.stringify(b.tallVertical || {});
    const wide_feature = JSON.stringify(b.wideFeature || {});
    const compact_a = JSON.stringify(b.compactA || {});
    const compact_b = JSON.stringify(b.compactB || {});
    const oem_strip = JSON.stringify(b.oemStrip || {});
    const promo_section1 = JSON.stringify(b.promoSection1 || {});
    const promo_section2 = JSON.stringify(b.promoSection2 || {});
    const custom_banners = JSON.stringify(Array.isArray(b.customBanners) ? b.customBanners : []);

    await db`
      INSERT INTO banners (
        id, tall_vertical, wide_feature, compact_a, compact_b, oem_strip, promo_section1, promo_section2, custom_banners, updated_at
      ) VALUES (
        'singleton_banners',
        ${tall_vertical}::jsonb,
        ${wide_feature}::jsonb,
        ${compact_a}::jsonb,
        ${compact_b}::jsonb,
        ${oem_strip}::jsonb,
        ${promo_section1}::jsonb,
        ${promo_section2}::jsonb,
        ${custom_banners}::jsonb,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        tall_vertical = EXCLUDED.tall_vertical,
        wide_feature = EXCLUDED.wide_feature,
        compact_a = EXCLUDED.compact_a,
        compact_b = EXCLUDED.compact_b,
        oem_strip = EXCLUDED.oem_strip,
        promo_section1 = EXCLUDED.promo_section1,
        promo_section2 = EXCLUDED.promo_section2,
        custom_banners = EXCLUDED.custom_banners,
        updated_at = NOW();
    `;
    return true;
  });
};

// ---------------- CMS ----------------
const getNeonCms = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM cms WHERE id = 'cms_settings' LIMIT 1;`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      slides: r.hero_slides || [],
      announcementBar: r.announcement_bar || '',
      siteTitle: r.site_title || '',
      siteTagline: r.site_tagline || ''
    };
  });
};

const saveNeonCms = async (c) => {
  return safeQuery(async (db) => {
    const hero_slides = JSON.stringify(c.slides || []);
    const announcement_bar = String(c.announcementBar || '');
    const site_title = String(c.siteTitle || '');
    const site_tagline = String(c.siteTagline || '');

    await db`
      INSERT INTO cms (id, hero_slides, announcement_bar, site_title, site_tagline, updated_at)
      VALUES (
        'cms_settings',
        ${hero_slides}::jsonb,
        ${announcement_bar},
        ${site_title},
        ${site_tagline},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        hero_slides = EXCLUDED.hero_slides,
        announcement_bar = EXCLUDED.announcement_bar,
        site_title = EXCLUDED.site_title,
        site_tagline = EXCLUDED.site_tagline,
        updated_at = NOW();
    `;
    return true;
  });
};

// ---------------- VOUCHERS ----------------
const getNeonVouchers = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM vouchers WHERE active = TRUE ORDER BY created_at DESC;`;
    if (!rows) return null;
    return rows.map(r => ({
      code: r.code,
      discount: Number(r.discount_percent || 0),
      discount_percent: Number(r.discount_percent || 0),
      minOrder: Number(r.min_order_units || 0),
      expiry_date: r.expiry_date,
      description: r.description,
      active: r.active
    }));
  });
};

const saveNeonVoucher = async (v) => {
  return safeQuery(async (db) => {
    const code = String(v.code || '').trim().toUpperCase();
    const discount_percent = Number(v.discount || v.discount_percent || 10);
    const min_order_units = Number(v.minOrder || v.min_order_units || 50);
    const expiry_date = String(v.expiry_date || '');
    const description = String(v.description || '');

    await db`
      INSERT INTO vouchers (code, discount_percent, min_order_units, expiry_date, description, active)
      VALUES (${code}, ${discount_percent}, ${min_order_units}, ${expiry_date}, ${description}, TRUE)
      ON CONFLICT (code) DO UPDATE SET
        discount_percent = EXCLUDED.discount_percent,
        min_order_units = EXCLUDED.min_order_units,
        expiry_date = EXCLUDED.expiry_date,
        description = EXCLUDED.description,
        active = TRUE;
    `;
    return true;
  });
};

const deleteNeonVoucher = async (code) => {
  return safeQuery(async (db) => {
    const cleanCode = String(code || '').trim().toUpperCase();
    await db`DELETE FROM vouchers WHERE code = ${cleanCode};`;
    return true;
  });
};

// ---------------- ORDERS ----------------
const getNeonOrders = async () => {
  return safeQuery(async (db) => {
    const rows = await db`SELECT * FROM orders ORDER BY created_at DESC;`;
    if (!rows) return null;
    return rows.map(r => ({
      id: r.id,
      userEmail: r.user_email,
      customerName: r.customer_name,
      phone: r.phone,
      items: Array.isArray(r.items) ? r.items : (r.items ? JSON.parse(r.items) : []),
      totalUnits: Number(r.total_units || 1),
      totalAmount: Number(r.total_amount || 0),
      discountAmount: Number(r.discount_amount || 0),
      shippingAddress: r.shipping_address,
      status: r.status,
      trackingNumber: r.tracking_number,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  });
};

const createNeonOrder = async (orderObj) => {
  return safeQuery(async (db) => {
    const id = String(orderObj.id);
    const user_email = String(orderObj.userEmail || orderObj.user_email || '');
    const customer_name = String(orderObj.customerName || orderObj.customer_name || 'Valued Wholesale Client');
    const phone = String(orderObj.phone || '');
    const items = JSON.stringify(Array.isArray(orderObj.items) ? orderObj.items : []);
    const total_units = Number(orderObj.totalUnits || orderObj.total_units || 1);
    const total_amount = Number(orderObj.totalAmount || orderObj.total_amount || 0);
    const discount_amount = Number(orderObj.discountAmount || orderObj.discount_amount || 0);
    const shipping_address = JSON.stringify(orderObj.shippingAddress || orderObj.shipping_address || {});
    const status = String(orderObj.status || 'Pending Review');
    const tracking_number = String(orderObj.trackingNumber || orderObj.tracking_number || '');
    const notes = String(orderObj.notes || '');

    await db`
      INSERT INTO orders (
        id, user_email, customer_name, phone, items, total_units, total_amount, discount_amount, shipping_address, status, tracking_number, notes, created_at, updated_at
      ) VALUES (
        ${id}, ${user_email}, ${customer_name}, ${phone}, ${items}::jsonb, ${total_units}, ${total_amount}, ${discount_amount}, ${shipping_address}::jsonb, ${status}, ${tracking_number}, ${notes}, NOW(), NOW()
      );
    `;
    return true;
  });
};

const updateNeonOrder = async (orderId, { status, trackingNumber, notes }) => {
  return safeQuery(async (db) => {
    if (status !== undefined && trackingNumber !== undefined) {
      await db`UPDATE orders SET status = ${status}, tracking_number = ${trackingNumber}, updated_at = NOW() WHERE id = ${String(orderId)};`;
    } else if (status !== undefined) {
      await db`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${String(orderId)};`;
    } else if (trackingNumber !== undefined) {
      await db`UPDATE orders SET tracking_number = ${trackingNumber}, updated_at = NOW() WHERE id = ${String(orderId)};`;
    }
    if (notes !== undefined) {
      await db`UPDATE orders SET notes = ${notes}, updated_at = NOW() WHERE id = ${String(orderId)};`;
    }
    return true;
  });
};

const deleteNeonOrder = async (orderId) => {
  return safeQuery(async (db) => {
    await db`DELETE FROM orders WHERE id = ${String(orderId)};`;
    return true;
  });
};

module.exports = {
  sql,
  getNeonProducts,
  saveNeonProduct,
  deleteNeonProduct,
  getNeonCategories,
  saveNeonCategories,
  getNeonBanners,
  saveNeonBanners,
  getNeonCms,
  saveNeonCms,
  getNeonVouchers,
  saveNeonVoucher,
  deleteNeonVoucher,
  getNeonOrders,
  createNeonOrder,
  updateNeonOrder,
  deleteNeonOrder
};

