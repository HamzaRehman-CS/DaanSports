require('dotenv').config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/e-commerce";

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

const Product = mongoose.model("Product",{
    id:{type: Number, required: true},
    name:{type: String, required: true},
    image:{type: String, required: true},
    images:{type: [String], default: []},
    category:{type: String, required: true},
    new_price:{type: Number, required: true},
    old_price:{type: Number, required: true},
    description:{type: String, default: ""},
    moq:{type: Number, default: 50},
    colors:{type: [String], default: []},
    sizes:{type: [String], default: ["S", "M", "L", "XL", "2XL"]},
    stock:{type: Number, default: 1000},
    date:{type: Date, default: Date.now},
    available:{type: Boolean, default: true},
});

const seedProducts = [
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
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
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
    colors: ["Charcoal", "Cream White", "Olive Green", "Black"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
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
    colors: ["Jet Black", "Electric Blue", "Steel Gray"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
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
    colors: ["White/Black", "Red/White", "Navy/Gold", "Green/White"],
    sizes: ["S", "M", "L", "XL", "2XL"],
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
    colors: ["Black", "Midnight Navy", "Gunmetal Gray"],
    sizes: ["M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 6,
    name: "Classic Tri-Blend Athletic Warm-Up Track Pants",
    category: "Tracksuits",
    new_price: 14.20,
    old_price: 28.00,
    moq: 50,
    description: "Durable cotton-polyester blended joggers with elastic drawcord waistband, side stripe taping option, and elastic ankles.",
    colors: ["Black", "Heather Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

async function runSeed() {
  try {
    await Product.deleteMany({});
    console.log("Cleared existing products.");
    await Product.insertMany(seedProducts);
    console.log("Successfully seeded DAAN Sports wholesale products!");
    process.exit(0);
  } catch (err) {
    console.error("Seed Error:", err);
    process.exit(1);
  }
}

runSeed();
