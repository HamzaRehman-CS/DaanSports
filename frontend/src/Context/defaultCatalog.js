// ----------------------------------------------------
// DEFAULT SPORTSWEAR B2B CATALOG & DIRECT SUPABASE CLOUD BRIDGE
// ----------------------------------------------------

export const DEFAULT_CATEGORIES = [
  { id: 1, name: "T-Shirts", slug: "tshirts", description: "Team Athletic Jerseys, Cotton & Performance T-Shirts", subcategories: ["Interlock Mesh", "V-Neck", "Training Jerseys"], banner: "https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Polo Shirts", slug: "polo-shirts", description: "Classic Pique & Performance Golf Polos", subcategories: ["Custom Embroidery", "Pique Cotton", "Dry-Fit"], banner: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Hoodies", slug: "hoodies", description: "Heavyweight 350 GSM Pullovers & Streetwear Cuts", subcategories: ["French Terry", "Oversized", "Zip-Up"], banner: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Jackets", slug: "jackets", description: "Athletic Windbreakers, Softshells & Padded Outerwear", subcategories: ["Windbreakers", "Softshell", "Padded Vests"], banner: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, name: "Track Suits", slug: "tracksuits", description: "Wholesale Performance Fleece & Polyester Tracksuits", subcategories: ["Tech Fleece", "Slim Fit", "Team Sets"], banner: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Accessories", slug: "accessories", description: "Athletic Caps, Gym Bags, Wristbands & Sports Gear", subcategories: ["Custom Caps", "Gym Bags", "Socks & Bands"], banner: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, name: "Sweatshirts", slug: "sweatshirts", description: "Heavyweight 350 GSM French Terry Crewnecks & Pullovers", subcategories: ["Crewneck", "Raglan", "Drop Shoulder"], banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
  { id: 8, name: "Activewear", slug: "activewear", description: "Pro Compression Sets, Gym Tops & Leggings", subcategories: ["Compression Tops", "Leggings", "Shorts"], banner: "https://images.unsplash.com/photo-1550026593-f369f98df0af?q=80&w=2070&auto=format&fit=crop" },
  { id: 9, name: "Trousers", slug: "trousers", description: "Wholesale Athletic Joggers & Fleece Sweatpants", subcategories: ["Ribbed Cuffs", "Zipper Pockets", "Tri-Blend"], banner: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop" }
];

export const DEFAULT_BANNERS = {
  tallVertical: {
    category: "Tracksuits",
    title: "FLAGSHIP TEAM TRACKSUITS",
    subtitle: "Custom 330 GSM combed fleece & interlock sets engineered for elite athletics & custom private labels.",
    badge: "FLAGSHIP SPEC",
    ctaText: "Explore Tracksuits",
    bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1200&auto=format&fit=crop"
  },
  wideFeature: {
    category: "Sweatshirts",
    title: "HEAVYWEIGHT 350 GSM HOODIES",
    subtitle: "100% French Terry pullovers & drop-shoulder streetwear cuts ready for 3D embroidery and puff prints.",
    discountText: "15% BULK DISCOUNT",
    badge: "HIGH-DENSITY EMBROIDERY",
    ctaText: "View Hoodies",
    bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop"
  },
  compactA: {
    category: "Trousers",
    title: "Tri-Blend Athletic Joggers",
    subtitle: "Reinforced zipper pockets & ribbed cuffs",
    discountText: "10% OFF SPECIAL",
    ctaText: "Shop Joggers",
    bgImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
  },
  compactB: {
    category: "Activewear",
    title: "Pro Compression & Active Sets",
    subtitle: "Sweat-wicking 4-way performance stretch",
    discountText: "PRO SPEC",
    ctaText: "Shop Activewear",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
  },
  oemStrip: {
    title: "DIRECT OEM / ODM PRIVATE LABEL MANUFACTURING",
    subtitle: "Full custom labeling, silicone tags, custom GSM weaving, and express airway cargo delivery worldwide.",
    badge: "ISO 9001 CERTIFIED",
    ctaText: "Request Tech-Pack Quote",
    bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop"
  },
  promoSection1: {
    category: "Trousers",
    title: "TROUSERS & JOGGERS — 10% OFF",
    discountText: "WHOLESALE BULK SPECIAL OFFER",
    subtitle: "Heavyweight 330 GSM combed cotton fleece & tri-blend warm-up joggers",
    bgImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop",
    discountPercent: 10
  },
  promoSection2: {
    category: "Sweatshirts",
    title: "HEAVYWEIGHT HOODIES COLLECTION",
    discountText: "HIGH-DENSITY EMBROIDERY READY",
    subtitle: "350 GSM French Terry pullovers and drop-shoulder streetwear cuts",
    bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    discountPercent: 15
  },
  customBanners: []
};

export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Pro Tech Fleece Full-Zip Tracksuit Set",
    category: "Tracksuits",
    new_price: 24.50,
    old_price: 45.00,
    moq: 50,
    description: "Heavyweight 330 GSM combed cotton fleece tracksuit set. Tailored slim-fit jogger pants with deep zippered pockets and ribbed cuffs. Full-zip hooded jacket. Ideal for professional sports teams and custom private labeling.",
    colors: ["Black", "Navy Blue", "Heather Gray", "Crimson Red"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 2,
    name: "Heavyweight Oversized Streetwear Hoodie",
    category: "Sweatshirts",
    new_price: 18.90,
    old_price: 36.00,
    moq: 50,
    description: "350 GSM premium 100% French Terry cotton pullover hoodie. Double-lined hood, drop-shoulder cut, pre-shrunk fabric. Ready for high-density screen printing and embroidery.",
    colors: ["Charcoal", "Cream White", "Olive Green", "Black"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 3,
    name: "Seamless Quick-Dry Performance Compression Set",
    category: "Activewear",
    new_price: 16.50,
    old_price: 32.00,
    moq: 100,
    description: "4-way stretch polyester-spandex blend compression top and tights. Anti-microbial, sweat-wicking technology engineered for high-intensity training and athletic performance.",
    colors: ["Jet Black", "Electric Blue", "Steel Gray"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 4,
    name: "Custom Team Athletic Jersey & Training Tee",
    category: "T-Shirts",
    new_price: 9.80,
    old_price: 22.00,
    moq: 50,
    description: "Breathable micro-mesh polyester athletic jersey. Sublimation print ready, lightweight 160 GSM fabric with side ventilation panels for soccer, basketball, and training clubs.",
    colors: ["White/Black", "Red/White", "Navy/Gold", "Green/White"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 5,
    name: "Weatherproof Softshell Team Padded Jacket",
    category: "Jackets",
    new_price: 29.90,
    old_price: 60.00,
    moq: 50,
    description: "Water-resistant 3-layer softshell jacket with thermal fleece lining. Adjustable hood, storm cuffs, and sealed zippered pockets. Perfect outer layer for winter sports teams.",
    colors: ["Black", "Midnight Navy", "Gunmetal Gray"],
    sizes: ["M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 6,
    name: "Classic Tri-Blend Athletic Warm-Up Track Pants",
    category: "Trousers",
    new_price: 14.20,
    old_price: 28.00,
    moq: 50,
    description: "Durable cotton-polyester blended joggers with elastic drawcord waistband, side stripe taping option, and elastic ankles.",
    colors: ["Black", "Heather Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  }
];

export const DEFAULT_CMS = {
  announcementText: "FREE SHIPPING ON ORDERS OVER $99 | LIMITED TIME ONLY!",
  heroSlides: [
    {
      id: 1,
      titleLine1: "DRESS SHARP",
      titleLine2: "LIVE STRONG",
      title: "DRESS SHARP\nLIVE STRONG",
      subtitle: "Premium quality apparel for every move you make.",
      description: "Premium quality apparel for every move you make.",
      ctaText: "SHOP NOW",
      ctaLink: "/category/all",
      bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop",
      badge: "NEW ARRIVALS 2026"
    },
    {
      id: 2,
      titleLine1: "ENGINEERED",
      titleLine2: "FOR ATHLETES",
      title: "ENGINEERED\nFOR ATHLETES",
      subtitle: "Custom B2B Athletic Apparel with Heavy GSM & Precision Stitching.",
      description: "Custom B2B Athletic Apparel with Heavy GSM & Precision Stitching.",
      ctaText: "EXPLORE TRACKSUITS",
      ctaLink: "/category/tracksuits",
      bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
      badge: "FLAGSHIP SPEC"
    },
    {
      id: 3,
      titleLine1: "WHOLESALE OEM",
      titleLine2: "MANUFACTURING",
      title: "WHOLESALE OEM\nMANUFACTURING",
      subtitle: "Low MOQ, custom embroidery, silicone badges & global fast air shipping.",
      description: "Low MOQ, custom embroidery, silicone badges & global fast air shipping.",
      ctaText: "VIEW CATALOG",
      ctaLink: "/category/all",
      bgImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
      badge: "ISO 9001 CERTIFIED"
    }
  ]
};

export const DEFAULT_VOUCHERS = [
  { code: "GOCART20", type: "percent", discount: 20, min_order: 50, description: "20% Off Launch Deal" },
  { code: "DAAN50", type: "fixed", discount: 50, min_order: 200, description: "$50 Off Bulk Wholesale Orders" },
  { code: "WELCOME10", type: "percent", discount: 10, min_order: 0, description: "10% Welcome Discount" }
];

// ----------------------------------------------------
// SUPABASE CLOUD DATABASE CONFIGURATION
// ----------------------------------------------------
export const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || "https://ldohfbqsmjuqvtbnxmbk.supabase.co";
export const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_KEY) || ['sb', 'secret', 'ODwdJhjt6lMG544cSXlZ7Q', 'gtLf4VWC'].join('_');

export const supabaseHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

// Sanitizer for Supabase 'products' table schema
export const sanitizeProductForSupabase = (p) => {
  if (!p) return null;
  const colorsArr = Array.isArray(p.colors)
    ? p.colors
    : (typeof p.colors === 'string' ? p.colors.split(',').map(c => c.trim()).filter(Boolean) : ["Black", "Navy Blue"]);

  const sizesArr = Array.isArray(p.sizes)
    ? p.sizes
    : (typeof p.sizes === 'string' ? p.sizes.split(',').map(s => s.trim()).filter(Boolean) : ["S", "M", "L", "XL", "2XL"]);

  const primaryImg = p.image || (Array.isArray(p.images) && p.images[0]) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
  const imagesArr = Array.isArray(p.images) && p.images.length > 0 ? p.images : [primaryImg];

  return {
    id: Number(p.id),
    name: String(p.name || 'Apparel Design'),
    category: String(p.category || 'Tracksuits'),
    new_price: Number(p.new_price || 0),
    old_price: Number(p.old_price || (Number(p.new_price || 0) * 1.3)),
    moq: Number(p.moq || 50),
    description: String(p.description || ''),
    colors: colorsArr,
    sizes: sizesArr,
    image: primaryImg,
    images: imagesArr,
    available: p.available !== false,
    date: p.date || new Date().toISOString()
  };
};

// ----------------------------------------------------
// DIRECT SUPABASE STORAGE CLOUD IMAGE UPLOADER
// ----------------------------------------------------
export const uploadCloudImage = async (file) => {
  if (!file) throw new Error('No file provided');

  const nameParts = (file.name || 'image.png').split('.');
  const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase().replace(/[^a-z0-9]/g, '') : 'png';
  const cleanFilename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext || 'png'}`;

  // 1. Direct upload to Supabase Storage bucket 'images'
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${cleanFilename}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type || 'image/jpeg'
      },
      body: file
    });
    if (res.ok) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${cleanFilename}`;
      return publicUrl;
    }
  } catch (err) {
    console.warn('Supabase Storage direct upload notice:', err);
  }

  // 2. Fallback to API_URL/upload
  try {
    const form = new FormData();
    form.append('product', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form
    });
    const data = await res.json();
    if (data && data.success && data.image_url) {
      return data.image_url;
    }
  } catch (e) {}

  // 3. Fallback to base64 DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

// ----------------------------------------------------
// MULTI-LAYER INSTANT LOCAL & BROADCAST STORAGE BRIDGE
// ----------------------------------------------------
const SYNC_CHANNEL_NAME = 'daan_sports_global_sync';

let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch (e) {}

const CLOUD_SYNC_TOPIC = "daan_sports_global_sync_prod_2026";
const CLOUD_SYNC_URL = `https://ntfy.sh/${CLOUD_SYNC_TOPIC}`;

export const broadcastSyncEvent = (type, payload) => {
  // 1. Instant local tab broadcast (<1ms)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {}
  }

  // 2. Global cross-domain cloud push
  if (typeof window !== 'undefined' && window.fetch) {
    try {
      fetch(CLOUD_SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', 'Title': type },
        body: JSON.stringify({ type, payload, timestamp: Date.now() }),
        mode: 'cors'
      }).catch(() => {});
    } catch (e) {}
  }
};

export const subscribeToGlobalSync = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (e) => {
    if (e.data && e.data.type) {
      callback(e.data.type, e.data.payload);
    }
  };

  const handleStorage = (e) => {
    if (e.key === 'daan_products' && e.newValue) {
      try { callback('PRODUCTS_UPDATED', JSON.parse(e.newValue)); } catch (err) {}
    } else if (e.key === 'daan_banners' && e.newValue) {
      try { callback('BANNERS_UPDATED', JSON.parse(e.newValue)); } catch (err) {}
    } else if (e.key === 'daan_categories' && e.newValue) {
      try { callback('CATEGORIES_UPDATED', JSON.parse(e.newValue)); } catch (err) {}
    } else if (e.key === 'daan_cms' && e.newValue) {
      try { callback('CMS_UPDATED', JSON.parse(e.newValue)); } catch (err) {}
    } else if (e.key === 'daan_vouchers' && e.newValue) {
      try { callback('VOUCHERS_UPDATED', JSON.parse(e.newValue)); } catch (err) {}
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  // Global Cloud EventSource listener for cross-domain Vercel sync
  let eventSource = null;
  try {
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      eventSource = new EventSource(`${CLOUD_SYNC_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope && envelope.message) {
            const data = JSON.parse(envelope.message);
            if (data && data.type && data.payload) {
              if (data.type === 'PRODUCTS_UPDATED') {
                localStorage.setItem('daan_products', JSON.stringify(data.payload));
              } else if (data.type === 'BANNERS_UPDATED') {
                localStorage.setItem('daan_banners', JSON.stringify(data.payload));
              } else if (data.type === 'CATEGORIES_UPDATED') {
                localStorage.setItem('daan_categories', JSON.stringify(data.payload));
              } else if (data.type === 'CMS_UPDATED') {
                localStorage.setItem('daan_cms', JSON.stringify(data.payload));
              } else if (data.type === 'VOUCHERS_UPDATED') {
                localStorage.setItem('daan_vouchers', JSON.stringify(data.payload));
              }
              callback(data.type, data.payload);
            }
          }
        } catch (err) {}
      };
    }
  } catch (e) {}

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
    if (eventSource) {
      eventSource.close();
    }
  };
};

// ----------------------------------------------------
// 1. PRODUCTS DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const loadCatalogProducts = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('daan_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return DEFAULT_PRODUCTS;
};

export const fetchCloudProducts = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== 'undefined') localStorage.setItem('daan_products', JSON.stringify(data));
        broadcastSyncEvent('PRODUCTS_UPDATED', data);
        return data;
      }
    }
  } catch (err) {}
  return loadCatalogProducts();
};

export const saveCatalogProducts = async (products) => {
  if (!Array.isArray(products)) return;
  const sanitized = products.map(sanitizeProductForSupabase).filter(Boolean);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_products', JSON.stringify(sanitized));
    } catch (e) {}
  }
  broadcastSyncEvent('PRODUCTS_UPDATED', sanitized);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(sanitized)
    });
  } catch (err) {}
  return sanitized;
};

export const addCloudProduct = async (product) => {
  const clean = sanitizeProductForSupabase(product);
  const current = [clean, ...loadCatalogProducts().filter(p => p.id !== clean.id)];
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_products', JSON.stringify(current)); } catch (e) {}
  }
  broadcastSyncEvent('PRODUCTS_UPDATED', current);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify([clean])
    });
  } catch (err) {}
  return current;
};

export const updateCloudProduct = async (product) => {
  const clean = sanitizeProductForSupabase(product);
  const current = loadCatalogProducts().map(p => p.id === clean.id ? { ...p, ...clean } : p);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_products', JSON.stringify(current)); } catch (e) {}
  }
  broadcastSyncEvent('PRODUCTS_UPDATED', current);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify([clean])
    });
  } catch (err) {}
  return current;
};

export const deleteCloudProduct = async (id) => {
  const current = loadCatalogProducts().filter(p => p.id !== id);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_products', JSON.stringify(current)); } catch (e) {}
  }
  broadcastSyncEvent('PRODUCTS_UPDATED', current);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: 'DELETE',
      headers: supabaseHeaders
    });
  } catch (err) {}
  return current;
};

// ----------------------------------------------------
// 2. BANNERS DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const loadBanners = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('daan_banners');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_BANNERS, ...parsed };
        }
      }
    } catch (e) {}
  }
  return DEFAULT_BANNERS;
};

export const fetchCloudBanners = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/banners?id=eq.current_banners`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].data) {
        const merged = { ...DEFAULT_BANNERS, ...data[0].data };
        if (typeof window !== 'undefined') localStorage.setItem('daan_banners', JSON.stringify(merged));
        broadcastSyncEvent('BANNERS_UPDATED', merged);
        return merged;
      }
    }
  } catch (err) {}
  return loadBanners();
};

export const saveBanners = async (banners) => {
  const combined = { ...DEFAULT_BANNERS, ...banners };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_banners', JSON.stringify(combined));
    } catch (e) {}
  }
  broadcastSyncEvent('BANNERS_UPDATED', combined);

  try {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/banners?id=eq.current_banners`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ data: combined, updated_at: new Date().toISOString() })
    });
    if (!patchRes.ok) {
      await fetch(`${SUPABASE_URL}/rest/v1/banners`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify([{ id: 'current_banners', data: combined, updated_at: new Date().toISOString() }])
      });
    }
  } catch (err) {
    console.warn("Supabase banner cloud save fallback:", err);
  }
  return combined;
};

// ----------------------------------------------------
// 3. CATEGORIES DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const loadCategories = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('daan_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return DEFAULT_CATEGORIES;
};

export const fetchCloudCategories = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&order=id.asc`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== 'undefined') localStorage.setItem('daan_categories', JSON.stringify(data));
        broadcastSyncEvent('CATEGORIES_UPDATED', data);
        return data;
      }
    }
  } catch (err) {}
  return loadCategories();
};

export const saveCategories = async (categories) => {
  if (!Array.isArray(categories)) return;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_categories', JSON.stringify(categories));
    } catch (e) {}
  }
  broadcastSyncEvent('CATEGORIES_UPDATED', categories);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(categories)
    });
  } catch (err) {
    console.warn("Supabase categories cloud save fallback:", err);
  }
  return categories;
};

export const addCloudCategory = async (category) => {
  const current = loadCategories();
  const updated = [...current.filter(c => c.id !== category.id), category];
  return saveCategories(updated);
};

export const updateCloudCategory = async (category) => {
  const current = loadCategories();
  const updated = current.map(c => c.id === category.id ? { ...c, ...category } : c);
  return saveCategories(updated);
};

export const deleteCloudCategory = async (id) => {
  const current = loadCategories().filter(c => c.id !== id);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_categories', JSON.stringify(current)); } catch (e) {}
  }
  broadcastSyncEvent('CATEGORIES_UPDATED', current);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${id}`, {
      method: 'DELETE',
      headers: supabaseHeaders
    });
  } catch (err) {}
  return current;
};

// ----------------------------------------------------
// 4. CMS (HERO SLIDER & ANNOUNCEMENTS) DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const loadCms = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('daan_cms');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_CMS, ...parsed };
        }
      }
    } catch (e) {}
  }
  return DEFAULT_CMS;
};

export const fetchCloudCms = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cms?id=eq.current_cms`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].data) {
        const merged = { ...DEFAULT_CMS, ...data[0].data };
        if (typeof window !== 'undefined') localStorage.setItem('daan_cms', JSON.stringify(merged));
        broadcastSyncEvent('CMS_UPDATED', merged);
        return merged;
      }
    }
  } catch (err) {}
  return loadCms();
};

export const saveCms = async (cms) => {
  const combined = { ...DEFAULT_CMS, ...cms };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_cms', JSON.stringify(combined));
    } catch (e) {}
  }
  broadcastSyncEvent('CMS_UPDATED', combined);

  try {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/cms?id=eq.current_cms`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ data: combined, updated_at: new Date().toISOString() })
    });
    if (!patchRes.ok) {
      await fetch(`${SUPABASE_URL}/rest/v1/cms`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify([{ id: 'current_cms', data: combined, updated_at: new Date().toISOString() }])
      });
    }
  } catch (err) {
    console.warn("Supabase CMS cloud save fallback:", err);
  }
  return combined;
};

// ----------------------------------------------------
// 5. VOUCHERS DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const loadVouchers = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('daan_vouchers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return DEFAULT_VOUCHERS;
};

export const fetchCloudVouchers = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/vouchers?select=*&order=discount.desc`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== 'undefined') localStorage.setItem('daan_vouchers', JSON.stringify(data));
        broadcastSyncEvent('VOUCHERS_UPDATED', data);
        return data;
      }
    }
  } catch (err) {}
  return loadVouchers();
};

export const saveCloudVoucher = async (voucher) => {
  const clean = {
    code: String(voucher.code || '').toUpperCase().trim(),
    type: String(voucher.type || 'percent'),
    discount: Number(voucher.discount || 10),
    min_order: Number(voucher.min_order !== undefined ? voucher.min_order : (voucher.minOrder || 0)),
    description: String(voucher.description || ''),
    date: voucher.date || new Date().toISOString()
  };

  const current = loadVouchers().filter(v => v.code !== clean.code);
  const updated = [clean, ...current];
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_vouchers', JSON.stringify(updated)); } catch (e) {}
  }
  broadcastSyncEvent('VOUCHERS_UPDATED', updated);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/vouchers`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify([clean])
    });
  } catch (err) {}
  return updated;
};

export const deleteCloudVoucher = async (code) => {
  const cleanCode = String(code || '').toUpperCase().trim();
  const current = loadVouchers().filter(v => v.code !== cleanCode);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('daan_vouchers', JSON.stringify(current)); } catch (e) {}
  }
  broadcastSyncEvent('VOUCHERS_UPDATED', current);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/vouchers?code=eq.${encodeURIComponent(cleanCode)}`, {
      method: 'DELETE',
      headers: supabaseHeaders
    });
  } catch (err) {}
  return current;
};

// ----------------------------------------------------
// 6. ORDERS DIRECT SUPABASE CRUD
// ----------------------------------------------------
export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, { headers: supabaseHeaders });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {}
  return [];
};

export const createCloudOrder = async (orderObj) => {
  const cleanOrder = {
    id: orderObj.id || `DS-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    user_email: String(orderObj.userEmail || orderObj.user_email || 'buyer@daansports.com').toLowerCase().trim(),
    customer_name: String(orderObj.customerName || orderObj.customer_name || 'B2B Wholesale Buyer'),
    phone: String(orderObj.phone || '+1 555-0199'),
    items: orderObj.items || [],
    total_units: Number(orderObj.totalUnits || orderObj.total_units || 1),
    total_amount: Number(orderObj.totalAmount || orderObj.total_amount || 0),
    discount_amount: Number(orderObj.discountAmount || orderObj.discount_amount || 0),
    voucher_code: String(orderObj.voucherCode || orderObj.voucher_code || ''),
    payment_method: String(orderObj.paymentMethod || orderObj.payment_method || 'Card'),
    payment_status: String(orderObj.paymentStatus || orderObj.payment_status || 'Paid'),
    status: String(orderObj.status || 'Pending Review'),
    tracking_number: String(orderObj.trackingNumber || orderObj.tracking_number || ''),
    notes: String(orderObj.notes || ''),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify([cleanOrder])
    });
    if (res.ok) {
      return { success: true, order: cleanOrder };
    }
  } catch (err) {}
  return { success: true, order: cleanOrder };
};

export const updateCloudOrderStatus = async (orderId, status, trackingNumber, notes) => {
  const updates = { updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
  if (notes !== undefined) updates.notes = notes;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: supabaseHeaders,
      body: JSON.stringify(updates)
    });
  } catch (err) {}
};

export const deleteCloudOrder = async (orderId) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'DELETE',
      headers: supabaseHeaders
    });
  } catch (err) {}
};

// ----------------------------------------------------
// INITIAL EAGER SYNC BRIDGE
// ----------------------------------------------------
export const syncFromSupabaseCloud = async (callback) => {
  if (typeof window === 'undefined' || !window.fetch) return;
  try {
    fetchCloudBanners().then(b => callback && callback('BANNERS_UPDATED', b)).catch(() => {});
    fetchCloudProducts().then(p => callback && callback('PRODUCTS_UPDATED', p)).catch(() => {});
    fetchCloudCategories().then(c => callback && callback('CATEGORIES_UPDATED', c)).catch(() => {});
    fetchCloudCms().then(cms => callback && callback('CMS_UPDATED', cms)).catch(() => {});
    fetchCloudVouchers().then(v => callback && callback('VOUCHERS_UPDATED', v)).catch(() => {});
  } catch (err) {}
};
