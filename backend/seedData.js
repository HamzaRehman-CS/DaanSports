require('dotenv').config();
const neonClient = require('./neonClient');

const defaultCategories = [
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

const defaultBanners = {
  tallVertical: {
    category: "Tracksuits",
    title: "FLAGSHIP TEAM TRACKSUITS",
    subtitle: "Custom 330 GSM combed fleece & interlock sets engineered for elite athletics & custom private labels.",
    badge: "FLAGSHIP SPEC",
    ctaText: "Explore Tracksuits",
    bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1200&auto=format&fit=crop"
  },
  wideFeature: {
    category: "Hoodies",
    title: "350 GSM FRENCH TERRY HOODIES",
    subtitle: "Wholesale streetwear blanks ready for high-density puff printing, silicone badging & custom private labeling.",
    badge: "STREETWEAR BLANKS",
    ctaText: "View Heavyweight Hoodies",
    bgImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop"
  },
  compactA: {
    category: "Activewear",
    title: "COMPRESSION GEAR",
    subtitle: "4-way stretch moisture-wicking sets.",
    badge: "PRO ATHLETICS",
    ctaText: "Shop Activewear",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
  },
  compactB: {
    category: "Jackets",
    title: "SOFTSHELL OUTERWEAR",
    subtitle: "Waterproof ripstop team jackets & vests.",
    badge: "WEATHERPROOF",
    ctaText: "Explore Jackets",
    bgImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
  },
  oemStrip: {
    title: "FULL OEM & PRIVATE LABEL APPAREL MANUFACTURING",
    subtitle: "Custom woven damask tags, custom polybags, embossed metal aglets & express DDP door-to-door cargo.",
    ctaText: "Contact Factory Representative",
    bgImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop"
  },
  promoSection1: {
    title: "GLOBAL B2B EXPORT STANDARDS",
    subtitle: "Certified ISO 9001 and OEKO-TEX eco-friendly dyes.",
    badge: "EXPORT CERTIFIED",
    ctaText: "Review Certifications",
    bgImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop"
  },
  promoSection2: {
    title: "CUSTOM 3D EMBROIDERY & SCREEN PRINTING",
    subtitle: "High precision Japanese machinery delivering 0.1mm stitch clarity on heavyweight fabrics.",
    badge: "IN-HOUSE FACTORY",
    ctaText: "Explore Customization Options",
    bgImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop"
  },
  customBanners: []
};

const defaultCms = {
  announcementBar: "⚡ EXCLUSIVE WHOLESALE B2B ATHLETIC WEAR • FREE WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER 200 UNITS",
  siteTitle: "DAAN SPORTS - B2B Sportswear Manufacturer",
  siteTagline: "Engineered Wholesale Athletic Apparel",
  slides: [
    {
      id: 1,
      titleLine1: "CUSTOM TEAM",
      titleLine2: "TRACKSUITS & HOODIES",
      title: "CUSTOM TEAM\nTRACKSUITS & HOODIES",
      subtitle: "Premium 330 GSM combed fleece & interlock sets engineered for elite athletic performance.",
      description: "Premium 330 GSM combed fleece & interlock sets engineered for elite athletic performance.",
      ctaText: "DISCOVER COLLECTION",
      ctaLink: "/category/tracksuits",
      badgeText: "WHOLESALE ATHLETICS",
      rightTagTop: "MINIMUM ORDER",
      rightTagTopVal: "50 PCS",
      rightTagBottom: "DIRECT FACTORY",
      rightTagBottomVal: "DDP CARGO",
      bgImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=2000&auto=format&fit=crop"
    },
    {
      id: 2,
      titleLine1: "ENGINEERED FOR",
      titleLine2: "PERFORMANCE",
      title: "ENGINEERED FOR\nPERFORMANCE",
      subtitle: "Heavyweight 350 GSM French Terry pullovers & custom athletic apparel.",
      description: "Heavyweight 350 GSM French Terry pullovers & custom athletic apparel.",
      ctaText: "EXPLORE HOODIES",
      ctaLink: "/category/hoodies",
      badgeText: "HEAVYWEIGHT FLEECE",
      rightTagTop: "HEAVYWEIGHT FLEECE",
      rightTagTopVal: "350 GSM",
      rightTagBottom: "BULK WHOLESALE",
      rightTagBottomVal: "SPECIALS",
      bgImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=85&w=2000&auto=format&fit=crop"
    },
    {
      id: 3,
      titleLine1: "DIRECT FACTORY",
      titleLine2: "MANUFACTURING",
      title: "DIRECT FACTORY\nMANUFACTURING",
      subtitle: "Custom private labeling, silicone tags, and worldwide express door-to-door cargo.",
      description: "Custom private labeling, silicone tags, and worldwide express door-to-door cargo.",
      ctaText: "VIEW TRACKSUITS",
      ctaLink: "/category/tracksuits",
      badgeText: "LOW MOQ 50 PCS",
      rightTagTop: "LOW MOQ",
      rightTagTopVal: "50 PCS",
      rightTagBottom: "EXPORT READY",
      rightTagBottomVal: "ISO 9001",
      bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=85&w=2000&auto=format&fit=crop"
    }
  ]
};

const defaultVouchers = [
  { code: "DAAN20", discount: 20, minOrder: 50, description: "20% Wholesale Discount" },
  { code: "BULK50", discount: 50, minOrder: 200, description: "$50 Off Large Production Runs" },
  { code: "WELCOME10", discount: 10, minOrder: 30, description: "10% First Order Welcome Voucher" }
];

const defaultSeedProducts = [
  {
    id: 1,
    name: "Pro Tech Fleece Full-Zip Tracksuit Set",
    category: "Tracksuits",
    new_price: 24.50,
    old_price: 45.00,
    moq: 50,
    description: "Heavyweight 330 GSM combed cotton fleece tracksuit set. Tailored slim-fit jogger pants with deep zippered pockets and ribbed cuffs. Full-zip hooded jacket. Ideal for professional sports teams and custom private labeling.",
    material: "80% Combed Cotton / 20% Polyester",
    materials: ["80% Combed Cotton / 20% Polyester"],
    gsm: "330 GSM Heavyweight Fleece",
    stitching: "Double-Needle Flatlock Reinforced",
    customization: ["3D Embroidery", "Screen Printing", "Woven Damask Tags"],
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
    materials: ["100% French Terry Cotton"],
    gsm: "350 GSM Heavyweight",
    stitching: "Drop-Shoulder Reinforced Seams",
    customization: ["Puff Print", "High-Density Screen Print", "Rubber Badges"],
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
    materials: ["85% Polyester / 15% Spandex"],
    gsm: "220 GSM Performance Stretch",
    stitching: "Seamless Ergonomic Flatlock",
    customization: ["Heat Transfer Logos", "Reflective Prints"],
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
    materials: ["100% Micro-Mesh Interlock Polyester"],
    gsm: "160 GSM Quick-Dry",
    stitching: "V-Neck Double Stitch",
    customization: ["All-Over Sublimation", "Player Numbers & Crests"],
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
    materials: ["Waterproof Softshell Polyester Shell"],
    gsm: "380 GSM Padded Thermal",
    stitching: "Sealed Waterproof Tape Seams",
    customization: ["Silicon Badges", "Zipper Pullers", "Woven Labels"],
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
    materials: ["70% Cotton / 30% Polyester Fleece"],
    gsm: "310 GSM",
    stitching: "Flatlock Reinforced Pockets",
    customization: ["Custom Side Stripe Taping & Screen Print"],
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
    materials: ["65% Combed Cotton / 35% Poly Pique"],
    gsm: "220 GSM Performance Knit",
    stitching: "Reinforced Shoulder & Collar Seams",
    customization: ["High-Density Chest Embroidery & Custom Buttons"],
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
    materials: ["100% French Terry Cotton"],
    gsm: "350 GSM Heavyweight",
    stitching: "Twin-Needle Coverstitch",
    customization: ["Puff Print", "Screen Print", "Custom Neck Tape"],
    leadTime: "10 - 14 Business Days",
    colors: ["Jet Black", "Sand Beige", "Slate Gray"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    stock: 3500,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    available: true
  }
];

async function seedAll() {
  console.log("Seeding Neon database with real catalog data...");

  // Seed Categories
  await neonClient.saveNeonCategories(defaultCategories);
  console.log(`✓ Seeded ${defaultCategories.length} categories`);

  // Seed Banners
  await neonClient.saveNeonBanners(defaultBanners);
  console.log(`✓ Seeded promotional banners`);

  // Seed CMS
  await neonClient.saveNeonCms(defaultCms);
  console.log(`✓ Seeded homepage CMS & carousel slides`);

  // Seed Vouchers
  for (const v of defaultVouchers) {
    await neonClient.saveNeonVoucher(v);
  }
  console.log(`✓ Seeded ${defaultVouchers.length} vouchers`);

  // Seed Products
  for (const p of defaultSeedProducts) {
    await neonClient.saveNeonProduct(p);
  }
  console.log(`✓ Seeded ${defaultSeedProducts.length} sportswear catalog products`);

  const prods = await neonClient.getNeonProducts();
  console.log(`🎉 Neon Database successfully verified! Live Products: ${prods ? prods.length : 0}`);
}

seedAll().catch(console.error);

