require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const supabase = require("./supabaseClient");

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/e-commerce";
const jwtSecret = process.env.JWT_SECRET || 'secret_ecom_2026_hardened';

// SECURITY HARDENING MIDDLEWARE
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, please try again later." }
});

const orderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
    message: { success: false, error: "Order limit exceeded, please wait a moment." }
});

app.use("/create-order", orderLimiter);

const os = require('os');
const baseDir = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, 'upload');
const uploadDir = path.join(baseDir, 'images');
const dataFilePath = path.join(baseDir, 'products.json');
const ordersFilePath = path.join(baseDir, 'orders.json');
const cmsFilePath = path.join(baseDir, 'cms.json');
const vouchersFilePath = path.join(baseDir, 'vouchers.json');
const categoriesFilePath = path.join(baseDir, 'categories.json');
const bannersFilePath = path.join(baseDir, 'banners.json');

try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (e) {}

// ----------------------------------------------------
// DEFAULT SEED DATA (SPORTSWEAR CATALOG & SETTINGS)
// ----------------------------------------------------
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

const defaultVouchers = [
  { code: "GOCART20", type: "percent", discount: 20, minOrder: 50, description: "20% Off Launch Deal" },
  { code: "DAAN50", type: "fixed", discount: 50, minOrder: 200, description: "$50 Off Bulk Wholesale Orders" },
  { code: "WELCOME10", type: "percent", discount: 10, minOrder: 0, description: "10% Welcome Discount" }
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

const defaultCmsData = {
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
      badgeText: "DIRECT FACTORY WHOLESALE",
      rightTagTop: "NEW COLLECTION",
      rightTagTopVal: "2026",
      rightTagBottom: "UP TO",
      rightTagBottomVal: "30% OFF",
      bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=2000&auto=format&fit=crop"
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

// In-Memory Fast Cache
let inMemoryProducts = [...defaultSeedProducts];
let inMemoryCategories = [...defaultCategories];
let inMemoryBanners = { ...defaultBanners };
let inMemoryOrders = [];
let inMemoryCms = { ...defaultCmsData };
let inMemoryVouchers = [...defaultVouchers];

// Local JSON File Sync (Local Persistence Fallback)
const getJsonProducts = () => {
    try {
        if (fs.existsSync(dataFilePath)) {
            const raw = fs.readFileSync(dataFilePath, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (e) {}
    return inMemoryProducts;
};

const saveJsonProducts = (prods) => {
    inMemoryProducts = prods;
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(prods, null, 2), 'utf8');
    } catch (e) {}
};

const getJsonCategories = () => {
    try {
        if (fs.existsSync(categoriesFilePath)) {
            const raw = fs.readFileSync(categoriesFilePath, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (e) {}
    return inMemoryCategories;
};

const saveJsonCategories = (cats) => {
    inMemoryCategories = cats;
    try {
        fs.writeFileSync(categoriesFilePath, JSON.stringify(cats, null, 2), 'utf8');
    } catch (e) {}
};

const getJsonBanners = () => {
    try {
        if (fs.existsSync(bannersFilePath)) {
            const raw = fs.readFileSync(bannersFilePath, 'utf8');
            const parsed = JSON.parse(raw);
            return { ...defaultBanners, ...parsed };
        }
    } catch (e) {}
    return { ...defaultBanners, ...(inMemoryBanners || {}) };
};

const saveJsonBanners = (bannersData) => {
    inMemoryBanners = bannersData;
    try {
        fs.writeFileSync(bannersFilePath, JSON.stringify(bannersData, null, 2), 'utf8');
    } catch (e) {}
};

const getJsonOrders = () => {
    try {
        if (fs.existsSync(ordersFilePath)) {
            const raw = fs.readFileSync(ordersFilePath, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return inMemoryOrders;
};

const saveJsonOrders = (orders) => {
    inMemoryOrders = orders;
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    } catch (e) {}
};

const getJsonCms = () => {
    try {
        if (fs.existsSync(cmsFilePath)) {
            const raw = fs.readFileSync(cmsFilePath, 'utf8');
            const parsed = JSON.parse(raw);
            return {
                ...defaultCmsData,
                ...parsed,
                heroSlides: (parsed.heroSlides && parsed.heroSlides.length > 0) ? parsed.heroSlides : defaultCmsData.heroSlides
            };
        }
    } catch (e) {}
    return {
        ...defaultCmsData,
        ...(inMemoryCms || {}),
        heroSlides: (inMemoryCms && inMemoryCms.heroSlides && inMemoryCms.heroSlides.length > 0) ? inMemoryCms.heroSlides : defaultCmsData.heroSlides
    };
};

const saveJsonCms = (cmsData) => {
    inMemoryCms = cmsData;
    try {
        fs.writeFileSync(cmsFilePath, JSON.stringify(cmsData, null, 2), 'utf8');
    } catch (e) {}
};

const getJsonVouchers = () => {
    try {
        if (fs.existsSync(vouchersFilePath)) {
            const raw = fs.readFileSync(vouchersFilePath, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (e) {}
    return inMemoryVouchers;
};

const saveJsonVouchers = (vouchers) => {
    inMemoryVouchers = vouchers;
    try {
        fs.writeFileSync(vouchersFilePath, JSON.stringify(vouchers, null, 2), 'utf8');
    } catch (e) {}
};

// ----------------------------------------------------
// MONGOOSE SCHEMAS & MODELS FOR COMPLETE PERSISTENCE
// ----------------------------------------------------
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, default: 0 },
    moq: { type: Number, default: 50 },
    description: { type: String, default: "" },
    material: { type: String, default: "80% Combed Cotton / 20% Polyester" },
    gsm: { type: String, default: "330 GSM" },
    stitching: { type: String, default: "Double-Needle Flatlock Reinforced" },
    customization: { type: String, default: "Custom Printing & Labels Available" },
    leadTime: { type: String, default: "12 - 15 Business Days" },
    colors: { type: [String], default: ["Black", "Navy Blue", "Heather Gray", "Crimson Red"] },
    sizes: { type: [String], default: ["S", "M", "L", "XL", "2XL"] },
    stock: { type: Number, default: 1000 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }
});

const CategorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    subcategories: { type: [String], default: ["General"] },
    banner: { type: String, default: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop" },
    date: { type: Date, default: Date.now }
});

const BannerSchema = new mongoose.Schema({
    key: { type: String, default: "current_banners", unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedAt: { type: Date, default: Date.now }
});

const CmsSchema = new mongoose.Schema({
    key: { type: String, default: "current_cms", unique: true },
    announcementText: { type: String, default: "FREE SHIPPING ON ORDERS OVER $99 | LIMITED TIME ONLY!" },
    heroSlides: { type: [mongoose.Schema.Types.Mixed], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

const VoucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, default: "percent" },
    discount: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    customerName: { type: String, default: "B2B Buyer" },
    phone: { type: String, default: "+1 555-0199" },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    totalUnits: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    voucherCode: { type: String, default: "" },
    paymentMethod: { type: String, default: "Card" },
    paymentStatus: { type: String, default: "Paid" },
    status: { type: String, default: "Pending Review" },
    trackingNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const BannerModel = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
const CmsModel = mongoose.models.Cms || mongoose.model("Cms", CmsSchema);
const VoucherModel = mongoose.models.Voucher || mongoose.model("Voucher", VoucherSchema);
const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Mongoose Connection Handler with Cooldown Backoff
let cachedMongo = null;
let isMongoConnecting = false;
let lastMongoAttemptTime = 0;
const MONGO_RETRY_INTERVAL = 30000; // 30s cooldown between retries if connection failed

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    if (cachedMongo) {
        return cachedMongo;
    }
    if (isMongoConnecting) {
        return null;
    }
    const now = Date.now();
    if (now - lastMongoAttemptTime < MONGO_RETRY_INTERVAL) {
        return null;
    }
    lastMongoAttemptTime = now;
    isMongoConnecting = true;
    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2000,
            bufferCommands: false
        });
        cachedMongo = conn;
        console.log("⚡ MongoDB Database Connected Successfully.");
        await autoSeedMongoIfEmpty();
        return conn;
    } catch (err) {
        console.warn("ℹ️ MongoDB Connection Notice (Using Cloud/JSON Store):", err.message);
        return null;
    } finally {
        isMongoConnecting = false;
    }
};

const autoSeedMongoIfEmpty = async () => {
    try {
        const prodCount = await ProductModel.countDocuments();
        if (prodCount === 0) {
            await ProductModel.insertMany(defaultSeedProducts);
            console.log("🌱 Seeded initial products to MongoDB.");
        }
        const catCount = await CategoryModel.countDocuments();
        if (catCount === 0) {
            await CategoryModel.insertMany(defaultCategories);
            console.log("🌱 Seeded initial categories to MongoDB.");
        }
        const bannerDoc = await BannerModel.findOne({ key: 'current_banners' });
        if (!bannerDoc) {
            await BannerModel.create({ key: 'current_banners', data: defaultBanners });
            console.log("🌱 Seeded initial banners to MongoDB.");
        }
        const cmsDoc = await CmsModel.findOne({ key: 'current_cms' });
        if (!cmsDoc) {
            await CmsModel.create({ key: 'current_cms', announcementText: defaultCmsData.announcementText, heroSlides: defaultCmsData.heroSlides });
            console.log("🌱 Seeded initial CMS to MongoDB.");
        }
        const voucherCount = await VoucherModel.countDocuments();
        if (voucherCount === 0) {
            await VoucherModel.insertMany(defaultVouchers);
            console.log("🌱 Seeded initial vouchers to MongoDB.");
        }
    } catch (e) {
        console.warn("Mongo auto-seed notice:", e.message);
    }
};

// Non-blocking background database connection initialization
connectDB().catch(() => {});

// Helper for Safe Supabase Calls with Fast-Fail Timeout
const safeSupabase = async (callback) => {
    if (!supabase) return null;
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase Timeout')), 500)
        );
        return await Promise.race([callback(supabase), timeoutPromise]);
    } catch (err) {
        return null;
    }
};

// ----------------------------------------------------
// UNIFIED DATA ACCESS METHODS (ULTRA-FAST LOCAL-FIRST + ASYNC CLOUD SYNC)
// ----------------------------------------------------

// 1. PRODUCTS
const getAllProductsLive = async () => {
    return getJsonProducts();
};

const saveProductLive = async (productObj) => {
    const currentList = getJsonProducts();
    const existingIdx = currentList.findIndex(p => p.id === productObj.id);
    if (existingIdx >= 0) {
        currentList[existingIdx] = productObj;
    } else {
        currentList.push(productObj);
    }
    saveJsonProducts(currentList);

    // Non-blocking async background cloud sync
    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await ProductModel.findOneAndUpdate(
                    { id: productObj.id },
                    productObj,
                    { upsert: true, new: true }
                );
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('products').upsert([{
                id: productObj.id,
                name: productObj.name,
                category: productObj.category,
                new_price: productObj.new_price,
                old_price: productObj.old_price,
                moq: productObj.moq,
                description: productObj.description,
                material: productObj.material,
                gsm: productObj.gsm,
                stitching: productObj.stitching,
                customization: productObj.customization,
                lead_time: productObj.leadTime,
                colors: productObj.colors,
                sizes: productObj.sizes,
                stock: productObj.stock,
                image: productObj.image,
                images: productObj.images,
                available: productObj.available !== false
            }]);
        });
    }).catch(() => {});
};

const deleteProductLive = async (prodId) => {
    let currentList = getJsonProducts();
    currentList = currentList.filter(p => p.id !== prodId);
    saveJsonProducts(currentList);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await ProductModel.deleteOne({ id: prodId });
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('products').delete().eq('id', prodId);
        });
    }).catch(() => {});
};

// 2. CATEGORIES
const getCategoriesLive = async () => {
    return getJsonCategories();
};

const saveCategoriesLive = async (categoriesList) => {
    saveJsonCategories(categoriesList);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                for (const cat of categoriesList) {
                    await CategoryModel.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
                }
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            for (const cat of categoriesList) {
                await s.from('categories').upsert([cat]);
            }
        });
    }).catch(() => {});
};

const deleteCategoryLive = async (catId) => {
    let currentList = getJsonCategories();
    currentList = currentList.filter(c => c.id !== catId);
    saveJsonCategories(currentList);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await CategoryModel.deleteOne({ id: catId });
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('categories').delete().eq('id', catId);
        });
    }).catch(() => {});
};

// 3. BANNERS
const getBannersLive = async () => {
    return getJsonBanners();
};

const saveBannersLive = async (bannersData) => {
    const combined = { ...defaultBanners, ...bannersData };
    saveJsonBanners(combined);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await BannerModel.findOneAndUpdate(
                    { key: 'current_banners' },
                    { key: 'current_banners', data: combined, updatedAt: new Date() },
                    { upsert: true }
                );
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('banners').upsert([{ id: 'current_banners', data: combined, updated_at: new Date().toISOString() }]);
        });
    }).catch(() => {});
};

// 4. CMS (HERO SLIDERS & ANNOUNCEMENTS)
const getCmsLive = async () => {
    return getJsonCms();
};

const saveCmsLive = async (cmsData) => {
    const combined = {
        announcementText: cmsData.announcementText || defaultCmsData.announcementText,
        heroSlides: (cmsData.heroSlides && cmsData.heroSlides.length > 0) ? cmsData.heroSlides : defaultCmsData.heroSlides
    };
    saveJsonCms(combined);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await CmsModel.findOneAndUpdate(
                    { key: 'current_cms' },
                    { key: 'current_cms', announcementText: combined.announcementText, heroSlides: combined.heroSlides, updatedAt: new Date() },
                    { upsert: true }
                );
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('cms').upsert([{ id: 'current_cms', data: combined, updated_at: new Date().toISOString() }]);
        });
    }).catch(() => {});
};

// 5. VOUCHERS
const getVouchersLive = async () => {
    return getJsonVouchers();
};

const saveVoucherLive = async (voucherObj) => {
    let vouchers = getJsonVouchers();
    vouchers = vouchers.filter(v => v.code !== voucherObj.code);
    vouchers.unshift(voucherObj);
    saveJsonVouchers(vouchers);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await VoucherModel.findOneAndUpdate(
                    { code: voucherObj.code },
                    voucherObj,
                    { upsert: true }
                );
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('vouchers').upsert([{
                code: voucherObj.code,
                type: voucherObj.type,
                discount: voucherObj.discount,
                min_order: voucherObj.minOrder,
                description: voucherObj.description
            }]);
        });
    }).catch(() => {});
};

const deleteVoucherLive = async (code) => {
    let vouchers = getJsonVouchers();
    vouchers = vouchers.filter(v => v.code !== code);
    saveJsonVouchers(vouchers);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await VoucherModel.deleteOne({ code: code });
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('vouchers').delete().eq('code', code);
        });
    }).catch(() => {});
};

// 6. ORDERS
const getAllOrdersLive = async () => {
    return getJsonOrders();
};

const saveOrderLive = async (orderObj) => {
    const orders = getJsonOrders();
    orders.unshift(orderObj);
    saveJsonOrders(orders);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await OrderModel.create(orderObj);
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('orders').insert([{
                id: orderObj.id,
                user_email: orderObj.userEmail,
                customer_name: orderObj.customerName,
                phone: orderObj.phone,
                items: orderObj.items,
                total_units: orderObj.totalUnits,
                total_amount: orderObj.totalAmount,
                discount_amount: orderObj.discountAmount || 0,
                voucher_code: orderObj.voucherCode || '',
                payment_method: orderObj.paymentMethod,
                payment_status: orderObj.paymentStatus,
                status: orderObj.status,
                tracking_number: orderObj.trackingNumber || '',
                notes: orderObj.notes || ''
            }]);
        });
    }).catch(() => {});
};

const updateOrderStatusLive = async (orderId, status, trackingNumber, notes) => {
    let orders = getJsonOrders();
    let updatedOrder = null;

    orders = orders.map(o => {
        if (o.id === orderId) {
            if (status) o.status = status;
            if (trackingNumber !== undefined) o.trackingNumber = trackingNumber;
            if (notes !== undefined) o.notes = notes;
            o.updatedAt = new Date().toISOString();
            updatedOrder = o;
        }
        return o;
    });
    saveJsonOrders(orders);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                const updates = { updatedAt: new Date() };
                if (status) updates.status = status;
                if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
                if (notes !== undefined) updates.notes = notes;
                await OrderModel.findOneAndUpdate({ id: orderId }, updates);
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            const sUpdates = { updated_at: new Date().toISOString() };
            if (status) sUpdates.status = status;
            if (trackingNumber !== undefined) sUpdates.tracking_number = trackingNumber;
            if (notes !== undefined) sUpdates.notes = notes;
            await s.from('orders').update(sUpdates).eq('id', orderId);
        });
    }).catch(() => {});

    return updatedOrder;
};

const deleteOrderLive = async (orderId) => {
    let orders = getJsonOrders();
    orders = orders.filter(o => o.id !== orderId);
    saveJsonOrders(orders);

    Promise.resolve().then(async () => {
        if (mongoose.connection.readyState === 1) {
            try {
                await OrderModel.deleteOne({ id: orderId });
            } catch (e) {}
        }
        await safeSupabase(async (s) => {
            await s.from('orders').delete().eq('id', orderId);
        });
    }).catch(() => {});
};



// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// API Root Health Check
app.get("/", (req, res) => {
    res.json({
        service: "DAAN Sports Full-Stack API",
        status: "Healthy & Persistent",
        database: mongoose.connection.readyState === 1 ? "MongoDB Connected" : (supabase ? "Supabase Engine Active" : "Local Store"),
        features: ["MongoDB Atlas Multi-Model", "Supabase DB Engine", "Live CMS & Banner Sync", "Order Tracking", "Voucher Engine"]
    });
});

// Image Upload Endpoint (Converts to Base64 data URI for 100% Serverless Reliability)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use('/images', express.static(uploadDir));

app.post("/upload", upload.single('product'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: 0, error: "No image file uploaded" });
        const mimeType = req.file.mimetype || 'image/png';
        const base64Url = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
        res.json({ success: 1, image_url: base64Url });
    } catch (err) {
        console.error("Upload Route Error:", err);
        res.status(500).json({ success: 0, error: err.message });
    }
});

// PRODUCT APIs
app.get('/all-products', async (req, res) => {
    try {
        const products = await getAllProductsLive();
        res.json(products);
    } catch (err) {
        res.json(getJsonProducts());
    }
});

app.get('/popular-tracksuits', async (req, res) => {
    try {
        const products = await getAllProductsLive();
        const popular = products.filter(p => (p.category || '').toLowerCase().includes('tracksuit')).slice(0, 4);
        res.json(popular.length > 0 ? popular : products.slice(0, 4));
    } catch (err) {
        res.json(getJsonProducts().slice(0, 4));
    }
});

app.get('/new-collection', async (req, res) => {
    try {
        const products = await getAllProductsLive();
        res.json(products.slice(0, 8));
    } catch (err) {
        res.json(getJsonProducts().slice(0, 8));
    }
});

app.post('/add-product', async (req, res) => {
    try {
        const allProducts = await getAllProductsLive();
        const maxId = allProducts.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const newId = maxId + 1;

        const productObj = {
            id: newId,
            name: req.body.name || "Custom Apparel Design",
            image: req.body.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            images: (req.body.images && req.body.images.length > 0) ? req.body.images : [req.body.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
            category: req.body.category || "Tracksuits",
            new_price: Number(req.body.new_price) || 20.0,
            old_price: req.body.old_price ? Number(req.body.old_price) : Number(req.body.new_price) * 1.3,
            moq: Number(req.body.moq) || 50,
            description: req.body.description || "",
            material: req.body.material || "80% Combed Cotton / 20% Polyester",
            gsm: req.body.gsm || "330 GSM",
            stitching: req.body.stitching || "Double-Needle Flatlock Reinforced",
            customization: req.body.customization || "Custom Printing & Labels Available",
            leadTime: req.body.leadTime || "12 - 15 Business Days",
            colors: Array.isArray(req.body.colors) ? req.body.colors : ["Black", "Navy Blue"],
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : ["S", "M", "L", "XL", "2XL"],
            stock: Number(req.body.stock) || 1000,
            available: true,
            date: new Date()
        };

        await saveProductLive(productObj);
        console.log(`Product Added: ${productObj.name} (ID: ${productObj.id})`);
        res.json({ success: true, name: productObj.name, product: productObj });
    } catch (err) {
        console.error("Add Product Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/edit-product', async (req, res) => {
    try {
        const prodId = Number(req.body.id);
        const allProducts = await getAllProductsLive();
        const existing = allProducts.find(p => p.id === prodId);

        if (!existing) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        const updatedProd = {
            ...existing,
            name: req.body.name || existing.name,
            category: req.body.category || existing.category,
            new_price: req.body.new_price !== undefined ? Number(req.body.new_price) : existing.new_price,
            old_price: req.body.old_price !== undefined ? Number(req.body.old_price) : existing.old_price,
            moq: req.body.moq !== undefined ? Number(req.body.moq) : existing.moq,
            description: req.body.description !== undefined ? req.body.description : existing.description,
            material: req.body.material || existing.material,
            gsm: req.body.gsm || existing.gsm,
            stitching: req.body.stitching || existing.stitching,
            customization: req.body.customization || existing.customization,
            leadTime: req.body.leadTime || existing.leadTime,
            colors: Array.isArray(req.body.colors) ? req.body.colors : (typeof req.body.colors === 'string' ? req.body.colors.split(',').map(c => c.trim()).filter(Boolean) : existing.colors),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : (typeof req.body.sizes === 'string' ? req.body.sizes.split(',').map(s => s.trim()).filter(Boolean) : existing.sizes),
            stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
            image: req.body.image || existing.image,
            images: (req.body.images && req.body.images.length > 0) ? req.body.images : (req.body.image ? [req.body.image] : existing.images)
        };

        await saveProductLive(updatedProd);
        console.log(`Product Edited: ${updatedProd.name} (ID: ${updatedProd.id})`);
        res.json({ success: true, product: updatedProd });
    } catch (err) {
        console.error("Edit Product Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/remove-product', async (req, res) => {
    try {
        const idToRemove = Number(req.body.id);
        await deleteProductLive(idToRemove);
        console.log(`Product Deleted: ID ${idToRemove}`);
        res.json({ success: true, id: idToRemove });
    } catch (err) {
        console.error("Remove Product Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// CATEGORY APIs
app.get('/categories', async (req, res) => {
    try {
        const cats = await getCategoriesLive();
        res.json(cats);
    } catch (err) {
        res.json(defaultCategories);
    }
});

app.post('/add-category', async (req, res) => {
    try {
        const { name, description, subcategories, banner } = req.body;
        if (!name) return res.status(400).json({ success: false, error: "Category name required" });

        const cats = await getCategoriesLive();
        const maxId = cats.reduce((max, c) => (c.id > max ? c.id : max), 0);
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');

        const newCat = {
            id: maxId + 1,
            name: name.trim(),
            slug: slug || `category-${maxId + 1}`,
            description: description || `Wholesale ${name} apparel collection`,
            subcategories: Array.isArray(subcategories) ? subcategories : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()).filter(Boolean) : ["General"]),
            banner: banner || "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop",
            date: new Date()
        };

        const updatedCats = [...cats, newCat];
        await saveCategoriesLive(updatedCats);
        console.log(`Category Added: ${newCat.name}`);
        res.json({ success: true, category: newCat });
    } catch (err) {
        console.error("Add Category Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/edit-category', async (req, res) => {
    try {
        const { id, name, description, subcategories, banner } = req.body;
        const catId = Number(id);
        const cats = await getCategoriesLive();
        let updated = null;

        const updatedCats = cats.map(c => {
            if (c.id === catId) {
                const slug = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : c.slug;
                updated = {
                    ...c,
                    name: name !== undefined ? name.trim() : c.name,
                    slug: slug,
                    description: description !== undefined ? description : c.description,
                    subcategories: Array.isArray(subcategories) ? subcategories : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()).filter(Boolean) : c.subcategories),
                    banner: banner || c.banner
                };
                return updated;
            }
            return c;
        });

        await saveCategoriesLive(updatedCats);
        console.log(`Category Edited: ID ${catId}`);
        res.json({ success: true, category: updated });
    } catch (err) {
        console.error("Edit Category Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/delete-category', async (req, res) => {
    try {
        const idToRemove = Number(req.body.id);
        await deleteCategoryLive(idToRemove);
        console.log(`Category Deleted: ID ${idToRemove}`);
        res.json({ success: true, id: idToRemove });
    } catch (err) {
        console.error("Delete Category Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// PROMOTIONAL & BENTO BANNERS APIs
app.get('/promotional-banners', async (req, res) => {
    try {
        const banners = await getBannersLive();
        res.json(banners);
    } catch (err) {
        res.json(defaultBanners);
    }
});

app.post('/update-promotional-banners', async (req, res) => {
    try {
        const bannersData = req.body;
        await saveBannersLive(bannersData);
        console.log("Promotional Banners Updated & Synced Live.");
        res.json({ success: true, banners: bannersData });
    } catch (err) {
        console.error("Update Banners Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// CMS (HERO SLIDER & ANNOUNCEMENTS) APIs
app.get('/cms', async (req, res) => {
    try {
        const cmsData = await getCmsLive();
        res.json(cmsData);
    } catch (err) {
        res.json(defaultCmsData);
    }
});

app.post('/update-cms', async (req, res) => {
    try {
        const newCms = req.body;
        await saveCmsLive(newCms);
        console.log("Website CMS Updated & Synced Live.");
        res.json({ success: true, cms: newCms });
    } catch (err) {
        console.error("Update CMS Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// DISCOUNT VOUCHER SYSTEM APIs
app.get('/vouchers', async (req, res) => {
    try {
        const vouchers = await getVouchersLive();
        res.json(vouchers);
    } catch (err) {
        res.json(defaultVouchers);
    }
});

app.post('/create-voucher', async (req, res) => {
    try {
        const { code, type, discount, minOrder, description } = req.body;
        if (!code) return res.status(400).json({ success: false, error: "Voucher code required." });

        const newVoucher = {
            code: code.toUpperCase().trim(),
            type: type || "percent",
            discount: Number(discount) || 10,
            minOrder: Number(minOrder) || 0,
            description: description || "Promo Discount Voucher",
            date: new Date()
        };

        await saveVoucherLive(newVoucher);
        console.log(`Voucher Created: ${newVoucher.code}`);
        res.json({ success: true, voucher: newVoucher });
    } catch (err) {
        console.error("Create Voucher Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/delete-voucher', async (req, res) => {
    try {
        const { code } = req.body;
        await deleteVoucherLive(code.toUpperCase().trim());
        console.log(`Voucher Deleted: ${code}`);
        res.json({ success: true, code });
    } catch (err) {
        console.error("Delete Voucher Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/apply-voucher', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const cleanCode = (code || "").toUpperCase().trim();
        const total = Number(subtotal) || 0;

        const vouchers = await getVouchersLive();
        const found = vouchers.find(v => v.code === cleanCode);

        if (!found) {
            return res.status(400).json({ success: false, error: "Invalid or expired voucher code." });
        }

        if (total < found.minOrder) {
            return res.status(400).json({ success: false, error: `Voucher requires a minimum order of $${found.minOrder}.` });
        }

        let discountAmt = 0;
        if (found.type === "percent") {
            discountAmt = (total * found.discount) / 100;
        } else {
            discountAmt = found.discount;
        }

        discountAmt = Math.min(total, discountAmt);

        res.json({
            success: true,
            voucher: found,
            discountAmount: Number(discountAmt.toFixed(2)),
            finalAmount: Number((total - discountAmt).toFixed(2))
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ORDERS SYSTEM APIs
app.post('/create-order', async (req, res) => {
    try {
        const { customerName, userEmail, phone, items, totalUnits, totalAmount, paymentMethod, cardDetails, notes, discountAmount, voucherCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: "Cart items cannot be empty." });
        }

        const isCard = (paymentMethod || "").toLowerCase().includes("card");
        const last4 = cardDetails && cardDetails.number ? cardDetails.number.slice(-4) : "4242";
        const brand = cardDetails && cardDetails.brand ? cardDetails.brand : "Visa";

        const newOrder = {
            id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
            userEmail: (userEmail || "buyer@sportsbrand.com").toLowerCase().trim(),
            customerName: customerName || "B2B Buyer",
            phone: phone || "+1 555-0199",
            items: items || [],
            totalUnits: totalUnits || 50,
            totalAmount: Number(totalAmount) || 0,
            discountAmount: Number(discountAmount) || 0,
            voucherCode: voucherCode || "",
            paymentMethod: isCard ? `Card (${brand} ending in ${last4})` : "Wire Transfer / Pro-Forma Invoice",
            paymentStatus: isCard ? "Paid (Authorized)" : "Pending Invoice Payment",
            status: "Pending Review",
            trackingNumber: "",
            notes: notes || "Order placed via Secure Checkout",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await saveOrderLive(newOrder);
        console.log(`New Order Placed: ID ${newOrder.id} by ${newOrder.userEmail}`);
        res.json({ success: true, order: newOrder });
    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/all-orders', async (req, res) => {
    try {
        const orders = await getAllOrdersLive();
        res.json(orders);
    } catch (err) {
        res.json(getJsonOrders());
    }
});

app.get('/user-orders', async (req, res) => {
    try {
        const reqEmail = (req.query.email || "").toLowerCase().trim();
        if (!reqEmail) return res.json([]);

        const allOrders = await getAllOrdersLive();
        const filtered = allOrders.filter(o => (o.userEmail || "").toLowerCase().trim() === reqEmail);
        res.json(filtered);
    } catch (err) {
        res.json([]);
    }
});

app.post('/update-order-status', async (req, res) => {
    try {
        const { orderId, status, trackingNumber, notes } = req.body;
        const updated = await updateOrderStatusLive(orderId, status, trackingNumber, notes);
        console.log(`Order Status Updated: ID ${orderId} -> ${status}`);
        res.json({ success: true, order: updated });
    } catch (err) {
        console.error("Update Order Status Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/cancel-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        const updated = await updateOrderStatusLive(orderId, "Cancelled", undefined, "Order cancelled by Admin");
        console.log(`Order Cancelled: ID ${orderId}`);
        res.json({ success: true, order: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/delete-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        await deleteOrderLive(orderId);
        console.log(`Order Record Deleted: ID ${orderId}`);
        res.json({ success: true, message: `Order ${orderId} permanently deleted.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Optional Cart & Auth Support
const Users = mongoose.models.User || mongoose.model('User', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token, jwtSecret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

app.post('/signup', async (req, res) => {
    try {
        await connectDB();
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email address." });
        }
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });
        await user.save();
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, jwtSecret);
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, errors: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        await connectDB();
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = { user: { id: user.id } };
                const token = jwt.sign(data, jwtSecret);
                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong Email Address" });
        }
    } catch (err) {
        res.status(500).json({ success: false, errors: err.message });
    }
});

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData && userData.cartData) {
            userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.json({ success: true, message: "Added" });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData && userData.cartData && userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.json({ success: true, message: "Removed" });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData) {
            res.json(userData.cartData || {});
        } else {
            res.json({});
        }
    } catch (err) {
        res.status(500).json({});
    }
});

// Start Server for local execution
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, async (error) => {
        if (!error) {
            console.log("⚡ DAAN Sports API running on port " + port);
            await connectDB();
        } else {
            console.log("Error starting server: " + error);
        }
    });
}

module.exports = app;
