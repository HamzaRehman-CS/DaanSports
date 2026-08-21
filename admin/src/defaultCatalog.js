// ----------------------------------------------------
// DEFAULT SPORTSWEAR B2B CATALOG & SHARED SYNC BRIDGE
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
    material: "80% Combed Cotton / 20% Polyester",
    gsm: "330 GSM Heavyweight Fleece",
    stitching: "Double-Needle Flatlock Reinforced",
    customization: "3D Embroidery, Screen Printing, Woven Damask Tags",
    leadTime: "12 - 15 Business Days",
    colors: ["Black", "Navy Blue", "Heather Gray", "Crimson Red"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    stock: 5000,
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
    material: "100% French Terry Cotton",
    gsm: "350 GSM Heavyweight",
    stitching: "Drop-Shoulder Reinforced Seams",
    customization: "Puff Print, High-Density Screen Print, Rubber Badges",
    leadTime: "10 - 14 Business Days",
    colors: ["Charcoal", "Cream White", "Olive Green", "Black"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    stock: 3500,
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
    material: "85% Polyester / 15% Spandex",
    gsm: "220 GSM Performance Stretch",
    stitching: "Seamless Ergonomic Flatlock",
    customization: "Heat Transfer Logos, Reflective Prints",
    leadTime: "14 - 18 Business Days",
    colors: ["Jet Black", "Electric Blue", "Steel Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 6000,
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
    material: "100% Micro-Mesh Interlock Polyester",
    gsm: "160 GSM Quick-Dry",
    stitching: "V-Neck Double Stitch",
    customization: "All-Over Sublimation, Player Numbers & Crests",
    leadTime: "7 - 10 Business Days",
    colors: ["White/Black", "Red/White", "Navy/Gold", "Green/White"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    stock: 10000,
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
    material: "Waterproof Softshell Polyester Shell",
    gsm: "380 GSM Padded Thermal",
    stitching: "Sealed Waterproof Tape Seams",
    customization: "Silicon Badges, Zipper Pullers, Woven Labels",
    leadTime: "15 - 20 Business Days",
    colors: ["Black", "Midnight Navy", "Gunmetal Gray"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 2000,
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
    material: "70% Cotton / 30% Polyester Fleece",
    gsm: "310 GSM",
    stitching: "Flatlock Reinforced Pockets",
    customization: "Custom Side Stripe Taping & Screen Print",
    leadTime: "10 - 12 Business Days",
    colors: ["Black", "Heather Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    stock: 4500,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 7,
    name: "Pro Dry-Fit Pique Golf & Team Polo Shirt",
    category: "Polo Shirts",
    new_price: 13.50,
    old_price: 26.00,
    moq: 50,
    description: "Premium breathable pique knit polo with anti-curl ribbed collar and 3-button placket. Engineered for corporate teamwear, golf clubs, and custom chest logo embroidery.",
    material: "65% Combed Cotton / 35% Poly Pique",
    gsm: "220 GSM Performance Knit",
    stitching: "Reinforced Shoulder & Collar Seams",
    customization: "High-Density Chest Embroidery & Custom Buttons",
    leadTime: "8 - 12 Business Days",
    colors: ["Black", "Charcoal Gray", "Navy", "White"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    stock: 4000,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 8,
    name: "Heavyweight 350 GSM Streetwear Pullover Hoodie",
    category: "Hoodies",
    new_price: 19.50,
    old_price: 38.00,
    moq: 50,
    description: "Heavyweight 350 GSM French Terry cotton hoodie with kangaroo pocket and double-layer hood. Premium streetwear boxy cut ready for custom puff print and embroidery.",
    material: "100% French Terry Cotton",
    gsm: "350 GSM Heavyweight",
    stitching: "Twin-Needle Coverstitch",
    customization: "Puff Print, Screen Print, Custom Neck Tape",
    leadTime: "10 - 14 Business Days",
    colors: ["Jet Black", "Sand Beige", "Slate Gray"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    stock: 3500,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 9,
    name: "Elite Athletic Windbreaker & Weatherproof Track Jacket",
    category: "Jackets",
    new_price: 27.80,
    old_price: 55.00,
    moq: 50,
    description: "High-density wind-resistant ripstop shell with breathable mesh lining. Waterproof zip closures and elastic cuffs for all-weather athletic training.",
    material: "100% Ripstop Nylon Shell / Poly Mesh",
    gsm: "240 GSM Weatherproof",
    stitching: "Taped Waterproof Seams",
    customization: "Reflective Prints, Custom Pull Tabs, Rubber Logos",
    leadTime: "12 - 16 Business Days",
    colors: ["Black / Silver", "Navy / White", "Olive"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 2800,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  },
  {
    id: 10,
    name: "Pro Athlete Structured 6-Panel Cap & Gym Duffle Set",
    category: "Accessories",
    new_price: 8.90,
    old_price: 18.00,
    moq: 50,
    description: "Custom 6-panel athletic cap with moisture-wicking sweatband and laser-perforated ventilation. Includes heavy-duty water-resistant gym gear bag with shoe compartment.",
    material: "Performance Poly-Spandex & 600D Cordura",
    gsm: "Heavy-Duty Sports Weave",
    stitching: "Bar-tack Reinforced Stress Points",
    customization: "3D Raised Embroidery, Rubber Badges, Custom Buckles",
    leadTime: "7 - 10 Business Days",
    colors: ["Matte Black", "Graphite Gray", "White"],
    sizes: ["One Size Fits All"],
    stock: 8000,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
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

export const broadcastSyncEvent = (type, payload) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
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
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
};

// 1. PRODUCTS
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

export const saveCatalogProducts = (products) => {
  if (typeof window !== 'undefined' && Array.isArray(products)) {
    try {
      localStorage.setItem('daan_products', JSON.stringify(products));
    } catch (e) {}
  }
  broadcastSyncEvent('PRODUCTS_UPDATED', products);
};

// 2. BANNERS
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

export const saveBanners = (banners) => {
  const combined = { ...DEFAULT_BANNERS, ...banners };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_banners', JSON.stringify(combined));
    } catch (e) {}
  }
  broadcastSyncEvent('BANNERS_UPDATED', combined);
  return combined;
};

// 3. CATEGORIES
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

export const saveCategories = (categories) => {
  if (typeof window !== 'undefined' && Array.isArray(categories)) {
    try {
      localStorage.setItem('daan_categories', JSON.stringify(categories));
    } catch (e) {}
  }
  broadcastSyncEvent('CATEGORIES_UPDATED', categories);
};

// 4. CMS
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

export const saveCms = (cms) => {
  const combined = { ...DEFAULT_CMS, ...cms };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('daan_cms', JSON.stringify(combined));
    } catch (e) {}
  }
  broadcastSyncEvent('CMS_UPDATED', combined);
  return combined;
};
