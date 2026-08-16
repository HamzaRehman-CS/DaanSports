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

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/e-commerce";
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests from this IP, please try again later." }
});

const orderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: { success: false, error: "Order limit exceeded, please wait a moment." }
});

app.use("/all-products", apiLimiter);
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
} catch (e) {
    console.warn("Storage directory creation warning:", e.message);
}

// Default Categories Seed
const defaultCategories = [
  { id: 1, name: "Tracksuits", slug: "tracksuits", description: "Wholesale Performance Fleece & Polyester Tracksuits", subcategories: ["Tech Fleece", "Slim Fit", "Team Sets"], banner: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Sweatshirts", slug: "sweatshirts", description: "Heavyweight 350 GSM Pullovers & Streetwear Hoodies", subcategories: ["French Terry", "Oversized", "Zip-Up"], banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Activewear", slug: "activewear", description: "Pro Compression Sets & Gym Tops", subcategories: ["Leggings", "Compression Sets", "Sports Bras"], banner: "https://images.unsplash.com/photo-1550026593-f369f98df0af?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "T-Shirts", slug: "tshirts", description: "Team Athletic Jerseys & Sublimation Kits", subcategories: ["Interlock Mesh", "V-Neck", "Training Jerseys"], banner: "https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, name: "Trousers", slug: "trousers", description: "Wholesale Athletic Joggers & Sweatpants (10% OFF Special)", subcategories: ["Ribbed Cuffs", "Zipper Pockets", "Tri-Blend"], banner: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Outerwear", slug: "outerwear", description: "Softshell Jackets & Weatherproof Vests", subcategories: ["Padded Vests", "Windbreakers", "Softshell"], banner: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" }
];

// Default Bento & Promotional Banners
const defaultBanners = {
  // Bento Grid Banner 1: Tall Vertical Feature
  tallVertical: {
    category: "Tracksuits",
    title: "FLAGSHIP TEAM TRACKSUITS",
    subtitle: "Custom 330 GSM combed fleece & interlock sets engineered for elite athletics & custom private labels.",
    badge: "FLAGSHIP SPEC",
    ctaText: "Explore Tracksuits",
    bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1200&auto=format&fit=crop"
  },
  // Bento Grid Banner 2: Wide Horizontal Box
  wideFeature: {
    category: "Sweatshirts",
    title: "HEAVYWEIGHT 350 GSM HOODIES",
    subtitle: "100% French Terry pullovers & drop-shoulder streetwear cuts ready for 3D embroidery and puff prints.",
    discountText: "15% BULK DISCOUNT",
    badge: "HIGH-DENSITY EMBROIDERY",
    ctaText: "View Hoodies",
    bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop"
  },
  // Bento Grid Banner 3: Compact Box A
  compactA: {
    category: "Trousers",
    title: "Tri-Blend Athletic Joggers",
    subtitle: "Reinforced zipper pockets & ribbed cuffs",
    discountText: "10% OFF SPECIAL",
    ctaText: "Shop Joggers",
    bgImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
  },
  // Bento Grid Banner 4: Compact Box B
  compactB: {
    category: "Activewear",
    title: "Pro Compression & Active Sets",
    subtitle: "Sweat-wicking 4-way performance stretch",
    discountText: "PRO SPEC",
    ctaText: "Shop Activewear",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
  },
  // Bento Grid Banner 5: Direct Factory Innovation Strip
  oemStrip: {
    title: "DIRECT OEM / ODM PRIVATE LABEL MANUFACTURING",
    subtitle: "Full custom labeling, silicone tags, custom GSM weaving, and express airway cargo delivery worldwide.",
    badge: "ISO 9001 CERTIFIED",
    ctaText: "Request Tech-Pack Quote",
    bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop"
  },
  // Legacy compatibility fallbacks
  topSellers: {
    title: "TOP SELLERS — FLAGSHIP EDITION",
    subtitle: "Handpicked Performance Gear & High-Volume Custom Apparel",
    badge: "BESTSELLER SELECTION",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop"
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
  }
};


// Initial Default Vouchers
const defaultVouchers = [
  { code: "GOCART20", type: "percent", discount: 20, minOrder: 50, description: "20% Off GoCart Launch Deal" },
  { code: "DAAN50", type: "fixed", discount: 50, minOrder: 200, description: "$50 Off Bulk Wholesale Orders" },
  { code: "WELCOME10", type: "percent", discount: 10, minOrder: 0, description: "10% Welcome Discount" }
];

// Initial Seed Products
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    id: 5,
    name: "Weatherproof Softshell Team Padded Jacket",
    category: "Outerwear",
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
    ]
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
    ]
  }
];

const defaultCmsData = {
  announcementText: "🏭 DIRECT FACTORY MANUFACTURER — Wholesale Custom Sportswear & Bulk Athletic Wear (MOQ 50-100 Pcs)",
  heroSlides: [
    {
      id: 1,
      badgeText: "PREMIUM MANUFACTURER",
      tag: "Premium Manufacturer",
      title: "ENGINEERED<br />FOR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800'>EXCELLENCE</span>",
      subtitle: "Custom Manufacturing • Private Label • Global Export Solutions. The trusted partner for global sportswear and activewear brands.",
      description: "Custom Manufacturing • Private Label • Global Export Solutions. The trusted partner for global sportswear and activewear brands.",
      specBadge: "330 GSM FLEECE",
      productName: "Pro Tech Fleece Tracksuit",
      priceText: "From $24.50 /pc",
      bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1600&auto=format&fit=crop",
      productImg: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1000&auto=format&fit=crop",
      primaryCtaText: "Explore Collections",
      primaryCtaLink: "/tracksuits"
    },
    {
      id: 2,
      badgeText: "STREETWEAR & HOODIES",
      tag: "Pro Activewear & Hoodies",
      title: "ELEVATE<br />YOUR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800'>BRAND</span>",
      subtitle: "Heavyweight 350 GSM French Terry pullovers, custom drop-shoulder streetwear fits, and high-density 3D embroidery.",
      description: "Heavyweight 350 GSM French Terry pullovers, custom drop-shoulder streetwear fits, and high-density 3D embroidery.",
      specBadge: "350 GSM FRENCH TERRY",
      productName: "Heavyweight Boxy Hoodie",
      priceText: "From $18.90 /pc",
      bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
      productImg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
      primaryCtaText: "View Hoodies",
      primaryCtaLink: "/sweatshirts"
    },
    {
      id: 3,
      badgeText: "GLOBAL EXPORT SOLUTIONS",
      tag: "Global Export Solutions",
      title: "WORLDWIDE<br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800'>DISTRIBUTION</span>",
      subtitle: "Full ISO 9001 certified QC assurance, OEM private label silicone tagging, and worldwide door-to-door express cargo.",
      description: "Full ISO 9001 certified QC assurance, OEM private label silicone tagging, and worldwide door-to-door express cargo.",
      specBadge: "ISO 9001 CERTIFIED",
      productName: "Performance Compression Set",
      priceText: "From $16.50 /pc",
      bgImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1600&auto=format&fit=crop",
      productImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
      primaryCtaText: "Custom Orders",
      primaryCtaLink: "/custom-orders"
    }
  ]
};


// In-Memory Database Stores (Guarantees zero-crash execution on read-only serverless environments)
let inMemoryProducts = [...defaultSeedProducts];
let inMemoryCategories = [...defaultCategories];
let inMemoryBanners = { ...defaultBanners };
let inMemoryOrders = [];
let inMemoryCms = { ...defaultCmsData };
let inMemoryVouchers = [...defaultVouchers];

const getJsonProducts = () => {
    try {
        if (fs.existsSync(dataFilePath)) {
            const raw = fs.readFileSync(dataFilePath, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (e) {
        console.warn("JSON product read warning:", e.message);
    }
    return inMemoryProducts;
};

const saveJsonProducts = (prods) => {
    inMemoryProducts = prods;
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(prods, null, 2), 'utf8');
    } catch (e) {
        console.warn("JSON product write warning (cached in memory):", e.message);
    }
};

const getJsonCategories = () => {
    try {
        if (fs.existsSync(categoriesFilePath)) {
            const raw = fs.readFileSync(categoriesFilePath, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn("Categories read warning:", e.message);
    }
    return inMemoryCategories;
};

const saveJsonCategories = (cats) => {
    inMemoryCategories = cats;
    try {
        fs.writeFileSync(categoriesFilePath, JSON.stringify(cats, null, 2), 'utf8');
    } catch (e) {
        console.warn("Categories write warning (cached in memory):", e.message);
    }
};

const getJsonBanners = () => {
    try {
        if (fs.existsSync(bannersFilePath)) {
            const raw = fs.readFileSync(bannersFilePath, 'utf8');
            const parsed = JSON.parse(raw);
            return { ...defaultBanners, ...parsed };
        }
    } catch (e) {
        console.warn("Banners read warning:", e.message);
    }
    return { ...defaultBanners, ...(inMemoryBanners || {}) };
};


const saveJsonBanners = (bannersData) => {
    inMemoryBanners = bannersData;
    try {
        fs.writeFileSync(bannersFilePath, JSON.stringify(bannersData, null, 2), 'utf8');
    } catch (e) {
        console.warn("Banners write warning (cached in memory):", e.message);
    }
};

const getJsonOrders = () => {
    try {
        if (fs.existsSync(ordersFilePath)) {
            const raw = fs.readFileSync(ordersFilePath, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn("Orders read warning:", e.message);
    }
    return inMemoryOrders;
};

const saveJsonOrders = (orders) => {
    inMemoryOrders = orders;
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    } catch (e) {
        console.warn("Orders write warning (cached in memory):", e.message);
    }
};

const getJsonCms = () => {
    try {
        if (fs.existsSync(cmsFilePath)) {
            const raw = fs.readFileSync(cmsFilePath, 'utf8');
            const parsed = JSON.parse(raw);
            return {
                ...defaultCmsData,
                ...parsed,
                heroSlides: (parsed.heroSlides && parsed.heroSlides.length >= 3) ? parsed.heroSlides : defaultCmsData.heroSlides
            };
        }
    } catch (e) {
        console.warn("CMS read warning:", e.message);
    }
    return {
        ...defaultCmsData,
        ...(inMemoryCms || {}),
        heroSlides: (inMemoryCms && inMemoryCms.heroSlides && inMemoryCms.heroSlides.length >= 3) ? inMemoryCms.heroSlides : defaultCmsData.heroSlides
    };
};


const saveJsonCms = (cmsData) => {
    inMemoryCms = cmsData;
    try {
        fs.writeFileSync(cmsFilePath, JSON.stringify(cmsData, null, 2), 'utf8');
    } catch (e) {
        console.warn("CMS write warning (cached in memory):", e.message);
    }
};

const getJsonVouchers = () => {
    try {
        if (fs.existsSync(vouchersFilePath)) {
            const raw = fs.readFileSync(vouchersFilePath, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data)) return data;
        }
    } catch (e) {
        console.warn("Vouchers read warning:", e.message);
    }
    return inMemoryVouchers;
};

const saveJsonVouchers = (vouchers) => {
    inMemoryVouchers = vouchers;
    try {
        fs.writeFileSync(vouchersFilePath, JSON.stringify(vouchers, null, 2), 'utf8');
    } catch (e) {
        console.warn("Vouchers write warning (cached in memory):", e.message);
    }
};

// API Root
app.get("/", (req,res) => {
    res.json({
        service: "DAAN Sports / GoCart Full Stack API",
        status: "Healthy & Secure",
        features: ["Supabase DB Engine", "Clerk Auth Middleware", "Order Isolation", "Voucher System", "Admin Order & Category Control"]
    });
});

// Image Storage Engine (Memory Storage for Serverless Compatibility)
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

// Product API Endpoints
app.post('/add-product', async (req,res) => {
    try {
        let all_products = getJsonProducts();
        let id = all_products.length > 0 ? all_products[all_products.length - 1].id + 1 : 1;

        const productObj = {
            id: id,
            name: req.body.name || "Custom Apparel Design",
            image: req.body.image,
            images: req.body.images && req.body.images.length > 0 ? req.body.images : [req.body.image],
            category: req.body.category || "Tracksuits",
            new_price: Number(req.body.new_price) || 20.0,
            old_price: Number(req.body.old_price) || Number(req.body.new_price) * 1.3,
            description: req.body.description || "",
            material: req.body.material || "80% Cotton / 20% Fleece",
            gsm: req.body.gsm || "330 GSM",
            stitching: req.body.stitching || "Double-Needle Flatlock",
            customization: req.body.customization || "Custom Printing & Labels Available",
            leadTime: req.body.leadTime || "12 - 15 Business Days",
            moq: Number(req.body.moq) || 50,
            colors: req.body.colors || ["Black", "Gray"],
            sizes: req.body.sizes || ["S", "M", "L", "XL", "2XL"],
            stock: Number(req.body.stock) || 1000,
            date: new Date(),
            available: true
        };

        const jsonList = getJsonProducts();
        jsonList.push(productObj);
        saveJsonProducts(jsonList);

        if (supabase) {
            try {
                await supabase.from('products').insert([{
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
                    images: productObj.images
                }]);
            } catch (sErr) {
                console.warn("Supabase insert notice:", sErr.message);
            }
        }

        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// EDIT PRODUCT API
app.post('/edit-product', async (req, res) => {
    try {
        const prodId = Number(req.body.id);
        let products = getJsonProducts();
        let updatedProd = null;

        products = products.map(p => {
            if (p.id === prodId) {
                updatedProd = {
                    ...p,
                    name: req.body.name || p.name,
                    category: req.body.category || p.category,
                    new_price: req.body.new_price !== undefined ? Number(req.body.new_price) : p.new_price,
                    old_price: req.body.old_price !== undefined ? Number(req.body.old_price) : p.old_price,
                    moq: req.body.moq !== undefined ? Number(req.body.moq) : p.moq,
                    description: req.body.description !== undefined ? req.body.description : p.description,
                    material: req.body.material || p.material,
                    gsm: req.body.gsm || p.gsm,
                    stitching: req.body.stitching || p.stitching,
                    customization: req.body.customization || p.customization,
                    leadTime: req.body.leadTime || p.leadTime,
                    colors: Array.isArray(req.body.colors) ? req.body.colors : (typeof req.body.colors === 'string' ? req.body.colors.split(',').map(c => c.trim()) : p.colors),
                    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : (typeof req.body.sizes === 'string' ? req.body.sizes.split(',').map(s => s.trim()) : p.sizes),
                    stock: req.body.stock !== undefined ? Number(req.body.stock) : p.stock,
                    image: req.body.image || p.image,
                    images: req.body.images && req.body.images.length > 0 ? req.body.images : (req.body.image ? [req.body.image] : p.images)
                };
                return updatedProd;
            }
            return p;
        });

        saveJsonProducts(products);

        if (supabase && updatedProd) {
            try {
                await supabase.from('products').update({
                    name: updatedProd.name,
                    category: updatedProd.category,
                    new_price: updatedProd.new_price,
                    old_price: updatedProd.old_price,
                    moq: updatedProd.moq,
                    description: updatedProd.description,
                    material: updatedProd.material,
                    gsm: updatedProd.gsm,
                    stitching: updatedProd.stitching,
                    customization: updatedProd.customization,
                    lead_time: updatedProd.leadTime,
                    colors: updatedProd.colors,
                    sizes: updatedProd.sizes,
                    stock: updatedProd.stock,
                    image: updatedProd.image,
                    images: updatedProd.images
                }).eq('id', prodId);
            } catch (sErr) {
                console.warn("Supabase update product notice:", sErr.message);
            }
        }

        res.json({ success: true, product: updatedProd });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/remove-product', async (req,res) => {
    try {
        const idToRemove = Number(req.body.id);
        let jsonList = getJsonProducts();
        jsonList = jsonList.filter(p => p.id !== idToRemove);
        saveJsonProducts(jsonList);

        if (supabase) {
            try {
                await supabase.from('products').delete().eq('id', idToRemove);
            } catch (sErr) {
                console.warn("Supabase delete notice:", sErr.message);
            }
        }

        res.json({ success: true, id: idToRemove });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/all-products', async (req,res) => {
    try {
        if (supabase) {
            const { data, error } = await supabase.from('products').select('*');
            if (!error && data && data.length > 0) {
                const formatted = data.map(p => ({
                    ...p,
                    leadTime: p.lead_time || p.leadTime,
                    images: p.images || [p.image]
                }));
                return res.json(formatted);
            }
        }
        res.send(getJsonProducts());
    } catch (error) {
        res.send(defaultSeedProducts);
    }
});

// CATEGORY MANAGEMENT APIs
app.get('/categories', (req, res) => {
    try {
        res.json(getJsonCategories());
    } catch (err) {
        res.json(defaultCategories);
    }
});

app.post('/add-category', (req, res) => {
    try {
        const { name, description, subcategories, banner } = req.body;
        if (!name) return res.status(400).json({ success: false, error: "Category name required" });

        const cats = getJsonCategories();
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const newCat = {
            id: cats.length > 0 ? cats[cats.length - 1].id + 1 : 1,
            name: name.trim(),
            slug: slug,
            description: description || `Wholesale ${name} apparel collection`,
            subcategories: Array.isArray(subcategories) ? subcategories : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()) : ["General"]),
            banner: banner || "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop"
        };

        cats.push(newCat);
        saveJsonCategories(cats);
        res.json({ success: true, category: newCat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/delete-category', (req, res) => {
    try {
        const idToRemove = Number(req.body.id);
        let cats = getJsonCategories();
        cats = cats.filter(c => c.id !== idToRemove);
        saveJsonCategories(cats);
        res.json({ success: true, id: idToRemove });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/edit-category', (req, res) => {
    try {
        const { id, name, description, subcategories, banner } = req.body;
        const catId = Number(id);
        let cats = getJsonCategories();
        let updated = null;

        cats = cats.map(c => {
            if (c.id === catId) {
                const slug = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : c.slug;
                updated = {
                    ...c,
                    name: name !== undefined ? name.trim() : c.name,
                    slug: slug,
                    description: description !== undefined ? description : c.description,
                    subcategories: Array.isArray(subcategories) ? subcategories : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()) : c.subcategories),
                    banner: banner || c.banner
                };
                return updated;
            }
            return c;
        });

        saveJsonCategories(cats);
        res.json({ success: true, category: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PROMOTIONAL BANNERS APIs
app.get('/promotional-banners', (req, res) => {
    try {
        res.json(getJsonBanners());
    } catch (err) {
        res.json(defaultBanners);
    }
});

app.post('/update-promotional-banners', (req, res) => {
    try {
        const bannersData = req.body;
        saveJsonBanners(bannersData);
        res.json({ success: true, banners: bannersData });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ORDERS SYSTEM
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
            paymentMethod: isCard ? `Card (${brand} ending in ${last4})` : "Wire Transfer",
            paymentStatus: isCard ? "Paid (Authorized)" : "Pending Invoice Payment",
            status: "Pending Review",
            trackingNumber: "",
            notes: notes || "Order placed via Secure Checkout",
            createdAt: new Date().toISOString()
        };

        const orders = getJsonOrders();
        orders.unshift(newOrder);
        saveJsonOrders(orders);

        if (supabase) {
            try {
                await supabase.from('orders').insert([{
                    id: newOrder.id,
                    user_email: newOrder.userEmail,
                    customer_name: newOrder.customerName,
                    phone: newOrder.phone,
                    items: newOrder.items,
                    total_units: newOrder.totalUnits,
                    total_amount: newOrder.totalAmount,
                    payment_method: newOrder.paymentMethod,
                    payment_status: newOrder.paymentStatus,
                    status: newOrder.status,
                    tracking_number: newOrder.trackingNumber,
                    notes: newOrder.notes
                }]);
            } catch (sErr) {
                console.warn("Supabase order notice:", sErr.message);
            }
        }

        console.log(`New Order Placed by ${newOrder.userEmail}: ID ${newOrder.id}`);
        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET ALL ORDERS (ADMIN)
app.get('/all-orders', async (req, res) => {
    try {
        if (supabase) {
            const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                const formatted = data.map(o => ({
                    ...o,
                    userEmail: o.user_email || o.userEmail,
                    customerName: o.customer_name || o.customerName,
                    totalUnits: o.total_units || o.totalUnits,
                    totalAmount: o.total_amount || o.totalAmount,
                    paymentMethod: o.payment_method || o.paymentMethod,
                    paymentStatus: o.payment_status || o.paymentStatus,
                    trackingNumber: o.tracking_number || o.trackingNumber
                }));
                return res.json(formatted);
            }
        }
        res.json(getJsonOrders());
    } catch (err) {
        res.status(500).json([]);
    }
});

// GET USER SPECIFIC ORDERS
app.get('/user-orders', async (req, res) => {
    try {
        const reqEmail = (req.query.email || "").toLowerCase().trim();
        if (!reqEmail) {
            return res.json([]);
        }

        if (supabase) {
            const { data, error } = await supabase.from('orders').select('*').eq('user_email', reqEmail).order('created_at', { ascending: false });
            if (!error && data) {
                const formatted = data.map(o => ({
                    ...o,
                    userEmail: o.user_email || o.userEmail,
                    customerName: o.customer_name || o.customerName,
                    totalUnits: o.total_units || o.totalUnits,
                    totalAmount: o.total_amount || o.totalAmount,
                    paymentMethod: o.payment_method || o.paymentMethod,
                    paymentStatus: o.payment_status || o.paymentStatus,
                    trackingNumber: o.tracking_number || o.trackingNumber
                }));
                return res.json(formatted);
            }
        }

        const allOrders = getJsonOrders();
        const isolatedOrders = allOrders.filter(o => (o.userEmail || "").toLowerCase().trim() === reqEmail);
        res.json(isolatedOrders);
    } catch (err) {
        res.status(500).json([]);
    }
});

// ADMIN UPDATE ORDER STATUS
app.post('/update-order-status', async (req, res) => {
    try {
        const { orderId, status, trackingNumber, notes } = req.body;
        let orders = getJsonOrders();
        let updatedOrder = null;

        orders = orders.map(o => {
            if (o.id === orderId) {
                o.status = status || o.status;
                if (trackingNumber !== undefined) o.trackingNumber = trackingNumber;
                if (notes !== undefined) o.notes = notes;
                o.updatedAt = new Date().toISOString();
                updatedOrder = o;
            }
            return o;
        });

        saveJsonOrders(orders);

        if (supabase) {
            try {
                await supabase.from('orders').update({
                    status: status,
                    tracking_number: trackingNumber,
                    notes: notes,
                    updated_at: new Date().toISOString()
                }).eq('id', orderId);
            } catch (sErr) {
                console.warn("Supabase update notice:", sErr.message);
            }
        }

        res.json({ success: true, order: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ADMIN CANCEL ORDER
app.post('/cancel-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        let orders = getJsonOrders();
        let cancelledOrder = null;

        orders = orders.map(o => {
            if (o.id === orderId) {
                o.status = "Cancelled";
                o.paymentStatus = "Refunded / Voided";
                o.updatedAt = new Date().toISOString();
                cancelledOrder = o;
            }
            return o;
        });

        saveJsonOrders(orders);

        if (supabase) {
            try {
                await supabase.from('orders').update({
                    status: "Cancelled",
                    payment_status: "Refunded / Voided",
                    updated_at: new Date().toISOString()
                }).eq('id', orderId);
            } catch (sErr) {
                console.warn("Supabase cancel notice:", sErr.message);
            }
        }

        res.json({ success: true, order: cancelledOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ADMIN DELETE ORDER LOG
app.post('/delete-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        let orders = getJsonOrders();
        orders = orders.filter(o => o.id !== orderId);
        saveJsonOrders(orders);

        if (supabase) {
            try {
                await supabase.from('orders').delete().eq('id', orderId);
            } catch (sErr) {
                console.warn("Supabase delete notice:", sErr.message);
            }
        }

        console.log(`Admin permanently deleted order log: ${orderId}`);
        res.json({ success: true, message: `Order ${orderId} permanently deleted.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DISCOUNT VOUCHER SYSTEM APIs
app.get('/vouchers', (req, res) => {
    try {
        res.json(getJsonVouchers());
    } catch (err) {
        res.json(defaultVouchers);
    }
});

app.post('/create-voucher', (req, res) => {
    try {
        const { code, type, discount, minOrder, description } = req.body;
        if (!code) return res.status(400).json({ success: false, error: "Voucher code required." });

        const vouchers = getJsonVouchers();
        const newVoucher = {
            code: code.toUpperCase().trim(),
            type: type || "percent",
            discount: Number(discount) || 10,
            minOrder: Number(minOrder) || 0,
            description: description || "Promo Discount Voucher"
        };

        vouchers.unshift(newVoucher);
        saveJsonVouchers(vouchers);

        res.json({ success: true, voucher: newVoucher });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/delete-voucher', (req, res) => {
    try {
        const { code } = req.body;
        let vouchers = getJsonVouchers();
        vouchers = vouchers.filter(v => v.code !== code.toUpperCase().trim());
        saveJsonVouchers(vouchers);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/apply-voucher', (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const cleanCode = (code || "").toUpperCase().trim();
        const total = Number(subtotal) || 0;

        const vouchers = getJsonVouchers();
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

// CMS APIs
app.get('/cms', (req, res) => {
    try {
        res.json(getJsonCms());
    } catch (err) {
        res.json(defaultCmsData);
    }
});

app.post('/update-cms', (req, res) => {
    try {
        const newCms = req.body;
        saveJsonCms(newCms);
        res.json({ success: true, cms: newCms });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, (error) => {
        if (!error){
            console.log("⚡ DAAN Sports / GoCart API running on port " + port);
        }else{
            console.log("Error: " + error);
        }
    });
}

module.exports = app;